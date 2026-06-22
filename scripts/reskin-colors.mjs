// reskin-colors.mjs — swap the Windows-blue brand palette to Anthropic "Claude" clay.
// Brand/blue swaps apply everywhere; neutral warm-ups only to JS content files.
import { readFileSync, writeFileSync } from 'node:fs';

const HEX = [
  // blues -> clay family
  ['#2171d6', '#D97757'], ['#1a5fb8', '#BD5D3A'], ['#1e90ff', '#E0916F'],
  ['#16365c', '#BD5D3A'], ['#0078d7', '#D97757'], ['#0066cc', '#D97757'],
  ['#0052a3', '#BD5D3A'], ['#004080', '#9C4A2A'], ['#3399ff', '#E0916F'],
  ['#0a84ff', '#D97757'], ['#aecbfa', '#E8B79E'], ['#64b5f6', '#E0916F'],
  // original "AI teal" accent -> clay (single confident accent)
  ['#64ffda', '#D97757'],
];
const HEX_NEUTRAL = [
  // warm-ups for content surfaces/text (JS content only)
  ['#e8f4f8', '#F5F4EF'], ['#f0f8ff', '#E8E6DC'], ['#fafafa', '#F5F4EF'],
  ['#1a1a1a', '#141413'], ['#e0e0e0', '#DAD9D2'],
];
// rgba(r,g,b,a): swap the blue RGB triplets to clay/warm, keep alpha
const RGBA = [
  [[33, 113, 214], [217, 119, 87]],   // #2171d6
  [[51, 153, 255], [224, 145, 111]],  // #3399ff
  [[0, 120, 215], [217, 119, 87]],    // #0078d7
  [[100, 181, 246], [217, 119, 87]],  // #64b5f6
  [[30, 144, 255], [224, 145, 111]],  // #1e90ff
  [[100, 255, 218], [217, 119, 87]],  // teal #64ffda -> clay
  [[120, 201, 255], [224, 145, 111]], // light blue -> clay-light
];

function swapHex(s, pairs) {
  let n = 0;
  for (const [from, to] of pairs) {
    const re = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    s = s.replace(re, () => { n++; return to; });
  }
  return [s, n];
}
function swapRgba(s) {
  let n = 0;
  for (const [[r, g, b], [nr, ng, nb]] of RGBA) {
    const re = new RegExp('rgba\\(\\s*' + r + '\\s*,\\s*' + g + '\\s*,\\s*' + b + '\\s*,', 'gi');
    s = s.replace(re, () => { n++; return `rgba(${nr}, ${ng}, ${nb},`; });
  }
  return [s, n];
}

const files = [
  { f: 'css/devos.css', neutral: false },
  { f: 'css/mobile-shell.css', neutral: false },
  { f: 'js/devos/apps.js', neutral: true },
  { f: 'js/devos/ai-demos.js', neutral: true },
  { f: 'js/devos/main.js', neutral: true },
  { f: 'js/devos/easter-eggs.js', neutral: false },
  { f: 'js/devos/snake-game.js', neutral: false },
];

for (const { f, neutral } of files) {
  let s = readFileSync(f, 'utf8');
  let total = 0, r;
  [s, r] = swapHex(s, HEX); total += r;
  [s, r] = swapRgba(s); total += r;
  if (neutral) { [s, r] = swapHex(s, HEX_NEUTRAL); total += r; }
  writeFileSync(f, s);
  console.log(`${f}: ${total} replacements${neutral ? ' (incl. neutral warm-ups)' : ''}`);
}
