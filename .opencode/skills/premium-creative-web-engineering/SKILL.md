---
name: premium-creative-web-engineering
description: Route and execute premium creative web work across 3D, scroll, motion, and interaction. Use when building or reviewing immersive landing pages, product showcases, portfolios, WebGL/Three.js or React Three Fiber scenes, GSAP ScrollTrigger experiences, Lottie or Rive animations, Spline scenes, animated component libraries, or any brief asking for Awwwards-level polish, cinematic motion, interactive 3D, or anti-generic visual design. Covers tool selection, architecture, performance budgets, accessibility, responsive behavior, and pre-ship QA.
---

# Premium Creative Web Engineering

## Purpose

Build creative web experiences that are distinctive, fast, accessible, and maintainable. This skill is the router and quality bar for the specialized skills installed alongside it. Use the specialist for depth; use this skill for decisions, integration, and shipping discipline.

Premium does not mean "more effects." Premium means a clear visual idea, intentional typography and spacing, one or two memorable moments, and no jank, layout shift, inaccessible controls, or unnecessary dependencies.

## Operating principles

1. **Start with the content and the brand.** Decide what the page must communicate before choosing Three.js, GSAP, or a component library.
2. **Static-first, then enhance.** The page must remain readable and usable with JavaScript disabled or motion reduced.
3. **One primary moment.** Spend the visual budget on one hero experience and a few supporting transitions, not on every section.
4. **Use the smallest tool that works.** CSS before JavaScript, DOM before canvas, lightweight effects before a full 3D scene.
5. **Preserve the existing stack.** Read `AGENTS.md`, `package.json`, the lockfile, design tokens, and current changes before adding anything.
6. **Do not clone references.** Use references for structure, rhythm, and interaction logic; never copy branding, copy, protected assets, or code without permission.
7. **Evidence before claims.** Do not call something accessible, fast, production-ready, or "Awwwards-level" without test results, measurements, or screenshots.
8. **No surprise spend or external services.** Do not configure paid APIs, credit-consuming generation, hosted 3D services, or analytics without explicit authority.

## Skill routing

| Need | Use | Notes |
| --- | --- | --- |
| End-to-end 3D/premium site architecture | `3d-website-architect` | Process, structure, implementation guidance |
| Cinematic art direction, reference-led design, multi-pass polish | `ai-ui-ux-motion-engine` | Strong for product films, exploded views, scroll reveals |
| Complex scroll timelines, pinning, scrubbing, SVG/canvas sync | `gsap-scrolltrigger` | Deeper than the general `gsap-motion` skill |
| General GSAP tweens and timelines | `gsap-motion` | Existing global skill |
| React UI motion, layout animation, gestures, springs | `motion-dev` | Existing global Motion/Framer Motion skill |
| Timeline/SVG/line-drawing animation without React | `animejs-motion` | Existing global Anime.js skill |
| Smooth scrolling | `lenis-smooth-scroll` | Integrate carefully with ScrollTrigger; never fight native scroll |
| Scroll narrative and chapter design | `scroll-storytelling` | Existing global skill |
| Declarative 3D in React | `react-three-fiber` | R3F, Drei, hooks, instancing, Suspense |
| Custom WebGL, shaders, vanilla Three.js | `webgl-threejs` | Existing global Three.js skill |
| Designer-friendly no-code 3D scene | `spline-interactive` | Lazy-load exported scenes; always provide a fallback |
| After Effects vector animation | `lottie-animations` | Micro-interactions, icons, short loops |
| State-machine vector interaction | `rive-interactive` | Inputs, data binding, interactive characters/UI |
| Cheap decorative depth | `lightweight-3d-effects` | Zdog, Vanta, Vanilla-Tilt; avoid for core content |
| Prebuilt animated React components | `animated-component-libraries` | Magic UI/React Bits; audit bundle, a11y, and fit |
| Multi-library architecture | `web3d-integration-patterns` | Upstream references map to installed/global skills; see mapping below |
| Premium visual direction | `premium-web-design`, `apple-design`, `uix-ui-ux-pro-max`, `design-system` | Use for type, color, spacing, hierarchy, restraint |
| Next.js/React architecture | `nextjs-react-stack` | App Router, RSC, caching, testing |
| Browser QA | `anthropics-webapp-testing`, Playwright | Screenshots, console, interaction checks |
| SEO and performance hygiene | `seo-mastery` | Metadata, structured data, Core Web Vitals |

