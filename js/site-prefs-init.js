(function () {
  try {
    var p = JSON.parse(localStorage.getItem('site-prefs') || '{}');
    var r = document.documentElement;
    if (p.theme === 'dark') {
      r.setAttribute('data-theme', 'dark');
    } else if (p.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      r.setAttribute('data-theme', 'dark');
    }
    if (p.fontSize) r.setAttribute('data-font-size', p.fontSize);
  } catch (e) { /* ignore */ }
})();
