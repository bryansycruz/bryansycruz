/* -------------------------------------------------------
   1. Convert "Archivo" and "Tags" navbar dropdowns into
      direct pill-button links (they each have only one page).
   ------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  var navItems = document.querySelectorAll('.navbar-nav .nav-item.dropdown');
  navItems.forEach(function (item) {
    var toggler = item.querySelector('.nav-link.dropdown-toggle');
    if (!toggler) return;
    var text = toggler.textContent.trim();
    if (text !== 'Archivo' && text !== 'Tags') return;

    /* Grab the first (and only) link inside the dropdown */
    var innerLink = item.querySelector('.dropdown-menu a.nav-link');
    if (!innerLink) return;
    var href = innerLink.getAttribute('href');

    /* Build a plain <a> styled as a pill button */
    var pill = document.createElement('a');
    pill.href = href;
    pill.className = 'nav-link nav-btn-pill';
    pill.textContent = text;
    item.parentNode.replaceChild(pill, item);
  });
});

/* -------------------------------------------------------
   2. Floating "← Inicio" button on every page except home.
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