### Upstream reference mapping

`web3d-integration-patterns` mentions skill names from its original collection:

- `threejs-webgl` → use `webgl-threejs`
- `motion-framer` → use `motion-dev`
- `react-spring-physics` → use Motion springs in `motion-dev`; do not add React Spring unless the project already needs it

Do not edit the third-party skill to fix these names. Route through this table.

## Tool selection

### Use CSS only when

- The effect is a hover, focus, reveal, color shift, simple transform, or small entrance.
- `IntersectionObserver` plus CSS transitions is enough.
- The page already has a design system and the motion is supporting, not the idea.

### Use Motion when

- The app is React and needs layout animations, shared layout transitions, gestures, drag, or spring-based UI.
- You need `AnimatePresence` for route/modal transitions.
- You want declarative values tied to React state.

### Use GSAP + ScrollTrigger when

- The experience depends on scroll position, pinning, scrubbing, or long timelines.
- You need precise sequencing across DOM, SVG, canvas, and Three.js.
- You need `ScrollTrigger.refresh()` after fonts/images/layout changes.
- You can afford a dedicated motion layer and cleanup discipline.

### Use Three.js or R3F when

- The core idea needs real 3D: product inspection, camera moves, shaders, particles, spatial storytelling.
- A static image or video cannot communicate the interaction.
- You can budget for assets, GPU cost, loading, fallback, and QA.

Use R3F for React component architecture; use vanilla Three.js for non-React pages, maximum control, or a small isolated renderer.

### Use Spline when

- A designer can author the scene visually and the interaction is simple.
- The scene can be lazy-loaded and has a static fallback.
- Hosted runtime/privacy/licensing constraints are acceptable.

### Use Lottie when

- The animation is a short, timeline-based vector loop or micro-interaction authored in After Effects.
- The JSON is optimized and not interactive beyond play/pause/segment control.

### Use Rive when

- The animation needs state machines, inputs, data binding, or two-way interactivity.
- You need designer-authored logic without shipping a video.

### Use lightweight effects when

- The 3D is decorative: a pseudo-3D illustration, animated background, or tilt card.
- A full WebGL scene would be disproportionate.
- The effect can fail gracefully and does not carry content.

### Use animated component libraries when

- A proven component (marquee, bento grid, animated button, beam) saves meaningful time.
- You will audit dependencies, accessibility, responsiveness, and visual fit.
- The component does not dictate the whole design language.

## Intake

Before coding, establish:

- **Framework and rendering:** Next.js App Router, Pages Router, Astro, Vite, static HTML, Vue, Svelte. Note SSR/RSC/hydration constraints.
- **Existing dependencies:** Three, R3F, Drei, postprocessing, GSAP, Motion, Lenis, Lottie, Rive, Spline, Tailwind, shadcn. Reuse before adding.
- **Brand and content:** logo, type, palette, photography, product assets, copy, legal constraints, locale.
- **References:** what exactly is being referenced (layout, pacing, camera, typography, color, interaction), and what must not be copied.
- **Audience and device mix:** desktop-first showcase, mobile-heavy, low-end Android, conference demo, kiosk.
- **Success criteria:** one sentence for the emotional response and one measurable outcome.
- **Budgets:** performance, bundle, timeline, accessibility, browser support.
- **Constraints:** CMS, SEO, analytics, consent, hosting, paid services, asset licensing.

