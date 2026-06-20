/* =========================================================================
   Mobile Shell ("Pocket OS")
   A phone-native app shell that REPLACES the desktop OS on small screens.
   - Bottom tab bar: Home / About / Experience / Projects / Contact
   - Home springboard: hero + stats + grid of the remaining apps (open as sheets)
   - Reuses the exact apps[id].content + the existing chat widget (Clippy FAB)
   Only runs when DeviceMode.isMobile() is true; the desktop is untouched.
   ========================================================================= */
(function () {
  'use strict';
  if (!(window.DeviceMode && window.DeviceMode.isMobile())) return;

  var PRIMARY = [
    { id: 'home',       label: 'Home',       icon: '🏠' },
    { id: 'about',      label: 'About',      icon: '👨‍💻' },
    { id: 'experience', label: 'Experience', icon: '💼' },
    { id: 'projects',   label: 'Projects',   icon: '🚀' },
    { id: 'contact',    label: 'Contact',    icon: '✉️' }
  ];
  // Secondary apps surfaced on the Home springboard (open as full-screen sheets)
  var SECONDARY = ['skills', 'resume', 'certifications', 'ai-lab', 'github-stats',
                   'testimonials', 'blog', 'code-snippets', 'terminal', 'snake', 'analytics'];

  var apps = window.apps || {};
  var built = false;
  var activeTab = null;
  var mountedTabs = {};   // tabId -> screen element (cache)
  var sheetOpen = false;

  function appData(id) { return apps[id] || {}; }
  function appContent(id) { return appData(id).content || '<div style="padding:24px;color:#556">Content unavailable.</div>'; }
  function appTitle(id) { return appData(id).title || id; }
  function appIcon(id) { return appData(id).icon || '📦'; }

  // Mirror of openApp()'s per-app initializers, each guarded so a missing
  // function can never crash the shell (e.g. the blog initializers don't exist).
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
      case 'crypto-demo':  g('initializeDemoButtons'); break;
      case 'supplier-demo':g('initializeDemoButtons'); break;
      // 'easter-eggs' intentionally omitted: its initializer depends on the desktop window manager.
    }
  }

  // ---- Home springboard -------------------------------------------------
  function homeHTML() {
    var grid = SECONDARY.map(function (id) {
      return '<button class="ms-launch" data-app="' + id + '">' +
               '<span class="ms-ico">' + appIcon(id) + '</span>' +
               '<span>' + appTitle(id).replace(' & ', ' &amp; ') + '</span>' +
             '</button>';
    }).join('');
    return '' +
      '<div class="ms-hero">' +
        '<div class="ms-hero-top">' +
          '<img src="assets/clippy/clippy-on-yellow-paper.png" alt="Clippy">' +
          '<div><h1>Ryan James Indangan</h1>' +
          '<div class="ms-hero-title">AI Software Engineer · Full-Stack Developer · Certified CTO</div></div>' +
        '</div>' +
        '<p>Building AI/ML and full-stack products end to end — document intelligence, LLM systems, and scalable web apps.</p>' +
        '<div class="ms-hero-cta">' +
          '<a class="primary" href="assets/certificates/Ryan James Indangan Resume 2026.pdf" download>📄 Resume</a>' +
          '<a class="ghost" href="assets/certificates/Ryan James Indangan CV 2026.pdf" download>📑 CV</a>' +
        '</div>' +
      '</div>' +
      '<div class="ms-stats">' +
        '<div class="ms-stat"><div class="n">8+</div><div class="l">Years Exp</div></div>' +
        '<div class="ms-stat"><div class="n">50+</div><div class="l">Projects</div></div>' +
        '<div class="ms-stat"><div class="n">12</div><div class="l">Team Led</div></div>' +
      '</div>' +
      '<div class="ms-section-label">Explore</div>' +
      '<div class="ms-grid">' + grid + '</div>';
  }

  // ---- Tab screens ------------------------------------------------------
  function mountTab(id) {
    if (mountedTabs[id]) return mountedTabs[id];
    var screens = document.getElementById('msScreens');
    var el = document.createElement('div');
    el.className = 'ms-screen';
    el.setAttribute('data-screen', id);
    if (id === 'home') {
      el.innerHTML = homeHTML();
      el.addEventListener('click', function (e) {
        var btn = e.target.closest('.ms-launch');
        if (btn) openSheet(btn.getAttribute('data-app'));
      });
    } else {
      el.innerHTML = appContent(id);
    }
    screens.appendChild(el);
    mountedTabs[id] = el;
    if (id !== 'home') runInit(id);
    return el;
  }

  function switchTab(id) {
    if (activeTab === id) {
      var cur = mountedTabs[id];
      if (cur) cur.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    var el = mountTab(id);
    Object.keys(mountedTabs).forEach(function (k) { mountedTabs[k].classList.toggle('active', k === id); });
    var tabs = document.querySelectorAll('.ms-tabbar button');
    tabs.forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-tab') === id); });
    activeTab = id;
    el.scrollTop = 0;
  }

  // ---- Full-screen sheets (secondary apps) ------------------------------
  function openSheet(id) {
    if (sheetOpen) closeSheet(true);
    var sheet = document.createElement('div');
    sheet.className = 'ms-sheet';
    sheet.innerHTML =
      '<div class="ms-sheet-head">' +
        '<button class="ms-back" aria-label="Back">‹ Back</button>' +
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
    if (immediate) { s.remove(); }
    else { setTimeout(function () { s.remove(); }, 300); }
  }

  window.addEventListener('popstate', function () { if (sheetOpen) closeSheet(); });

  // ---- Build the shell --------------------------------------------------
  function build() {
    if (built) return;
    built = true;

    var shell = document.createElement('div');
    shell.id = 'mobileShell';
    shell.innerHTML =
      '<header class="ms-appbar">' +
        '<span class="ms-brand"><img src="assets/clippy/clippy-on-yellow-paper.png" alt="">RJ Portfolio</span>' +
        '<button class="ms-desktop-link" type="button">❖ Desktop view</button>' +
      '</header>' +
      '<main id="msScreens"></main>' +
      '<nav class="ms-tabbar" role="tablist">' +
        PRIMARY.map(function (t) {
          return '<button data-tab="' + t.id + '" role="tab"><span class="ms-ico">' + t.icon + '</span>' + t.label + '</button>';
        }).join('') +
      '</nav>';
    document.body.appendChild(shell);

    shell.querySelector('.ms-desktop-link').addEventListener('click', function () {
      location.href = location.pathname + '?desktop=1';
    });
    shell.querySelectorAll('.ms-tabbar button').forEach(function (b) {
      b.addEventListener('click', function () { switchTab(b.getAttribute('data-tab')); });
    });

    // Clippy chat: keep the widget closed initially, and add a dedicated FAB
    // (the desktop toggle's visibility is managed by initializeAIAssistant, so we
    // use our own button that opens the same chat via window.showAIAssistant()).
    var widget = document.getElementById('aiAssistantWidget');
    if (widget) widget.classList.add('hidden');
    var fab = document.createElement('button');
    fab.className = 'ms-clippy-fab';
    fab.type = 'button';
    fab.setAttribute('aria-label', 'Chat with Clippy');
    fab.innerHTML = '<img src="assets/clippy/clippy-on-yellow-paper.png" alt="">';
    fab.addEventListener('click', function () {
      if (typeof window.showAIAssistant === 'function') window.showAIAssistant();
      else if (widget) widget.classList.remove('hidden');
    });
    document.body.appendChild(fab);

    switchTab('home');

    // Optional deep-link for previews/sharing: ?mstab=experience or ?mstab=skills
    var dl = new URLSearchParams(location.search).get('mstab');
    if (dl) {
      if (PRIMARY.some(function (t) { return t.id === dl; })) switchTab(dl);
      else if (apps[dl]) openSheet(dl);
    }
  }

  function start() { try { build(); } catch (e) { console.error('[mobile-shell] build failed', e); } }

  document.addEventListener('bootComplete', start, { once: true });
  if (document.readyState === 'complete') setTimeout(start, 0);
  window.addEventListener('load', function () { setTimeout(start, 200); });
})();
