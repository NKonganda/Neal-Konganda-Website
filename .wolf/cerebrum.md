# Cerebrum

Accumulated knowledge, preferences, and rules for the Neal Konganda Website project.

## User Preferences

_None yet._

## Key Learnings

- Stack: Vite + React (no TypeScript). Initialized 2026-06-25.
- All resume content lives in `src/data/resume.js` as named exports — edit there, not in components.
- Scaffolding Vite into a non-empty directory fails interactively; workaround: scaffold to `/tmp/`, then `cp -r /tmp/nk-website/. .`
- Google Docs-rendered PDFs use subsetted fonts; only Swift PDFKit (`swift - << 'EOF'` with Quartz import) reliably extracts text on macOS without extra installs.
- User does NOT want Awards or Activities sections on the site.
- User does NOT want a Skills section on the site.
- User does NOT want graduation years or GPA shown in the Education section.
- Design language (from Portfolio.dc.html): warm cream `#fcfbf9` bg, `#211f1b` text, `#1f5fae` blue accent, Newsreader serif for headings/name, Hanken Grotesk for body. Hatch pattern `repeating-linear-gradient(135deg, #e6e2da 0 Npx, #efece6 Npx 2Npx)` used as placeholder for photos/logos/figures.
- Scroll-reveal pattern: `useEffect` in App.jsx sets `opacity:0; transform:translateY(22px)` on `[data-reveal]` elements, then IntersectionObserver reveals them. 2500ms fallback timer shows all in case IO doesn't fire.
- Sidebar uses CSS `position: sticky; top: 40px` inside a flex row — works without JS.
- Nav dot animation: CSS `transition: gap` on the parent `<a>` + `transform: scale(1.8)` on the dot span on hover. Pure CSS via `:hover` selectors in Sidebar.css.

- Animation plan lives in `docs/animation-plan.md` (Anime.js v4). Key API for scroll-linked "follow the scroll" motion: pass `onScroll({ target, enter, leave, sync })` as an animation's `autoplay`. `sync: true` = 1:1 scrub bound to scroll; `sync: <number>` = eased/lagged scrub (use for spatial parallax/markers — the lag is what makes it feel like it "follows" you); `sync: 'play pause'` = method-based at section boundaries. Thresholds use `"<target-edge> <container-edge>"` (top/center/bottom/min/max, relative offsets ok); `debug:true` overlays trigger lines. Reduced-motion must disable all scrubbing.
- Animejs skill at `.agents/skills/animejs/` only has SKILL.md — the referenced `references/*.md` files do NOT exist; pull live docs via Context7 (`/juliangarnier/anime`) instead.
- Anime.js v4 `createDrawable(el)` wraps a stroked SVG element (`polyline`, `rect`, `circle`, `line`) and returns an animatable. Animate its `draw` property: `['0 0', '0 1']` draws from hidden to fully drawn. Use `createTimeline({ autoplay: onScroll(...) })` to trigger on scroll.
- For SVG draw animations: SVG IDs must be on the element to animate (e.g., `<polyline id="bw-wave">`). Group player dots in `<g id="fc26-dots">` and animate the group opacity instead of individual circles to preserve their per-element opacity attributes.
- `onScroll` used as `autoplay` with `once: true` works for one-shot reveals (section lines, data-reveal elements). Verified in browser.
- Progress rail: use `position: fixed; left: 0; width: 2px; height: 100vh` with a fill child at `transform-origin: top; transform: scaleY(pct)` updated on scroll.

## Do-Not-Repeat

- [2026-06-28] Do NOT use `onScroll({ target: document.documentElement, sync: true })` for a page scroll progress indicator — Anime.js v4 computes the document's viewport bounds incorrectly and jumps to 100% immediately. Use a manual `scroll` event listener with `requestAnimationFrame` instead: `fill.style.transform = scaleY(scrollY / (scrollHeight - innerHeight))`.
- [2026-06-28] Do NOT use `onScroll` standalone with callbacks (`onEnterForward`, `onLeaveBackward`) for driving non-animation side-effects (like moving a nav marker) — it's unreliable. Use a standard `IntersectionObserver` for section tracking and call `animate(marker, { translateY })` in the IO callback.
- [2026-06-28] SVG files in `public/` cannot be imported with `?raw` in Vite the same way as `src/` assets. Use `fetch(src).then(r => r.text())` to inline SVGs for animation, and render with `dangerouslySetInnerHTML`. Animate after state update in a second `useEffect` that depends on the fetched string.
- [2026-06-28] `createScope({ root })` scopes CSS selector queries inside the `add()` callback. Prefer `root.querySelectorAll(...)` when querying within the scope root to be explicit.

## Decision Log

- 2026-06-25: Chose Vite + React + plain CSS (no Tailwind/component library). Design polish deferred to a later session.
- 2026-06-25: Sections included: Hero, Education, Experience, Projects. Awards, Activities, and Skills explicitly excluded by user. Graduation years and GPA also excluded from Education.
- 2026-06-27: Implemented Portfolio.dc.html from claude.ai/design. Replaced top-nav + single-column layout with sticky sidebar + main two-column layout. Hero.jsx removed; replaced by Sidebar.jsx + About.jsx. Projects adapted to "publications" card style (thumbnail + description + tags). Experience adapted with company logo placeholder + indented roles. Skills adapted to 2-col category grid matching the design's "Services" section style.