If the brief is vague, propose one clear direction and one restrained alternative. Do not ask a long questionnaire when a sensible default is available.

## Architecture

### Static-first composition

1. Build the semantic HTML and responsive layout without motion.
2. Establish type scale, color tokens, spacing, grid, radii, and section rhythm.
3. Add the primary interaction layer.
4. Add 3D or cinematic layers.
5. Add polish and QA.

### Isolation

- Keep 3D and browser-only animation in client components.
- Dynamically import heavy scenes with a meaningful skeleton and error boundary.
- In Next.js, use `next/dynamic` with `ssr: false` only for components that truly need the browser.
- Do not read `window`, `document`, or WebGL at module scope.
- Keep server-rendered content available even if the scene fails.

### State and lifecycle

- Use refs for per-frame values; avoid React state updates inside `useFrame` or scroll callbacks.
- Keep scene state local unless multiple sections must coordinate.
- Use a small store (for example Zustand) only when prop drilling or context becomes worse.
- Clean up: `gsap.context().revert()`, ScrollTrigger `kill()`, Lenis `destroy()`, Three.js `dispose()`, event listeners, observers, and animation frames.

### Scroll ownership

- Use one smooth-scroll layer at most.
- If using Lenis with ScrollTrigger, connect them with `lenis.on('scroll', ScrollTrigger.update)` and drive Lenis from the GSAP ticker.
- Refresh ScrollTrigger after fonts, images, route changes, and layout shifts.
- Never hijack scroll for a section that contains essential reading or forms.

### Asset pipeline

- Prefer glTF/GLB for 3D; compress with Draco or Meshopt.
- Use KTX2/Basis textures where supported; keep texture dimensions sane.
- Use WebP/AVIF for posters and images; provide dimensions to prevent layout shift.
- Preload only the hero asset; lazy-load below-the-fold scenes.
- Provide a poster image or static fallback for every heavy scene.

## Performance budgets

Set and record project-specific budgets. A reasonable starting point for a marketing page:

- LCP ≤ 2.5s on a mid-tier mobile profile.
- INP ≤ 200ms.
- CLS ≤ 0.1.
- 60fps desktop; at least 30fps on target mobile.
- Initial JS within the project's agreed budget; 3D in a separate lazy chunk.
- No long tasks during scroll; no layout reads in animation loops.

Techniques:

- Cap device pixel ratio at 1.5–2 for heavy scenes.
- Reduce or disable shadows, postprocessing, antialiasing, and high-DPR rendering on mobile.
- Use instancing, merged geometry, texture atlases, LODs, and frustum culling.
- Pause rendering when the canvas is offscreen or the tab is hidden.
- Avoid per-frame allocations; reuse vectors, matrices, and objects.
- Throttle pointer/raycast work; do not raycast every mouse move.
- Code-split scenes and third-party animation libraries.
- Test with CPU/network throttling, not only on a fast desktop.

## Accessibility

- Respect `prefers-reduced-motion`; remove parallax, pinning, autoplay, and large camera moves, not just shorten them.
- Provide a visible motion toggle when the experience is motion-heavy.
- Interactive canvases need keyboard-operable DOM controls and a clear focus order.
- Do not trap focus in a canvas or modal.
- Provide text alternatives for meaningful visuals; decorative visuals can be hidden from assistive tech.
- Maintain contrast, readable type, and 44px touch targets.
- Avoid flashing above 3Hz; provide pause/stop for autoplay longer than 5 seconds.
- Caption video; transcribe meaningful audio.
- Test at 200% zoom, keyboard-only, reduced motion, and with a screen reader for basic flow.

## Responsive and touch

- Design mobile first; use fluid type with `clamp()`, container queries, and safe-area insets.
- Simplify or replace 3D on small screens; do not ship the desktop scene unchanged.
- Do not rely on hover for essential information.
- Use pointer events; distinguish coarse and fine pointers.
- Do not block vertical scroll with drag gestures unless the interaction is explicit and escapable.
- Test iOS Safari, Android Chrome, and at least one low-end profile.

