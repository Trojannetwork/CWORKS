/**
 * Blueprint Timeline Zoom & Pan Scroll Controller
 * Vanilla JS (No External Libraries)
 */
(function() {
  // Elements
  const container = document.getElementById('process');
  const stickyWrapper = container ? container.querySelector('.process-sticky-wrapper') : null;
  const blueprintCanvas = document.getElementById('blueprint-canvas');
  const steps = blueprintCanvas ? Array.from(blueprintCanvas.querySelectorAll('.blueprint-step')) : [];
  const scaleDisplay = document.getElementById('blueprint-scale-display');
  const titleBlock = container ? container.querySelector('.blueprint-title-block') : null;

  if (!container || !blueprintCanvas || !scaleDisplay || !steps.length) return;

  // Constants
  const CANVAS_WIDTH = 1500;
  const CANVAS_HEIGHT = 950;
  const HALF_CANVAS_W = CANVAS_WIDTH / 2;
  const HALF_CANVAS_H = CANVAS_HEIGHT / 2;

  // State Variables
  let baseScale = 1;
  let zoomScale = 1;
  let stepCenters = []; // Array of { cx, cy } for each step

  // LERP Variables
  let currentScale = 1;
  let currentTx = 0;
  let currentTy = 0;
  let currentTitleOpacity = 1;

  let targetScale = 1;
  let targetTx = 0;
  let targetTy = 0;
  let targetTitleOpacity = 1;
  let targetStepIndex = -1; // -1 for overview, 0-5 for steps 1-6

  let isAnimating = false;
  let isIntersecting = false;
  let animationFrameId = null;

  // Measure card positions relative to canvas
  function measureSteps() {
    stepCenters = steps.map(step => {
      const w = step.offsetWidth;
      const h = step.offsetHeight;
      
      // Calculate center coordinates relative to blueprint-canvas
      const cx = step.offsetLeft + w / 2;
      const cy = step.offsetTop + h / 2;
      
      return { cx, cy };
    });
  }

  // Calculate scales based on viewport
  function updateDimensions() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Base Scale: fit the entire canvas in the viewport with a padding margin
    const scaleX = vw / CANVAS_WIDTH;
    const scaleY = vh / CANVAS_HEIGHT;
    
    // Desktop layout fits nicely at ~0.75 size, mobile will scale down further
    baseScale = Math.min(scaleX, scaleY) * 0.76;
    baseScale = Math.min(1.0, Math.max(0.18, baseScale)); // Clamp base scale

    // Zoom Scale: scale a single step card to occupy a comfortable viewport space
    // Let's target the card (width 340, height 240) to fit nicely.
    const zoomX = vw / 420;
    const zoomY = vh / 330;
    zoomScale = Math.min(zoomX, zoomY) * 1.1;
    zoomScale = Math.min(2.2, Math.max(0.8, zoomScale)); // Clamp zoom scale
  }

  // Get target transformation parameters for a given state index (0 to 6)
  function getTargetParams(index) {
    if (index === 0) {
      // State 0: Overview (Centered, scaled out)
      return { scale: baseScale, tx: 0, ty: 0 };
    }

    // States 1..6: Steps (Centered on target card, zoomed in)
    const stepIdx = index - 1;
    const center = stepCenters[stepIdx];
    
    if (!center) return { scale: baseScale, tx: 0, ty: 0 };

    // Calculate displacement from canvas center
    const px = center.cx - HALF_CANVAS_W;
    const py = center.cy - HALF_CANVAS_H;

    // Apply scale factor to translate parameters
    const tx = -px * zoomScale;
    const ty = -py * zoomScale;

    return { scale: zoomScale, tx, ty };
  }

  // Calculate target state from current scroll progress
  function updateTargetState() {
    const rect = container.getBoundingClientRect();
    const scrollableHeight = rect.height - window.innerHeight;
    
    if (scrollableHeight <= 0) return;

    // Calculate scroll progress clamped to [0, 1]
    const progress = -rect.top / scrollableHeight;
    const pct = Math.max(0, Math.min(1, progress));

    // Calculate target title block opacity: fade out completely from pct 0.04 to 0.10
    if (pct <= 0.04) {
      targetTitleOpacity = 1;
    } else if (pct >= 0.10) {
      targetTitleOpacity = 0;
    } else {
      targetTitleOpacity = 1 - (pct - 0.04) / 0.06;
    }

    const N = 6; // Number of steps
    const intervalLength = 1 / N;

    // Determine current scroll interval
    let i = Math.floor(pct / intervalLength);
    if (i >= N) i = N - 1;

    const startPct = i * intervalLength;
    const endPct = (i + 1) * intervalLength;
    const t = (pct - startPct) / (endPct - startPct);

    // Apply smooth step panning curve with plateaus (dwell times)
    let easedT;
    if (t < 0.22) {
      easedT = 0; // Hold at state i
    } else if (t > 0.78) {
      easedT = 1; // Hold at state i+1
    } else {
      // Transition from 0 to 1 between 0.22 and 0.78
      const nt = (t - 0.22) / 0.56;
      easedT = nt * nt * (3 - 2 * nt); // Smoothstep cubic ease
    }

    // Interpolate state A parameters to state B parameters
    const stateA = getTargetParams(i);
    const stateB = getTargetParams(i + 1);

    targetScale = stateA.scale + (stateB.scale - stateA.scale) * easedT;
    targetTx = stateA.tx + (stateB.tx - stateA.tx) * easedT;
    targetTy = stateA.ty + (stateB.ty - stateA.ty) * easedT;

    // Determine currently active card
    const currentFocalIndex = (t < 0.5) ? i : i + 1;
    if (currentFocalIndex === 0) {
      targetStepIndex = -1; // Overview
    } else {
      targetStepIndex = currentFocalIndex - 1; // Step index (0-5)
    }

    // Start animating if loop is idle
    startAnimationLoop();
  }

  // Animation render loop
  function animate() {
    if (!isIntersecting) {
      isAnimating = false;
      return;
    }

    // LERP calculation for liquid smooth transitions
    const scaleDiff = targetScale - currentScale;
    const txDiff = targetTx - currentTx;
    const tyDiff = targetTy - currentTy;
    const titleOpacityDiff = targetTitleOpacity - currentTitleOpacity;

    // Check if convergence threshold is met to stop animation
    if (Math.abs(scaleDiff) < 0.0005 && Math.abs(txDiff) < 0.05 && Math.abs(tyDiff) < 0.05 && Math.abs(titleOpacityDiff) < 0.005) {
      currentScale = targetScale;
      currentTx = targetTx;
      currentTy = targetTy;
      currentTitleOpacity = targetTitleOpacity;
      
      // Update transforms
      blueprintCanvas.style.transform = `translate3d(${currentTx}px, ${currentTy}px, 0) scale(${currentScale})`;
      scaleDisplay.textContent = `1:${currentScale.toFixed(2)}`;
      
      if (titleBlock) {
        titleBlock.style.opacity = currentTitleOpacity;
        titleBlock.style.pointerEvents = currentTitleOpacity < 0.1 ? 'none' : 'auto';
      }
      
      // Highlight/Fade steps
      updateStepClasses();
      
      isAnimating = false;
      return;
    }

    // Apply LERP transition
    currentScale += scaleDiff * 0.095;
    currentTx += txDiff * 0.095;
    currentTy += tyDiff * 0.095;
    currentTitleOpacity += titleOpacityDiff * 0.095;

    // Transform DOM
    blueprintCanvas.style.transform = `translate3d(${currentTx}px, ${currentTy}px, 0) scale(${currentScale})`;
    scaleDisplay.textContent = `1:${currentScale.toFixed(2)}`;

    if (titleBlock) {
      titleBlock.style.opacity = currentTitleOpacity;
      titleBlock.style.pointerEvents = currentTitleOpacity < 0.1 ? 'none' : 'auto';
    }

    updateStepClasses();

    animationFrameId = requestAnimationFrame(animate);
  }

  // Start animation loop safely
  function startAnimationLoop() {
    if (!isAnimating && isIntersecting) {
      isAnimating = true;
      animationFrameId = requestAnimationFrame(animate);
    }
  }

  // Update active/inactive classes on step cards
  let activeStepIndex = -2; // Start with placeholder to force initial check
  function updateStepClasses() {
    if (targetStepIndex === activeStepIndex) return;
    activeStepIndex = targetStepIndex;

    if (activeStepIndex === -1) {
      blueprintCanvas.classList.remove('state-zoomed');
      blueprintCanvas.classList.add('state-overview');
      steps.forEach(s => s.classList.remove('active'));
    } else {
      blueprintCanvas.classList.remove('state-overview');
      blueprintCanvas.classList.add('state-zoomed');
      steps.forEach((s, idx) => {
        s.classList.toggle('active', idx === activeStepIndex);
      });
    }
  }

  // Initialization
  function init() {
    updateDimensions();
    measureSteps();
    
    // Set initial transform instantly
    const initialParams = getTargetParams(0);
    currentScale = initialParams.scale;
    currentTx = initialParams.tx;
    currentTy = initialParams.ty;
    blueprintCanvas.style.transform = `translate3d(${currentTx}px, ${currentTy}px, 0) scale(${currentScale})`;
    scaleDisplay.textContent = `1:${currentScale.toFixed(2)}`;
    
    updateStepClasses();

    // IntersectionObserver to observe if section is in viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isIntersecting = entry.isIntersecting;
        if (isIntersecting) {
          updateTargetState();
        } else {
          // Stop animation loop
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            isAnimating = false;
          }
        }
      });
    }, {
      rootMargin: "0px",
      threshold: 0.01 // Start calculating even if only 1% of section is visible
    });

    observer.observe(container);

    // Event listener for scroll (bind window directly since section scroll height controls scrollbar)
    window.addEventListener('scroll', updateTargetState, { passive: true });

    // Handle resize
    window.addEventListener('resize', () => {
      updateDimensions();
      measureSteps();
      updateTargetState();
    });
  }

  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
