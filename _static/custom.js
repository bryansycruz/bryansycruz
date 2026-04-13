/* -------------------------------------------------------
   UTILS
   ------------------------------------------------------- */

/** Resolve a relative URL to absolute using the DOM */
function resolveAbsUrl(rel) {
  var a = document.createElement('a');
  a.href = rel;
  return a.href;
}

/* -------------------------------------------------------
   1. Dark mode toggle (persists in localStorage)
   ------------------------------------------------------- */
(function () {
  var saved = localStorage.getItem('darkMode');
  if (saved === 'on' ||
    (saved === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark-mode-pending');
  }
})();

document.addEventListener('DOMContentLoaded', function () {
  if (document.documentElement.classList.contains('dark-mode-pending')) {
    document.body.classList.add('dark-mode');
    document.documentElement.classList.remove('dark-mode-pending');
  }

  var SVG_MOON = '<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  var SVG_SUN  = '<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';

  var isDark = document.body.classList.contains('dark-mode');
  var btn = document.createElement('div');
  btn.id = 'dark-mode-toggle';
  btn.title = 'Cambiar tema claro / oscuro';
  btn.innerHTML = isDark ? SVG_SUN : SVG_MOON;
  btn.setAttribute('role', 'button');
  btn.setAttribute('aria-label', 'Cambiar tema');

  btn.addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');
    var nowDark = document.body.classList.contains('dark-mode');
    btn.innerHTML = nowDark ? SVG_SUN : SVG_MOON;
    localStorage.setItem('darkMode', nowDark ? 'on' : 'off');
  });

  document.body.appendChild(btn);
});

/* -------------------------------------------------------
   2. Scroll-to-top button (appears after 280px scroll)
   ------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  var topBtn = document.createElement('div');
  topBtn.id = 'scroll-top-btn';
  topBtn.innerHTML = '&#8679;';
  topBtn.title = 'Volver al inicio de esta pagina';
  topBtn.setAttribute('role', 'button');
  topBtn.setAttribute('aria-label', 'Ir al inicio de la pagina');

  topBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.body.appendChild(topBtn);

  window.addEventListener('scroll', function () {
    if (window.scrollY > 280) {
      topBtn.classList.add('visible');
    } else {
      topBtn.classList.remove('visible');
    }
  }, { passive: true });
});

/* -------------------------------------------------------
   3. Floating back-to-home button on inner pages.
   ------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  var brand = document.querySelector('.navbar-brand, .navbar-brand-link');
  if (!brand) return;
  var homeUrl = brand.getAttribute('href');
  if (!homeUrl) return;

  var currentPath = window.location.pathname.replace(/\/$/, '');
  var homePath = resolveAbsUrl(homeUrl).replace(/\/$/, '');
  var currentAbs = resolveAbsUrl(currentPath).replace(/\/$/, '');
  if (currentAbs === homePath || currentPath.endsWith('/intro') ||
      window.location.pathname.endsWith('intro.html')) return;

  var btn = document.createElement('a');
  btn.href = homeUrl;
  btn.className = 'home-back-btn';
  btn.textContent = '\u2190 Inicio';
  btn.setAttribute('aria-label', 'Volver al inicio');
  document.body.appendChild(btn);
});

/* -------------------------------------------------------
   4. Convert TOC navbar dropdowns to direct pill-button links.
      Also injects an "Inicio" pill using the brand link.
      Uses Sphinx-generated hrefs (server-rendered) — no
      dynamic root detection needed.
   ------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  var navbarNav = document.querySelector('.navbar-nav, .bd-navbar-elements');
  if (!navbarNav) return;

  /* --- Inicio pill (reads brand link rendered by Sphinx) --- */
  var brand = document.querySelector('.navbar-brand, .navbar-brand-link');
  if (brand && brand.getAttribute('href')) {
    var homeHref = brand.getAttribute('href');
    var inicioPill = document.createElement('a');
    inicioPill.href = homeHref;
    inicioPill.className = 'nav-link nav-btn-pill';
    inicioPill.textContent = 'Inicio';
    navbarNav.insertBefore(inicioPill, navbarNav.firstChild);
  }

  /* --- Archivo and Tags: convert TOC dropdowns to pills --- */
  var dropdowns = document.querySelectorAll('.navbar-nav .nav-item.dropdown');
  dropdowns.forEach(function (item) {
    var toggler = item.querySelector('.nav-link.dropdown-toggle');
    if (!toggler) return;
    var text = toggler.textContent.trim();
    if (text !== 'Archivo' && text !== 'Tags') return;

    /* Use the first real link inside the dropdown (Sphinx-generated URL) */
    var innerLink = item.querySelector('.dropdown-menu a');
    if (!innerLink) return;
    var href = innerLink.getAttribute('href');
    if (!href) return;

    var pill = document.createElement('a');
    pill.href = href;
    pill.className = 'nav-link nav-btn-pill';
    pill.textContent = text;
    item.parentNode.replaceChild(pill, item);
  });
});
