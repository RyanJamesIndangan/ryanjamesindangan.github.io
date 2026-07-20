#!/usr/bin/env node
/**
 * record-lastresortai.mjs — produce a portfolio-ready MP4 of the LastResortAI
 * Mission Control dashboard.
 *
 *   node scripts/record-lastresortai.mjs [--live] [--keep-webm] [--port N] [--out PATH]
 *
 * WHAT IT DOES
 *   1. Creates a throwaway LRAI_DATA_DIR under the OS temp dir + picks a free port.
 *   2. Boots the LastResortAI daemon (cwd c:/laragon/www/LastResortAI), waits /api/health.
 *   3. Pauses the queue and disables autopilot BEFORE seeding, then seeds generic
 *      software tasks over the REST API.
 *   4. Drives an 11-beat storyboard with Playwright, recording WebM.
 *   5. Trims + transcodes to H.264 MP4 with a real ffmpeg build.
 *   6. Writes assets/demos/lastresortai.mp4.
 *   7. Tears down the daemon process tree and the temp data dir on ANY exit path.
 *
 * ---------------------------------------------------------------------------
 * TWO DELIBERATE DEVIATIONS FROM A NAIVE READING OF THE BRIEF — read before editing:
 *
 * (a) RECORDING SOURCE. By default this records in the app's built-in demo mode
 *     (`#/deck?demo=1`), NOT against the REST-seeded daemon. web/src/deck/demo.ts
 *     calls disableNetwork() + stopWs() BEFORE seeding, so under demo mode nothing
 *     from the backend can reach the frame — that is belt-and-braces on the privacy
 *     rules. It also seeds running/verifying/done/failed states and a live animation
 *     engine, which the REST API physically cannot produce: there is no
 *     PATCH /api/tasks/:id, so with the queue paused (and it MUST stay paused, or the
 *     daemon spawns real `claude` sessions against the real repo) every seeded task
 *     is stuck at "queued" and every agent at "idle".
 *     The REST seeding still runs — it satisfies the brief, keeps the backend
 *     non-empty, and is what `--live` records instead. Pass --live to record the
 *     REST-seeded daemon; expect a flat, all-queued dashboard.
 *
 * (b) CAPTURE SIZE. Capture is 1600x900, DELIVERY is 1280x720 (the size the brief
 *     asks for). Recon rendered all three sizes: at 1920x1080 ~45% of the frame is
 *     dead black space (pages are top-anchored with a fixed content height), and at
 *     a native 1280x720 capture the Deck's absolutely-positioned DECK LOG / SWEEP
 *     panels overlap and cover the agent sprites. 1600x900 is the only size where
 *     the office fills the frame with panels clear of sprites, Overview's six stat
 *     cards stay on one row, and the agent grid is a clean 4-across.
 *     Downscaling 1600x900 -> 1280x720 with lanczos is also smaller AND crisper than
 *     capturing 720p natively (supersampling averages out VP8 capture noise).
 * ---------------------------------------------------------------------------
 */

