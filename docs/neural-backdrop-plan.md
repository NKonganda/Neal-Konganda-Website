# Neural Network Backdrop — Implementation Plan

> Ambient, full-page **node-edge network** that drifts gently at all times and **flows up/down with
> scroll velocity**. Faint ink lines, sparse blue nodes, "whisper" intensity. Built to sit *behind*
> the existing editorial/cream résumé without competing with the text. Companion to
> [`animation-plan.md`](./animation-plan.md) (see new §4.6 there).

Date: 2026-06-27 · Stack: React 19 + Vite + Anime.js v4 · Canvas 2D for rendering.

---

## 1. Decisions (locked)

| Aspect | Decision |
|--------|----------|
| Visual form | **Node-edge network** — faint dots connected by thin lines forming a living graph |
| Placement | **Full-page fixed backdrop** behind ALL content (sidebar + reading column), content readable on top |
| Color | **Mixed** — ink lines (`#211f1b`), sparse **blue nodes** (`#1f5fae`) |
| Motion | **Always drifting + scroll parallax** — perpetual slow drift; scroll velocity drives eased up/down flow |
| Intensity | **Whisper** — ~7% line opacity, ~50 nodes (responsive), slow motion |
| Flourishes | All four: edge draw-in on load, cursor proximity glow, section ignition pulse, scroll-velocity intensity |
| Reduced motion | Component returns `null` — no canvas, no listeners, content untouched |

**Why Canvas 2D, not pure anime.js/SVG:** a full-page, always-animating graph (~50 nodes, hundreds of
edges, redrawn every frame) is a rendering job. SVG/DOM would thrash. **Anime.js is still used** for the
value-level animations where it shines (edge draw-in progress, node ignition pulses); the canvas reads
those animated values each frame. Scroll parallax reuses the **manual rAF scroll pattern already in
`App.jsx`** (`onScroll()` targets DOM elements, not a fixed canvas).

---

## 2. Files

### New
- `src/lib/network.js` — pure, React-free helpers + draw routine. Mirrors the `lib/motion.js` convention.
- `src/components/NeuralBackdrop.jsx` — the `<canvas>` + one `useEffect` (build graph, rAF loop, listeners, cleanup).
- `src/components/NeuralBackdrop.css` — fixed full-viewport, `pointer-events:none`, `z-index:0`.

### Edit
- `src/App.jsx` — render `<NeuralBackdrop />` as first child of `.layout`, guarded by `reduceMotion()`.
- `src/App.css` — `.layout` (and/or `.main`/`.sidebar`) get `position:relative; z-index:1` so content sits above the canvas.
- `docs/animation-plan.md` — add **§4.6 Neural network backdrop** cross-referencing this doc.
- `.wolf/anatomy.md` — add entries for the 3 new files.

---

## 3. `src/lib/network.js` — pure helpers

Exports (no React, no DOM mounting — just math + a draw function that takes a context):

```
COLORS = { line: "#211f1b", node: "#1f5fae" }

CONFIG = {
  baseCount: 50,          // node count at ~1440px width
  minCount: 22,           // floor for small screens
  maxDist: 150,           // px; edges only drawn between nodes closer than this
  driftSpeed: 0.12,       // px/frame baseline drift
  lineOpacity: 0.07,      // whisper
  nodeOpacity: 0.5,       // nodes a touch stronger than lines
  nodeRadius: 1.6,
  flowLerp: 0.08,         // smoothing for scroll-velocity → flowOffset
  proximityRadius: 140,   // cursor glow reach
  igniteRadius: 180,      // section-pulse reach (vertical band)
}

nodeCountFor(width)        -> scales baseCount by width, clamped to [minCount, baseCount]
buildNodes(count, w, h)    -> [{ x, y, vx, vy, baseR, pulse:0 }]   // vx/vy tiny random drift
stepNodes(nodes, w, h, dt) -> mutate positions, wrap at edges (toroidal)
drawNetwork(ctx, nodes, state) -> render edges + nodes for one frame
```

