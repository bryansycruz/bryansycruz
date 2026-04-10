/* Inject "← Inicio" floating button on every page except the home page */
document.addEventListener('DOMContentLoaded', function () {
  /* Find the home URL from the navbar brand link (set by Jupyter Book) */
  var brand = document.querySelector('.navbar-brand, .navbar-brand-link');
  if (!brand) return;
  var homeUrl = brand.getAttribute('href');
  if (!homeUrl) return;

  /* Skip button on the home page itself */
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
