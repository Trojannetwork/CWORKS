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
  }

  section.style.position = 'relative';
  section.appendChild(container);

  /* ---- Pointer tracking ---- */
  const onPointerMove = (e) => {
    const spans = container.querySelectorAll('span');
    spans.forEach(span => {
      const rect = span.getBoundingClientRect();
      const cx = rect.x + rect.width / 2;
      const cy = rect.y + rect.height / 2;
      const b = e.clientX - cx;
      const a = e.clientY - cy;
      const c = Math.sqrt(a * a + b * b) || 1;
      const r = ((Math.acos(b / c) * 180) / Math.PI) * (e.clientY > cy ? 1 : -1);
      span.style.setProperty('--rotate', `${r}deg`);
    });
  };

  window.addEventListener('pointermove', onPointerMove);
})();
