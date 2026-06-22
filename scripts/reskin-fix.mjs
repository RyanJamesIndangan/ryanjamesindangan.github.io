// reskin-fix.mjs — second pass: fix contrast (clay-as-text -> readable #A84B2A)
// and sweep leftover cold colors the first pass missed. From the audit-mine.
import { readFileSync, writeFileSync } from 'node:fs';

// Substring/regex fixes (order matters)
const REGEX = [
  [/color:\s*#D97757/gi, 'color: #A84B2A'],   // clay-as-TEXT fails AA on cream -> deeper clay (5.15:1)
  [/\b2171d6\b/g, 'D97757'],                   // leftover blue in remote badge URL params
];
// Hex swaps (whole value, case-insensitive)
const HEX = [
  ['#4a9eff', '#A84B2A'],   // old link-hover blue
  ['#1f3a5f', '#8A4A30'],   // navy CV button stop
  ['#f7fafc', '#F5F4EF'], ['#edf2f7', '#E8E6DC'], ['#e3e8ef', '#DAD9D2'],
  ['#2d3748', '#141413'], ['#4a5568', '#5C5A53'],
  ['#33414f', '#141413'], ['#6b7785', '#5C5A53'],
  ['#667eea', '#3A2A22'], ['#764ba2', '#1F1E1B'],  // lockscreen indigo->warm dusk
  ['#60a5fa', '#788C5D'], ['#a78bfa', '#E8B79E'],  // easter-egg blue/violet
  ['#4caf50', '#788C5D'], ['#45a049', '#6B7D4F'],  // material green -> olive
  ['#0b1b34', '#141413'],  // qs-tile.on cold navy text
  ['#e0245e', '#788C5D'],  // availability crimson -> olive
  ['#34c759', '#788C5D'],  // iOS cc green -> olive
  ['#e2e8f0', '#E4E1D8'],  // cool light gray (text-on-dark / borders) -> warm light
];
const RGBA = [
  [[22, 54, 92], [189, 93, 58]],     // navy CV shadow -> clay-dark
  [[59, 130, 246], [120, 140, 93]],  // blue-500 -> olive (AI user bubble)
  [[124, 58, 237], [120, 140, 93]],  // violet -> olive (module badge)
];

function fixHex(s) {
  let n = 0;
  for (const [from, to] of HEX) {
    const re = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    s = s.replace(re, () => { n++; return to; });
  }
  return [s, n];
}
function fixRgba(s) {
  let n = 0;
  for (const [[r, g, b], [nr, ng, nb]] of RGBA) {
    const re = new RegExp('rgba\\(\\s*' + r + '\\s*,\\s*' + g + '\\s*,\\s*' + b + '\\s*,', 'gi');
    s = s.replace(re, () => { n++; return `rgba(${nr}, ${ng}, ${nb},`; });
  }
  return [s, n];
}
function fixRegex(s) {
  let n = 0;
  for (const [re, to] of REGEX) s = s.replace(re, () => { n++; return to; });
  return [s, n];
}

const files = [
  'css/devos.css', 'css/mobile-shell.css',
  'js/devos/apps.js', 'js/devos/ai-demos.js', 'js/devos/main.js',
  'js/devos/easter-eggs.js', 'js/devos/snake-game.js',
  'js/devos/code-snippets.js', 'js/devos/contact-form.js',
];
for (const f of files) {
  let s;
  try { s = readFileSync(f, 'utf8'); } catch { console.log(`(skip ${f})`); continue; }
  let total = 0, r;
  [s, r] = fixRegex(s); total += r;
  [s, r] = fixHex(s); total += r;
  [s, r] = fixRgba(s); total += r;
  writeFileSync(f, s);
  console.log(`${f}: ${total} fixes`);
}
