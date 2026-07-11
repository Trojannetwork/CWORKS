/* === TextPressure — Vanilla JS ===
   Mouse-reactive variable font text effect.
   Ported from React. Requires Roboto Flex loaded via Google Fonts.
   Uses font-variation-settings: wght, wdth, ital animate per character based on cursor distance. */

(function () {
  const container = document.getElementById('text-pressure');
  if (!container) return;

  /* --- Config --- */
  const TEXT = 'CWORKS';
  const FONT_FAMILY = 'Roboto Flex';
  const MIN_FONT_SIZE = 24;

  const width = true;
  const weight = true;
  const italic = true;
  const alpha = false;
  const flex = true;
  const stroke = false;
  const scale = false;
  const textColor = '#FFFFFF';
  const strokeColor = '#FF0000';

  /* --- Build DOM --- */
  const chars = TEXT.split('');
  const h1 = document.createElement('h1');
  h1.className = 'text-pressure-title' + (flex ? ' flex' : '') + (stroke ? ' stroke' : '');
  h1.style.cssText =
    'font-family:"Roboto Flex",sans-serif;text-transform:uppercase;' +
    'margin:0;text-align:center;user-select:none;white-space:nowrap;' +
    'font-weight:100;width:100%;color:' + textColor + ';' +
    'font-variation-settings:"wght" 100, "wdth" 100, "ital" 0;';

  const spans = [];
  chars.forEach(char => {
    const span = document.createElement('span');
    span.setAttribute('data-char', char);
    span.style.cssText = 'display:inline-block;';
    span.textContent = char;
    h1.appendChild(span);
    spans.push(span);
  });

  if (stroke) {
    h1.style.position = 'relative';
    h1.style.color = textColor;
    const style = document.createElement('style');
    style.textContent =
      '.stroke span{position:relative;}' +
      '.stroke span::after{content:attr(data-char);position:absolute;left:0;top:0;' +
      'color:transparent;z-index:-1;-webkit-text-stroke-width:3px;' +
      '-webkit-text-stroke-color:' + strokeColor + ';}';
    document.head.appendChild(style);
  }

  container.appendChild(h1);

  /* --- Sizing --- */
  function setSize() {
    const containerW = container.clientWidth;
    const newFontSize = Math.max(containerW / (chars.length / 2), MIN_FONT_SIZE);
    h1.style.fontSize = newFontSize + 'px';
    h1.style.lineHeight = '1';
    h1.style.transform = 'scale(1,1)';
    h1.style.transformOrigin = 'center top';

    requestAnimationFrame(() => {
      if (scale) {
        const textRect = h1.getBoundingClientRect();
        const containerH = container.clientHeight;
        if (textRect.height > 0) {
          const yRatio = containerH / textRect.height;
          h1.style.transform = 'scale(1,' + yRatio + ')';
          h1.style.lineHeight = yRatio;
        }
      }
    });
  }

  setSize();
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setSize, 100);
  });

  /* --- Mouse tracking --- */
  const cursor = { x: 0, y: 0 };
  const mouse = { x: 0, y: 0 };

  window.addEventListener('mousemove', e => {
    cursor.x = e.clientX;
    cursor.y = e.clientY;
  });
  window.addEventListener('touchmove', e => {
    const t = e.touches[0];
    cursor.x = t.clientX;
    cursor.y = t.clientY;
  }, { passive: true });

  // Init cursor at center
  const rect = container.getBoundingClientRect();
  mouse.x = rect.left + rect.width / 2;
  mouse.y = rect.top + rect.height / 2;
  cursor.x = mouse.x;
  cursor.y = mouse.y;

  /* --- Helpers --- */
  function dist(a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function getAttr(distance, maxDist, minVal, maxVal) {
    const val = maxVal - Math.abs((maxVal * distance) / maxDist);
    return Math.max(minVal, val + minVal);
  }

  /* --- Animation loop --- */
  function animate() {
    // Ease mouse toward cursor
    mouse.x += (cursor.x - mouse.x) / 15;
    mouse.y += (cursor.y - mouse.y) / 15;

    const titleRect = h1.getBoundingClientRect();
    const maxDist = titleRect.width / 2;

    spans.forEach(span => {
      if (!span) return;
      const r = span.getBoundingClientRect();
      const charCenter = { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      const d = dist(mouse, charCenter);

      const wdth = width ? Math.floor(getAttr(d, maxDist, 5, 200)) : 100;
      const wght = weight ? Math.floor(getAttr(d, maxDist, 100, 900)) : 400;
      const italVal = italic ? getAttr(d, maxDist, 0, 1).toFixed(2) : 0;

      span.style.fontVariationSettings = "'wght' " + wght + ", 'wdth' " + wdth + ", 'ital' " + italVal;

      if (alpha) {
        const alphaVal = getAttr(d, maxDist, 0, 1).toFixed(2);
        span.style.opacity = alphaVal;
      }
    });

    requestAnimationFrame(animate);
  }

  animate();
})();