## Motion direction

- One idea per section; motion must clarify hierarchy, not decorate everything.
- UI transitions: roughly 150–300ms. Cinematic sequences: longer, but interruptible.
- Use stagger sparingly (roughly 30–80ms) and avoid revealing every element the same way.
- Prefer transform and opacity; avoid layout-triggering properties.
- Use easing with intent; linear is for scrubs and continuous loops, not entrances.
- Make interactions interruptible and reversible.
- Avoid bounce, overshoot, and blur on every element; use them as accents.
- Keep a motion token set: durations, easings, distances, and reduced-motion variants.

## 3D direction

- Define the scene's purpose, camera path, lighting, materials, and interaction before modeling details.
- Match units and scale; establish a consistent origin and camera framing.
- Use color management and tone mapping deliberately.
- Budget shadows, reflections, transparency, and postprocessing; they are expensive.
- Prefer baked lighting and simple materials when the art direction allows.
- Use `Suspense` and error boundaries in R3F; preload critical models.
- Use `frameloop="demand"` when the scene is static or interaction-driven.
- Implement resize handling and DPR caps.
- Provide a static fallback for WebGL failure, reduced motion, and low-power devices.
- Make interactive objects reachable through DOM controls, not only raycasting.

## QA gate

Run only scripts that exist and are understood. Check `package.json` before invoking commands.

- Build and typecheck.
- Lint.
- Playwright or the project's browser tests.
- Lighthouse mobile and desktop.
- axe or equivalent accessibility scan.
- Console: no errors, warnings, or hydration mismatches.
- Network: no unexpected large assets; scene chunk loads only when needed.
- Visual: desktop, tablet, mobile; compare against references.
- Motion: reduced motion, motion toggle, pause/stop.
- Keyboard: tab order, focus visibility, canvas controls, escape routes.
- Performance: scroll smoothness, long tasks, memory growth, WebGL context loss.
- Resilience: slow network, blocked scene, missing asset, 404, route change cleanup.
- Cleanup: no orphaned listeners, timers, animation frames, or canvas contexts.

Record exact commands and results. If a check cannot be run, say so and explain the remaining risk.

## Anti-patterns

- 3D with no narrative purpose.
- Generic gradient blobs, floating glass cards, and random particle fields used as a substitute for art direction.
- Scroll-jacking, hidden scrollbars, or pinned sections that trap mobile users.
- Autoplaying audio or video with no control.
- Hover-only interactions and invisible focus states.
- Low-contrast type over busy video or canvas.
- Layout shift from unsized media, fonts, or late-loading scenes.
- Heavy dependencies for effects CSS can do.
- Desktop-only scenes shipped to mobile.
- Uncompressed models and textures.
- Multiple animation systems fighting for the same property.
- Claiming accessibility, performance, or visual parity without evidence.
- Copying a reference site's branding, copy, or proprietary assets.

## Deliverable format

When reporting work, include:

1. **What changed** and why.
2. **Stack decisions** and rejected alternatives.
3. **Files and assets** added or modified.
4. **Performance and accessibility evidence** with commands and measurements.
5. **Known limitations** and fallbacks.
6. **Exact verification commands** and their results.
7. **Attribution** for third-party skills, code, fonts, models, and textures.

If blocked, state the precise missing asset, credential, decision, or environment constraint. Do not invent results.

## Definition of done

- The static page is coherent without JavaScript.
- The primary interaction has a clear purpose and a reduced-motion path.
- 3D and heavy animation are lazy-loaded with a fallback.
- Mobile has a deliberate simplified experience.
- Keyboard, focus, contrast, and touch targets are usable.
- Performance budgets are measured on a realistic profile.
- No console errors, hydration mismatches, or layout shifts.
- Third-party licenses and notices are preserved.
- The report includes evidence, limitations, and exact commands.
