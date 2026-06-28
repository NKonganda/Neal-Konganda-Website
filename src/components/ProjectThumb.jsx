import { useRef, useEffect, useState } from "react";
import { createScope, createTimeline, createDrawable, onScroll } from "animejs";
import { reduceMotion } from "../lib/motion";

function animateBrainwave(container) {
  const wave = container.querySelector("#bw-wave");
  const wave2 = container.querySelector("#bw-wave-2");
  if (!wave) return;
  const tl = createTimeline({
    autoplay: onScroll({ target: container, enter: "bottom-=10%", once: true }),
  });
  tl.add(createDrawable(wave), { draw: ["0 0", "0 1"], duration: 1300, ease: "inOutQuart" })
    .add(createDrawable(wave2), { draw: ["0 0", "0 1"], duration: 900, ease: "outQuart" }, "-=600");
}

function animateFc26(container) {
  const pitch = container.querySelector("#fc26-pitch");
  const center = container.querySelector("#fc26-center");
  const half = container.querySelector("#fc26-half");
  const penL = container.querySelector("#fc26-pen-l");
  const penR = container.querySelector("#fc26-pen-r");
  const dots = container.querySelector("#fc26-dots");
  if (!pitch) return;
  const tl = createTimeline({
    autoplay: onScroll({ target: container, enter: "bottom-=10%", once: true }),
    defaults: { ease: "inOutQuart" },
  });
  tl.add(createDrawable(pitch), { draw: ["0 0", "0 1"], duration: 700 })
    .add(createDrawable(half), { draw: ["0 0", "0 1"], duration: 380 }, "-=300")
    .add(createDrawable(center), { draw: ["0 0", "0 1"], duration: 480 }, "-=200")
    .add(createDrawable(penL), { draw: ["0 0", "0 1"], duration: 350 }, "-=320")
    .add(createDrawable(penR), { draw: ["0 0", "0 1"], duration: 350 }, "<")
    .add(dots, { opacity: [0, 1], duration: 420, ease: "outExpo" }, "-=100");
}

const ANIM_FNS = {
  "/thumbs/brainwave.svg": animateBrainwave,
  "/thumbs/fc26.svg": animateFc26,
};

export default function ProjectThumb({ src, alt }) {
  const containerRef = useRef(null);
  const [svgHtml, setSvgHtml] = useState(null);

  useEffect(() => {
    if (!src) return;
    fetch(src)
      .then(r => r.text())
      .then(html => setSvgHtml(html))
      .catch(() => {});
  }, [src]);

  useEffect(() => {
    if (!svgHtml || !containerRef.current || reduceMotion()) return;
    const container = containerRef.current;
    const animFn = ANIM_FNS[src];
    if (!animFn) return;
    const scope = createScope({ root: container }).add(() => {
      animFn(container);
    });
    return () => scope.revert();
  }, [svgHtml, src]);

  if (svgHtml) {
    return (
      <div
        ref={containerRef}
        className="proj-thumb-svg"
        aria-label={alt}
        role="img"
        dangerouslySetInnerHTML={{ __html: svgHtml }}
      />
    );
  }

  return <img src={src} alt={alt} className="proj-thumb-img" />;
}
