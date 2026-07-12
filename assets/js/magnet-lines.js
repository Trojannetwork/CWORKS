/* === MagnetLines — Vanilla JS ===
   Grid of lines that rotate toward the cursor. Ported from React.
   Appended to #services section as a background layer. */

(function () {
  const section = document.getElementById('services');
  if (!section) return;

  const container = document.createElement('div');
  container.className = 'magnet-lines';
  container.style.cssText =
    'display:grid;position:absolute;inset:0;pointer-events:none;z-index:0;overflow:hidden;opacity:0.25;';

  const rows = 6;
  const columns = 6;
  const total = rows * columns;
  container.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  container.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

  const spans = [];
  for (let i = 0; i < total; i++) {
    const span = document.createElement('span');
    span.style.cssText =
      'display:block;margin:auto;border-radius:2px;' +
      'width:0.35rem;height:2rem;' +
      'background:var(--signal);' +
      'transform:rotate(var(--rotate, -10deg));' +
      'transition:transform 0.12s ease-out;';
    span.style.setProperty('--rotate', '-10deg');
    container.appendChild(span);
    spans.push(span);
  }

  section.style.position = 'relative';
  section.appendChild(container);

  /* ---- Cache positions to prevent layout thrashing ---- */
  let centers = [];
  function updateCenters() {
    centers = spans.map(span => {
      const rect = span.getBoundingClientRect();
      return {
        element: span,
        x: rect.left + rect.width / 2 + window.scrollX,
        y: rect.top + rect.height / 2 + window.scrollY
      };
    });
  }

  // Initial update
  // Use requestAnimationFrame to ensure elements are rendered and layout is ready
  requestAnimationFrame(updateCenters);

  window.addEventListener('resize', updateCenters);

  /* ---- Pointer tracking using cached positions ---- */
  const onPointerMove = (e) => {
    // If centers are not loaded yet, skip
    if (!centers.length) return;

    // e.pageX and e.pageY are page-relative, matching our cached coords
    const mx = e.pageX;
    const my = e.pageY;

    centers.forEach(c => {
      const b = mx - c.x;
      const a = my - c.y;
      const dist = Math.sqrt(a * a + b * b) || 1;
      const r = ((Math.acos(b / dist) * 180) / Math.PI) * (my > c.y ? 1 : -1);
      c.element.style.setProperty('--rotate', `${r}deg`);
    });
  };

  window.addEventListener('pointermove', onPointerMove);
})();

