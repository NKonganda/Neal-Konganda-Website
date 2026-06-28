import { animate, stagger, onScroll } from "animejs";

export const EASE = "outExpo";
export const DUR = { fast: 350, base: 550, slow: 700 };

export const reduceMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function reveal(target, { delay = 0, staggerMs = 0 } = {}) {
  if (reduceMotion()) return;
  const nodes =
    typeof target === "string"
      ? Array.from(document.querySelectorAll(target))
      : target instanceof Element
      ? [target]
      : Array.from(target);
  if (!nodes.length) return;
  animate(nodes, {
    opacity: [0, 1],
    translateY: [22, 0],
    duration: DUR.slow,
    delay: staggerMs ? stagger(staggerMs, { start: delay }) : delay,
    ease: EASE,
    autoplay: onScroll({
      target: nodes[0],
      enter: "bottom-=10%",
      once: true,
    }),
  });
}
