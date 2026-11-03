# ImaginarsClub — The Institution Instrument Upgrade

**Status:** Approved for phased implementation  
**Date:** 2026-10-31  
**Owner:** ImaginarsClub studio  
**Scope:** Public marketing site visual system, homepage hero, evidence surfaces, and a new `/craft` workshop  
**Amends:** `docs/superpowers/specs/2026-10-22-institutional-futurism-redesign-design.md`  
**Approval:** User approved “Phased full upgrade” and “Approve — start Phase 0 (Recommended)” on 2026-10-31.  
**Phase 0:** Complete — baseline recorded in [`docs/PHASE_0_BASELINE.md`](../../PHASE_0_BASELINE.md).

---

## 1. Summary

The institutional repositioning is right. The visual system is competent, but it still reads as a well-built editorial site rather than an instrument an institution would trust to run on.

This addendum authorises a four-layer upgrade that keeps the existing institutional strategy and information architecture while adding a controlled signature experience:

1. **The Institution** — a site-wide refinement of the existing bone, ink and cobalt system.
2. **The Instrument** — one homepage hero: an exploded axonometric of Brand, Website, Admissions and Intelligence assembling as the visitor scrolls.
3. **The Evidence** — interactive proof modules on `/work`, `/platform`, `/pricing`, `/process` and `/trust`.
4. **The Workshop** — a new `/craft` page where all eleven installed creative skills are demonstrated in eleven self-contained stations.

This is not a generic 3D showcase. The Instrument exists to make one argument visible: ImaginarsClub builds four branches as one operating layer. The Workshop exists to prove range without putting that weight on the institutional sales path.

The site remains a Next.js static export. There is no backend, no real client dashboard and no invented proof.

---

## 2. Relationship to the 2026-10-22 spec

This addendum keeps the positioning, palette, typography, grid, route map, proof rules, pricing strategy and static-export constraint from the 2026-10-22 spec.

It explicitly supersedes these two constraints:

- “Do not make 3D a dependency of top-level marketing pages.”
- “No generic 3D/WebGL showcase.”

They are replaced by the narrower permissions below:

- **One** controlled 3D instrument is allowed on the homepage.
- **One** isolated workshop page (`/craft`) may contain heavier interactive demos.
- Everywhere else, the original anti-patterns still apply: no particle fields, no glassmorphism, no gradient text, no glowing orbs, no wireframe globes, no custom cursors, no autoplay audio/video, no scroll-jacking, no fake dashboards.

The old `docs/PHASE_0_AUDIT.md` and `docs/ARCHITECTURE_UPGRADE.md` are historical/aspirational, not authoritative. They claim R3F and a persistent canvas are missing or already mounted; the current package already includes R3F, Drei, postprocessing, GSAP, Lenis, Zustand and tunnel-rat, and no persistent canvas is mounted in `src/app`. Treat this addendum and measured baselines as the source of truth.

---

## 3. Approved experience model

### L1 — The Institution

Site-wide baseline. Keep the existing institutional system and make it more precise:

- Darken the low-contrast institutional inks and extend contrast coverage to all institutional text tokens.
- Refine type rhythm, hairline rules, spacing and section transitions.
- Standardise motion tokens and reduced-motion behaviour.
- Add restrained hover/focus details: rule movement, 2px lift, underline travel, arrow shift.
- Adapt selected animated components only where they preserve the institutional language.
- No glass, particles, gradient text, cursor followers or ambient loops.

### L2 — The Instrument

Homepage hero only.

- A four-plate exploded axonometric: **Brand**, **Website**, **Admissions**, **Intelligence**.
- The plates begin indexed and separated; as the visitor scrolls, they assemble into one accountable system.
- Labels and annotations are DOM text, not baked into the canvas.
- A static SVG axonometric with the same labels is the default and the fallback. The canvas crossfades in only after it is ready and only when the device and motion preference allow it.
- The hero headline remains the LCP element. The canvas must never delay text, CTAs or first input.
- Mobile, reduced motion and WebGL failure get the static diagram, not a reduced desktop scene.

### L3 — The Evidence

Interactive modules that make proof inspectable:

