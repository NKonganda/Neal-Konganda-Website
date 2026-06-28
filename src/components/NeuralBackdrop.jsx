import { useRef, useEffect } from 'react';
import { reduceMotion } from '../lib/motion.js';
import { CONFIG, nodeCountFor, buildNodes, stepNodes, drawNetwork } from '../lib/network.js';
import './NeuralBackdrop.css';

export default function NeuralBackdrop() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Skip all setup for users who prefer reduced motion
    if (reduceMotion()) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // --- DPR-aware sizing ---
    const dpr = window.devicePixelRatio || 1;
    let w = window.innerWidth;
    let h = window.innerHeight;
    let nodes = [];

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      // Use setTransform (not scale) to avoid DPR compounding on repeated resizes
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      nodes = buildNodes(nodeCountFor(w), w, h);
    }

    resize();

    // Throttled resize: rebuild nodes on window resize
    let resizeTimer = null;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    }
    window.addEventListener('resize', onResize, { passive: true });

    // --- state ---
    const state = {
      drawProgress: 1,   // Task 5 will animate this 0→1; hold at 1 for now
      flowOffset: 0,     // Task 4 will update this from scroll velocity
      velocity: 0,       // Tasks 4/8 will update this
      mouse: { x: 0, y: 0, active: false },
      dpr,
    };

    // Scroll parallax
    const PARALLAX_FACTOR = 0.4;   // how much raw scroll delta amplifies into target flow
    let lastScrollY = window.scrollY;
    let targetFlow = 0;

    function onScroll() {
      const rawDelta = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      targetFlow += rawDelta * PARALLAX_FACTOR;
      state.velocity = rawDelta;  // raw; decays in tick
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    // --- rAF loop ---
    let rafId = null;

    function tick() {
      if (document.hidden) {
        // Skip drawing to save battery, but keep rAF ticking for instant resume
        rafId = requestAnimationFrame(tick);
        return;
      }
      // Eased flow and velocity decay
      state.flowOffset += (targetFlow - state.flowOffset) * CONFIG.flowLerp;
      state.velocity *= 0.85;   // decay toward 0 each frame
      stepNodes(nodes, w, h);
      drawNetwork(ctx, nodes, state);
      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);

    // visibilitychange listener registered for future use (loop self-guards via document.hidden)
    function onVisibility() {
      // no extra logic needed — tick() checks document.hidden itself
    }
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="neural-backdrop" aria-hidden="true" />;
}
