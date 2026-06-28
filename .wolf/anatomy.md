# Project Anatomy

> One entry per file. Format: `path` — description (~N tokens)
> Update this file after every create/rename/delete.

## Root

- `CLAUDE.md` — Claude Code guidance, references OpenWolf protocol (~50 tokens)
- `public/profile.png` — Neal Konganda headshot photo, used in sidebar (~binary)
- `public/logos/qualcomm.svg` — Qualcomm monogram icon (blue Q on #3253DC) (~250 tokens)
- `public/logos/american-airlines.svg` — American Airlines monogram (AA on #0078D2) (~250 tokens)
- `public/logos/emory.svg` — Emory University monogram (E gold on #002855) (~250 tokens)
- `public/thumbs/brainwave.svg` — EEG waveform thumbnail for Brainwave Classifier project (~900 tokens)
- `public/thumbs/fc26.svg` — Soccer pitch thumbnail for FC26 Squad Optimizer project (~1600 tokens)
- `index.html` — Vite entry HTML; loads Newsreader + Hanken Grotesk from Google Fonts (~60 tokens)
- `package.json` — Vite + React project config, scripts: dev/build/preview (~80 tokens)
- `vite.config.js` — Vite config with React plugin (~20 tokens)
- `.wolf/OPENWOLF.md` — OpenWolf operating protocol for this session (~800 tokens)
- `.wolf/anatomy.md` — this file; index of all project files (~50 tokens)
- `.wolf/cerebrum.md` — accumulated preferences, learnings, and do-not-repeat rules (~150 tokens)
- `.wolf/memory.md` — append-only session log (~120 tokens)
- `.wolf/buglog.json` — structured bug/fix log (~10 tokens)

## docs/

- `docs/animation-plan.md` — plan for adding Anime.js v4 motion: principles, setup, src/lib/motion.js wrapper, createScope React pattern, per-component spec, §4.5 scroll-linked "follow the scroll" motion (onScroll sync modes, progress rail/active-nav follower/parallax), a11y/perf, 5-phase rollout (~2200 tokens)
- `docs/neural-backdrop-plan.md` — execution-ready plan for full-page Canvas 2D neural-network backdrop: locked decisions, file list (src/lib/network.js + NeuralBackdrop.jsx/.css), render/motion model (always-drift + scroll-velocity eased parallax), 4 flourishes (edge draw-in, cursor glow, section ignition, velocity sparks), a11y/perf checklist, 9-step build order, CONFIG tuning knobs (~2500 tokens)

## src/

- `src/lib/motion.js` — Anime.js v4 animation tokens (EASE, DUR), reduceMotion guard, reveal() scroll-trigger helper (~40 tokens)
- `src/lib/network.js` — Pure Canvas 2D network helpers: COLORS, CONFIG, nodeCountFor, buildNodes, stepNodes, drawNetwork (~150 tokens)
- `src/main.jsx` — React root mount; imports index.css and App.jsx (~30 tokens)
- `src/index.css` — global CSS reset; #fcfbf9 background, #211f1b text, riseIn keyframe (~40 tokens)
- `src/App.jsx` — root component; IntersectionObserver scroll-reveal effect + renders Sidebar + About/Experience/Projects/Education/Skills in two-column layout (~80 tokens)
- `src/App.css` — layout CSS: .layout (flex, max-width 1160px), .main, .section, .section-heading (Newsreader serif), .footer (~60 tokens)

## src/data/

- `src/data/resume.js` — ALL resume content as JS exports: profile, education (with years/gpa), experience[], projects[], skills{}. Single source of truth. (~220 tokens)

## src/components/

- `src/components/Sidebar.jsx` — sticky left sidebar: profile photo placeholder, name (Newsreader), title, social chips (Email/LinkedIn/GitHub), animated nav items with blue dots (~60 tokens)
- `src/components/Sidebar.css` — sidebar styles: sticky positioning, riseIn animation, chip hover (dark fill), nav-dot scale + gap transitions (~80 tokens)
- `src/components/About.jsx` — bio paragraph section with inline blue links; has data-reveal (~30 tokens)
- `src/components/About.css` — about prose styles: 16.5px, 1.72 line-height, blue link with border-bottom hover (~30 tokens)
- `src/components/Education.jsx` — school logo placeholder + school/degree/years/GPA; data-reveal on items (~30 tokens)
- `src/components/Education.css` — education layout: flex row with logo + content, monospace years (~30 tokens)
- `src/components/Experience.jsx` — maps experience[] with company logo placeholder, company/location header, nested roles with period + dash-bulleted items; data-reveal per company (~50 tokens)
- `src/components/Experience.css` — experience layout: logo + company header, indented roles, em-dash bullets (~60 tokens)
- `src/components/Projects.jsx` — maps projects[] as publications-style cards: 16:10 thumbnail placeholder + title/description/tags/GitHub link; data-reveal per item (~50 tokens)
- `src/components/Projects.css` — project grid: 150px thumbnail col + content col, blue monospace tags, hover effects (~60 tokens)
- `src/components/Skills.jsx` — maps skills{} as 2-col grid (category | items); data-reveal per row (~25 tokens)
- `src/components/ProjectThumb.jsx` — fetches SVG thumbs via fetch(), inlines HTML with dangerouslySetInnerHTML, runs createDrawable Anime.js animation on bw-wave/fc26 elements on scroll into view (~80 tokens)
- `src/components/Skills.css` — skills grid: 170px category col + items, responsive stack at 500px (~25 tokens)
- `src/components/NeuralBackdrop.jsx` — canvas backdrop component: DPR-aware sizing, debounced resize, scroll parallax (targetFlow/flowOffset/PARALLAX_FACTOR=0.4, passive listener, cleanup), rAF tick with flowLerp ease + 0.85 velocity decay, stepNodes+drawNetwork; reduceMotion guard inside useEffect (~110 tokens)
- `src/components/NeuralBackdrop.css` — fixed-position canvas styles: inset:0, 100vw/100vh, z-index:0, pointer-events:none (~15 tokens)
- `src/components/BraidBackdrop.jsx` — scroll-linked braid SVG: 3 sine-wave strands draw downward as user scrolls; continuous phase weave + 0.08 eased scroll follow; reduceMotion guard; cleanup on unmount (~90 tokens)
- `src/components/BraidBackdrop.css` — fixed SVG styles: left:clamp(6px,2.4vw,46px), 64px wide, 100vh, z-index:0, pointer-events:none (~15 tokens)
- `public/thumbs/justicai.svg` — scales of justice + circuit nodes thumbnail for Justice AI project (~300 tokens)
