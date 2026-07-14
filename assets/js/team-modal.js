/**
 * CWORKS Team Modal Interaction
 * Implements Anime.js layout-dimension transitions (top, left, width, height)
 * for smooth card-to-modal transitions. Fully accessible.
 */

const teamMembers = [
  {
    name: "Brian Kasingye",
    role: "Founder & Lead Developer",
    photo: "assets/images/team-brian.png",
    bio: "Brian started CWORKS to build clean, fast, and custom web applications. He splits his time between client strategy and writing clean CSS and backend API integrations. He believes that web standards, performance, and attention to detail are what make websites stand out.",
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com"
    }
  },
  {
    name: "Hope Kansiime",
    role: "UI/UX Designer",
    photo: "assets/images/team-hope.png",
    bio: "Hope handles the design system, wireframes, and interactive prototypes. She makes sure every site we build is easy to navigate, responsive, and visually stunning. Her work is guided by user-centric research and aesthetic excellence.",
    socials: {
      linkedin: "https://linkedin.com",
      dribbble: "https://dribbble.com"
    }
  },
  {
    name: "Derek Mugisha",
    role: "Front-end Engineer",
    photo: "assets/images/team-derek.png",
    bio: "Derek translates Hope's designs into performant HTML, CSS, and JavaScript. He is obsessed with page speed, micro-animations, and full web accessibility (WCAG). He ensures that everything runs at a smooth 60fps on all screen sizes.",
    socials: {
      github: "https://github.com",
      twitter: "https://twitter.com"
    }
  },
  {
    name: "Fiona Nassolo",
    role: "Project Manager",
    photo: "assets/images/team-fiona.png",
    bio: "Fiona keeps projects on track and ensures clear communication between clients and our engineering team. She oversees timelines, project scope, and quality assurance, ensuring that CWORKS always delivers outstanding quality on schedule.",
    socials: {
      linkedin: "https://linkedin.com"
    }
  },
  {
    name: "Julius Kato",
    role: "Full-Stack Developer",
    photo: "assets/images/team-julius.png",
    bio: "Julius focuses on database design, server-side APIs, and system integrations. He makes sure our e-commerce sites and custom web apps run reliably at scale, handling mobile money, card payments, and data sync securely.",
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com"
    }
  },
  {
    name: "Aisha Nabakooza",
    role: "Content Strategist",
    photo: "assets/images/team-aisha.png",
    bio: "Aisha helps clients define their brand voice and drafts clear, engaging copy for their sites. She also handles SEO optimization, schema markup, and metadata setups, ensuring that our sites rank well and convert visitors.",
    socials: {
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com"
    }
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('team-modal-overlay');
  const modalContent = overlay.querySelector('.team-modal-content');
  const closeBtn = overlay.querySelector('.team-modal-close');

  let activeCard = null;
  let isAnimating = false;

  function getSocialsHTML(socials) {
    if (!socials) return '';
    let html = '';
    const icons = {
      github: `<svg viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`,
      linkedin: `<svg viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`,
      twitter: `<svg viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>`,
      dribbble: `<svg viewBox="0 0 24 24"><path d="M12 24c-6.627 0-12-5.373-12-12s5.373-12 12-12 12 5.373 12 12-5.373 12-12 12zm2-22.951c-4.103-.434-8.002 1.485-9.878 5.176.711.189 1.488.358 2.298.508 1.157-2.211 2.827-4.113 4.887-5.525-2.316.036-4.526-.713-6.529-1.929.743-.377 1.557-.645 2.422-.793.818 1.054 1.833 1.956 3.003 2.673 1.258-2.395 2.106-4.996 2.476-7.72-.888-.124-1.787-.19-2.679-.19zm-3.087 8.04c-.651-.433-1.26-.918-1.815-1.442-.816.084-1.637.199-2.456.347.464 1.396 1.341 2.628 2.502 3.518.528-.838 1.121-1.644 1.769-2.423zm-6.223.109c.81-.137 1.62-.244 2.428-.323-.153-.393-.321-.775-.503-1.144-1.12.339-2.179.865-3.14 1.552.348-.309.757-.569 1.215-.685zm8.563-1.46c-.502.822-1.057 1.6-1.656 2.327 1.142.756 2.43 1.328 3.803 1.687-.417-1.488-1.229-2.823-2.32-3.882.059-.044.117-.089.173-.132zm-2.091-1.745c.571.492 1.192.927 1.849 1.298 1.011-.962 1.776-2.178 2.212-3.535-1.579-.272-3.161-.716-4.664-1.325.2.492.385 1.002.548 1.524.019.697.037 1.385.055 2.038z"/></svg>`
    };
    
    Object.keys(socials).forEach(key => {
      if (icons[key]) {
        html += `<a href="${socials[key]}" target="_blank" rel="noopener noreferrer" aria-label="${key}">${icons[key]}</a>`;
      }
    });
    return html;
  }

  function openModal(card, index) {
    if (isAnimating) return;
    isAnimating = true;
    activeCard = card;

    const data = teamMembers[index];

    // Populate modal data
    document.getElementById('modal-member-photo').src = data.photo;
    document.getElementById('modal-member-photo').alt = data.name;
    document.getElementById('modal-member-name').textContent = data.name;
    document.getElementById('modal-member-role').textContent = data.role;
    document.getElementById('modal-member-bio').textContent = data.bio;
    document.getElementById('modal-member-socials').innerHTML = getSocialsHTML(data.socials);

    // 1. Measure First Position of card relative to the viewport
    const firstRect = card.getBoundingClientRect();

    // 2. Set modal active to display it so we can measure its final layout
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    overlay.style.opacity = '0';

    // Clear any previous inline styles to ensure accurate centered measurement
    modalContent.style.position = '';
    modalContent.style.left = '';
    modalContent.style.top = '';
    modalContent.style.width = '';
    modalContent.style.height = '';
    modalContent.style.margin = '';
    modalContent.style.transform = '';
    modalContent.style.borderRadius = '';

    // 3. Measure Last Position of modal content centered
    const lastRect = modalContent.getBoundingClientRect();

    // 4. Hide the original card to make expansion visual transition look seamless
    card.style.opacity = '0.05';

    // 5. Place modalContent fixed matching the card's initial viewport box
    modalContent.style.position = 'fixed';
    modalContent.style.margin = '0';
    modalContent.style.left = firstRect.left + 'px';
    modalContent.style.top = firstRect.top + 'px';
    modalContent.style.width = firstRect.width + 'px';
    modalContent.style.height = firstRect.height + 'px';
    modalContent.style.borderRadius = '20px';

    // Hide internal elements so they fade in smoothly and don't distort during resize
    const infoSection = modalContent.querySelector('.team-modal-info');
    const closeButton = modalContent.querySelector('.team-modal-close');
    infoSection.style.opacity = '0';
    closeButton.style.opacity = '0';

    // 6. Play animations using Anime.js (Strictly 500ms)
    // Fade in backdrop overlay
    anime({
      targets: overlay,
      opacity: [0, 1],
      duration: 500,
      easing: 'cubicBezier(0.25, 1, 0.5, 1)'
    });

    // Morph layout dimensions from Card box to Modal box
    anime({
      targets: modalContent,
      left: [firstRect.left, lastRect.left],
      top: [firstRect.top, lastRect.top],
      width: [firstRect.width, lastRect.width],
      height: [firstRect.height, lastRect.height],
      borderRadius: ['20px', '24px'],
      duration: 500,
      easing: 'cubicBezier(0.25, 1, 0.5, 1)',
      complete: () => {
        // Once layout transitions finish, restore regular centered CSS layout for responsiveness
        modalContent.style.position = '';
        modalContent.style.left = '';
        modalContent.style.top = '';
        modalContent.style.width = '';
        modalContent.style.height = '';
        modalContent.style.margin = '';
        isAnimating = false;
        closeBtn.focus();
      }
    });

    // Fade in internal content smoothly alongside layout change
    anime({
      targets: [infoSection, closeButton],
      opacity: [0, 1],
      duration: 500,
      easing: 'cubicBezier(0.25, 1, 0.5, 1)'
    });
  }

  function closeModal() {
    if (isAnimating || !activeCard) return;
    isAnimating = true;

    // 1. Get current centered viewport box of the modal content
    const firstRect = modalContent.getBoundingClientRect();

    // 2. Measure target viewport box of the original card
    const lastRect = activeCard.getBoundingClientRect();

    // 3. Immediately switch modalContent back to fixed positioning at its centered coordinate
    modalContent.style.position = 'fixed';
    modalContent.style.margin = '0';
    modalContent.style.left = firstRect.left + 'px';
    modalContent.style.top = firstRect.top + 'px';
    modalContent.style.width = firstRect.width + 'px';
    modalContent.style.height = firstRect.height + 'px';

    const infoSection = modalContent.querySelector('.team-modal-info');
    const closeButton = modalContent.querySelector('.team-modal-close');

    // 4. Play exit animation using Anime.js (Strictly 500ms)
    // Fade out backdrop
    anime({
      targets: overlay,
      opacity: 0,
      duration: 500,
      easing: 'cubicBezier(0.25, 1, 0.5, 1)'
    });

    // Contract layout dimensions back to original card box
    anime({
      targets: modalContent,
      left: lastRect.left,
      top: lastRect.top,
      width: lastRect.width,
      height: lastRect.height,
      borderRadius: '20px',
      duration: 500,
      easing: 'cubicBezier(0.25, 1, 0.5, 1)',
      complete: () => {
        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
        
        // Reset modal styles completely
        modalContent.style.position = '';
        modalContent.style.left = '';
        modalContent.style.top = '';
        modalContent.style.width = '';
        modalContent.style.height = '';
        modalContent.style.margin = '';
        
        // Restore card visibility and focus
        activeCard.style.opacity = '1';
        activeCard.focus();
        activeCard = null;
        isAnimating = false;
      }
    });

    // Fade out inner content and close button
    anime({
      targets: [infoSection, closeButton],
      opacity: 0,
      duration: 500,
      easing: 'cubicBezier(0.25, 1, 0.5, 1)'
    });
  }

  // Initialize event handlers
  const cards = document.querySelectorAll('.team-card');
  cards.forEach((card, index) => {
    // Click event
    card.addEventListener('click', () => {
      openModal(card, index);
    });

    // Keyboard support (Enter & Space)
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card, index);
      }
    });
  });

  // Close button click
  closeBtn.addEventListener('click', closeModal);

  // Close on clicking backdrop overlay
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  });

  // Keyboard accessibility inside modal (Focus Trap & Escape closing)
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeModal();
      return;
    }

    if (e.key === 'Tab') {
      const focusableElements = Array.from(overlay.querySelectorAll(
        'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )).filter(el => !el.hasAttribute('disabled') && el.getAttribute('tabindex') !== '-1');

      if (focusableElements.length === 0) return;

      const firstEl = focusableElements[0];
      const lastEl = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) { // backward tab
        if (document.activeElement === firstEl) {
          lastEl.focus();
          e.preventDefault();
        }
      } else { // forward tab
        if (document.activeElement === lastEl) {
          firstEl.focus();
          e.preventDefault();
        }
      }
    }
  });
});
