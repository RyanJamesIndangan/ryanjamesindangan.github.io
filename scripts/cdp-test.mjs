// cdp-test.mjs — drive headless Chrome via the DevTools Protocol (no deps).
// Boots a page, captures console errors, runs interaction assertions, screenshots.
// Usage: node scripts/cdp-test.mjs <url> <outPng> [width] [height] [scriptFile]
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';

const [, , URL, OUT, W = '1280', H = '900', SCRIPT_FILE] = process.argv;
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9222 + Math.floor((Date.now() % 500));
mkdirSync('.preview', { recursive: true });

const userScript = SCRIPT_FILE ? (await import('node:fs')).readFileSync(SCRIPT_FILE, 'utf8') : 'return {ok:true};';

const chrome = spawn(CHROME, [
  '--headless=new', `--remote-debugging-port=${PORT}`,
  '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  `--window-size=${W},${H}`, '--force-device-scale-factor=2',
  '--user-data-dir=' + process.cwd() + '/.preview/cdp-profile',
  'about:blank',
], { stdio: 'ignore' });

let nextId = 1;
function rpc(ws, method, params = {}, sessionId) {
  const id = nextId++;
  return new Promise((resolve, reject) => {
    const onMsg = (ev) => {
      const m = JSON.parse(ev.data);
      if (m.id === id) { ws.removeEventListener('message', onMsg); m.error ? reject(new Error(method + ': ' + m.error.message)) : resolve(m.result); }
    };
    ws.addEventListener('message', onMsg);
    ws.send(JSON.stringify({ id, method, params, sessionId }));
  });
}

async function main() {
  // wait for devtools endpoint
  let wsUrl;
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://localhost:${PORT}/json/version`);
      wsUrl = (await r.json()).webSocketDebuggerUrl; if (wsUrl) break;
    } catch {}
    await sleep(200);
  }
  if (!wsUrl) throw new Error('Chrome devtools never came up');

  const ws = new WebSocket(wsUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

  const { targetId } = await rpc(ws, 'Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await rpc(ws, 'Target.attachToTarget', { targetId, flatten: true });
  const S = sessionId;

  const consoleErrors = [];
  ws.addEventListener('message', (ev) => {
    const m = JSON.parse(ev.data);
    if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error')
      consoleErrors.push(m.params.args.map(a => a.value || a.description || a.type).join(' '));
    if (m.method === 'Runtime.exceptionThrown')
      consoleErrors.push('EXCEPTION: ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text));
  });

  await rpc(ws, 'Page.enable', {}, S);
  await rpc(ws, 'Runtime.enable', {}, S);
  await rpc(ws, 'Page.navigate', { url: URL }, S);
  await sleep(3500); // let boot + app init settle

  const expr = `(async () => { try { ${userScript} } catch(e){ return {error: String(e && e.stack || e)}; } })()`;
  const evalRes = await rpc(ws, 'Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }, S);
  const result = evalRes.result?.value ?? evalRes.exceptionDetails?.text;

  await sleep(400);
  const shot = await rpc(ws, 'Page.captureScreenshot', { format: 'png' }, S);
  writeFileSync(OUT, Buffer.from(shot.data, 'base64'));

  console.log('=== RESULT ===');
  console.log(JSON.stringify(result, null, 2));
  console.log('=== CONSOLE ERRORS (' + consoleErrors.length + ') ===');
  consoleErrors.forEach(e => console.log(' • ' + e));
  console.log('screenshot →', OUT);

  ws.close();
  chrome.kill();
}

main().catch(e => { console.error('FAIL:', e.message); chrome.kill(); process.exit(1); });