import { spawn, execFileSync } from 'node:child_process';
import { createServer } from 'node:net';
import {
  mkdtempSync, mkdirSync, rmSync, writeFileSync, readFileSync, existsSync, readdirSync, statSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';

// ───────────────────────────── configuration ─────────────────────────────

const LRAI_ROOT = 'c:/laragon/www/LastResortAI';
const PORTFOLIO_ROOT = 'c:/projects/github/ryanjamesindangan.github.io';
const DEFAULT_OUT = join(PORTFOLIO_ROOT, 'assets', 'demos', 'lastresortai.mp4');

/** Capture size — see deviation (b) in the header. */
const CAPTURE = { width: 1600, height: 900 };
/** Delivery size. */
const DELIVER = { width: 1280, height: 720 };

/** Where the spark-burst celebration should land in the final cut, in seconds. */
const BURST_ANCHOR_S = 5.0;

/**
 * Demo workspace dir. MUST NOT live under %TEMP%: on this machine $env:TEMP expands
 * to C:\Users\RYANSI~1\... (the 8.3 short name), and the events feed renders the
 * workspace path VERBATIM — that would put the username on screen for the whole take.
 */
const DEMO_WS_ROOT = 'C:\\lrai-demo';
const DEMO_WS_NAME = 'demo-project';

// ─────────────────────────────── CLI args ────────────────────────────────

const argv = process.argv.slice(2);
const hasFlag = (f) => argv.includes(f);
const argVal = (f, fallback) => {
  const i = argv.indexOf(f);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};

const OPTS = {
  live: hasFlag('--live'),
  keepWebm: hasFlag('--keep-webm'),
  port: Number(argVal('--port', '0')) || null,
  out: resolve(argVal('--out', DEFAULT_OUT)),
};

// ──────────────────────────────── logging ────────────────────────────────

const t0Wall = Date.now();
const stamp = () => `${((Date.now() - t0Wall) / 1000).toFixed(1).padStart(6)}s`;
const log = (...a) => console.log(`[${stamp()}]`, ...a);
const warn = (...a) => console.log(`[${stamp()}] WARN:`, ...a);
const step = (n, msg) => console.log(`\n[${stamp()}] ═══ ${n}. ${msg}`);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ──────────────────────── teardown registry (HARD RULE 7) ────────────────

/**
 * Every resource registers an idempotent disposer here. cleanupAll() runs them in
 * reverse order and swallows individual failures so one bad disposer cannot strand
 * the rest — in particular, a Playwright hang must never prevent the taskkill.
 */
const cleanups = [];
let cleanupDone = false;

function onCleanup(label, fn) {
  cleanups.push({ label, fn });
}

function cleanupAll() {
  if (cleanupDone) return;
  cleanupDone = true;
  console.log(`\n[${stamp()}] ═══ teardown`);
  for (const { label, fn } of cleanups.reverse()) {
    try {
      fn();
      console.log(`[${stamp()}]   ✓ ${label}`);
    } catch (err) {
      console.log(`[${stamp()}]   ✗ ${label}: ${err?.message ?? err}`);
    }
  }
}

// Synchronous disposers only, so 'exit' can actually run them.
process.on('exit', cleanupAll);
for (const sig of ['SIGINT', 'SIGTERM', 'SIGHUP', 'SIGBREAK']) {
  process.on(sig, () => { cleanupAll(); process.exit(130); });
}
process.on('uncaughtException', (err) => {
  console.error('\nUNCAUGHT:', err);
  cleanupAll();
  process.exit(1);
});

// ─────────────────────── dependency discovery: playwright ────────────────

/**
 * @playwright/test is declared in LastResortAI's devDependencies but is NOT installed
 * (verified: node_modules has no @playwright, no playwright-core). Rather than
 * hardcode an npx-cache path — those are content hashes and npm prunes them — probe a
 * ranked candidate list and require that the build's pinned chromium revision is
 * actually present in the local browser registry.
 *
 * The real fix is `npm install` inside LastResortAI. This is the unblock.
 */
function browserRegistryDir() {
  if (process.env.PLAYWRIGHT_BROWSERS_PATH) return process.env.PLAYWRIGHT_BROWSERS_PATH;
  const home = process.env.USERPROFILE || process.env.HOME || '';
  return join(home, 'AppData', 'Local', 'ms-playwright');
}

function chromiumRevisionOf(pkgDir) {
  try {
    const bjPath = join(pkgDir, 'browsers.json');
    if (!existsSync(bjPath)) return null;
    const bj = JSON.parse(readFileSync(bjPath, 'utf8'));
    const entry = (bj.browsers ?? []).find((b) => b.name === 'chromium');
    return entry?.revision ?? null;
  } catch { return null; }
}

function candidatePlaywrightDirs() {
  const out = [];
  const push = (p) => { if (p && existsSync(p)) out.push(p); };

  // 1. Installed in the project (the correct long-term answer).
  push(join(LRAI_ROOT, 'node_modules', 'playwright-core'));
  push(join(LRAI_ROOT, 'node_modules', 'playwright'));
  push(join(LRAI_ROOT, 'node_modules', '@playwright', 'test', 'node_modules', 'playwright-core'));
  // 2. Installed in this portfolio repo.
  push(join(PORTFOLIO_ROOT, 'node_modules', 'playwright-core'));
  push(join(PORTFOLIO_ROOT, 'node_modules', 'playwright'));
  // 3. Global npm root.
  const home = process.env.USERPROFILE || process.env.HOME || '';
  push(join(home, 'AppData', 'Roaming', 'npm', 'node_modules', 'playwright-core'));
  push(join(home, 'AppData', 'Roaming', 'npm', 'node_modules', 'playwright'));
  // 4. npx cache — hash-named and prunable, so last resort only.
  const npxCache = join(home, 'AppData', 'Local', 'npm-cache', '_npx');
  if (existsSync(npxCache)) {
    for (const entry of readdirSync(npxCache)) {
      push(join(npxCache, entry, 'node_modules', 'playwright-core'));
      push(join(npxCache, entry, 'node_modules', 'playwright'));
    }
  }
  return out;
}

async function loadPlaywright() {
  const registry = browserRegistryDir();
  const tried = [];

  for (const dir of candidatePlaywrightDirs()) {
    const rev = chromiumRevisionOf(dir);
    // A build whose pinned chromium isn't downloaded will fail at launch().
    if (rev && !existsSync(join(registry, `chromium-${rev}`))) {
      tried.push(`${dir} (needs chromium-${rev}, not installed)`);
      continue;
    }
    try {
      const mod = await import(pathToFileURL(join(dir, 'index.js')).href);
      const pw = mod.default ?? mod;
      if (pw?.chromium?.launch) {
        log(`playwright: ${dir}${rev ? ` (chromium-${rev})` : ''}`);
        return pw;
      }
      tried.push(`${dir} (no chromium export)`);
    } catch (err) {
      tried.push(`${dir} (${err.message.split('\n')[0]})`);
    }
  }

  throw new Error(
    'Could not resolve a usable playwright build.\n' +
    `  Browser registry: ${registry}\n` +
    '  Tried:\n    ' + (tried.join('\n    ') || '(no candidates found)') + '\n' +
    `  Fix: cd ${LRAI_ROOT} && npm install && npx playwright install chromium`,
  );
}

// ──────────────────────── dependency discovery: ffmpeg ───────────────────

/**
 * Playwright's BUNDLED ffmpeg (ms-playwright/ffmpeg-NNNN) is built --disable-everything
 * with only png + libvpx encoders and only image2 + webm muxers. It cannot write MP4
 * at all ("Requested output format 'mp4' is not known"). It is deliberately excluded
 * from this search — we need a build with libx264.
 */
function candidateFfmpegPaths() {
  const home = process.env.USERPROFILE || process.env.HOME || '';
  return [
    process.env.FFMPEG_PATH,
    // Proper installs (winget install Gyan.FFmpeg / choco install ffmpeg).
    'C:\\Program Files\\ffmpeg\\bin\\ffmpeg.exe',
    'C:\\ffmpeg\\bin\\ffmpeg.exe',
    'C:\\ProgramData\\chocolatey\\bin\\ffmpeg.exe',
    join(home, 'AppData', 'Local', 'Microsoft', 'WinGet', 'Links', 'ffmpeg.exe'),
    // Borrowed from third-party apps — today-only unblock, see warning below.
    'C:\\Program Files\\dslrBooth\\ffmpeg.exe',
    'C:\\Program Files\\EaseUS\\EaseUS Data Recovery Wizard\\VideoViewer\\ffmpeg.exe',
  ].filter(Boolean);
}

function ffmpegHasX264(bin) {
  try {
    const out = execFileSync(bin, ['-hide_banner', '-encoders'], {
      encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 20000,
    });
    return /\blibx264\b/.test(out);
  } catch { return false; }
}

const BORROWED = /dslrBooth|EaseUS/i;

function findFfmpeg() {
  // Prefer whatever is on PATH.
  try {
    const which = execFileSync('where', ['ffmpeg'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
      .split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
    for (const p of which) if (ffmpegHasX264(p)) { log(`ffmpeg: ${p} (PATH)`); return p; }
  } catch { /* not on PATH */ }

  for (const p of candidateFfmpegPaths()) {
    if (!existsSync(p)) continue;
    if (!ffmpegHasX264(p)) continue;
    log(`ffmpeg: ${p}`);
    if (BORROWED.test(p)) {
      warn('that ffmpeg belongs to a third-party application. It works today, but it can');
      warn('vanish on that app\'s update/uninstall and its build flags are not yours.');
      warn('Install a real static build: winget install Gyan.FFmpeg');
    }
    return p;
  }

  throw new Error(
    'No ffmpeg with an H.264 (libx264) encoder found.\n' +
    "  Playwright's bundled ffmpeg cannot write MP4 and is intentionally not used.\n" +
    '  Fix: winget install Gyan.FFmpeg   (or set FFMPEG_PATH=<path to ffmpeg.exe>)',
  );
}

// ─────────────────────────────── net helpers ─────────────────────────────

function freePort() {
  return new Promise((res, rej) => {
    const srv = createServer();
    srv.on('error', rej);
    srv.listen(0, '127.0.0.1', () => {
      const { port } = srv.address();
      srv.close(() => res(port));
    });
  });
}

/** Every mutating /api/* call needs the CSRF header, and bodyless POSTs still need `{}`. */
function apiFactory(base) {
  return async function api(method, path, body) {
    const res = await fetch(`${base}${path}`, {
      method,
      headers: { 'content-type': 'application/json', 'X-LRAI': '1' },
      body: method === 'GET' ? undefined : JSON.stringify(body ?? {}),
    });
    const text = await res.text();
    let json = null;
    try { json = text ? JSON.parse(text) : null; } catch { /* non-JSON */ }
    if (!res.ok) {
      throw new Error(`${method} ${path} -> ${res.status} ${text.slice(0, 300)}`);
    }
    return json;
  };
}

async function waitForHealth(base, timeoutMs = 60000) {
  const deadline = Date.now() + timeoutMs;
  let lastErr = null;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${base}/api/health`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) return await res.json();
    } catch (err) { lastErr = err; }
    await sleep(300);
  }
  throw new Error(`daemon never became healthy at ${base} (${lastErr?.message ?? 'timeout'})`);
}

// ───────────────────────────── seed content ──────────────────────────────

/**
 * HARD RULE 2: generic software work only. Nothing clinical, medical, or
 * client-identifying — no sponsor names, trial names, repo names, or people.
 */
const SEED_TASKS = [
  {
    title: 'Add rate limiting to the auth endpoint',
    description: 'POST /api/auth/login has no throttle. Add a sliding-window limiter keyed on IP + username so credential stuffing is bounded.',
    acceptance_criteria: 'Sixth attempt within 60s returns 429 with Retry-After; successful logins are unaffected; unit tests cover the window boundary.',
    check_commands: ['npm test', 'npm run lint'],
    priority: 2, max_attempts: 3, agent_slug: 'aegis',
  },
  {
    title: 'Fix flaky checkout test',
    description: 'checkout.spec.ts fails ~1 run in 8 on CI. Suspect an unawaited toast animation racing the assertion.',
    acceptance_criteria: '200 consecutive runs green; no arbitrary sleeps introduced.',
    check_commands: ['npm run test:e2e'],
    priority: 2, max_attempts: 4, agent_slug: 'artemis',
  },
  {
    title: 'Migrate config to TOML',
    description: 'Replace the ad-hoc JSON config loader with TOML so comments and typed sections survive round-trips.',
    acceptance_criteria: 'Existing JSON config loads via a shim; new TOML path is documented; typecheck and build pass.',
    check_commands: ['npm run typecheck', 'npm run build'],
    priority: 5, max_attempts: 3, agent_slug: 'athena',
  },
  {
    title: 'Add retry backoff jitter to the job runner',
    description: 'Rate-limited attempts currently retry on a fixed delay, so failures resynchronise into a thundering herd.',
    acceptance_criteria: 'Full-jitter exponential backoff; unit test asserts the jitter bounds; no fixed-delay path remains.',
    check_commands: ['npm test'],
    priority: 3, max_attempts: 3, agent_slug: 'mercury',
  },
  {
    title: 'Stream CSV export instead of buffering',
    description: 'The export endpoint builds the whole payload in memory before responding, which spikes RSS on large accounts.',
    acceptance_criteria: 'Endpoint streams rows; memory stays flat on a 50k-row fixture; download completes.',
    check_commands: ['npm test'],
    priority: 4, max_attempts: 3, agent_slug: 'mercury',
  },
  {
    title: 'Add index on orders.created_at',
    description: 'The dashboard date-range query does a full table scan and dominates p95.',
    acceptance_criteria: 'EXPLAIN shows index use; p95 under 200ms on the seeded fixture; migration is reversible.',
    check_commands: ['npm run migrate', 'npm test'],
    priority: 4, max_attempts: 2, agent_slug: 'demeter',
  },
  {
    title: 'Pin the CI container base image by digest',
    description: 'CI pulls a floating :latest tag, so builds are not reproducible across days.',
    acceptance_criteria: 'Base image referenced by sha256 digest; CI green; renovate config updates the digest.',
    check_commands: ['npm run lint'],
    priority: 6, max_attempts: 2, agent_slug: 'vulcan',
  },
  {
    title: 'Write API reference for the webhooks module',
    description: 'Document payload shapes, the retry schedule and signature verification for outbound webhooks.',
    acceptance_criteria: 'Docs page builds; every endpoint and header documented; examples are copy-pasteable.',
    check_commands: ['npm run docs:build'],
    priority: 7, max_attempts: 2, agent_slug: 'mnemosyne',
  },
  {
    title: 'Debounce the search-as-you-type request',
    description: 'Each keystroke fires a request; the results list flickers between stale and fresh payloads.',
    acceptance_criteria: '250ms debounce with in-flight cancellation; no stale response can overwrite a newer one.',
    check_commands: ['npm test', 'npm run lint'],
    priority: 5, max_attempts: 3, agent_slug: 'iris',
  },
  {
    title: 'Reject unsigned webhook deliveries',
    description: 'Inbound webhooks are processed without verifying the HMAC signature header.',
    acceptance_criteria: 'Missing or bad signature returns 401 and is logged; valid deliveries unchanged; replay window enforced.',
    check_commands: ['npm test'],
    priority: 1, max_attempts: 3, agent_slug: 'aegis',
  },
];

// ─────────────────────────────── storyboard ──────────────────────────────

/**
 * Chrome that must never appear in the frame.
 *  - .top-stat:has(.wsdot) — demo mode calls stopWs(), and applyWs() never sets
 *    connected:true on a 'hello', so the topbar shows a red dot + "NO LINK" for the
 *    entire session. Hiding it removes a demo-mode artifact; it does not fabricate a
 *    live uplink (which would be dishonest on a portfolio piece).
 *  - .quota-hint — its href is hardcoded to the user's real GitHub profile URL. Under
 *    demo mode quota is null so QuotaBars() early-returns and it never renders, but
 *    this is free insurance for --live.
 *  - .side-foot — renders the literal string "VDEMO" under demo mode; reads as a
 *    rendering bug, not a version string.
 */
const SCRUB_CSS = `
  .top-stat:has(.wsdot) { display: none !important; }
  .quota-hint { display: none !important; }
  .side-foot { visibility: hidden !important; }
`;

/**
 * "WHAT THE CREW KNOWS" fetches /api/corpus, and its .catch(() => {}) never clears the
 * loading flag — under demo mode (network severed) it is a grey skeleton forever. A
 * "do not scroll" rule is a promise; a MutationObserver is a guarantee. CSS cannot do
 * this because there is no text-content selector.
 */
const HIDE_CORPUS_JS = `
  (() => {
    const hide = () => {
      for (const p of document.querySelectorAll('.panel')) {
        if (p.textContent && p.textContent.includes('WHAT THE CREW KNOWS')) {
          p.style.display = 'none';
        }
      }
    };
    hide();
    new MutationObserver(hide).observe(document.body, { childList: true, subtree: true });
  })();
`;

/** Smooth, video-friendly scroll. mouse.wheel in one big delta reads as a jump cut. */
async function smoothScroll(page, totalPx, durationMs) {
  const steps = Math.max(1, Math.round(durationMs / 16));
  const per = totalPx / steps;
  await page.mouse.move(CAPTURE.width / 2, CAPTURE.height / 2);
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, per);
    await sleep(16);
  }
}

/**
 * Wait for the Nth *fresh* spark-burst, using detached->attached edges so a burst
 * already on screen when we start is not miscounted.
 *
 * demo.ts flips task #104 on Math.floor(Date.now()/6000)%2, so verifying->done (and
 * therefore the burst) fires every 12s. We anchor on the SECOND burst, never the
 * first: the trim can only REMOVE head, so the anchor must be guaranteed later than
 * BURST_ANCHOR_S. A first burst could fire at +1s, which no -ss value can fix.
 * Returns the timestamp the burst appeared.
 */
async function waitForNthBurst(page, n, timeoutMs = 45000) {
  let at = 0;
  for (let i = 0; i < n; i++) {
    await page.waitForSelector('.spark-burst', { state: 'detached', timeout: timeoutMs }).catch(() => {});
    await page.waitForSelector('.spark-burst', { state: 'attached', timeout: timeoutMs });
    at = Date.now();
    log(`  burst ${i + 1}/${n} at +${((at - page.__recStart) / 1000).toFixed(1)}s`);
    if (i < n - 1) {
      await page.waitForSelector('.spark-burst', { state: 'detached', timeout: timeoutMs }).catch(() => {});
    }
  }
  return at;
}

/** Sidebar nav. Accessible name is "NN LABEL", and getByRole name matching is substring. */
async function nav(page, label) {
  await page.getByRole('link', { name: label }).first().click();
  await sleep(400);
}

async function runStoryboard(page, baseUrl) {
  const demo = !OPTS.live;
  const deckHash = demo ? '#/deck?demo=1&hour=21' : '#/deck?hour=21';

  // ── BEAT 1 — COMMAND DECK, night. The hook. Hands off; the scene animates itself.
  step('B1', `COMMAND DECK (night)${demo ? ' — demo mode' : ' — live seeded daemon'}`);
  await page.goto(`${baseUrl}/${deckHash}`, { waitUntil: 'domcontentloaded' });
  await page.addStyleTag({ content: SCRUB_CSS });
  await page.evaluate(HIDE_CORPUS_JS);
  await page.waitForSelector('.deck-root', { timeout: 20000 });
  await sleep(1200);

  // ── BEAT 2 — the spark-burst. The headline claim: work gets VERIFIED.
  let burstAt = null;
  if (demo) {
    step('B2', 'waiting for the 2nd spark-burst (trim anchor)');
    try {
      burstAt = await waitForNthBurst(page, 2);
      await sleep(3500); // hold through the 1.8s burst and let the DECK LOG absorb it
    } catch {
      warn('no spark-burst observed — continuing without a trim anchor');
      await sleep(6000);
    }
  } else {
    // Live mode has no celebration: the queue is paused, so nothing ever passes.
    await sleep(6000);
  }

  // ── BEAT 3 — zoom push-in. First proof this is a live interface being driven.
  step('B3', 'deck zoom push-in');
  await page.getByRole('button', { name: 'Zoom in' }).click().catch(() => warn('zoom-in button not found'));
  await sleep(3000);

  // ── BEAT 4 — Agent Cam on Apollo (QA & Verification Lead, agent id 8).
  //    Never click KNOWLEDGE / EXPLAIN / SHOW: all three fetch (and throw under
  //    demo mode), and EXPLAIN additionally writes to the user's real ~/.claude.json.
  step('B4', 'Agent Cam — Apollo (QA & Verification Lead)');
  const apollo = page.locator('[data-agent-id="8"]');
  if (await apollo.count()) {
    await apollo.first().click();
    await sleep(7000);
    // ── BEAT 5 — dismiss. Escape keeps the cursor parked (no stray mouse jump).
    step('B5', 'dismiss Agent Cam');
    await page.keyboard.press('Escape');
    await sleep(2000);
  } else {
    warn('agent 8 sprite not found — skipping Agent Cam beat');
    await sleep(2000);
  }

  // ── BEAT 6 — TASKS: land on TABLE (titles legible in full), then toggle to BOARD
  //    on camera. The toggle is on-screen proof of a live control. Never open a card:
  //    the drawer is hollow under demo mode (no attempts, no criteria).
  step('B6', 'TASKS — table, then board');
  await nav(page, 'TASKS');
  await sleep(2500);
  await page.getByRole('button', { name: 'BOARD' }).first().click().catch(() => warn('BOARD toggle not found'));
  await sleep(4500);

  // ── BEAT 7 — AGENTS: scale, ending on a trust contrast pair (PROVEN vs PROBATION)
  //    so the meters read as data with consequences, not a repeated template.
  step('B7', 'AGENTS — crew grid, settling on a trust contrast');
  await nav(page, 'AGENTS');
  await sleep(2000);
  const probation = page.locator('.agent-card', { hasText: 'PROBATION' });
  if (await probation.count()) {
    await probation.first().scrollIntoViewIfNeeded().catch(() => {});
  } else {
    await smoothScroll(page, 520, 2500);
  }
  await sleep(3500);

  // ── BEAT 8 — USAGE: cost is measured. Use TOKENS BY MODEL (fully populated) over
  //    the 14-day chart (demo seeds only 3 days -> 11 empty slots), and use the
  //    TABLE VIEW toggle as the interaction: it is pure local useState, so it works
  //    with the network severed, and a numbers table beats an illegible bar tooltip
  //    at card size.
  step('B8', 'USAGE — tokens by model, chart -> table');
  await nav(page, 'USAGE');
  await sleep(600);
  const byModel = page.locator('.chart-block', { hasText: 'TOKENS BY MODEL' });
  if (await byModel.count()) {
    await byModel.first().scrollIntoViewIfNeeded().catch(() => {});
    await sleep(2800);
    await byModel.first().getByRole('button', { name: 'TABLE VIEW' }).click().catch(() => warn('TABLE VIEW toggle not found'));
    await sleep(3600);
  } else {
    warn('TOKENS BY MODEL block not found');
    await sleep(6400);
  }

  // ── BEAT 9 — LESSONS: it learns. Corpus panel already hidden by the observer.
  step('B9', 'LESSONS — learned strategies');
  await nav(page, 'LESSONS');
  await page.evaluate(HIDE_CORPUS_JS);
  await sleep(6000);

  // ── BEAT 10 — OVERVIEW: the "I operate this" shot, and the densest hold. The red
  //    BLOCKED card and NEEDS ATTENTION panel are the thesis in miniature — the
  //    system reports its own failures instead of declaring success.
  step('B10', 'OVERVIEW — mission control');
  await nav(page, 'OVERVIEW');
  await sleep(1200);
  const attention = page.locator('.panel', { hasText: 'NEEDS ATTENTION' });
  if (await attention.count()) {
    await attention.first().scrollIntoViewIfNeeded().catch(() => {});
  }
  await sleep(6800);

  // ── BEAT 11 — back to the deck for the freeze-frame the card poster will use.
  //    MUST be a direct hash assignment carrying ?demo=1&hour=21: the sidebar href
  //    drops the query, which would kill the DEMO chip and snap the lighting from
  //    night to the wall clock. Never goto()/reload() — that destroys demo state.
  step('B11', 'COMMAND DECK — resting wide shot');
  await page.evaluate((h) => { location.hash = h; }, deckHash);
  await sleep(800);
  await page.locator('.deck-zoom-pct').click().catch(() => {}); // reset zoom to 100%
  await sleep(7000);

  return burstAt;
}

// ──────────────────────────────── encode ─────────────────────────────────

function encode(ffmpeg, webmPath, outPath, trimS) {
  mkdirSync(dirname(outPath), { recursive: true });

  const args = ['-y', '-i', webmPath];
  // Output-side seek (-ss AFTER -i) is frame-accurate; input-side seek would snap to
  // the nearest keyframe and Playwright's VP8 keyframes are sparse. The clip is short,
  // so the decode cost is irrelevant.
  if (trimS > 0.05) args.push('-ss', trimS.toFixed(3));
  args.push(
    '-c:v', 'libx264',
    '-profile:v', 'high',
    '-level:v', '4.0',
    '-preset', 'slow',
    '-crf', '21',
    '-pix_fmt', 'yuv420p',
    '-vf', `scale=${DELIVER.width}:${DELIVER.height}:flags=lanczos`,
    '-an',
    '-movflags', '+faststart',
    // No -r: Playwright captures at a fixed 25fps and forcing 30 only duplicates
    // frames and introduces judder.
    outPath,
  );

  log(`ffmpeg ${args.join(' ')}`);
  execFileSync(ffmpeg, args, { stdio: ['ignore', 'ignore', 'inherit'], timeout: 300000 });
}

/**
 * Structural faststart check: moov must physically precede mdat for progressive
 * playback. Checking the atom order is stronger than trusting the -movflags flag.
 */
function verifyFaststart(p) {
  const b = readFileSync(p);
  const moov = b.indexOf('moov');
  const mdat = b.indexOf('mdat');
  return { ok: moov > 0 && mdat > 0 && moov < mdat, moov, mdat };
}

// ──────────────────────────────── main ───────────────────────────────────

async function main() {
  console.log('LastResortAI — portfolio recording');
  console.log(`  mode      : ${OPTS.live ? 'LIVE (REST-seeded daemon)' : 'DEMO (client-only synthetic scene)'}`);
  console.log(`  capture   : ${CAPTURE.width}x${CAPTURE.height}`);
  console.log(`  delivery  : ${DELIVER.width}x${DELIVER.height} H.264`);
  console.log(`  output    : ${OPTS.out}`);

  // ---- 0. dependencies up front, so we fail before booting anything ----
  step(0, 'resolving dependencies');
  const ffmpeg = findFfmpeg();
  const pw = await loadPlaywright();

  if (!existsSync(join(LRAI_ROOT, 'web', 'dist', 'index.html'))) {
    throw new Error(
      `web/dist is missing. Build it first:\n  cd ${LRAI_ROOT} && npm run build`,
    );
  }

  // ---- 1. throwaway data dir + scratch port (HARD RULE 1) ----
  step(1, 'creating throwaway data dir + scratch port');
  const dataDir = mkdtempSync(join(tmpdir(), 'lrai-rec-'));
  onCleanup(`removed data dir ${dataDir}`, () => rmSync(dataDir, { recursive: true, force: true }));
  log(`data dir: ${dataDir}`);

  const port = OPTS.port ?? await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  log(`port: ${port}`);

  // Seed a statusline drop file so the topbar never renders the "connect statusline"
  // pill, whose href is hardcoded to the user's real GitHub profile. Resolved against
  // DATA_DIR, so it stays inside the throwaway dir.
  mkdirSync(join(dataDir, 'quota'), { recursive: true });
  writeFileSync(
    join(dataDir, 'quota', 'rate_limits.json'),
    JSON.stringify({
      rate_limits: {
        five_hour: { used_percentage: 18, resets_at: new Date(Date.now() + 3 * 3600e3).toISOString() },
        seven_day: { used_percentage: 41, resets_at: new Date(Date.now() + 4 * 86400e3).toISOString() },
      },
    }),
  );

  // Demo workspace dir on a NEUTRAL root — %TEMP% embeds the username and the events
  // feed prints workspace paths verbatim.
  const demoWsPath = join(DEMO_WS_ROOT, DEMO_WS_NAME);
  try {
    mkdirSync(demoWsPath, { recursive: true });
  } catch (err) {
    throw new Error(
      `could not create the demo workspace dir at ${demoWsPath}: ${err.message}\n` +
      '  It must NOT live under %TEMP% — that path contains the username and the\n' +
      '  events feed renders workspace paths verbatim, putting it on screen.',
    );
  }
  log(`demo workspace: ${demoWsPath}`);

  // ---- 2. boot the daemon ----
  step(2, 'booting the daemon');
  const child = spawn('node', ['server/src/index.ts'], {
    cwd: LRAI_ROOT,
    env: {
      ...process.env,
      LRAI_PORT: String(port),
      LRAI_DATA_DIR: dataDir,            // absolute -> wins outright over config.dataDir
      LRAI_API_TOKEN: '',                // localhost then auto-resolves to 'admin'
      // Defence in depth: autopilot files its OWN tasks (cron */20) and self-merge
      // would git-mutate the real repo. The API pause below is the primary guard.
      LRAI_AUTOPILOT__ENABLED: 'false',
      LRAI_SELF__AUTO_MERGE_ON_PASS: 'false',
      LRAI_SELF__USE_WORKTREE: 'false',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
  });

  const daemonPid = child.pid;
  log(`daemon pid ${daemonPid}`);
  // Kill by CAPTURED PID ONLY. Never match on a CommandLine pattern like
  // '*server/src/index.ts*' — during recon that over-matched and killed ~10
  // unrelated node process trees.
  onCleanup(`killed daemon tree pid ${daemonPid}`, () => {
    execFileSync('taskkill', ['/PID', String(daemonPid), '/T', '/F'], { stdio: 'ignore' });
  });

  child.stdout.on('data', (d) => process.stdout.write(`  [daemon] ${d}`));
  child.stderr.on('data', (d) => process.stderr.write(`  [daemon!] ${d}`));
  child.on('exit', (code, sig) => log(`daemon exited code=${code} sig=${sig}`));

  const health = await waitForHealth(baseUrl);
  log(`health: ${JSON.stringify(health)}`);

  const api = apiFactory(baseUrl);

  // ---- 3. PAUSE FIRST, then seed ----
  // POST /api/tasks calls notifyQueue() and the orchestrator claims queued tasks
  // within ~1 tick, spawning a REAL `claude` CLI session. A task with no
  // workspace_id falls back to the self workspace = the live LastResortAI repo.
  // Pausing must happen before any task can exist.
  step(3, 'pausing the queue + disabling autopilot (before anything can dispatch)');
  const paused = await api('POST', '/api/system/pause', { reason: 'demo recording' });
  log(`queue: ${paused?.queue_status}`);
  if (paused?.queue_status !== 'paused') {
    throw new Error(`refusing to continue: queue is "${paused?.queue_status}", not "paused"`);
  }
  const autopilot = await api('POST', '/api/autopilot', { enabled: false });
  log(`autopilot enabled: ${autopilot?.enabled}`);

  // HARD RULE 1 tripwire: config.ts defaults dataDir to the repo's real ./data. If
  // LRAI_DATA_DIR were ever dropped by quoting, the daemon would silently open the
  // user's real database. A fresh dir must have zero tasks.
  const existing = await api('GET', '/api/tasks');
  if (Array.isArray(existing) && existing.length > 0) {
    throw new Error(
      `ABORT: expected an empty database but found ${existing.length} tasks. ` +
      'LRAI_DATA_DIR may not have applied — this could be the real data dir.',
    );
  }
  log('verified: database is empty (throwaway data dir applied)');

  // ---- 4. seed generic demo content ----
  step(4, 'seeding generic software tasks over REST');
  let wsId = null;
  try {
    const ws = await api('POST', '/api/workspaces', {
      name: DEMO_WS_NAME, path: demoWsPath, default_branch: 'main',
    });
    wsId = ws?.id ?? null;
    log(`workspace #${wsId} ${ws?.name}`);
  } catch (err) {
    warn(`workspace create failed (${err.message.split('\n')[0]}) — falling back to the self workspace`);
    const all = await api('GET', '/api/workspaces');
    wsId = all?.[0]?.id ?? null;
  }
  if (!wsId) throw new Error('no workspace id — refusing to POST tasks without an explicit workspace_id');

  for (const t of SEED_TASKS) {
    const created = await api('POST', '/api/tasks', { ...t, workspace_id: wsId });
    log(`  #${created.id} [${created.status}] ${created.title}`);
  }

  // A cancelled task gives the board a non-queued column so it is not one flat row.
  try {
    const all = await api('GET', '/api/tasks');
    const victim = all?.[all.length - 1];
    if (victim) {
      await api('POST', `/api/tasks/${victim.id}/cancel`, {});
      log(`  #${victim.id} cancelled (board variety)`);
    }
  } catch (err) { warn(`cancel failed: ${err.message.split('\n')[0]}`); }

  // Confirm the paused queue really did prevent any child `claude` process.
  try {
    const kids = execFileSync('powershell', [
      '-NoProfile', '-NonInteractive', '-Command',
      `(Get-CimInstance Win32_Process -Filter "ParentProcessId=${daemonPid}" | Measure-Object).Count`,
    ], { encoding: 'utf8', timeout: 20000 }).trim();
    log(`daemon child processes: ${kids} (expect 0)`);
    if (kids !== '0') warn('daemon spawned child processes despite the paused queue — investigate');
  } catch { warn('could not enumerate daemon children'); }

  // ---- 5. record ----
  step(5, 'recording the storyboard');
  const videoDir = mkdtempSync(join(tmpdir(), 'lrai-vid-'));
  onCleanup(`removed video scratch ${videoDir}`, () => {
    if (!OPTS.keepWebm) rmSync(videoDir, { recursive: true, force: true });
    else console.log(`      (kept: ${videoDir})`);
  });

  const browser = await pw.chromium.launch({ headless: true });
  onCleanup('closed browser', () => { browser.close().catch(() => {}); });

  const ctx = await browser.newContext({
    viewport: { width: CAPTURE.width, height: CAPTURE.height },
    recordVideo: { dir: videoDir, size: { width: CAPTURE.width, height: CAPTURE.height } },
    deviceScaleFactor: 1, // DSF does NOT raise capture resolution; recordVideo.size does
    colorScheme: 'dark',
    reducedMotion: 'no-preference',
  });

  const page = await ctx.newPage();
  // Stamp as close to the first captured frame as possible; the trim is relative to it.
  page.__recStart = Date.now();
  const recStart = page.__recStart;

  let burstAt = null;
  try {
    burstAt = await runStoryboard(page, baseUrl);
  } finally {
    // Video is only finalized on context.close(). Closing just the browser — or
    // killing the process — yields a truncated or zero-byte WebM.
    log('finalizing video (ctx.close)');
    await ctx.close();
    await browser.close().catch(() => {});
  }

  // ---- 6. locate the WebM ----
  step(6, 'locating the capture');
  const webms = readdirSync(videoDir)
    .filter((f) => f.endsWith('.webm'))
    .map((f) => join(videoDir, f))
    .sort((a, b) => statSync(b).size - statSync(a).size);
  if (!webms.length) throw new Error(`no .webm produced in ${videoDir}`);
  const webm = webms[0];
  log(`webm: ${webm} (${(statSync(webm).size / 1048576).toFixed(2)} MB)`);

  // ---- 7. trim so the burst lands on the anchor, then transcode ----
  step(7, 'trimming + transcoding to H.264 MP4');
  let trimS = 0;
  if (burstAt) {
    const elapsed = (burstAt - recStart) / 1000;
    trimS = Math.max(0, elapsed - BURST_ANCHOR_S);
    log(`burst at +${elapsed.toFixed(2)}s -> trimming ${trimS.toFixed(2)}s so it lands at ${BURST_ANCHOR_S.toFixed(1)}s`);
  } else {
    log('no burst anchor — no trim');
  }

  encode(ffmpeg, webm, OPTS.out, trimS);

  const bytes = statSync(OPTS.out).size;
  log(`wrote ${OPTS.out} (${(bytes / 1048576).toFixed(2)} MB)`);

  try {
    const fs = verifyFaststart(OPTS.out);
    log(`faststart: ${fs.ok ? 'YES' : 'NO'} (moov@${fs.moov} mdat@${fs.mdat})`);
    if (!fs.ok) warn('moov does not precede mdat — the file will not stream progressively');
  } catch { warn('could not verify faststart'); }

  console.log(`\n[${stamp()}] ✅ done -> ${OPTS.out}`);
  console.log('\nBefore publishing, watch the whole clip once and confirm:');
  console.log('  · no absolute path containing a username, no email, no token');
  console.log('  · no client-identifying text anywhere in the events / logs / task titles');
  console.log('  · the DEMO chip is visible (demo mode) — do not crop it out; it is what');
  console.log('    keeps the piece honest about the data being synthetic');
}

main()
  .then(() => { cleanupAll(); process.exit(0); })
  .catch((err) => {
    console.error(`\n[${stamp()}] ❌ FAILED: ${err?.stack ?? err}`);
    cleanupAll();
    process.exit(1);
  });
