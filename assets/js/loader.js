/**
 * CWORKS Website Loading Screen Script
 * Implements Anime.js scrambleText effect, fade-in, and page transition
 * with full accessibility and prefers-reduced-motion compliance.
 */

document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loading-screen');
  const loaderText = document.getElementById('loader-text');
  if (!loader || !loaderText) return;

  const targetText = 'cworks';
  const possibleChars = 'abcdefghijklmnopqrstuvwxyz0123456789!@#$%&*+=-';
  
  // Check user preferences for animation
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // If reduced motion is enabled, show the text statically immediately
    loaderText.style.opacity = '1';
    loaderText.innerHTML = targetText;
    
    // Wait briefly, then fade out the loader
    setTimeout(() => {
      fadeLoaderOut();
    }, 800);
    return;
  }

  // 1. Subtle fade-in of the text before scramble begins (350ms)
  anime({
    targets: loaderText,
    opacity: [0, 1],
    duration: 350,
    easing: 'easeOutQuad',
    complete: () => {
      // 2. Scramble animation (Exactly 500ms)
      const scrambleObj = { progress: 0 };
      
      anime({
        targets: scrambleObj,
        progress: 100,
        duration: 500,
        easing: 'linear',
        update: () => {
          const p = scrambleObj.progress / 100;
          let result = '';
          
          for (let i = 0; i < targetText.length; i++) {
            // Resolve characters progressively based on animation progress
            if (p >= (i + 1) / targetText.length) {
              result += targetText[i];
            } else if (p > i / targetText.length) {
              // Intermediate state: swap between real character and random glyph
              result += Math.random() > 0.4 ? targetText[i] : possibleChars[Math.floor(Math.random() * possibleChars.length)];
            } else {
              result += possibleChars[Math.floor(Math.random() * possibleChars.length)];
            }
          }
          loaderText.innerHTML = result;
        },
        complete: () => {
          // Guarantee final state matches exactly
          loaderText.innerHTML = targetText;
          
          // 3. Pause briefly (about 250ms) before fading out
          setTimeout(() => {
            fadeLoaderOut();
          }, 250);
        }
      });
    }
  });

  function fadeLoaderOut() {
    // 4. Smoothly fade out the loader screen overlay
    anime({
      targets: loader,
      opacity: 0,
      duration: 400,
      easing: 'easeOutQuad',
      complete: () => {
        loader.style.display = 'none';
        document.body.classList.remove('loading');
      }
    });
  }
});