- `/work`: case-file record with verified results and a static evidence plate; optional small R3F/Lottie detail only if it earns its weight.
- `/platform`: the Institution Stack as an inspectable system map, not a card grid.
- `/pricing`: scope matrix that shows what changes across Starter, Growth, Pro and Institutional.
- `/process`: pinned or scrub-linked process timeline on desktop; static numbered sequence on mobile and reduced motion.
- `/trust`: an animated seal or ownership diagram using custom Lottie JSON, with a static SVG fallback.

### L4 — The Workshop

New `/craft` page. This is the only place where maximal motion and 3D ambition is allowed.

Eleven stations, one per installed skill:

| Station | Skill demonstrated | Interaction |
|---|---|---|
| 01 | `premium-creative-web-engineering` | The page’s routing, performance and QA checklist made visible |
| 02 | `3d-website-architect` | A small scene architecture diagram / build sequence |
| 03 | `ai-ui-ux-motion-engine` | A cinematic exploded-view study with scrub control |
| 04 | `react-three-fiber` | A live R3F material or geometry station |
| 05 | `gsap-scrolltrigger` | A pinned/scrubbed micro-timeline with a reset control |
| 06 | `web3d-integration-patterns` | DOM-to-canvas state sync demonstration |
| 07 | `lightweight-3d-effects` | Vanilla-Tilt / Zdog pseudo-3D card, no Vanta background |
| 08 | `lottie-animations` | Custom Lottie JSON micro-animation with play/pause |
| 09 | `rive-interactive` | State-machine interaction with explicit inputs |
| 10 | `spline-interactive` | Self-hosted Spline scene, click-to-load |
| 11 | `animated-component-libraries` | An adapted Magic UI / React Bits component, audited for fit |

Workshop rules:

- Every station has a static poster, title, short explanation and a clear “Run station” control.
- Rive, Spline, Lottie and R3F payloads load only after the station is activated, except the first station if it is already in view.
- No autoplay audio or video. No station traps scroll, focus or pointer input.
- Each station can be reset and can fail independently without breaking the page.
- `/craft` is linked from the footer and `/about`, not the primary institutional navigation. It is a proof-of-craft surface, not the main sales path.
- Add `/craft` to the sitemap and route tests.

---

## 4. Skill routing

Use `premium-creative-web-engineering` as the router and quality bar. Use the specialist skills for depth:

- `3d-website-architect` — scene structure, asset pipeline, 3D implementation order.
- `ai-ui-ux-motion-engine` — cinematic art direction and multi-pass polish for the Instrument and Workshop.
- `react-three-fiber` — R3F scene, Suspense, hooks, instancing and disposal.
- `gsap-scrolltrigger` — the single scroll timeline, pinning, scrubbing and cleanup.
- `web3d-integration-patterns` — DOM/canvas state synchronisation and multi-library architecture.
- `lightweight-3d-effects` — Zdog and Vanilla-Tilt only; do not add Vanta backgrounds.
- `lottie-animations` — custom JSON for the seal and micro-interactions.
- `rive-interactive` — state-machine demos in `/craft`.
- `spline-interactive` — self-hosted exported scenes in `/craft`.
- `animated-component-libraries` — adapted components only after bundle, accessibility and visual-fit review.

Global skills in this environment may supplement the eleven, but they do not replace them.

