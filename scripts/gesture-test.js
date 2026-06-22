const sleep = ms => new Promise(r => setTimeout(r, ms));
const out = {};

function fire(el, type, x, y) {
  const t = new Touch({ identifier: 1, target: el, clientX: x, clientY: y, pageX: x, pageY: y });
  const list = type === 'touchend' || type === 'touchcancel' ? [] : [t];
  el.dispatchEvent(new TouchEvent(type, { bubbles: true, cancelable: true, touches: list, targetTouches: list, changedTouches: [t] }));
}
async function drag(el, x0, y0, x1, y1) {
  fire(el, 'touchstart', x0, y0); await sleep(20);
  const steps = 8;
  for (let i = 1; i <= steps; i++) { fire(el, 'touchmove', x0 + (x1 - x0) * i / steps, y0 + (y1 - y0) * i / steps); await sleep(16); }
  return el.style.transform;
}

// --- Phase 1: pull-down-to-dismiss ---
let sheet = document.querySelector('.ms-sheet.open');
out.sheet1Open = !!sheet;
out.pullTransform = await drag(sheet, 200, 60, 200, 280);
fire(sheet, 'touchend', 200, 280);
await sleep(450);
out.closedAfterPull = !document.querySelector('.ms-sheet.open');

// --- Phase 2: left-edge swipe-back ---
window.MobileShell && window.MobileShell.open('skills');
await sleep(550);
let sheet2 = document.querySelector('.ms-sheet.open');
out.sheet2Open = !!sheet2;
out.edgeTransform = await drag(sheet2, 6, 320, 230, 320);
fire(sheet2, 'touchend', 230, 320);
await sleep(450);
out.closedAfterEdge = !document.querySelector('.ms-sheet.open');

// --- Phase 3: a small pull that should NOT dismiss (snap back) ---
window.MobileShell && window.MobileShell.open('about');
await sleep(550);
let sheet3 = document.querySelector('.ms-sheet.open');
await drag(sheet3, 200, 60, 200, 130);
fire(sheet3, 'touchend', 200, 130);
await sleep(350);
out.stillOpenAfterSmallPull = !!document.querySelector('.ms-sheet.open');
out.transformClearedAfterSnap = (document.querySelector('.ms-sheet.open')?.style.transform || '') === '';

return out;
