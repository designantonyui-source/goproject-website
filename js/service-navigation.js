// Complete the existing offer-page menu interactions without changing its layout.
document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('main-header');
  const button = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  const toggle = document.getElementById('mobile-oferta-toggle');
  const submenu = document.getElementById('mobile-oferta-submenu');
  if (!header || !button || !menu) return;

  const isOpen = () => !menu.classList.contains('hidden');
  const alignMenu = () => { menu.style.top = `${header.getBoundingClientRect().height}px`; };
  button.setAttribute('aria-controls', menu.id);
  const syncMenuLabel = () => button.setAttribute('aria-label', isOpen() ? 'Zamknij menu' : 'Otwórz menu');
  syncMenuLabel();
  button.addEventListener('click', syncMenuLabel);

  if (toggle && submenu) {
    toggle.setAttribute('aria-controls', submenu.id);
    const syncSubmenu = () => toggle.setAttribute('aria-expanded', String(!submenu.classList.contains('hidden')));
    syncSubmenu();
    toggle.addEventListener('click', syncSubmenu);
  }

  document.addEventListener('keydown', event => {
    if (!isOpen()) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      button.click();
      button.focus();
    } else if (event.key === 'Tab') {
      const controls = [button, ...menu.querySelectorAll('a[href], button')]
        .filter(element => element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden');
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && (document.activeElement === first || !controls.includes(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !controls.includes(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  const desktop = window.matchMedia('(min-width: 1024px)');
  desktop.addEventListener('change', event => {
    if (event.matches && isOpen()) button.click();
  });
  new ResizeObserver(alignMenu).observe(header);
  alignMenu();

  // Match clean routes and direct .html previews consistently.
  const normalize = path => path.replace(/\.html$/, '').replace(/\/$/, '') || '/';
  menu.querySelectorAll('a[href]').forEach(link => {
    if (normalize(new URL(link.href).pathname) === normalize(location.pathname)) {
      link.setAttribute('aria-current', 'page');
      link.classList.remove('text-zinc-200');
      link.classList.add('text-accent', 'font-bold');
    }
  });
});
