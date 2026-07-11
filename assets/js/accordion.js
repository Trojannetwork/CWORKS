/* === Accordion (FAQ expand/collapse) === */

(function () {
  const triggers = document.querySelectorAll('.accordion-trigger');
  if (!triggers.length) return;

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.parentElement;
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.accordion-item').forEach(el => {
        el.classList.remove('open');
        el.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
      });

      // Open clicked (unless it was already open)
      if (!isOpen) {
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();