**Tooling note:** the project-local skills are instruction-only and live under `D:\goat\.opencode\skills\`. The native `skill` tool did not expose them in this session; read each `SKILL.md` directly and follow it. Do not silently substitute a different skill for a required one.

---

## 5. Motion system

The motion grammar is **Index → Assemble → Verify**.

- **Index:** labels, coordinates, rules and layers establish order.
- **Assemble:** the four plates and the page’s evidence move into alignment.
- **Verify:** a result, proof point or next action becomes legible.

Tokens:

- Entrances: `cubic-bezier(.16, 1, .3, 1)`.
- State changes: `cubic-bezier(.65, 0, .35, 1)`.
- Micro: 180ms.
- UI: 320ms.
- Reveals: 600ms.
- Cinematic: 900ms maximum for non-scroll sequences.
- Hover: 2px lift, rule travel, arrow shift. No scale-pop.
- Magnetic behaviour: primary CTA only, subtle, disabled on touch and reduced motion.
- Stagger: 30–80ms, used sparingly.
- No bounce, elastic, overshoot or blur on every element.

Scroll ownership:

- One smooth-scroll layer at most. Use Lenis only on fine-pointer devices without reduced motion.
- Connect Lenis to ScrollTrigger with `lenis.on('scroll', ScrollTrigger.update)` and the GSAP ticker.
- Use `gsap.context()` and revert on cleanup.
- Refresh ScrollTrigger after fonts, images and layout changes.
- Never pin essential reading, forms or the only copy of a CTA.

Reduced motion:

- No canvas, no pin, no scrub, no parallax, no count-up.
- All content visible in its final state.
- The static SVG diagram replaces the Instrument.
- Lottie/Rive/Spline stations show their poster and a “Play once” control rather than autoplaying.

---

## 6. Page scope

### Global shell

- Keep `SiteHeader`, `Footer`, `MobileCtaBar`, command palette and existing route map.
- Refine tokens, type, rules, buttons, forms and focus states.
- Do not add a new primary navigation item for `/craft`.

### Homepage

- Keep the current five proof beats and conversion structure.
- Replace only the hero visual layer with the Instrument; keep the headline, lede, verified proof and CTAs.
- Keep the eight operating layers list, but align its labels and numbering with the Instrument.
- No second 3D scene on the homepage. If the hero canvas fails, the page still reads as complete.

### Evidence routes

- `/work`: case-file evidence record, verified results, blueprint links, no invented metrics.
- `/platform`: system map and layer detail.
- `/pricing`: scope matrix and fixed-scope terms.
- `/process`: method phases with a static mobile sequence.
- `/trust`: ownership, standards, security and handover, with the Lottie seal as an accent.

### `/craft`

- New route with eleven stations.
- Static poster for every station; click-to-load for heavy runtimes.
- No backend, uploads, accounts or analytics beyond the existing site policy.
- Self-host all Rive, Spline and Lottie assets under `public/craft/`.
- If an authored asset is not available, ship the poster and a clearly labelled “asset pending” state; do not fake the demo.

---

## 7. Technical architecture

### New structure

```text
src/
├── components/
│   ├── instrument/
│   │   ├── instrument-hero.tsx        # client hero wrapper, dynamic scene
│   │   ├── instrument-diagram.tsx     # static SVG fallback and default
│   │   ├── instrument-scene.tsx       # R3F scene
│   │   └── instrument-labels.tsx      # DOM annotations
│   ├── craft/
│   │   ├── craft-lab.tsx              # client orchestrator
│   │   ├── craft-station.tsx          # frame, poster, run/reset controls
│   │   └── stations/                  # one file per station
│   └── evidence/
│       └── ...                        # L3 modules as needed
├── lib/
│   └── motion/
│       ├── tokens.ts                  # durations, easings, distances
│       ├── scroll.ts                  # single Lenis + ScrollTrigger owner
│       └── reduced-motion.ts          # matchMedia helpers
└── app/(site)/craft/page.tsx          # new route
```

### Reuse and deletion

- Reuse `src/components/experience/kit/tier.ts` for quality tiers.
- Do not mount `ExperienceLayer`, `SceneCanvas` or `PersistentCanvas` as a site-wide background.
- Do not revive all eighteen dormant scenes.
- After L2 ships, audit unused experience/canvas code and remove it only when no route imports it. Do not remove dependencies until the last import is gone.
- Keep `MotionProvider` only if it earns its bundle cost; otherwise use CSS + IntersectionObserver reveals.

### Dependencies

Add only when the matching station is implemented:

- `@rive-app/react-canvas`
- `@splinetool/react-spline`
- `lottie-react` or an equivalent lightweight Lottie renderer
- `zdog`
- `vanilla-tilt`

Do not add Vanta, Anime.js, React Spring, a hosted Spline runtime, or a paid 3D service.

### Rendering rules

- Keep 3D and browser-only animation in client components.
- Use `next/dynamic` with `ssr: false` only for components that genuinely need the browser.
- Do not read `window`, `document` or WebGL at module scope.
- Keep server-rendered hero copy, proof and CTAs available even if the scene fails.
- Use `frameloop="demand"` or an in-view 30fps cap; do not run an always-on 60fps canvas.
- Pause rendering when offscreen or the tab is hidden.
- Cap DPR at 1.5 for the Instrument and 2 for lightweight stations.
- Dispose geometries, materials, textures, render targets and event listeners.
- Handle context loss and render a static fallback.
- No bloom, depth-of-field, heavy shadows or postprocessing on the Instrument.
- Use simple materials and baked-looking lighting; no particle fields.

### Asset pipeline

- Prefer SVG and CSS for diagrams; use GLB/GLTF only when real 3D is required.
- Keep the Instrument procedural or extremely small; no large model download before LCP.
- Self-host all `.riv`, `.splinecode`, Lottie JSON and poster images.
- Optimise Lottie JSON, strip unused assets and provide dimensions.
- Provide a poster or static SVG for every heavy station.
- Preload only the LCP font/headline asset; lazy-load the rest.

### Scroll and state

- One Lenis/ScrollTrigger owner in `src/lib/motion/scroll.ts`.
- Use refs for per-frame values; do not set React state inside scroll or frame callbacks.
- Use Zustand only for genuinely shared scene state; keep local state local.
- Clean up every GSAP context, ScrollTrigger, Lenis instance, observer, timer and animation frame.

### Static export and redirects

- Preserve `output: 'export'` and `trailingSlash: true`.
- `redirects` and `headers` in `next.config.ts` do not work with static export. Resolve the 16 legacy redirects at the host level (for example `vercel.json`) or remove the dead config and document the loss. Do not claim they are active until tested.
- The custom `Cache-Control` header for `/_next/static/(.*)` is a host-level concern; move or remove it.

---

## 8. Accessibility

Target: Lighthouse Accessibility 100 on the homepage and all L3/L4 routes.

Baseline defects to fix in Phase 1:

- `--ink-4` (`#8c8a7e`) on bone is 2.99:1; it fails for all text, including 8–11px labels.
- `--ink-3` (`#66665c`) on `--bone-2` (`#e7e1d4`) is 4.45:1; just below 4.5:1.
- One `<dl class="evidence-results">` contains `div > p` direct children; use valid `dt`/`dd` groups.
- Extend `scripts/contrast-ci.mjs` to cover institutional text tokens on bone, bone-2, dark and accent surfaces, not only the legacy semantic tokens.

