(function () {
  var STORAGE_KEY = 'site-prefs';
  var root = document.documentElement;

  var prefs = loadPrefs();

  function loadPrefs() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function savePrefs() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  }

  function systemIsDark() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function resolvedTheme() {
    if (prefs.theme === 'system' || !prefs.theme) {
      return systemIsDark() ? 'dark' : 'light';
    }
    return prefs.theme;
  }

  function applyPrefs() {
    root.setAttribute('data-theme', resolvedTheme());
    root.setAttribute('data-font-size', prefs.fontSize || 'base');
    updateThemeButton();
    updateFontButtons();
  }

  function updateThemeButton() {
    var btn = document.querySelector('[data-action="toggle-theme"]');
    if (!btn) return;
    var theme = resolvedTheme();
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    btn.setAttribute('title', theme === 'dark' ? 'Light mode' : 'Dark mode');
    btn.innerHTML = theme === 'dark'
      ? '<svg class="site-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>'
      : '<svg class="site-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }

  function updateFontButtons() {
    var size = prefs.fontSize || 'base';
    document.querySelectorAll('[data-action="font-size"]').forEach(function (btn) {
      var active = btn.getAttribute('data-size') === size;
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      btn.classList.toggle('site-prefs__btn--active', active);
    });
  }

  function cycleTheme() {
    var current = resolvedTheme();
    prefs.theme = current === 'dark' ? 'light' : 'dark';
    savePrefs();
    applyPrefs();
  }

  function setFontSize(size) {
    prefs.fontSize = size;
    savePrefs();
    applyPrefs();
  }

  function initMobileNav() {
    var toggle = document.querySelector('[data-action="toggle-mobile-nav"]');
    var panel = document.getElementById('mobile-nav');
    if (!toggle || !panel) return;

    function closeNav() {
      panel.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('mobile-nav-open');
    }

    function openNav() {
      panel.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('mobile-nav-open');
    }

    toggle.addEventListener('click', function () {
      if (panel.hidden) openNav();
      else closeNav();
    });

    panel.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
  }

  document.querySelector('[data-action="toggle-theme"]')?.addEventListener('click', cycleTheme);

  document.querySelectorAll('[data-action="font-size"]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setFontSize(btn.getAttribute('data-size'));
    });
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
    if (prefs.theme === 'system' || !prefs.theme) applyPrefs();
  });

  applyPrefs();
  initMobileNav();
})();
