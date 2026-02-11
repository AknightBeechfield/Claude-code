/* ==========================================================================
   Navigation — Mega menu, mobile nav, search overlay
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initMegaMenu();
  initSearchOverlay();
});

/* ── Mobile Navigation ── */
function initMobileNav() {
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.main-nav');

  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('mobile-toggle--open');
    nav.classList.toggle('main-nav--open');
    document.body.style.overflow = nav.classList.contains('main-nav--open') ? 'hidden' : '';
  });
}

/* ── Mega Menu (desktop hover + mobile click) ── */
function initMegaMenu() {
  const items = document.querySelectorAll('.main-nav__item[data-mega]');

  items.forEach(item => {
    const link = item.querySelector('.main-nav__link');

    // Mobile: toggle on click
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 1024) {
        e.preventDefault();
        const wasOpen = item.classList.contains('mega-open');

        // Close all others
        items.forEach(i => i.classList.remove('mega-open'));

        if (!wasOpen) {
          item.classList.add('mega-open');
        }
      }
    });
  });

  // Close mega menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.main-nav__item[data-mega]')) {
      items.forEach(i => i.classList.remove('mega-open'));
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      items.forEach(i => i.classList.remove('mega-open'));
      const searchOverlay = document.querySelector('.search-overlay');
      if (searchOverlay) {
        searchOverlay.classList.remove('search-overlay--open');
      }
    }
  });
}

/* ── Search Overlay ── */
function initSearchOverlay() {
  const toggle = document.querySelector('.search-toggle');
  const overlay = document.querySelector('.search-overlay');
  const closeBtn = document.querySelector('.search-overlay__close');
  const input = document.querySelector('.search-overlay__input');

  if (!toggle || !overlay) return;

  toggle.addEventListener('click', () => {
    overlay.classList.add('search-overlay--open');
    if (input) input.focus();
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      overlay.classList.remove('search-overlay--open');
    });
  }
}