Rules:

- All text ≥4.5:1; large text ≥3:1; interactive boundaries ≥3:1.
- Do not use low-contrast ink for meaningful labels. Reserve it for non-text rules or decoration.
- Canvas is `aria-hidden`; all annotations and meaning exist in DOM text.
- Interactive canvases need DOM controls, keyboard operation and a clear focus order.
- Maintain 44px touch targets.
- Test at 200% zoom, keyboard-only, reduced motion and with a basic screen-reader flow.
- No flashing above 3Hz. Any autoplay longer than 5 seconds needs pause/stop.

---

## 9. Performance budgets and baseline

Recorded in [`docs/PHASE_0_BASELINE.md`](../../PHASE_0_BASELINE.md). Lighthouse was fetched on 2026-10-30T19:34:49Z (mobile) and 2026-10-30T19:36:22Z (desktop) against `https://goat-wheat.vercel.app`:

| Check | Mobile | Desktop |
|---|---|---|
| Lighthouse Performance | 85 | 100 |
| Lighthouse Accessibility | 94 | 94 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |
| LCP | 1.4s | 0.4s |
| CLS | 0 | 0 |
| TBT | 580ms | 40ms |
| Speed Index | 1.7s | 0.7s |
| Main-thread work | 3.1s | 0.7s |
| Unused JS | ~70 KiB | Not flagged |
| Total transfer | 452 KiB | 474 KiB |
| Forced reflow | 285.8ms | 222.5ms |

Build/test baseline:

- `pnpm run build`: 60/60 static pages, TypeScript clean; `out/` is 496 files / 14,748,025 bytes (54 HTML files).
- `pnpm run typecheck`: clean.
- `pnpm test`: 67/67 tests across 7 files; contrast CI 52 pairings passed (26 per mode); token lint clean.
- `pnpm run lint`: clean after adding `.opencode/**`, `scripts/**`, and `glsl-loader.mjs` to `eslint.config.mjs` globalIgnores.
- `pnpm run test:e2e`: 10/10 passing in Chromium after the Phase 0 harness; run `pnpm run build` first.
- Build warnings: `redirects` and `headers` are not applied with `output: 'export'`; custom Cache-Control header warning. `vercel.json` carries host-level headers and redirects, but their live status codes are untested.

