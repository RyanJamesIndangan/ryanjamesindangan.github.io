const sleep = ms => new Promise(r => setTimeout(r, ms));
const out = { opened: [], failedToOpen: [] };
const ids = ['about','experience','projects','skills','certifications','github-stats',
             'ai-lab','testimonials','blog','terminal','snake','code-snippets',
             'analytics','easter-eggs','resume','contact'];
const isMobile = !!(window.DeviceMode && window.DeviceMode.isMobile());
for (const id of ids) {
  try {
    if (isMobile && window.MobileShell) {
      window.MobileShell.open(id);
      await sleep(350);
      const ok = !!document.querySelector('.ms-sheet.open');
      out.opened.push(id + (ok ? '' : '(no-sheet)'));
      history.back(); await sleep(300);
    } else if (typeof openApp === 'function') {
      openApp(id);
      await sleep(350);
      const ok = !!document.querySelector('.window[data-app-id="' + id + '"]');
      out.opened.push(id + (ok ? '' : '(no-window)'));
    }
  } catch (e) { out.failedToOpen.push(id + ': ' + (e && e.message)); }
}
return out;
