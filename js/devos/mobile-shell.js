/* =========================================================================
   Mobile Shell — a real phone HOME SCREEN on small devices.
   - Android  -> Pixel/Material home: status bar, Google search bar, app grid
                 on a wallpaper, dock, 3-button nav bar.
   - iOS      -> Cupertino home: status bar, widgets, app grid, Spotlight pill,
                 dock, home indicator.
   Each "app" icon is a portfolio section that launches full-screen (like an
   app opening). Reuses the exact apps[id].content + per-app initializers.
   Only runs when DeviceMode.isMobile(); the desktop is untouched.
   ========================================================================= */
(function () {
  'use strict';
  if (!(window.DeviceMode && window.DeviceMode.isMobile())) return;

  var OS = (window.DeviceMode.os === 'android') ? 'android' : 'ios';
  var apps = window.apps || {};
  var built = false, sheetOpen = false;
  var ControlCenter = null;
  var Search = null;

  function appData(id) { return apps[id] || {}; }
  function appContent(id) { return appData(id).content || '<div style="padding:24px;color:#556">Content unavailable.</div>'; }
  function appTitle(id) { return appData(id).title || id; }

  // Portfolio sections styled as crafted phone apps (id, label, gradient).
  var HOME_APPS = [
    { id: 'about',         label: 'About',      grad: 'linear-gradient(145deg,#4f9cff,#1d6fe0)' },
    { id: 'experience',    label: 'Experience', grad: 'linear-gradient(145deg,#22b8e6,#0e86c4)' },
    { id: 'projects',      label: 'Projects',   grad: 'linear-gradient(145deg,#9b6cff,#6d3bdb)' },
    { id: 'skills',        label: 'Skills',     grad: 'linear-gradient(145deg,#ffb24d,#f08a1d)' },
    { id: 'certifications',label: 'Certs',      grad: 'linear-gradient(145deg,#ff6b81,#e11d48)' },
    { id: 'github-stats',  label: 'GitHub',     grad: 'linear-gradient(145deg,#485063,#1b1f2a)' },
    { id: 'ai-lab',        label: 'AI Lab',     grad: 'linear-gradient(145deg,#2dd4a7,#0ea371)' },
    { id: 'testimonials',  label: 'Reviews',    grad: 'linear-gradient(145deg,#ffd24d,#f1a811)' },
    { id: 'blog',          label: 'Blog',       grad: 'linear-gradient(145deg,#ff7a59,#e0492f)' },
    { id: 'terminal',      label: 'Terminal',   grad: 'linear-gradient(145deg,#2b3340,#11151d)' },
    { id: 'snake',         label: 'Snake',      grad: 'linear-gradient(145deg,#46d66b,#1ba345)' },
    { id: 'code-snippets', label: 'Snippets',   grad: 'linear-gradient(145deg,#7c83ff,#4f46e5)' },
    { id: 'analytics',     label: 'Analytics',  grad: 'linear-gradient(145deg,#2bd4c0,#0f9e95)' },
    { id: 'easter-eggs',   label: 'Secrets',    grad: 'linear-gradient(145deg,#ff8ec2,#e1559a)' },
    { id: '__desktop',     label: 'Desktop',    grad: 'linear-gradient(145deg,#8090a8,#475569)' }
  ];
  var DOCK_APPS = [
    { id: 'resume',   label: 'Résumé',  grad: 'linear-gradient(145deg,#5aa0ff,#2f6fe6)' },
    { id: 'contact',  label: 'Contact', grad: 'linear-gradient(145deg,#49d96b,#1ea34a)' },
    { id: '__chat',   label: 'Clippy',  grad: 'linear-gradient(145deg,#ffffff,#eef0f3)', img: 'assets/clippy/clippy-on-yellow-paper.png', badge: '1' },
    { id: '__github', label: 'GitHub',  grad: 'linear-gradient(145deg,#485063,#15181f)' }
  ];

  // ---- SVG bits ---------------------------------------------------------
  var SB_ICONS =
    '<svg class="ms-sb-svg" viewBox="0 0 19 12" aria-hidden="true"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="2.8" width="3" height="9.2" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>' +
    '<svg class="ms-sb-svg" viewBox="0 0 16 13" aria-hidden="true"><path d="M8 12.8l2.1-2.6a3.3 3.3 0 0 0-4.2 0L8 12.8z"/><path d="M8 6.1c1.9 0 3.7.7 5 2l1.6-2A9.5 9.5 0 0 0 8 3.4 9.5 9.5 0 0 0 1.4 6.1l1.6 2a7.2 7.2 0 0 1 5-2z"/></svg>' +
    '<svg class="ms-sb-svg" viewBox="0 0 27 13" aria-hidden="true"><rect x="0.6" y="0.6" width="22" height="11.8" rx="3" fill="none" stroke="currentColor" stroke-width="1.1" opacity="0.45"/><rect x="2.2" y="2.2" width="17" height="8.6" rx="1.6"/><rect x="23.4" y="4.3" width="2.2" height="4.4" rx="1"/></svg>';

  var GOOGLE_G =
    '<svg viewBox="0 0 24 24" aria-hidden="true">' +
    '<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>' +
    '<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>' +
    '<path fill="#FBBC05" d="M5.84 14.09A6.6 6.6 0 0 1 5.49 12c0-.73.13-1.43.35-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93l3.66-2.84z"/>' +
    '<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>';
  var MIC_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" class="ms-g-mic"><path fill="#4285F4" d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3z"/><path fill="#34A853" d="M17 11a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11z"/></svg>';
  var LENS_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" class="ms-g-lens"><circle cx="12" cy="12" r="3.2" fill="#4285F4"/><circle cx="12" cy="4.6" r="1.7" fill="#EA4335"/><circle cx="18.4" cy="15.5" r="1.7" fill="#FBBC05"/><circle cx="5.6" cy="15.5" r="1.7" fill="#34A853"/></svg>';
  var MAG_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6" fill="none" stroke="currentColor" stroke-width="2"/><line x1="15" y1="15" x2="20" y2="20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  var NAV_BACK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7z"/></svg>';
  var NAV_HOME = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7.5" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
  var NAV_RECENTS = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/></svg>';

  // Mirror of openApp()'s per-app initializers, each guarded.
  function runInit(id) {
    function g() {
      for (var i = 0; i < arguments.length; i++) {
        var fn = arguments[i];
        try { if (typeof window[fn] === 'function') window[fn](); }
        catch (e) { console.warn('[mobile-shell] init failed:', fn, e); }
      }
    }
    switch (id) {
      case 'about':        g('updateExperienceYears'); break;
      case 'projects':     g('initializeDemoButtons', 'initializeProjectFilters', 'initializeProjectModals'); break;
      case 'terminal':     g('initializeTerminal'); break;
      case 'snake':        g('initializeSnakeGame'); break;
      case 'testimonials': g('initializeTestimonialsCarousel'); break;
      case 'github-stats': g('loadGitHubStats', 'initializeGitHubStats'); break;
      case 'ai-lab':       g('initializeOCRDemo', 'initializePipelineVisualization', 'initializeWatermarkDemo'); break;
    }
  }

  // Cohesive line-glyph set (24x24, white stroke via CSS) for crafted app icons.
  var GLYPHS = {
    about: '<circle cx="12" cy="8.5" r="3.4"/><path d="M5.5 19.5a6.5 6.5 0 0 1 13 0"/>',
    experience: '<rect x="3" y="7.5" width="18" height="12" rx="2"/><path d="M8.5 7.5V6.2A2.2 2.2 0 0 1 10.7 4h2.6a2.2 2.2 0 0 1 2.2 2.2V7.5"/><path d="M3 12.5h18"/>',
    projects: '<path d="M12 3.4c2.8 1.7 4.3 4.4 4.3 7.3L13.8 14.2h-3.6L7.7 10.7c0-2.9 1.5-5.6 4.3-7.3z"/><circle cx="12" cy="9.6" r="1.4"/><path d="M9.6 14.6 8 18M14.4 14.6 16 18"/>',
    skills: '<path d="M14.8 6.2a4 4 0 0 0-5.1 5L4 16.9 7.1 20l5.7-5.7a4 4 0 0 0 5-5.1l-2.7 2.7-2.3-2.3 2.8-2.7z"/>',
    certifications: '<path d="M12 4 2.8 8.3 12 12.6l9.2-4.3L12 4z"/><path d="M6.6 10.4v4.1c0 1.4 2.4 2.5 5.4 2.5s5.4-1.1 5.4-2.5v-4.1"/><path d="M21.2 8.3v4.4"/>',
    'github-stats': '<line x1="3.5" y1="20" x2="20.5" y2="20"/><rect x="5.5" y="11" width="3" height="8"/><rect x="10.5" y="6.5" width="3" height="12.5"/><rect x="15.5" y="13.5" width="3" height="5.5"/>',
    'ai-lab': '<path d="M11 4l1.5 4 4 1.5-4 1.5L11 15l-1.5-4-4-1.5 4-1.5L11 4z"/><path d="M17.8 4.6l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7.7-1.9z"/>',
    testimonials: '<path d="M12 3.6l2.5 5.2 5.7.8-4.1 4 1 5.7L12 16.9l-5.1 2.4 1-5.7-4.1-4 5.7-.8L12 3.6z"/>',
    blog: '<path d="M13.5 3.5H7A2 2 0 0 0 5 5.5v13A2 2 0 0 0 7 20.5h10a2 2 0 0 0 2-2V9l-5.5-5.5z"/><path d="M13.5 3.5V9H19"/><path d="M8.5 13h7M8.5 16.5h7"/>',
    terminal: '<rect x="3" y="4.5" width="18" height="15" rx="2"/><path d="M7 9.5l3 2.5-3 2.5"/><path d="M12.5 15h5"/>',
    snake: '<rect x="2.5" y="8" width="19" height="9" rx="4.5"/><path d="M6.8 11v3M5.3 12.5h3"/><circle cx="15.8" cy="11.8" r="1.05"/><circle cx="18.2" cy="13.6" r="1.05"/>',
    'code-snippets': '<path d="M8.6 8 4.6 12l4 4M15.4 8l4 4-4 4M13.4 6l-2.8 12"/>',
    analytics: '<path d="M3.5 16.5l5-5 3 3 6.5-6.5"/><path d="M15.5 8h4.5v4.5"/>',
    'easter-eggs': '<path d="M12 3.5c3.3 0 6 4.7 6 8.6a6 6 0 0 1-12 0c0-3.9 2.7-8.6 6-8.6z"/>',
    __desktop: '<rect x="3" y="4.5" width="18" height="11.5" rx="2"/><path d="M9 20h6M12 16v4"/>',
    resume: '<path d="M13.5 3.5H7A2 2 0 0 0 5 5.5v13A2 2 0 0 0 7 20.5h10a2 2 0 0 0 2-2V9l-5.5-5.5z"/><path d="M13.5 3.5V9H19"/><path d="M8.5 12.5h7M8.5 16h7"/>',
    contact: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M4 7l8 6 8-6"/>',
    __github: '<circle cx="6.5" cy="6" r="2.2"/><circle cx="6.5" cy="18" r="2.2"/><circle cx="16.5" cy="8.5" r="2.2"/><path d="M6.5 8.2v7.6M16.5 10.7c0 3.2-2.7 4-5.5 4H6.5"/>',
    _default: '<circle cx="12" cy="12" r="8"/>'
  };

  function iconHTML(a) {
    var inner = a.img
      ? '<img src="' + a.img + '" alt="">'
      : '<svg viewBox="0 0 24 24" aria-hidden="true">' + (GLYPHS[a.id] || GLYPHS._default) + '</svg>';
    return '<button class="ms-app" data-app="' + a.id + '" type="button">' +
             '<span class="ms-app-ico' + (a.img ? ' ms-app-img' : '') + '" style="background:' + a.grad + '">' + inner +
               (a.badge ? '<i class="ms-badge">' + a.badge + '</i>' : '') + '</span>' +
             '<span class="ms-app-lbl">' + a.label + '</span></button>';
  }

  function openChat() {
    if (typeof window.showAIAssistant === 'function') window.showAIAssistant();
    else { var w = document.getElementById('aiAssistantWidget'); if (w) w.classList.remove('hidden'); }
  }

  function launch(id) {
    if (id === '__desktop') { location.href = location.pathname + '?desktop=1'; return; }
    if (id === '__chat') { openChat(); return; }
    if (id === '__github') { window.open('https://github.com/ryanjamesindangan', '_blank', 'noopener'); return; }
    openSheet(id);
  }

  // ---- Full-screen "app" sheets ----------------------------------------
  function openSheet(id) {
    if (sheetOpen) closeSheet(true);
    var sheet = document.createElement('div');
    sheet.className = 'ms-sheet';
    sheet.innerHTML =
      '<div class="ms-sheet-head">' +
        '<button class="ms-back" type="button" aria-label="Back">‹ Back</button>' +
        '<span class="ms-sheet-title">' + appTitle(id) + '</span>' +
      '</div>' +
      '<div class="ms-sheet-body">' + appContent(id) + '</div>';
    document.body.appendChild(sheet);
    sheet.querySelector('.ms-back').addEventListener('click', function () { history.back(); });
    requestAnimationFrame(function () { sheet.classList.add('open'); });
    runInit(id);
    sheetOpen = true;
    try { history.pushState({ msSheet: id }, ''); } catch (e) {}
  }
  function closeSheet(immediate) {
    var s = document.querySelector('.ms-sheet.open');
    if (!s) { sheetOpen = false; return; }
    s.classList.remove('open');
    sheetOpen = false;
    if (immediate) s.remove();
    else setTimeout(function () { s.remove(); }, 300);
  }
  window.addEventListener('popstate', function () { if (sheetOpen) closeSheet(); });

  // ---- Home-screen regions ---------------------------------------------
  function topHTML() {
    if (OS === 'android') {
      return '<button class="ms-gsearch" type="button">' +
               '<span class="ms-g">' + GOOGLE_G + '</span>' +
               '<span class="ms-gsearch-ph">Search</span>' +
               '<span class="ms-gtools">' + MIC_SVG + LENS_SVG + '</span>' +
             '</button>';
    }
    return '<div class="ms-widgets">' +
      '<button class="ms-widget ms-w-profile" data-app="about" type="button">' +
        '<img src="assets/clippy/clippy-on-yellow-paper.png" alt="">' +
        '<div class="ms-w-name">Ryan James Indangan</div>' +
        '<div class="ms-w-title">AI Software Engineer</div>' +
      '</button>' +
      '<button class="ms-widget ms-w-status" data-app="contact" type="button">' +
        '<div class="ms-w-h">AVAILABILITY</div>' +
        '<div class="ms-w-big">Open to work</div>' +
        '<div class="ms-w-sub">Caloocan City, PH · Remote</div>' +
      '</button>' +
    '</div>';
  }

  function bottomHTML() {
    var dock = '<div class="ms-dock">' + DOCK_APPS.map(iconHTML).join('') + '</div>';
    if (OS === 'android') {
      return dock +
        '<div class="ms-navbar">' +
          '<button class="ms-nav-back" type="button" aria-label="Back">' + NAV_BACK + '</button>' +
          '<button class="ms-nav-home" type="button" aria-label="Home">' + NAV_HOME + '</button>' +
          '<button class="ms-nav-recents" type="button" aria-label="Recents">' + NAV_RECENTS + '</button>' +
        '</div>';
    }
    return '<button class="ms-ios-search" type="button">' + MAG_SVG + '<span>Search</span></button>' +
           dock +
           '<div class="ms-home-indicator" aria-hidden="true"><span></span></div>';
  }

  // ---- Search overlay (filters & launches apps) -------------------------
  function initSearch(shell) {
    var ov = document.createElement('div'); ov.className = 'ms-search';
    ov.innerHTML =
      '<div class="ms-search-bar"><span class="ms-search-mag">' + MAG_SVG + '</span>' +
      '<input class="ms-search-input" type="text" placeholder="Search apps & sections" autocomplete="off" autocapitalize="off">' +
      '<button class="ms-search-cancel" type="button">Cancel</button></div>' +
      '<div class="ms-search-results"></div>';
    shell.appendChild(ov);
    var input = ov.querySelector('.ms-search-input');
    var results = ov.querySelector('.ms-search-results');
    var ALL = HOME_APPS.concat(DOCK_APPS);
    var open = false;
    function render(q) {
      q = (q || '').trim().toLowerCase();
      var list = ALL.filter(function (a) {
        var sub = (apps[a.id] && apps[a.id].title) || '';
        return !q || (a.label + ' ' + sub).toLowerCase().indexOf(q) >= 0;
      });
      results.innerHTML = list.map(function (a) {
        var sub = (apps[a.id] && apps[a.id].title) || '';
        var inner = a.img ? '<img src="' + a.img + '" alt="">' : '<svg viewBox="0 0 24 24">' + (GLYPHS[a.id] || GLYPHS._default) + '</svg>';
        return '<button class="ms-search-row" data-app="' + a.id + '" type="button">' +
          '<span class="ms-app-ico' + (a.img ? ' ms-app-img' : '') + '" style="background:' + a.grad + '">' + inner + '</span>' +
          '<span class="ms-search-row-t">' + a.label + (sub ? '<small>' + sub + '</small>' : '') + '</span></button>';
      }).join('') || '<div class="ms-search-empty">No matches</div>';
    }
    function openS() { ov.classList.add('open'); open = true; render(''); setTimeout(function () { try { input.focus(); } catch (e) {} }, 80); }
    function closeS() { ov.classList.remove('open'); open = false; input.value = ''; }
    Search = { open: openS, close: closeS, isOpen: function () { return open; } };
    input.addEventListener('input', function () { render(input.value); });
    ov.querySelector('.ms-search-cancel').addEventListener('click', closeS);
    results.addEventListener('click', function (e) {
      var b = e.target.closest('[data-app]');
      if (b) { closeS(); launch(b.getAttribute('data-app')); }
    });
  }

  // ---- Control center / notification shade (swipe down from the top) -----
  function ccAndroid() {
    var date = new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    function tile(id, ico, label, on, app) {
      var attr = app ? 'data-app="' + app + '"' : 'data-toggle="' + id + '"';
      return '<button class="ms-qs-tile' + (on ? ' on' : '') + '" ' + attr + ' type="button">' +
        '<span class="ms-qs-ico">' + ico + '</span><span class="ms-qs-lbl">' + label + '</span></button>';
    }
    return '<div class="ms-cc-grab"><span></span></div>' +
      '<div class="ms-cc-head"><span class="ms-cc-clock">--:--</span><span class="ms-cc-date">' + date + '</span></div>' +
      '<div class="ms-qs">' +
        tile('wifi', '📶', 'Wi-Fi', true) +
        tile('bt', '🔷', 'Bluetooth', true) +
        tile('flash', '🔦', 'Flashlight', false) +
        tile('dnd', '🌙', 'Do Not Disturb', false) +
        tile('desktop', '🖥️', 'Desktop', false, '__desktop') +
        tile('clippy', '📎', 'Clippy', false, '__chat') +
      '</div>' +
      '<div class="ms-bright"><span>🔅</span><input type="range" class="ms-bright-range" min="12" max="100" value="100" aria-label="Brightness"><span>🔆</span></div>' +
      '<div class="ms-notif">' +
        '<button class="ms-notif-card" data-app="__chat" type="button"><span class="ms-notif-ico">📎</span><div><div class="ms-notif-t">Clippy</div><div class="ms-notif-b">Need a hand? Tap to chat with my AI assistant.</div></div></button>' +
        '<button class="ms-notif-card" data-app="resume" type="button"><span class="ms-notif-ico">📄</span><div><div class="ms-notif-t">Résumé 2026</div><div class="ms-notif-b">My latest résumé is ready — tap to view.</div></div></button>' +
      '</div>';
  }
  function ccIOS() {
    function round(id, ico, on) { return '<button class="ms-cc-round' + (on ? ' on' : '') + '" data-toggle="' + id + '" type="button">' + ico + '</button>'; }
    function sq(app, ico, label) { return '<button class="ms-cc-sq" data-app="' + app + '" type="button"><span class="ms-cc-sq-ico">' + ico + '</span><span>' + label + '</span></button>'; }
    function vs(id, ico, val) { return '<div class="ms-vslider" data-vs="' + id + '"><div class="ms-vs-fill" style="height:' + val + '%"></div><span class="ms-vs-ico">' + ico + '</span></div>'; }
    return '<div class="ms-cc-grab"><span></span></div>' +
      '<div class="ms-cc-head"><span class="ms-cc-clock">--:--</span></div>' +
      '<div class="ms-ccgrid">' +
        '<div class="ms-cc-conn">' + round('airplane', '✈️', false) + round('cell', '📶', true) + round('wifi', '📡', true) + round('bt', '🔷', true) + '</div>' +
        '<div class="ms-cc-stack">' + sq('__desktop', '🖥️', 'Desktop') + sq('__chat', '📎', 'Clippy') + '</div>' +
        '<div class="ms-cc-sliders">' + vs('bright', '🔆', 100) + vs('vol', '🔊', 65) + '</div>' +
      '</div>';
  }

  function initControlCenter(shell) {
    var dim = document.createElement('div'); dim.className = 'ms-dim';
    var backdrop = document.createElement('div'); backdrop.className = 'ms-cc-backdrop';
    var cc = document.createElement('div'); cc.className = 'ms-cc ms-cc-' + OS;
    cc.innerHTML = (OS === 'android') ? ccAndroid() : ccIOS();
    shell.appendChild(dim); shell.appendChild(backdrop); shell.appendChild(cc);

    var ccOpen = false;
    function openCC() { cc.classList.add('open'); backdrop.classList.add('show'); ccOpen = true; }
    function closeCC() { cc.classList.remove('open'); backdrop.classList.remove('show'); ccOpen = false; }
    ControlCenter = { isOpen: function () { return ccOpen; }, open: openCC, close: closeCC };
    backdrop.addEventListener('click', closeCC);

    function setBright(v) { dim.style.opacity = String(Math.max(0, (100 - v) / 100 * 0.72)); }

    cc.addEventListener('click', function (e) {
      var app = e.target.closest('[data-app]');
      if (app) { closeCC(); launch(app.getAttribute('data-app')); return; }
      var tog = e.target.closest('[data-toggle]');
      if (tog) tog.classList.toggle('on');
    });
    var br = cc.querySelector('.ms-bright-range');
    if (br) br.addEventListener('input', function () { setBright(+br.value); });
    cc.querySelectorAll('.ms-vslider').forEach(function (vsl) {
      var fill = vsl.querySelector('.ms-vs-fill'); var active = false;
      function set(clientY) {
        var r = vsl.getBoundingClientRect();
        var pct = Math.max(0, Math.min(1, (r.bottom - clientY) / r.height));
        fill.style.height = Math.round(pct * 100) + '%';
        if (vsl.getAttribute('data-vs') === 'bright') setBright(pct * 100);
      }
      vsl.addEventListener('pointerdown', function (e) { active = true; try { vsl.setPointerCapture(e.pointerId); } catch (x) {} set(e.clientY); });
      vsl.addEventListener('pointermove', function (e) { if (active) set(e.clientY); });
      window.addEventListener('pointerup', function () { active = false; });
    });

    // Open gesture: pull down from the top edge.
    var startY = 0, pulling = false, ph = 1, prog = 0;
    shell.addEventListener('touchstart', function (e) {
      if (ccOpen || sheetOpen) return;
      var t = e.touches[0];
      if (t.clientY <= 70) { pulling = true; startY = t.clientY; ph = cc.offsetHeight || window.innerHeight; cc.style.transition = 'none'; }
    }, { passive: true });
    shell.addEventListener('touchmove', function (e) {
      if (!pulling) return;
      prog = Math.max(0, Math.min(1, (e.touches[0].clientY - startY) / ph));
      cc.style.transform = 'translateY(' + (-100 + prog * 100) + '%)';
      backdrop.style.visibility = 'visible'; backdrop.style.opacity = String(prog * 0.5);
    }, { passive: true });
    shell.addEventListener('touchend', function () {
      if (!pulling) return; pulling = false;
      cc.style.transition = ''; cc.style.transform = ''; backdrop.style.opacity = ''; backdrop.style.visibility = '';
      if (prog > 0.35) openCC(); else closeCC();
      prog = 0;
    }, { passive: true });

    // Close gesture: drag the grab handle up.
    var gY = 0, gDrag = false, gProg = 0;
    cc.addEventListener('touchstart', function (e) {
      if (!ccOpen || !e.target.closest('.ms-cc-grab')) return;
      gDrag = true; gY = e.touches[0].clientY; cc.style.transition = 'none';
    }, { passive: true });
    cc.addEventListener('touchmove', function (e) {
      if (!gDrag) return;
      var dy = Math.min(0, e.touches[0].clientY - gY);
      gProg = Math.max(-1, dy / (cc.offsetHeight || 1));
      cc.style.transform = 'translateY(' + (gProg * 100) + '%)';
    }, { passive: true });
    cc.addEventListener('touchend', function () {
      if (!gDrag) return; gDrag = false; cc.style.transition = ''; cc.style.transform = '';
      if (gProg < -0.3) closeCC(); else openCC();
      gProg = 0;
    }, { passive: true });
  }

  // ---- Build ------------------------------------------------------------
  function build() {
    if (built) return;
    built = true;

    var shell = document.createElement('div');
    shell.id = 'mobileShell';
    shell.className = 'ms-home-screen';
    shell.innerHTML =
      '<div class="ms-statusbar"><span class="ms-sb-time">--:--</span><span class="ms-sb-icons">' + SB_ICONS + '</span></div>' +
      '<div class="ms-home">' +
        topHTML() +
        '<div class="ms-springboard">' + HOME_APPS.map(iconHTML).join('') + '</div>' +
        (OS === 'ios' ? '<div class="ms-page-dots"><i class="on"></i><i></i></div>' : '') +
      '</div>' +
      bottomHTML();
    document.body.appendChild(shell);

    // Delegated taps: app icons / dock / search → launch; Android nav → back/home.
    shell.addEventListener('click', function (e) {
      if (e.target.closest('.ms-gsearch, .ms-ios-search')) { if (Search) Search.open(); return; }
      var nav = e.target.closest('.ms-nav-back, .ms-nav-home');
      if (nav) {
        if (Search && Search.isOpen()) { Search.close(); return; }
        if (ControlCenter && ControlCenter.isOpen()) { ControlCenter.close(); return; }
        if (sheetOpen) history.back();
        return;
      }
      var app = e.target.closest('.ms-home [data-app], .ms-dock [data-app]');
      if (app) launch(app.getAttribute('data-app'));
    });

    // Keep the chat widget closed until summoned.
    var widget = document.getElementById('aiAssistantWidget');
    if (widget) widget.classList.add('hidden');

    // Swipe-down quick settings / control center + tap-to-search.
    initControlCenter(shell);
    initSearch(shell);

    // Live status-bar + control-center clock.
    (function tickClock() {
      var d = new Date();
      var h = d.getHours() % 12 || 12;
      var m = ('0' + d.getMinutes()).slice(-2);
      shell.querySelectorAll('.ms-sb-time, .ms-cc-clock').forEach(function (e2) { e2.textContent = h + ':' + m; });
      setTimeout(tickClock, 20000);
    })();

    // Optional preview hooks: ?msapp=experience opens an app; ?cc=1 opens control center.
    var params = new URLSearchParams(location.search);
    var dl = params.get('msapp');
    if (dl && apps[dl]) openSheet(dl);
    if (params.get('cc') === '1' && ControlCenter) ControlCenter.open();
    if (params.get('search') === '1' && Search) Search.open();
  }

  function start() { try { build(); } catch (e) { console.error('[mobile-shell] build failed', e); } }
  document.addEventListener('bootComplete', start, { once: true });
  if (document.readyState === 'complete') setTimeout(start, 0);
  window.addEventListener('load', function () { setTimeout(start, 200); });
})();