Targets after the upgrade:

- Mobile Lighthouse Performance ≥90; desktop ≥95.
- Mobile LCP ≤2.5s, CLS ≤0.05, INP ≤200ms, TBT ≤300ms.
- No long task over 200ms during scroll on a mid-tier mobile profile.
- Instrument canvas chunk ≤400KB gzip and never blocks LCP.
- `/craft` initial load does not include Rive/Spline/Lottie/3D station code until needed.
- Desktop 60fps; mobile at least 30fps in active stations.
- No console errors, hydration mismatches or WebGL context leaks.

Baseline artifacts:

- `baseline/home-1440.png`, `home-768.png`, `home-390.png`, `home-1440-viewport.png`, `home-390-viewport.png`, and `baseline-work-1440.png` (repository root).
- `baseline/lighthouse-mobile.json`, `baseline/lighthouse-desktop.json`.
- Treat these as local evidence, not production assets; `baseline/`, `playwright-report/`, `test-results/`, and `baseline-work-1440.png` are git-ignored.

---

## 10. Content and proof rules

- Keep the one verified case study: PRV Financial Services, live since April 2025.
- Do not invent clients, logos, testimonials, rankings, awards or outcome metrics.
- Label reference architectures and illustrative tools clearly.
- The Instrument is a diagram of the offer, not a dashboard or client system.
- The Workshop demonstrates craft; it is not proof of client work.
- Counters only for real, sourced numbers.
- No stock education photography.
- Maintain the existing pricing and package SKUs unless separately approved.

---

## 11. Routes and SEO

- Add `/craft`; include it in `src/app/sitemap.ts` and the route/content tests.
- Keep existing service and insight URLs.
- Preserve `/rss.xml`, metadata, canonical strategy and structured data.
- Update the design-system route only if tokens or motion primitives change.
- Resolve the legacy redirect delivery before production. A static export requires host-level redirects; test the actual status codes, not just the map.
- Do not change the production domain. The current live target is `https://goat-wheat.vercel.app`.

---

## 12. QA and evidence

Run only scripts that exist and are understood.

Required checks:

```text
pnpm run typecheck
pnpm run lint
pnpm test
pnpm run build
pnpm run test:e2e
```

`pnpm run test:e2e` runs against the static `out/` export through `scripts/serve-out.mjs`. Run `pnpm run build` first when site code changes. The current harness is `playwright.config.ts` plus `e2e/smoke.spec.ts`; Phase 0 result is 10/10 passing in Chromium.

Plus:

- Lighthouse mobile and desktop on `/`, `/work`, `/pricing`, `/process`, `/trust`, `/craft`.
- axe scan on the same routes.
- Playwright screenshots at 390, 768 and 1440 for `/`, `/work`, `/craft`.
- Keyboard-only pass: header, command palette, Instrument controls (if any), every Workshop station.
- Reduced-motion pass: no canvas, no pin, no scrub, all content visible.
- Slow-network and blocked-WebGL pass.
- Console and hydration check.
- Bundle report for the Instrument and each Workshop station.
- Memory/context check after route changes and station resets.
- Redirect status-code check at the host level.

Record exact commands, scores, sizes and limitations. Do not call the work accessible, fast or production-ready without evidence.

---

## 13. Phases

### Phase 0 — Baseline and spec

- Measure build, tests, lint, typecheck.
- Capture Lighthouse and screenshots.
- Write this addendum.
- Fix stale or contradictory audit documentation.
- Add a working Playwright static-export harness.
- Status: **complete** — baseline recorded in [`docs/PHASE_0_BASELINE.md`](../../PHASE_0_BASELINE.md); 10/10 E2E smoke tests passing.

### Phase 1 — L1 foundation and L2 Instrument