`state` passed to `drawNetwork` each frame:
`{ drawProgress, flowOffset, velocity, mouse:{x,y,active}, dpr }`

Drawing rules inside `drawNetwork`:
- **Edges:** for each node pair within `maxDist`, alpha = `lineOpacity * (1 - dist/maxDist) * drawProgress * (1 + velocityBoost)`. Apply `flowOffset` to y when sampling positions so the whole field shifts vertically.
- **Nodes:** filled arc; alpha = `nodeOpacity`; radius = `baseR + pulse`. Blue. Brighten if within `proximityRadius` of `mouse` (when `mouse.active`).
- **Cursor lines:** when `mouse.active`, draw faint lines from nodes within `proximityRadius` to the cursor.
- **Sparks (velocity intensity):** small bright dots interpolated along a few random edges, offset by a per-spark `t` that advances with `velocity`. Only spawn when `velocity` exceeds a threshold; fade out as it settles.

> Keep the O(n²) neighbor scan — at ≤50 nodes it's ≤~1250 pairs/frame, trivial. Add spatial bucketing
> only if `nodeCountFor` ever returns large counts on ultrawide screens.

---

## 4. `src/components/NeuralBackdrop.jsx` — wiring

```
export default function NeuralBackdrop() {
  if (reduceMotion()) return null;          // hard short-circuit: no canvas at all
  const canvasRef = useRef(null);

  useEffect(() => {
    // --- setup ---
    // 1. size canvas to window * dpr; ctx.scale(dpr, dpr). Re-run on resize (throttled).
    // 2. nodes = buildNodes(nodeCountFor(w), w, h)
    // 3. state = { drawProgress:0, flowOffset:0, velocity:0, mouse:{x,y,active:false}, dpr }

    // --- anime.js: edge draw-in on load ---
    // animate(state, { drawProgress:[0,1], duration: 1200, ease: "outExpo" })

    // --- scroll: velocity → eased flowOffset (manual rAF, like App.jsx progress rail) ---
    // on scroll: rawVelocity = scrollY - lastScrollY; targetFlow += rawVelocity * parallaxFactor
    // each frame: flowOffset += (targetFlow - flowOffset) * flowLerp;  velocity decays toward 0

    // --- mouse: proximity glow (skip if matchMedia("(pointer: coarse)")) ---
    // mousemove -> mouse = {x, y, active:true}; mouseleave -> active:false

    // --- IntersectionObserver: section ignition ---
    // observe ["about","experience","projects","education"] (existing section ids)
    // on enter -> anime.js pulse on nodes whose y is within igniteRadius of the section's screen band:
    //   animate(node, { pulse:[0, 3, 0], duration: 900, ease: "outQuad" }) staggered

    // --- render loop ---
    // rAF: if document.hidden -> skip; stepNodes(); drawNetwork(ctx, nodes, state)

    // --- cleanup ---
    // cancelAnimationFrame; remove scroll/mouse/resize/visibility listeners; IO.disconnect();
    //   anime.js scope.revert() if a createScope is used.
  }, []);

  return <canvas ref={canvasRef} className="neural-backdrop" aria-hidden="true" />;
}
```

Notes:
- Guard `reduceMotion()` **before** hooks is fine here because the component either always mounts the
  canvas branch or never does within a given session; if lint/Rules-of-Hooks complains, move the guard
  inside `useEffect` and render an empty `<canvas>` that the effect leaves untouched. (Prefer the early
  return; verify with `npm run lint`.)
- Wrap anime.js animations in `createScope({ root: canvasRef.current })` so StrictMode double-mount in
  dev auto-reverts — same pattern as `App.jsx`.
- Pause rAF on `visibilitychange` (tab hidden) to save battery.

---

## 5. `src/components/NeuralBackdrop.css`

