/* =========================================================
   main.js — 3 funcionalidades:
   1) Theme toggle (dark/light) con localStorage
   2) Scroll reveal animations (IntersectionObserver)
   3) Scroll progress bar + Back to top button
   ========================================================= */

// ---------- Helpers ----------
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// ---------- 1) Theme toggle ----------
(function themeToggleInit() {
  const root = document.documentElement;
  const btn = $('#themeToggle');

  // Si no existe el botón en una página, no hacemos nada.
  if (!btn) return;

  // Preferencia: localStorage > sistema
  const saved = localStorage.getItem('theme');
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  const initialTheme = saved || (prefersLight ? 'light' : 'dark');

  setTheme(initialTheme);

  btn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('theme', next);
  });

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    btn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
    btn.textContent = theme === 'light' ? '🌙' : '☀️';
    btn.title = theme === 'light' ? 'Canviar a mode fosc' : 'Canviar a mode clar';
  }
})();

// ---------- 2) Scroll reveal animations ----------
(function revealInit() {
  // Elementos que queremos animar (puedes añadir más selectores si quieres)
  const targets = [
    ...$$('.hero'),
    ...$$('.hero-card'),
    ...$$('.destacats'),
    ...$$('.project-card'),
    ...$$('.projects-hero'),
    ...$$('.projects-toolbar'),
    ...$$('.grid-projectes'),
  ];

  // Evitar duplicados y elementos no existentes
  const uniq = Array.from(new Set(targets)).filter(Boolean);
  if (uniq.length === 0) return;

  // Aplica clase inicial
  uniq.forEach(el => el.classList.add('reveal'));

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    uniq.forEach(el => el.classList.add('reveal--visible'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  uniq.forEach(el => io.observe(el));
})();

// ---------- 3) Scroll progress + Back to top ----------
(function scrollUIInit() {
  const bar = $('#scrollProgress');
  const btnTop = $('#backToTop');

  // Si no están en la página, no hacemos nada.
  if (!bar && !btnTop) return;

  function onScroll() {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

    if (bar) bar.style.width = progress.toFixed(2) + '%';

    if (btnTop) {
      if (scrollTop > 450) btnTop.classList.add('backtotop--show');
      else btnTop.classList.remove('backtotop--show');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (btnTop) {
    btnTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