- Fix contrast tokens, invalid `<dl>`, lint ignores and redirect/header configuration.
- Add motion tokens and the single scroll owner.
- Build the static Instrument diagram first.
- Add the R3F Instrument behind a dynamic import, in-view cap and static fallback.
- Validate LCP, CLS, TBT and reduced motion.
- Do not start L3 or L4 until L2 is stable.

### Phase 2 — L3 Evidence

- Upgrade `/work`, `/platform`, `/pricing`, `/process`, `/trust`.
- Add the Lottie seal with a static fallback.
- Keep each module independently removable.

### Phase 3 — L4 Workshop

- Add `/craft` and the eleven stations.
- Add Rive/Spline/Lottie assets only when licensed and self-hosted.
- Lazy-load every heavy station; click-to-load Rive and Spline.
- Add sitemap and route tests.

### Phase 4 — QA and preview

- Full Lighthouse/axe/Playwright pass.
- Bundle, memory and context-loss audit.
- Verify redirects and headers at the host.
- Deploy a preview only to the approved Vercel project or here.now.

### Phase 5 — Production

- Review the preview against this spec.
- Deploy to `goat-wheat.vercel.app` and/or here.now.
- Do not touch `imaginarsclubservices.com` or its Vercel/DNS aliases without explicit permission.

---

## 14. Risks and dependencies

- **Rive/Spline assets:** no authored brand assets exist yet. Use licensed, self-hosted demo assets in `/craft` with a one-file swap path. Do not load hosted runtimes or fake a demo. Main-site use waits for brand-ready assets.
- **Mobile main-thread cost:** the current homepage already has 580ms TBT. The Instrument must not add to the initial critical path. Defer it, cap it, and measure.
- **Static export redirects:** host-level configuration is required. Do not assume `next.config.ts` redirects work.
- **Dirty worktree:** the repository has 202 changed/untracked entries. Stage only intended files; do not revert unrelated work.
- **Dormant code:** the experience/canvas systems are large and mostly unused. Do not mistake their existence for a working architecture.
- **Third-party skill assets:** installed starter assets trigger lint warnings. Ignore the skills directory for app lint; do not edit third-party assets.
- **Domain:** the `.com` is a separate live project. No aliases, DNS or production changes without explicit approval.

---

## 15. Acceptance criteria

### Visual

- The homepage reads as one institutional system, not a collection of sections.
- The Instrument has a clear four-plate narrative and a static fallback that is good enough to ship alone.
- No glass, particles, gradient text, custom cursor or generic 3D showcase outside `/craft`.
- `/craft` demonstrates all eleven skills without dictating the main site’s design language.

### Functional

- Static HTML contains the headline, lede, proof and CTAs without JavaScript.
- WebGL failure, blocked assets and reduced motion leave a complete page.
- Every Workshop station has run, reset and failure states.
- `/craft` is in the sitemap and route tests.

### Accessibility

- Lighthouse Accessibility 100 on `/` and `/craft`; no contrast or definition-list failures.
- Keyboard-only operation for all controls.
- Reduced motion shows final states and no canvas/pin/scrub.
- Canvas is hidden from assistive tech; annotations are DOM text.

### Performance

- Mobile Lighthouse Performance ≥90; desktop ≥95.
- LCP ≤2.5s, CLS ≤0.05, INP ≤200ms, TBT ≤300ms on the mobile profile.
- Instrument chunk ≤400KB gzip; heavy Workshop runtimes load only on demand.
- No console errors, hydration mismatches or context leaks.

### Process

- `typecheck`, `lint`, `test`, `build` and `test:e2e` pass.
- Redirect/header behaviour is verified at the host.
- Deployment only to the approved targets.
- The final report includes commands, measurements, limitations and attribution.

---

## 16. Out of scope and guardrails

- No backend, API routes, database, authentication or client portal.
- No CMS.
- No full rebrand of the legal entity.
- No domain migration.
- No invented proof.
- No paid services or hosted 3D runtimes without explicit authority.
- No commits, pushes or production deploys unless the user asks.
- No changes to `imaginarsclubservices.com` without explicit permission.

---

## 17. Approval record

- 2026-10-31 — User approved the phased full upgrade.
- 2026-10-31 — User approved implementing all four ambition levels through the progressive-layer architecture.
- 2026-10-31 — User approved starting Phase 0 (baseline audit and spec addendum).