```
.neural-backdrop {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;   /* never intercepts clicks/scroll */
  display: block;
}
```

In `App.css`, ensure content stacks above:
```
.layout { position: relative; z-index: 1; }   /* canvas is z-index:0 behind it */
```
(Background `#fcfbf9` stays on `body`; the canvas is transparent so cream shows through.)

---

## 6. `src/App.jsx` integration

- Import `NeuralBackdrop` and render it as the **first child** of `.layout`:
  ```
  <div className="layout" ref={layoutRef}>
    <NeuralBackdrop />
    <div className="progress-rail" ... />
    <Sidebar />
    <main className="main"> ... </main>
  </div>
  ```
- No other App logic changes — the backdrop is fully self-contained. The existing reveal/progress/nav
  code is untouched.

---

## 7. Accessibility & performance checklist

- [ ] `prefers-reduced-motion: reduce` → `NeuralBackdrop` renders nothing (verify in DevTools emulation).
- [ ] Canvas is `aria-hidden`, `pointer-events:none`, never traps focus or clicks.
- [ ] Content fully readable: line opacity ≤ ~7%; spot-check contrast over text columns.
- [ ] rAF pauses when tab hidden (`document.hidden`).
- [ ] All listeners `passive` where applicable; all removed on cleanup; IO disconnected.
- [ ] DPR-aware sizing; throttled resize rebuild.
- [ ] Cursor glow disabled on coarse/touch pointers.
- [ ] No measurable LCP regression; scroll stays 60fps (profile with ~50 nodes).
- [ ] `npm run lint` clean; `npm run build` succeeds.

---

## 8. Build order (execute top-down)

1. **`src/lib/network.js`** — nodes, drift/step, `drawNetwork` (edges + nodes only). Unit-mountable.
2. **`NeuralBackdrop.jsx` + `.css`** — mount canvas, DPR sizing, rAF loop calling step+draw. *Static drift only.*
3. **App integration** — render in `App.jsx`, add `z-index` in `App.css`. Confirm content sits on top and is readable.
4. **Scroll parallax** — velocity → eased `flowOffset`. Confirm down=flow down, up=flow up, with weight.
5. **Edge draw-in on load** — anime.js `drawProgress` 0→1.
6. **Section ignition pulse** — IntersectionObserver + anime.js node pulses.
7. **Cursor proximity glow** — mousemove, skip on touch.
8. **Scroll-velocity intensity** — line brighten/stretch + sparks at high velocity.
9. **A11y + perf pass** — run the §7 checklist; `npm run designqc` to eyeball "whisper" level; tune
   `CONFIG` (opacity/count/speed) until it reads as ambient texture.

> Ship after each step is verifiable on its own. Steps 5–8 are independent flourishes — cut or reorder
> any that don't earn their place once seen on the real page.

---

## 9. Tuning knobs (all in `CONFIG`, `src/lib/network.js`)

`baseCount`, `maxDist`, `lineOpacity`, `nodeOpacity`, `driftSpeed`, `flowLerp`, `proximityRadius`,
`igniteRadius`. Start at the values in §3; adjust **only** these during the QC pass — no logic changes
needed to dial intensity up/down.

---

## 10. Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Backdrop competes with text | Whisper defaults (7% lines); QC over each section; cut count/opacity in `CONFIG`. |
| Canvas covers/blocks content | `z-index:0` + `pointer-events:none`; `.layout` `z-index:1`. |
| Jank on scroll | Single rAF, transform-free canvas draw, ≤50 nodes, eased lerp self-throttles. |
| StrictMode double-mount in dev | `createScope().revert()` cleanup + full listener teardown in effect return. |
| Reduced-motion users see motion | Component returns `null` — nothing to disable downstream. |
| Battery drain on idle tab | Pause rAF on `document.hidden`. |
| Hooks-order lint on early return | Fall back to in-effect guard + inert canvas if `npm run lint` flags it. |
