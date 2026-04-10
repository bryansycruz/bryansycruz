/* -------------------------------------------------------
   1. Dark mode toggle (persiste en localStorage)
   ------------------------------------------------------- */
(function () {
  var saved = localStorage.getItem('darkMode');
  if (saved === 'on' ||
    (saved === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark-mode-pending');
  }
})();

document.addEventListener('DOMContentLoaded', function () {
  /* Apply pending dark mode before paint to avoid flash */
  if (document.documentElement.classList.contains('dark-mode-pending')) {
    document.body.classList.add('dark-mode');
    document.documentElement.classList.remove('dark-mode-pending');
  }

  /* Build the toggle button */
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
   2. Convert "Archivo" and "Tags" navbar dropdowns
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
   3. Floating "← Inicio" button on inner pages.
   ------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  var brand = document.querySelector('.navbar-brand, .navbar-brand-link');
  if (!brand) return;
  var homeUrl = brand.getAttribute('href');
  if (!homeUrl) return;

  var currentPath = window.location.pathname.replace(/\/$/, '');
  var homePath = homeUrl.replace(/\/$/, '');
  if (currentPath === homePath || currentPath.endsWith('/intro')) return;

  var btn = document.createElement('a');
  btn.href = homeUrl;
  btn.className = 'home-back-btn';
  btn.innerHTML = '&#8592; Inicio';
  btn.setAttribute('aria-label', 'Volver al inicio');
  document.body.appendChild(btn);
});
