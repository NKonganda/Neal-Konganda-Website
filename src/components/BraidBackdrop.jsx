import { useEffect, useRef } from "react";
import { reduceMotion } from "../lib/motion";
import "./BraidBackdrop.css";

export default function BraidBackdrop() {
  const svgRef = useRef(null);

  useEffect(() => {
    if (reduceMotion()) return;
    const svg = svgRef.current;
    if (!svg) return;

    const strands = [0, 1, 2].map(i => svg.querySelector(`[data-strand="${i}"]`));
    const tips = [0, 1, 2].map(i => svg.querySelector(`[data-tip="${i}"]`));
    const cx = 32, amp = 15, period = 132;

    let H = 0, target = 0, eased = 0, phase = 0, last = performance.now();
    let rafId = null;

    const resize = () => {
      H = window.innerHeight;
      svg.setAttribute("viewBox", `0 0 64 ${H}`);
    };
    resize();
    window.addEventListener("resize", resize);

    const readScroll = () => {
      const doc = document.documentElement;
      const max = (doc.scrollHeight - window.innerHeight) || 1;
      target = Math.min(1, Math.max(0, window.scrollY / max));
    };
    readScroll();
    window.addEventListener("scroll", readScroll, { passive: true });

    const buildPath = (i, revealY) => {
      const k = (Math.PI * 2) / period;
      const step = 5;
      let d = "";
      for (let y = 0; y <= revealY; y += step) {
        const x = cx + amp * Math.sin(k * y + phase + i * (Math.PI * 2 / 3));
        d += (d ? " L " : "M ") + x.toFixed(2) + " " + y.toFixed(2);
      }
      const x = cx + amp * Math.sin(k * revealY + phase + i * (Math.PI * 2 / 3));
      d += " L " + x.toFixed(2) + " " + revealY.toFixed(2);
      return { d, tipX: x, tipY: revealY };
    };

    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      phase += dt * 0.35;
      eased += (target - eased) * 0.08;
      const revealY = Math.max(2, eased * H);
      for (let i = 0; i < 3; i++) {
        const { d, tipX, tipY } = buildPath(i, revealY);
        strands[i].setAttribute("d", d);
        tips[i].setAttribute("cx", tipX.toFixed(2));
        tips[i].setAttribute("cy", tipY.toFixed(2));
        tips[i].setAttribute("fill-opacity", eased > 0.01 && eased < 0.99 ? "0.9" : "0");
      }
      rafId = requestAnimationFrame(frame);
    };
    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <svg ref={svgRef} className="braid-backdrop" aria-hidden="true" viewBox="0 0 64 0">
      <path data-strand="0" fill="none" stroke="#1f5fae" strokeWidth="1.4" strokeOpacity="0.55" />
      <path data-strand="1" fill="none" stroke="#b07a3c" strokeWidth="1.4" strokeOpacity="0.5" />
      <path data-strand="2" fill="none" stroke="#7c8a6a" strokeWidth="1.4" strokeOpacity="0.5" />
      <circle data-tip="0" r="2.6" fill="#1f5fae" fillOpacity="0" />
      <circle data-tip="1" r="2.6" fill="#b07a3c" fillOpacity="0" />
      <circle data-tip="2" r="2.6" fill="#7c8a6a" fillOpacity="0" />
    </svg>
  );
}
