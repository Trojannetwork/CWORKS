/* === Pricing Tier Pre-Select ===
   When a "Get Started" button is clicked, pre-selects the matching tier
   in the contact form dropdown and scrolls to #contact. */

(function () {
  const buttons = document.querySelectorAll('.pricing-btn[data-tier]');
  const select = document.getElementById('es-tier');
  if (!buttons.length || !select) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tier = btn.getAttribute('data-tier');
      if (tier) {
        select.value = tier;
      }
    });
  });
})();
