/* === Mobile Navigation Toggle + Anchor Smooth Scroll === */

(function () {
  const toggle = document.querySelector('.mobile-nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navAnchors = navLinks.querySelectorAll('a');

  if (!toggle || !navLinks) return;

  function closeNav() {
    navLinks.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    const spans = toggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);

    const spans = toggle.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      document.body.style.overflow = 'hidden';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
      document.body.style.overflow = '';
    }
  });

  navAnchors.forEach(link => {
    link.addEventListener('click', function (e) {
      closeNav();

      // Smooth-scroll for same-page anchor links
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          target.scrollIntoView({
            behavior: prefersReduced ? 'auto' : 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
})();
