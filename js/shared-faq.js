// Shared single-open accordion; native buttons support Enter and Space.
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.shared-faq').forEach(section => {
    const buttons = [...section.querySelectorAll('.faq-toggle')];
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const shouldOpen = button.getAttribute('aria-expanded') !== 'true';
        buttons.forEach(other => {
          other.setAttribute('aria-expanded', 'false');
          document.getElementById(other.getAttribute('aria-controls')).classList.add('hidden');
        });
        if (shouldOpen) {
          button.setAttribute('aria-expanded', 'true');
          document.getElementById(button.getAttribute('aria-controls')).classList.remove('hidden');
        }
      });
    });
  });
});
