/* -------------------------------------------------------
   UTILS
   ------------------------------------------------------- */

/** Resolve a relative URL to absolute using the DOM */
function resolveAbsUrl(rel) {
  var a = document.createElement('a');
  a.href = rel;
  return a.href;
}

/** Return the site root path (ends with '/') */
function getSiteRoot() {
  var brand = document.querySelector('.navbar-brand, .navbar-brand-link');
  if (!brand) return '/';
  var abs = resolveAbsUrl(brand.getAttribute('href'));
  // brand points to intro.html — strip filename to get root
  return abs.replace(/[^/]+\.html(\?.*)?$/, '').replace(/\/?$/, '/');
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

  var isDark = document.body.classList.contains('dark-mode');
  var btn = document.createElement('div');
  btn.id = 'dark-mode-toggle';
  btn.title = 'Cambiar tema claro / oscuro';
  btn.textContent = isDark ? '☀️' : '🌙';
  btn.setAttribute('role', 'button');
  btn.setAttribute('aria-label', 'Cambiar tema');

  btn.addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');
    var nowDark = document.body.classList.contains('dark-mode');
    btn.textContent = nowDark ? '☀️' : '🌙';
    localStorage.setItem('darkMode', nowDark ? 'on' : 'off');
  });

  document.body.appendChild(btn);
});

/* -------------------------------------------------------
   2. Floating Categories / Tags widget (Stack-style)
   ------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  var root = getSiteRoot();

  var widget = document.createElement('div');
  widget.id = 'stack-widget';
  widget.innerHTML =
    '<div class="ssw-section">' +
      '<div class="ssw-header">' +
        '<span class="ssw-icon">#</span>' +
        '<span class="ssw-label">Categorías</span>' +
      '</div>' +
      '<div class="ssw-pills">' +
        '<a href="' + root + 'archive.html" class="ssw-pill">Archivo</a>' +
        '<a href="' + root + 'ml/01_que_es_ml.html" class="ssw-pill teorico">Teórico</a>' +
        '<a href="' + root + 'constructora/00_intro_constructora.html" class="ssw-pill constructora">Constructora</a>' +
        '<a href="' + root + 'academia/00_intro_academia.html" class="ssw-pill academia">Academia</a>' +
      '</div>' +
    '</div>' +
    '<div class="ssw-section">' +
      '<div class="ssw-header">' +
        '<span class="ssw-icon">🏷️</span>' +
        '<span class="ssw-label">Tags</span>' +
      '</div>' +
      '<div class="ssw-pills">' +
        '<a href="' + root + 'tags.html" class="ssw-pill">#ml</a>' +
        '<a href="' + root + 'tags.html" class="ssw-pill">#llm</a>' +
        '<a href="' + root + 'tags.html" class="ssw-pill">#rag</a>' +
        '<a href="' + root + 'tags.html" class="ssw-pill">#deep-learning</a>' +
        '<a href="' + root + 'tags.html" class="ssw-pill">#construccion</a>' +
        '<a href="' + root + 'tags.html" class="ssw-pill">#apu</a>' +
        '<a href="' + root + 'tags.html" class="ssw-pill">#python</a>' +
        '<a href="' + root + 'tags.html" class="ssw-pill">#prompts</a>' +
        '<a href="' + root + 'tags.html" class="ssw-pill">#papers</a>' +
      '</div>' +
    '</div>';

  document.body.appendChild(widget);
});

/* -------------------------------------------------------
   3. Scroll-to-top button (appears after 280px scroll)
   ------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  var topBtn = document.createElement('div');
  topBtn.id = 'scroll-top-btn';
  topBtn.innerHTML = '↑';
  topBtn.title = 'Volver al inicio de esta página';
  topBtn.setAttribute('role', 'button');
  topBtn.setAttribute('aria-label', 'Ir al inicio de la página');

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
   4. Convert "Archivo" and "Tags" navbar dropdowns
      into direct pill-button links.
   ------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  var navItems = document.querySelectorAll('.navbar-nav .nav-item.dropdown');
  navItems.forEach(function (item) {
    var toggler = item.querySelector('.nav-link.dropdown-toggle');
    if (!toggler) return;
    var text = toggler.textContent.trim();
    if (text !== 'Archivo' && text !== 'Tags') return;

    var innerLink = item.querySelector('.dropdown-menu a.nav-link');
    if (!innerLink) return;
    var href = innerLink.getAttribute('href');

    var pill = document.createElement('a');
    pill.href = href;
    pill.className = 'nav-link nav-btn-pill';
    pill.textContent = text;
    item.parentNode.replaceChild(pill, item);
  });
});

/* -------------------------------------------------------
   5. Floating "← Inicio" button on inner pages.
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
  btn.innerHTML = '&#8592; Inicio';
  btn.setAttribute('aria-label', 'Volver al inicio');
  document.body.appendChild(btn);
});
