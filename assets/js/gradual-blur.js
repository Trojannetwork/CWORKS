/* === GradualBlur — Vanilla JS ===
   Creates a progressive blur curtain at the bottom of the hero section.
   Multiple stacked divs with increasing backdrop-blur + mask-image gradient.
   Only active on index.html. Target: #hero */

(function () {
  const hero = document.getElementById('hero');
  if (!hero) return;

  /* ---- Config ---- */
  const config = {
    position: 'bottom',
    strength: 2.5,
    height: '10rem',
    divCount: 6,
    opacity: 1,
    curve: 'ease-out',
    exponential: false,
    animated: true,
    zIndex: 5,
  };

  /* ---- Curve functions ---- */
  const curves = {
    linear: p => p,
    'ease-in': p => p * p,
    'ease-out': p => 1 - Math.pow(1 - p, 2),
    'ease-in-out': p => p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2,
  };

  const curveFn = curves[config.curve] || curves.linear;

  /* ---- Build DOM ---- */
  const container = document.createElement('div');
  container.className = 'gradual-blur';
  container.style.cssText =
    'position:absolute;bottom:0;left:0;right:0;pointer-events:none;' +
    'z-index:' + config.zIndex + ';height:' + config.height + ';' +
    'opacity:' + config.opacity + ';' +
    (config.animated ? 'transition:opacity 0.3s ease-out;' : '');

  const inner = document.createElement('div');
  inner.style.cssText = 'position:relative;width:100%;height:100%;';
  container.appendChild(inner);

  const increment = 100 / config.divCount;

  for (let i = 1; i <= config.divCount; i++) {
    let progress = curveFn(i / config.divCount);

    let blurValue;
    if (config.exponential) {
      blurValue = Math.pow(2, progress * 4) * 0.0625 * config.strength;
    } else {
      blurValue = 0.0625 * (progress * config.divCount + 1) * config.strength;
    }

    const p1 = Math.round((increment * i - increment) * 10) / 10;
    const p2 = Math.round(increment * i * 10) / 10;
    const p3 = Math.round((increment * i + increment) * 10) / 10;
    const p4 = Math.round((increment * i + increment * 2) * 10) / 10;

    let gradient = `transparent ${p1}%, black ${p2}%`;
    if (p3 <= 100) gradient += `, black ${p3}%`;
    if (p4 <= 100) gradient += `, transparent ${p4}%`;

    const layer = document.createElement('div');
    layer.style.cssText =
      'position:absolute;inset:0;' +
      `mask-image:linear-gradient(to bottom, ${gradient});` +
      `-webkit-mask-image:linear-gradient(to bottom, ${gradient});` +
      `backdrop-filter:blur(${blurValue.toFixed(3)}rem);` +
      `-webkit-backdrop-filter:blur(${blurValue.toFixed(3)}rem);`;

    inner.appendChild(layer);
  }

  hero.appendChild(container);

  /* ---- Intersection Observer: fade in on scroll ---- */
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        container.style.opacity = '1';
      }
    },
    { threshold: 0.1 }
  );

  observer.observe(hero);
})();
