/* -------------------------------------------------------
   UTILS
   ------------------------------------------------------- */

/** Resolve a relative URL to absolute using the DOM */
function resolveAbsUrl(rel) {
  var a = document.createElement('a');
  a.href = rel;
  return a.href;
}

/**
 * Find the absolute href of a nav/sidebar link whose href
 * contains `pattern`. Returns null if not found.
 * Uses only Sphinx-rendered links (no root calculation).
 */
function findNavHref(pattern) {
  var selectors = [
    '.bd-sidebar-primary a',
    '.bd-sidenav a',
    '#bd-docs-nav a',
    '.navbar-nav a',
    'nav a'
  ];
  for (var s = 0; s < selectors.length; s++) {
    var links = document.querySelectorAll(selectors[s]);
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute('href');
      if (href && href.indexOf(pattern) !== -1) {
        return links[i].href; /* browser-resolved absolute URL */
      }
    }
  }
  return null;
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
   4. Floating Navigation Widget (quick-jump panel)
      Primary: reads links already rendered by Sphinx in
      sidebar/navbar (no 404 risk).
      Fallback: computes URLs from the brand link's root
      (same approach that worked in earlier versions).
      Visible on screens >= 1390px, on the right of content.
   ------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {

  var ico = {
    home:    '<svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    archive: '<svg viewBox="0 0 24 24"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5" rx="1"/><line x1="10" y1="12" x2="14" y2="12"/></svg>',
    tag:     '<svg viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>',
    book:    '<svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
    build:   '<svg viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><line x1="9" y1="7" x2="9.01" y2="7"/><line x1="15" y1="7" x2="15.01" y2="7"/><line x1="9" y1="11" x2="9.01" y2="11"/><line x1="15" y1="11" x2="15.01" y2="11"/><line x1="9" y1="15" x2="9.01" y2="15"/><line x1="15" y1="15" x2="15.01" y2="15"/></svg>',
    grad:    '<svg viewBox="0 0 24 24"><path d="M22 10v6"/><path d="M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>'
  };

  function makeItem(href, cls, icon, label) {
    if (!href) return null;
    var a = document.createElement('a');
    a.href = href;
    a.className = 'ssw-item' + (cls ? ' ' + cls : '');
    a.innerHTML = icon + '<span>' + label + '</span>';
    return a;
  }

  /* --- Step 1: try sidebar / navbar links (Sphinx-generated, always correct) --- */
  var brand    = document.querySelector('.navbar-brand, .navbar-brand-link');
  var homeHref = brand ? brand.href : findNavHref('intro.html');
  var archHref = findNavHref('archive.html');
  var tagsHref = findNavHref('tags.html');
  var teorHref = findNavHref('01_que_es_ml.html');
  var consHref = findNavHref('00_intro_constructora.html');
  var acadHref = findNavHref('00_intro_academia.html');

  /* --- Step 2: fallback — derive root from brand href and build absolute URLs --- */
  if (homeHref && (!archHref || !tagsHref || !teorHref || !consHref || !acadHref)) {
    /* Strip the filename to get the site root
       e.g.  https://byama.github.io/Bryansycruz/intro.html
             → https://byama.github.io/Bryansycruz/            */
    var root = homeHref.replace(/[^/]+\.html[^/]*$/, '');
    if (root) {
      archHref = archHref || root + 'archive.html';
      tagsHref = tagsHref || root + 'tags.html';
      teorHref = teorHref || root + 'ml/01_que_es_ml.html';
      consHref = consHref || root + 'constructora/00_intro_constructora.html';
      acadHref = acadHref || root + 'academia/00_intro_academia.html';
    }
  }

  if (!homeHref) return; /* nothing to build */

  /* --- Build the widget --- */
  var widget = document.createElement('nav');
  widget.id = 'stack-widget';
  widget.setAttribute('aria-label', 'Navegacion rapida');

  var items = [
    makeItem(homeHref, '',               ico.home,    'Inicio'),
    makeItem(archHref, '',               ico.archive, 'Archivo'),
    makeItem(tagsHref, '',               ico.tag,     'Tags')
  ];

  var sep = document.createElement('hr');
  sep.className = 'ssw-sep';
  items.push(sep);
  items.push(makeItem(teorHref, 'ssw-teorico',      ico.book,  'Teorico'));
  items.push(makeItem(consHref, 'ssw-constructora', ico.build, 'Constructora'));
  items.push(makeItem(acadHref, 'ssw-academia',     ico.grad,  'Academia'));

  items.forEach(function (el) {
    if (el) widget.appendChild(el);
  });

  document.body.appendChild(widget);
});

/* -------------------------------------------------------
   5. Convert TOC navbar dropdowns to direct pill-button links.
      Also injects an "Inicio" pill using the brand link.
   ------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  var navbarNav = document.querySelector('.navbar-nav, .bd-navbar-elements');
  if (!navbarNav) return;

  /* Inicio pill — reads brand href rendered by Sphinx */
  var brand = document.querySelector('.navbar-brand, .navbar-brand-link');
  if (brand && brand.getAttribute('href')) {
    var inicioPill = document.createElement('a');
    inicioPill.href = brand.getAttribute('href');
    inicioPill.className = 'nav-link nav-btn-pill';
    inicioPill.textContent = 'Inicio';
    navbarNav.insertBefore(inicioPill, navbarNav.firstChild);
  }

  /* Archivo / Tags — convert TOC dropdown items to pills */
  var dropdowns = document.querySelectorAll('.navbar-nav .nav-item.dropdown');
  dropdowns.forEach(function (item) {
    var toggler = item.querySelector('.nav-link.dropdown-toggle');
    if (!toggler) return;
    var text = toggler.textContent.trim();
    if (text !== 'Archivo' && text !== 'Tags') return;

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
