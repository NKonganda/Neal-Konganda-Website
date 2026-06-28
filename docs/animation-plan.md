# Animation Plan — Neal Konganda Website

Adding **clean, restrained motion** with [Anime.js v4](https://animejs.com) that elevates the
existing editorial/cream aesthetic without making it feel like a "demo reel." Every animation
should feel like it was always meant to be there.

---

## 1. Design Principles

The site is calm, warm, and editorial (Newsreader serif, `#fcfbf9` cream, `#1f5fae` blue accent).
Motion must match that tone.

1. **Subtle over showy.** Short distances (12–24px), short durations (350–700ms), gentle easing
   (`outExpo`, `outQuart`, light springs). No bounces, spins, or attention-grabbing loops.
2. **Purposeful, not decorative.** Animate to guide the eye (reveal content as you scroll, confirm
   a hover). Never animate just because we can.
3. **One entrance per element.** Content reveals once on first view, then stays put. No re-triggering
   on scroll-up — it gets distracting on a resume site. *Exception:* deliberately scroll-linked motion
   (§4.5) is reversible by design — it tracks scroll position, so it's allowed to move both ways.
4. **Stagger for rhythm.** Lists (nav items, social chips, experience entries, project cards) cascade
   with a small per-item delay (40–90ms) instead of appearing all at once.
5. **Accessibility first.** Fully honor `prefers-reduced-motion: reduce` — content appears instantly,
   no transforms. The site must be perfect with motion disabled.
6. **Never block content.** If JS fails or is slow, everything must still be visible (keep a fallback).

---

## 2. Setup

```bash
npm install animejs
```

- Anime.js v4 is tree-shakeable ES modules — import only what each feature needs (`animate`,
  `createTimeline`, `stagger`, `onScroll`, `createDrawable`, `splitText`).
- Full bundle is ~24.5KB gzipped; our realistic footprint (animation + stagger + scroll + svg) is
  ~12–15KB. Acceptable for the payoff.
- Centralize motion in one module so components stay clean and tokens stay consistent.

### Proposed file: `src/lib/motion.js`

A small wrapper that holds shared easing/duration tokens and a reduced-motion guard:

```js
import { animate, stagger, onScroll } from "animejs";

export const EASE = "outExpo";
export const DUR = { fast: 350, base: 550, slow: 700 };

export const reduceMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Reveal helper: fade + rise, once, on scroll into view.
export function reveal(targets, { delay = 0, stagger: step = 0 } = {}) {
  if (reduceMotion()) return; // CSS leaves content visible; nothing to do
  animate(targets, {
    opacity: [0, 1],
    translateY: [22, 0],
    duration: DUR.slow,
    delay: step ? stagger(step, { start: delay }) : delay,
    ease: EASE,
    autoplay: onScroll({ target: targets, enter: "bottom-=10%", once: true }),
  });
}
```

---

## 3. React Integration Pattern

Use `createScope` so animations are scoped to a component root and **auto-cleaned on unmount**
(prevents leaks and double-binding in React 19 StrictMode dev double-render).

```jsx
import { useRef, useEffect } from "react";
import { createScope } from "animejs";

useEffect(() => {
  const scope = createScope({ root: rootRef.current }).add(() => {
    // animate(...) calls here
  });
  return () => scope.revert(); // cleans inline styles + cancels animations
}, []);
```

This replaces the hand-rolled IntersectionObserver + inline-style logic currently in `App.jsx`.

---

## 4. Per-Component Animation Spec

| Area | Animation | Trigger | Notes |
|------|-----------|---------|-------|
| **Sidebar entrance** | Timeline: photo fade+scale(0.98→1) → name → title → chips (stagger 60ms) → nav items (stagger 50ms) | On load | Replaces the single `riseIn` CSS keyframe. Total ~1.1s, finishes before user scrolls. |
| **Name** | Optional: `splitText` by word, each word rises 8px with 40ms stagger | On load, after photo | Keep extremely subtle — it's a serif name, not a headline. Skip if it reads as gimmicky. |
| **Section headings** | Heading fades/rises; thin accent underline draws left→right (scaleX 0→1) | On scroll into view | Gives each section a quiet "arrival" beat. |
| **About paragraph** | Single fade + rise | On scroll | Already has `data-reveal`; route through `reveal()`. |
| **Experience entries** | Each company block staggers in (60ms apart) | On scroll | Logo + header + role lines as one unit. |
| **Project cards** | Cards stagger in on scroll; on hover, thumbnail scales 1→1.03 + subtle shadow | Scroll + hover | Hover stays mostly CSS; JS only if we want spring feel. |
| **Project thumbnails (SVG)** | `createDrawable` line-draw on the EEG waveform (`brainwave.svg`) and pitch lines (`fc26.svg`) | On scroll into card | High-impact, on-theme. The waveform "drawing itself" is the signature moment. |
| **Nav items (sidebar)** | Keep current CSS gap + dot scale on hover | Hover | Already clean — don't replace. Maybe add active-section highlight via `onScroll`. |
| **Social chips** | Keep CSS hover fill | Hover | No change needed. |

### Priority order (impact ÷ effort)
1. **Scroll-reveal refactor** → `reveal()` helper replacing the inline-style IO. (foundation)
2. **Sidebar entrance timeline.** (first thing users see)
3. **Section heading + underline reveal.** (structure/rhythm)
4. **SVG line-draw on project thumbnails.** (signature delight)
5. **Project card hover polish.** (micro-interaction)
6. **Name splitText / active-nav highlight.** (optional flourishes — only if they earn their place)

---

## 4.5 Scroll-Linked Motion ("Following the Scroll")

> Goal: as you scroll down, motion **tracks the scroll position** so the page feels alive and "follows
> you" — but in a restrained, editorial way, never a parallax theme-park. These effects are *reversible*:
> they advance as you scroll down and rewind as you scroll up.

### How Anime.js v4 drives scroll-linked motion

The same `onScroll()` we use for one-shot reveals doubles as a full scroll-scrubber via its **`sync`**
setting. `onScroll()` is passed as an animation/timeline's `autoplay`:

```js
import { animate, onScroll } from "animejs";

animate(target, {
  translateY: [0, -40],
  autoplay: onScroll({
    target,                 // element whose viewport position is tracked
    enter: "bottom top",    // start point: target's bottom hits container top
    leave: "top bottom",    // end point:   target's top hits container bottom
    sync: true,             // ← bind animation PROGRESS to scroll PROGRESS
  }),
});
```

**`sync` modes — pick per effect:**

| `sync` value | Behavior | Use for |
|--------------|----------|---------|
| *(omitted)* | Plays once on enter (our `reveal()` default) | Content entrances |
| `sync: true` | **1:1 scrub** — progress locked to scroll between `enter`/`leave`; reverses on scroll-up | Progress rails, parallax, pinned reveals |
| `sync: 0.5` (a number) | **Eased/smooth scrub** — animation *lags and lerps* toward scroll position; the number is the smoothing factor (higher = more trailing momentum) | The "follows you with weight" feel — buttery parallax, smooth indicators |
| `sync: "play pause"` (method names) | Method-based — maps `play`/`pause`/`reverse`/`reset` to enter/leave × forward/backward events | Start/stop loops or timelines at section boundaries |

**`enter`/`leave` thresholds** use `"<target-edge> <container-edge>"` syntax (`top`/`center`/`bottom`,
plus `min`/`max`), with relative offsets like `"top-=15% center"`. `debug: true` overlays the trigger
lines while tuning. Callbacks (`onEnterForward`, `onLeaveBackward`, `onUpdate`, …) let us toggle classes
or read progress without a separate observer.

### Concrete, on-brand applications (most restrained → most playful)

1. **Scroll progress rail** *(recommended first — high signal, very subtle).*
   A 2px hairline along the left gutter of `.main` whose fill height is bound to page scroll.
   Implementation: animate a `.progress-fill` `scaleY: [0, 1]` (transform-origin top) with
   `sync: true` over the whole document. One element, GPU-cheap, reads as "you are here."

2. **Active-nav follower** *(the literal "following you down").*
   As each section scrolls past, its sidebar nav item becomes active and a small blue marker
   **slides** to it. Use one `onScroll` per section with `onEnterForward`/`onLeaveBackward` to set
   `activeIndex`, then `animate('.nav-marker', { translateY: index * itemHeight, ease: 'outQuart', duration: 350 })`.
   The dot literally travels down the rail alongside your reading position. Useful *and* delightful.

3. **Thumbnail parallax** *(depth without noise).*
   Inside each project card, scrub the thumbnail `translateY: [16, -16]` with `sync: 0.4` while the
   card crosses the viewport. The image drifts slower than the text → quiet sense of depth. Keep the
   range tiny (≤ ±16px) so it never looks like the image is "sliding off."

4. **Section heading drift / underline scrub** *(editorial accent).*
   Bind each section's accent underline `scaleX: [0, 1]` to `sync: true` over the section's top
   portion, so the line "draws itself in time with your scroll" rather than on a fixed timer. Optional:
   a 1–2px upward drift on the heading as it enters.

5. **Sticky "stacking" experience timeline** *(advanced, optional).*
   A vertical rail beside the Experience entries with a blue progress dot that descends as you scroll
   through the work history (`position: sticky` rail + `sync: true` dot translateY). Gives a "timeline
   you're traveling down" feel. Build only if §3 review says the page wants more.

### Notes specific to this site
- The **sidebar is already `position: sticky`**, so the active-nav follower (#2) needs no layout
  changes — just a marker element + scroll listeners.
- Prefer **`sync: <number>` (eased)** over raw `sync: true` for anything that moves spatially
  (parallax, markers); the slight lag is exactly what makes motion feel like it's *following* you
  rather than rigidly snapped to the scrollbar.
- Keep total scroll-linked travel small and slow. On a calm cream resume, 3–4 quiet scrubbed effects
  beat one loud one.

---

## 4.6 Neural Network Backdrop (ambient)

A separate, larger effort with its own execution doc: [`neural-backdrop-plan.md`](./neural-backdrop-plan.md).

Full-page **fixed Canvas 2D** node-edge network behind all content — faint ink lines (`#211f1b` ~7%) with
sparse blue nodes (`#1f5fae`). Always gently drifts; **scroll velocity drives an eased up/down parallax
flow**. "Whisper" intensity so it never competes with the résumé text. Anime.js drives the value-level
animations (edge draw-in on load, section ignition pulses); the canvas renders them, and scroll parallax
reuses the manual-rAF pattern already in `App.jsx`. Flourishes: edge draw-in, cursor proximity glow,
section ignition pulse, scroll-velocity intensity/sparks. Fully disabled under reduced motion (component
returns `null`). See the dedicated plan for the build order and tuning knobs.

---

## 5. Accessibility & Reduced Motion

- A single `prefers-reduced-motion: reduce` check (in `motion.js`) short-circuits every JS animation.
- **Critical:** elements must default to their *visible* state in CSS. Do NOT set `opacity:0` in CSS
  (the current `data-reveal` flow sets opacity via JS, which is correct — keep that invariant). If we
  pre-hide in CSS and JS is disabled/blocked, content vanishes for reduced-motion users.
- Keep the existing fallback timer concept: if `onScroll` never fires (edge cases), content still shows.
- Respect `splitText`'s `accessible: true` so screen readers read the name as one string, not letters.
- **Scroll-linked motion (§4.5) is fully disabled under reduced motion:** skip the scrubbed `onScroll`
  bindings entirely. The progress rail can stay (static or simple), parallax/markers are dropped, and
  the active-nav state falls back to a plain class toggle with no sliding.

---

## 6. Performance

- Animate only `opacity` and `transform` (translate/scale) — GPU-composited, no layout thrash.
  Avoid animating `top`, `height`, `margin`, `box-shadow` (use transform/opacity proxies).
- Use `once: true` on scroll triggers so observers detach after firing.
- Scope-based cleanup via `createScope().revert()` prevents orphaned animations on route/unmount.
- Lazy-consideration: SVG drawables only initialize when their card scrolls near view.
- **Scroll-linked specifics:** `sync` scrubbing runs on anime.js's rAF loop (no per-frame React
  renders) and writes only `transform`/`opacity` — cheap. Keep scrubbed targets to a handful; bind
  each `onScroll` to a specific `target` so it only computes while that element is near the viewport.
  Avoid scrubbing layout properties. Eased sync (`sync: <number>`) self-throttles via lerp.
- Target: no measurable hit to LCP; total added JS ≤ ~15KB gzipped (scroll module adds ~4.3KB).

---

## 7. Rollout Phases

- **Phase 1 — Foundation.** Install anime.js, create `src/lib/motion.js`, refactor `App.jsx`
  scroll-reveal to use `reveal()`. Verify reduced-motion + fallback. *No visual change yet, cleaner code.*
- **Phase 2 — Entrance.** Sidebar entrance timeline replacing `riseIn`. Section heading + underline reveals.
- **Phase 3 — Signature.** SVG line-draw on project thumbnails. Project card hover polish.
- **Phase 4 — Scroll-linked motion (§4.5).** Scroll progress rail → active-nav follower → thumbnail
  parallax → underline scrub. Add one effect at a time and screenshot/scroll-test between each; cut
  anything that competes for attention. (Sticky experience timeline deferred unless it earns its place.)
- **Phase 5 — Flourish (optional).** Name `splitText` and any remaining polish. Ship only if earned.

After each phase: run `openwolf designqc` to screenshot and confirm motion reads as "clean," then iterate.

---

## 8. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Motion feels "too much" / gimmicky | Start subtle, review screenshots/video each phase, cut anything that draws attention to itself. |
| FOUC or content hidden if JS fails | Never pre-hide in CSS; keep JS-driven hide + fallback timer. |
| React 19 StrictMode double-fires animations in dev | `createScope` + `revert()` cleanup in `useEffect` return. |
| Bundle bloat | Tree-shake imports; only pull `createDrawable`/`splitText` where used. |
| Scroll triggers misfire on fast scroll | `once: true` + generous enter threshold + fallback reveal. |
| Scroll-linked motion feels janky / "theme-park" | Prefer eased `sync: <number>`, tiny travel ranges (≤16px), few scrubbed targets; tune with `debug: true`. |
| Scrubbed values fight the one-shot reveal on the same element | Never scrub and reveal the same property on one element — reveal opacity, scrub transform on a child. |

---

## 9. Open Questions (for review before building)

1. **Name animation** — do you want the `splitText` word-rise on your name, or keep it static and let
   the photo/title carry the entrance? (Recommend: keep static, it's more elegant.)
2. **SVG line-draw** — green-light the EEG waveform draw-in as the site's signature moment?
3. **Scope** — animate all four sections now, or start with sidebar + projects and expand?
4. **Scroll-linked motion (§4.5)** — which of the "following you down" effects do you want? My pick for
   max impact / min noise: **progress rail + active-nav follower + subtle thumbnail parallax**. Want the
   sticky experience timeline (#5) too, or hold it back?
```