/**
 * Paper Plane Trace Timeline Controller
 * Vanilla JS (No External Libraries)
 */
(function() {
  const container = document.getElementById('process');
  if (!container) return;

  const wrapper = container.querySelector('.timeline-paper-plane-wrapper');
  const svg = document.getElementById('timeline-svg');
  const pathBg = document.getElementById('plane-path-bg');
  const pathFg = document.getElementById('plane-path-fg');
  const paperPlane = document.getElementById('paper-plane');
  const steps = Array.from(container.querySelectorAll('.paper-plane-step'));

  if (!wrapper || !svg || !pathBg || !pathFg || !paperPlane || !steps.length) return;

  let totalLength = 0;
  let stepCenters = []; // Precomputed centers for vertical trigger comparison
  let isIntersecting = false;

  // Compute layout coordinates relative to wrapper
  function getRelativeCoords(el) {
    const wrapperRect = wrapper.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    return {
      x: elRect.left - wrapperRect.left,
      y: elRect.top - wrapperRect.top,
      w: elRect.width,
      h: elRect.height
    };
  }

  // Draw the intricate winding path
  function generatePath() {
    if (!steps.length) return;

    let d = '';
    const tempCenters = [];

    // Construct path segments through steps
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const marker = step.querySelector('.step-marker');
      const content = step.querySelector('.step-content');

      const markerCoords = getRelativeCoords(marker);
      const contentCoords = getRelativeCoords(content);

      // Center of the marker
      const mx = markerCoords.x + markerCoords.w / 2;
      const my = markerCoords.y + markerCoords.h / 2;

      // Card coordinates
      const cx = contentCoords.x;
      const cy = contentCoords.y;
      const cw = contentCoords.w;
      const ch = contentCoords.h;

      tempCenters.push({ x: mx, y: my });

      if (i === 0) {
        // Start trajectory at Step 1 marker
        d = `M ${mx} ${my}`;
      }

      if (i < steps.length - 1) {
        const nextStep = steps[i + 1];
        const nextMarker = nextStep.querySelector('.step-marker');
        const nextMarkerCoords = getRelativeCoords(nextMarker);
        const nmx = nextMarkerCoords.x + nextMarkerCoords.w / 2;
        const nmy = nextMarkerCoords.y + nextMarkerCoords.h / 2;

        // Loop points around content of step i
        // cp1 pushes the path outwards to the right of the card
        const cp1x = cx + cw + 45;
        const cp1y = cy + ch * 0.15;
        
        // cp2 pulls path down below the card
        const cp2x = cx + cw + 25;
        const cp2y = cy + ch + 15;
        
        const endx = cx + cw * 0.45;
        const endy = cy + ch + 25;

        // S-curve sweeping left to next marker
        const cp3x = nmx - 30;
        const cp3y = endy + 20;
        const cp4x = nmx - 20;
        const cp4y = nmy - 25;

        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endx} ${endy}`;
        d += ` C ${cp3x} ${cp3y}, ${cp4x} ${cp4y}, ${nmx} ${nmy}`;
      } else {
        // Last step: terminate below Step 06 content
        const cp1x = cx + cw + 45;
        const cp1y = cy + ch * 0.15;
        const cp2x = cx + cw + 20;
        const cp2y = cy + ch + 20;
        const endx = cx + cw * 0.45;
        const endy = cy + ch + 35;

        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endx} ${endy}`;
      }
    }

    stepCenters = tempCenters;

    // Apply paths
    pathBg.setAttribute('d', d);
    pathFg.setAttribute('d', d);

    // Measure length for scroll binding
    totalLength = pathFg.getTotalLength();
    pathFg.style.strokeDasharray = totalLength;
    pathFg.style.strokeDashoffset = totalLength;
  }

  // Update plane position and trail trace on scroll
  function updateTimeline() {
    if (!totalLength) return;

    const wrapperRect = wrapper.getBoundingClientRect();
    
    // Determine scroll boundaries relative to viewport middle
    const viewportMiddle = window.innerHeight * 0.5;
    const startScroll = wrapperRect.top + window.scrollY - viewportMiddle;
    const endScroll = wrapperRect.bottom + window.scrollY - viewportMiddle - 100;
    
    const currentScroll = window.scrollY;
    
    // Compute scroll progress clamped between 0 and 1
    let pct = (currentScroll - startScroll) / (endScroll - startScroll);
    pct = Math.max(0, Math.min(1, pct));

    const distance = pct * totalLength;
    
    // Set dashoffset to "draw" path
    pathFg.style.strokeDashoffset = totalLength - distance;

    // Get current plane position coordinates on path
    const targetDist = Math.max(0, Math.min(totalLength, distance));
    const point = pathFg.getPointAtLength(targetDist);

    // Calculate tangent angle for orientation rotation
    const stepAhead = 2;
    let angle = 0;

    if (targetDist + stepAhead <= totalLength) {
      const pointAhead = pathFg.getPointAtLength(targetDist + stepAhead);
      angle = Math.atan2(pointAhead.y - point.y, pointAhead.x - point.x) * 180 / Math.PI;
    } else {
      const pointBehind = pathFg.getPointAtLength(Math.max(0, targetDist - stepAhead));
      angle = Math.atan2(point.y - pointBehind.y, point.x - pointBehind.x) * 180 / Math.PI;
    }

    // Apply SVG transform to plane group
    paperPlane.setAttribute('transform', `translate(${point.x}, ${point.y}) rotate(${angle})`);

    // Compare plane vertical position with step markers to activate/deactivate steps
    steps.forEach((step, idx) => {
      const triggerY = stepCenters[idx] ? stepCenters[idx].y : 0;
      
      // When the plane passes the card's vertical center position, activate it
      if (point.y >= triggerY - 15) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });
  }

  // Recalculate and redraw paths
  let resizeTimeout;
  function handleResize() {
    // Debounce resize events
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      generatePath();
      updateTimeline();
    }, 150);
  }

  function init() {
    generatePath();
    updateTimeline();

    // IntersectionObserver to run scrolls only when section is visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isIntersecting = entry.isIntersecting;
        if (isIntersecting) {
          updateTimeline();
        }
      });
    }, {
      rootMargin: "100px 0px 100px 0px", // pre-trigger calculations slightly before entry
      threshold: 0.01
    });

    observer.observe(container);

    // Bind scroll
    window.addEventListener('scroll', () => {
      if (isIntersecting) {
        updateTimeline();
      }
    }, { passive: true });

    // Bind resize
    window.addEventListener('resize', handleResize);
  }

  // DOM load trigger
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
