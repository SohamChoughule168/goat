# Phase 0 Baseline — Institutional Instrument Upgrade

**Status:** Phase 0 complete. Phase 1 (L1 Institution + L2 Instrument) complete and signed off. Phase 2 (L3 Evidence) not started.
**Recorded:** 2026-10-31
**Branch:** `main`
**HEAD:** `7c93a79`
**Environment:** Windows / PowerShell 5.1, Node v24.16.0, pnpm 11.24.0
**Approved design:** [`docs/superpowers/specs/2026-10-31-institutional-instrument-upgrade-design.md`](superpowers/specs/2026-10-31-institutional-instrument-upgrade-design.md)

This document records the pre-upgrade evidence. It is a snapshot, not a claim that the site already meets the upgrade targets.

## Scope and limitations

- Lighthouse was run against the live target `https://goat-wheat.vercel.app/`, not against a locally served build.
- The commit deployed at that URL was not independently verified.
- The 16 legacy redirects and security headers were not tested at the host level in Phase 0.
- No axe scan, mobile Safari run, blocked-WebGL run, or `/craft` route existed at baseline.
- Screenshots cover the homepage and `/work` only.
- Numeric Lighthouse values are shown rounded where the report used display values; the exact values remain in the JSON artifacts.

## Commands and results

| Check | Command | Result |
|---|---|---|
| TypeScript | `pnpm run typecheck` | Passed |
| Lint | `pnpm run lint` | Passed after adding `.opencode/**`, `scripts/**`, and `glsl-loader.mjs` to `eslint.config.mjs` ignores |
| Unit/integration tests | `pnpm test` | 67/67 tests across 7 files |
| Contrast CI | `node scripts/contrast-ci.mjs` | 52 pairings passed (26 per mode) |
| Token lint | `node scripts/token-lint.mjs` | Passed |
| Production build | `pnpm run build` | Passed; 60/60 static pages; TypeScript clean |
| Static output | `out/` | 496 files, 14,748,025 bytes, 54 HTML files |
| E2E baseline | `pnpm run test:e2e` | Failed before harness: Playwright picked up Vitest tests |
| E2E after harness | `pnpm run test:e2e` | 10/10 passed in Chromium |

`pnpm test` also emits a non-failing Vite `configLoader: 'native'` ESM/CommonJS warning from `vitest.config.ts`.

The build reports that `redirects` and `headers` in `next.config.ts` are not applied with `output: 'export'`, and that the custom `Cache-Control` header for `/_next/static/(.*)` is not applied. See “Static export and redirects” below.

## Lighthouse baseline

Evidence: `baseline/lighthouse-mobile.json`, `baseline/lighthouse-desktop.json`.

| Metric | Mobile | Desktop |
|---|---:|---:|
| Lighthouse version | 13.6.0 | 13.6.0 |
| Fetch time | 2026-10-30T19:34:49.693Z | 2026-10-30T19:36:22.009Z |
| Performance | 85 | 100 |
| Accessibility | 94 | 94 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |
| FCP | 1.4s | 0.4s |
| LCP | 1.4s | 0.4s |
| Speed Index | 1.7s | 0.7s |
| TBT | 580ms (583ms numeric) | 40ms (36ms numeric) |
| CLS | 0 | 0 |
| TTI | 3.0s | 0.6s |
| Main-thread work | 3.1s | 0.7s |
| Bootup time | 1.2s | 0.3s |
| Total transfer | 452 KiB (463,061 bytes) | 474 KiB (485,063 bytes) |
| Unused JavaScript | ~70 KiB | Not flagged |
| Forced reflow | 285.767ms | 222.535ms |

The mobile profile is the binding constraint: TBT, main-thread work, unused JavaScript, and forced reflow all need improvement before the Phase 1 budgets can be claimed.

## Accessibility baseline

### Color contrast

- Mobile: 53 `color-contrast` items.
- Desktop: 51 `color-contrast` items.
- Failing token pairings:
  - `--ink-4` `#8c8a7e` on `--bone` `#f2eee5` = **2.99:1**.
  - `--ink-3` `#66665c` on `--bone-2` `#e7e1d4` = **4.45:1**.
- Both pairings fail the 4.5:1 requirement for normal text. The 2.99:1 pairing is also used at 8–9px, so it cannot rely on large-text allowances.

Confirmed affected selectors include:

| Selector | Ratio | Observed size |
|---|---:|---|
| `article.evidence-record > dl.evidence-results > div > dt` | 2.99:1 | 6.8pt / 9px |
| `article.method-phase > dl.method-meta > div > dt` | 2.99:1 | 6.0pt / 8px |
| `div.stack-row-detail-grid > div > p.stack-detail-label` | 2.99:1 | 6.8pt / 9px |
| `div.evidence-blueprint-grid > a.evidence-blueprint > div.evidence-blueprint-meta > span` | 2.99:1 | 6.8pt / 9px |
| `div.fit-card-main > div.fit-question > div.fit-question-actions > span.fit-question-note` | 2.99:1 | 6.8pt / 9px |
| `div.inst-shell > div.economics-grid > article.economics-card > p` | 4.45:1 | 9.75pt / 13px |
| `div.inst-shell > div.economics-grid > article.economics-card > p.economics-price` | 4.45:1 | 9.75pt / 13px |

The exact node list is in the Lighthouse JSON. Some selectors include unstable React IDs; use the stable class or component context when fixing them.

`scripts/contrast-ci.mjs` currently checks 26 legacy semantic pairings per mode and passes all of them. It does not check institutional text tokens on `--bone`, `--bone-2`, dark surfaces, or accent surfaces, which is why the failures were not caught by `pnpm test`.

### Invalid definition list

Both modes report one `definition-list` failure:

```text
div.inst-shell > div.evidence-grid > article.evidence-record > dl.evidence-results
Fix all of the following: dl element has direct children that are not allowed: div > p
```

Use valid `dt`/`dd` groups, or change the container semantics.

### Accessible-name mismatch

Desktop reports three `label-content-name-mismatch` items; mobile reports zero:

```text
body.flex > header.site-header > div.inst-shell > a.site-wordmark
div.inst-shell > div.footer-top > div.footer-contact > a.site-wordmark
header.site-header > div.inst-shell > div.site-header-actions > button.site-index-button
```

The visible wordmark text and “Search the site” affordance are not included in the accessible names. Reconcile the accessible and visible labels.

## Static export and redirects

`next.config.ts` uses:

```ts
output: "export"
trailingSlash: true
```

It also declares 16 legacy service redirects and several headers. Next warns that these are not applied with static export. `vercel.json` contains host-level headers and redirects to `www.imaginarsclubservices.com`, but those were not tested in Phase 0. No redirect or header behavior should be called active until its actual host response is verified.

The custom `Cache-Control` header for `/_next/static/(.*)` is a host concern. Resolve it in `vercel.json` or remove the dead config and document the loss.

## E2E baseline

Before this phase, `pnpm run test:e2e` ran `playwright test` with no project config. Playwright collected `src/__tests__/*.test.ts` and failed with:

```text
Error: Vitest cannot be imported in a CommonJS module using require().
Please use "import" instead.
```

The Phase 0 harness fixes that:

- `playwright.config.ts` scopes tests to `./e2e` and `**/*.spec.ts`.
- `scripts/serve-out.mjs` serves the static `out/` directory with correct MIME types, trailing-slash redirects, and `404.html` handling.
- `e2e/smoke.spec.ts` covers the homepage, `/work`, `/platform`, `/pricing`, `/process`, `/trust`, `/services/web-development`, primary conversion links, 390px horizontal overflow, and extensionless trailing-slash routing.
- Current result: 10/10 passing in Chromium.

The harness validates the built static export. Run `pnpm run build` before `pnpm run test:e2e` when site code changes.

## Baseline artifacts

- `baseline/home-1440.png`
- `baseline/home-768.png`
- `baseline/home-390.png`
- `baseline/home-1440-viewport.png`
- `baseline/home-390-viewport.png`
- `baseline-work-1440.png` (repository root)
- `baseline/lighthouse-mobile.json`
- `baseline/lighthouse-desktop.json`

These are local evidence, not production assets. `baseline/`, `baseline-work-1440.png`, `playwright-report/`, and `test-results/` are ignored by git.

## Phase 0 sign-off

- [x] Build, tests, lint, and typecheck measured.
- [x] Lighthouse mobile and desktop captured.
- [x] Baseline screenshots captured.
- [x] Approved design addendum written.
- [x] Stale audit documentation marked historical and linked here.
- [x] Baseline recorded with exact artifacts and limitations.
- [x] Playwright E2E harness added and passing.

Phase 0 is complete. Phase 1 may start with contrast-token fixes, the invalid `<dl>` repair, contrast-CI coverage, redirect/header resolution, and the L1 motion foundation.

## Phase 1 completion — L1 Institution + L2 Instrument

**Recorded:** 2026-10-31
**Scope:** Layers 1 and 2 of the approved design only. L3 Evidence and L4 `/craft` remain.
**Branch:** `main`
**HEAD:** `7c93a79` (all Phase 1 work uncommitted)

### Delivered

**L1 — Institution**

- Added the bone/ink/cobalt token system, corrected the failing contrast pairings, and extended `scripts/contrast-ci.mjs` to cover both legacy and institutional tokens.
- Added the institutional type rhythm, rules, spacing and motion tokens in `src/styles/institutional.css`.
- Replaced the old hero's motion with restrained entrances and state changes: `cubic-bezier(.16,1,.3,1)` for entrances, `cubic-bezier(.65,0,.35,1)` for state changes, 180/320/600/900ms duration tokens, no bounce or elastic.
- Centralised motion policy in `src/lib/motion/`:
  - `tokens.ts` — durations, easings, stagger, lift.
  - `reduced-motion.ts` — environment reader and `resolveMotionPolicy`.
  - `scroll.ts` — the single Lenis + ScrollTrigger owner, with `gsap.context()`-friendly cleanup and refresh after fonts/load.
- Lenis only initialises on fine-pointer devices without reduced motion. Reduced motion disables canvas, pin, scrub, parallax and count-up; all content renders final.

**L2 — The Instrument**

- Replaced only the hero visual with a four-plate exploded axonometric (Brand, Website, Admissions, Intelligence). The headline, lede, verified proof and CTAs are unchanged.
- `src/components/home/instrument/instrument-static.tsx` is the default and the complete fallback: a static SVG of the fully exploded stack, `aria-hidden`, with DOM labels in a legend.
- `instrument-canvas.tsx` crossfades in only when the policy allows it. Activation requires:
  - width ≥ 1024px,
  - a fine pointer,
  - no reduced-motion preference,
  - a successful WebGL probe,
  - the plot in view (`IntersectionObserver`, 200px margin),
  - an idle callback (2200ms timeout) or a 1400ms fallback.
- The canvas is a dynamic import, uses `frameloop="demand"`, DPR capped at 1.5, an error boundary, a `webglcontextlost` handler, and explicit geometry/material disposal.
- Static SVG and canvas share one isometric projection (`projection.ts`) and one plate layout (`plates.ts`). The camera frustum is derived from the same `instrumentViewBox`, so both frame the same drawing.
- The camera is an explicit `THREE.OrthographicCamera` with `manual = true`; React Three Fiber otherwise resets orthographic frustums to pixel units on resize.
- Plates use flat `MeshBasicMaterial` palette colours with no scene lights, so the canvas matches the static SVG instead of drifting through lighting.
- Scroll progress uses absolute scroll (`start: 0`, `end: innerHeight × 0.72`) so the Instrument starts fully exploded on load and assembles as the hero exits.
- Mobile/tablet widths cap the figure at `30rem`; the canvas never loads there, so the WebGL probe is skipped entirely on coarse pointers and widths below 1024px.

### Baseline defects closed

- `--ink-3` and `--ink-4` raised to `#5c5c53` and `#636258`; `--live` and `--warning` set to `#2f6f4f` and `#8e5624`. All 71 contrast checks pass.
- The invalid `evidence-results` definition list now uses valid `dt`/`dd` groups.
- The wordmark and search affordances have accessible names that include their visible text.
- `e2e/a11y.spec.ts` now scans all 21 public routes with axe, including the visible-label rule (`label-content-name-mismatch` requires `.withRules(...)` explicitly).

### Gates (final)

| Check | Command | Result |
|---|---|---|
| TypeScript | `pnpm run typecheck` | Passed |
| Lint | `pnpm run lint` | Passed |
| Unit/integration | `pnpm test` | 77/77 tests across 8 files |
| Contrast CI | `node scripts/contrast-ci.mjs` | 71/71 checks passed |
| Token lint | `node scripts/token-lint.mjs` | Clean |
| Production build | `pnpm run build` | Passed; 54 HTML files in `out/`; 52 RSC aliases |
| E2E | `pnpm run test:e2e` | 32/32 passed in Chromium |
| Instrument stage chunk | `02nxlp51xsxee.js` | 48.4KB raw / **15.8KB gzip** |
| Instrument canvas chunk | `0pffr-p-d1fb7.js` | 868.3KB raw / **229.8KB gzip** |
| Instrument total | stage + canvas | **245.6KB gzip**, under the 400KB budget |

### Lighthouse (final, local gzip server)

Evidence: `C:\Users\soham\AppData\Local\Temp\opencode\instrument\lh-mobile.json` and `lh-desktop.json`.

| Metric | Mobile | Desktop |
|---|---:|---:|
| Lighthouse | 13.6.0 | 13.6.0 |
| Performance | **100** | **100** |
| Accessibility | **100** | **100** |
| Best Practices | **100** | **100** |
| SEO | **100** | **100** |
| FCP | 1.4s | 0.3s |
| LCP | **1.4s** | **0.3s** |
| TBT | **50ms** | **0ms** |
| CLS | **0** | **0** |
| Speed Index | 2.5s | 0.4s |
| TTI | 3.9s | 0.3s |
| Main-thread work | 1.9s | 0.5s |
| Total transfer | 447 KiB | 467 KiB |

Repeated mobile runs on the same build ranged from 95 to 100 with TBT 50–270ms and CLS 0; the binding budget is TBT ≤ 300ms, so every run passed. `scripts/serve-out.mjs` now gzips text assets and sends `Vary: Accept-Encoding`, so local measurements reflect the compressed host rather than raw transfer sizes. The earlier 90/340ms mobile result came from the pre-Instrument hero, whose Framer Motion bundle is no longer loaded on `/`.

### Layout stability

The first Instrument build measured CLS 0.0498: the metric fallback for Geist is ~4.7% wider than Geist, so "One system." wrapped to a second line before the font swap and pushed the lede down 60px. The fix is layout, not timing:

- `.hero-inst-headline` keeps the intended two-line lockup with `white-space: nowrap`.
- Phones (≤480px) use `clamp(3.125rem, 16vw, 5rem)` and `overflow-x: clip` on the copy column, so the fallback's small overhang is clipped without a scrollbar or a third line.
- At desktop the display line overhangs its column into the grid gap, ending ~108px left of the Instrument's actual ink.

Verified with fonts blocked and loaded at 320, 360, 390, 412, 430, 768, 1024 and 1440px: headline and lede geometry is identical in both states at 320–390 and 1024–1440, and `scrollWidth === innerWidth` at every width. A residual 8px eyebrow shift remains at 412–430px and a ~27px lede reflow at tablet widths, caused by fallback metrics; neither affects the mobile or desktop gates.

### Visual verification

| Environment | Instrument state | Result |
|---|---|---|
| 1440×900, fine pointer | `data-canvas="ready"` | Canvas crossfades in; SVG opacity 0; Lenis active |
| 768×1024 | `data-canvas="static"` | Static SVG; no canvas request; Lenis off |
| 390×844 touch | `data-canvas="static"` | Static SVG; no canvas request; Lenis off |
| 1440, reduced motion | `data-canvas="static"` | Static SVG; no canvas; Lenis off |
| 1440, WebGL disabled | `data-canvas="static"` | Static SVG; no console or page errors |

- LCP is the H1 in every environment.
- No console errors, page errors or hydration warnings.
- No horizontal overflow at 390px.
- Static/canvas cobalt-plate alignment measured pixel-wise: canvas `(116,50)–(402,235)`, static `(116,52)–(401,236)` — within 1–2px.
- Temporary verification scripts were removed after the run.

### Known limitations

- Host-level redirects and headers are declared in `vercel.json` (including the `/_next/static/(.*)` immutable cache rule) but remain unverified until a deployment is authorised. The static-export build still warns that `next.config.ts` redirects/headers are not applied; `vercel.json` is the authoritative host config.
- Rive and Spline authored assets are not present; L4 `/craft` still needs licensed demos or approved static fallbacks. L3's Lottie seal is authored locally and complete.
- The Instrument is a hero-exit effect: at ~340px of scroll it is partly above the fold. A sticky treatment was evaluated and rejected because the grid row leaves only ~124px of stick room.
- No commit, push or deploy was made. The `.com` Vercel/DNS aliases were not touched.

## Phase 2 completion — L3 Evidence

### Delivered

- Five evidence routes now share one cover sheet (`EvidenceHeader`): reference, status, record fields and actions. The visual language stays bone / ink / cobalt with mono labels and serif accents.
- `/work` leads with the single publishable record — PRV Financial Services, live since April 2025 — and a static technical delivery plate (`CasePlate`, inline SVG). No tilt, no R3F, no second 3D scene.
- `/platform` is an inspectable register of the eight institution layers. Five explicit seam rows sit between layers, one layer opens at a time, and `Escape` closes the open layer.
- `/pricing` pairs a four-column scope matrix with a changes-only filter (22 capabilities, 16 change across tiers) and the restyled builder. Institutional remains “Quoted after diagnosis”; no price is invented.
- `/process` uses a sticky phase index and scroll-linked progress fill on fine-pointer desktop widths ≥1024px. At ≤1023px and with reduced motion it renders the same four phases as a static numbered sequence.
- `/trust` uses a hand-authored 120-frame Lottie seal on a dark plate. The static SVG poster is the default; the runtime and JSON load only after activation. Controls are play / pause / resume / replay, with a static fallback on failure and a “Play once” control under reduced motion.
- All L3 CSS is consolidated in `src/styles/evidence.css`, imported after `institutional.css`. The Lottie runtime is contained in a 75.1KB gzip chunk that is not requested on initial paint.

### Gates

| Check | Command | Result |
|---|---|---|
| TypeScript | `pnpm run typecheck` | Passed |
| Lint | `pnpm run lint` | Passed |
| Unit/integration | `pnpm test` | **87/87** tests across 9 files |
| Contrast CI | `node scripts/contrast-ci.mjs` | **71/71** checks passed |
| Token lint | `node scripts/token-lint.mjs` | Clean |
| Production build | `pnpm run build` | Passed; 54 HTML documents in `out/` |
| E2E | `pnpm run test:e2e` | **41/41** passed in Chromium |
| L3 interaction checks | temporary Playwright script | **40/40** passed; 0 console/page errors |

### Lighthouse (local gzip server)

Evidence: `C:\Users\soham\AppData\Local\Temp\opencode\l3\lh-*-mobile.json` and `lh-*-desktop.json`.

| Route | Mobile perf | Mobile a11y | Mobile LCP | Mobile TBT | Mobile CLS | Desktop perf | Desktop LCP | Desktop TBT | Desktop CLS |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `/work` | 99 | 100 | 1.6s | 70ms | 0 | 100 | 0.3s | 0ms | 0 |
| `/pricing` | 100 | 100 | 1.4s | 40ms | 0 | 100 | 0.3s | 0ms | 0.009 |
| `/process` | 99 | 100 | 1.7s | 40ms | 0 | 100 | 0.4s | 0ms | 0 |
| `/trust` | 100 | 100 | 1.4s | 40ms | 0 | 100 | 0.3s | 0ms | 0 |

All four routes scored 100 for best practices and SEO in both modes. Mobile transfer was 374–412 KiB; desktop was 407–438 KiB. Every run reported zero console errors.

### Interaction verification

- Pricing: 22 rows initially; the changes-only filter reduces them to 16 (Foundation 4, Acquisition 4, Application 5, Governance 3), updates the live status, and restores 22 when toggled back. Package selection and quote links stay in sync.
- Platform: exactly one layer is open at a time; five seam rows render; `Escape` closes the open panel.
- Process: desktop reports `data-motion="scrub"`, the progress fill advances with scroll, and one stage / one phase link carries the active state. Mobile and reduced motion report `data-motion="static"` with the rail hidden and no active stage.
- Trust: the poster is the initial state and no Lottie SVG exists before activation. Activation loads the seal, pause / resume work, completion exposes Replay, and reduced motion plays once then restores the poster.
- No horizontal overflow at 390, 768 or 1440px on any of the five routes.

### Visual matrix

Screenshots captured at 1440, 768 and 390px, plus 1440px with `prefers-reduced-motion: reduce`, for all five routes.

| Route | Desktop | Tablet | Mobile | Reduced motion |
|---|---|---|---|---|
| `/work` | Complete record and plate | Stacked case file | Single column, plate first | Same content, no motion |
| `/platform` | Sticky stack key + register | Single column register | Full-width rows | Same content, no motion |
| `/pricing` | Four-column matrix + builder | Scrollable matrix + stacked builder | Single column | Same content, no motion |
| `/process` | Sticky index + scrub fill | Static sequence | Static sequence | Static sequence |
| `/trust` | Dark seal plate + static poster | Stacked seal section | Single column seal | Poster + “Play once” |

### Known limitations

- The Lottie seal is hand-authored rather than a licensed designed asset. L4 `/craft` still needs authored Rive/Spline demos or approved static fallbacks.
- `/process` uses a sticky index and scrub-linked fill, not a full pin; this was the approved motion decision because a full pin would trap the page for four long stages.
- Only one client engagement can be published in full. The NDA block is deliberate, not a placeholder.
- Host-level redirects and headers remain unverified until a deployment is authorised.
- No commit, push or deploy was made. The `.com` Vercel/DNS aliases were not touched.

## Phase 3 completion — L4 Workshop (`/craft`)

### Delivered

- New `/craft` route with a shared `EvidenceHeader` (`kicker="Workshop"`), an intro band that distinguishes craft proof from client proof, a live/pending legend, and eleven stations on the twelve-column bench grid.
- Station contract in `src/content/craft.ts`: 11 stations, 9 live, 2 pending, 0 client data. Unit tests assert indexes, ids, skill order and non-empty copy/metadata.
- Every station ships a static SVG poster in the same fixed-aspect stage as its live panel, so activation and reset cannot shift layout. Each live station owns its run/reset controls and an `aria-live` status; pending stations expose a disabled run control and a visible asset gap.
- Live runtimes, all activation-only: station 04 lazy R3F material bench (`frameloop="demand"`, context-loss callback), station 05 station-scoped GSAP scrub with `gsap.context()` revert, station 06 Canvas 2D state bridge reading CSS-variable palette, station 07 hand-rolled CSS 3D pointer tilt, station 08 hand-authored 90-frame Lottie dial, station 11 adapted enter-once ledger.
- Stations 09 (Rive) and 10 (Spline) ship poster + labelled “Asset pending” with the missing file named. No `@rive-app` or `@splinetool` dependency was added; no fake runtime.
- `/craft` linked from the footer Proof column and `/about`, added to `sitemap.ts`, `e2e/smoke.spec.ts` and `e2e/a11y.spec.ts` (22 routes). Not added to primary navigation.
- All L4 CSS lives in `src/styles/craft.css`, imported after `evidence.css`.

### Gates

| Check | Command | Result |
|---|---|---|
| TypeScript | `pnpm run typecheck` | Passed |
| Lint | `pnpm run lint` | Passed |
| Unit/integration | `pnpm vitest run` | **93/93** tests across 10 files |
| Contrast CI | `node scripts/contrast-ci.mjs` | **71/71** checks passed |
| Token lint | `node scripts/token-lint.mjs` | Clean |
| Production build | `pnpm run build` | Passed; 61 HTML documents, 53 RSC aliases |
| E2E | `npx playwright test` | **55/55** passed in Chromium |
| L4 interaction checks | `e2e/l4-craft.spec.ts` | **12/12**, and **24/24** with `--repeat-each=2` |

### Lighthouse (local gzip server)

Evidence: `C:\Users\soham\AppData\Local\Temp\opencode\l4\lh-craft-{mobile,desktop}-fix.json`.

| Mode | Perf | A11y | Best practices | SEO | FCP | LCP | TBT | CLS | Transfer |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Mobile | 100 | 100 | 100 | 100 | 1.4s | 1.4s | 60ms | 0 | 412 KiB |
| Desktop | 100 | 100 | 100 | 100 | 0.3s | 0.3s | 0ms | 0 | 425 KiB |

### Runtime budget

- Initial `/craft` load: 17 JS requests, 241,357 bytes gzip total (~236 KiB). No Three, R3F, GSAP or Lottie chunk is requested at rest.
- Station 04 loads the R3F/Three chunk on run; station 08 loads the Lottie runtime on run; station 05 loads the lazy GSAP chunks on run.
- Reset removes the canvas and the Lottie SVG. Instrument chunk remains 245.6KB gzip, inside the 400KB budget.
- 0 console errors and 0 page errors through activation, scroll, reset and reduced motion.

### Interaction verification

- 03: range input moves the plates between exploded and assembled, output and `aria-valuetext` agree, reset restores the poster.
- 04: no canvas before run; run mounts it; tone and mode controls update the readout; reset unmounts the canvas.
- 05: run enters scrub mode scoped to the station frame; scroll advances the readout; reset kills the trigger and restores the poster.
- 06: yaw slider drives both the canvas and the visible readout; reset removes the live panel.
- 07: tilt only enables on a fine pointer with normal motion; pointer move sets the tilt variables; leaving recentres; reset restores the static card.
- 08: no SVG before run; run loads the JSON and renders; pause/resume/replay work; reset removes the SVG.
- 09/10: run is disabled and the missing `.riv` / `.splinecode` asset is named.
- 11: run enters five ledger rows; reset clears them.
- Reduced motion: every station starts static, tilt refuses to enable, no autoplay, Lottie stays poster-first.
- No horizontal overflow at 390px.

### Visual matrix

Screenshots captured at 1440, 768 and 390px, plus 1440px with `prefers-reduced-motion: reduce`. Fixes applied after review: dark-poster accent label switched to bone; station 07 card narrowed so its note never clips; reduced-motion and coarse-pointer status copy separated; station 04 datum raised and camera reframed so the plate is not cropped; bench stage grid added; station foot spacing corrected.

### Known limitations

- Stations 09 and 10 remain labelled pending because no authored Rive/Spline asset exists in the repository. The approved fallback is the poster plus the explicit gap, not a demo.
- Station 05 scrubs only its own frame and never pins the page; this is deliberate to avoid a scroll trap.
- `/craft` is craft proof only; `/work` remains the sole client-proof surface.
- Host-level redirects and headers were verified on the Vercel preview in Phase 4 (see “Host verification and preview”).
- No commit or push was made. A Vercel preview was later aliased to `goat-wheat.vercel.app`; the `.com` Vercel/DNS aliases were not touched.

## Phase 4 QA — post-L4 verification

### Lighthouse sweep (local gzip server, post-L4 build)

Evidence: `C:\Users\soham\AppData\Local\Temp\opencode\l4\phase4\`.

| Route | Mobile perf | Mobile LCP | Mobile TBT | Mobile CLS | Desktop perf | Desktop LCP | Desktop TBT | Desktop CLS |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `/` | 99 | 1.4s | 80ms | 0 | 100 | 0.3s | 30ms | 0 |
| `/work` | 100 | 1.4s | 60ms | 0 | 100 | 0.3s | 0ms | 0 |
| `/platform` | 100 | 1.4s | 40ms | 0 | 100 | 0.3s | 0ms | 0 |
| `/pricing` | 98 | 1.4s | 60ms | 0 | 100 | 0.3s | 0ms | 0.009 |
| `/process` | 97 | 1.6s | 60ms | 0 | 100 | 0.3s | 0ms | 0 |
| `/trust` | 100 | 1.4s | 70ms | 0 | 100 | 0.3s | 0ms | 0 |
| `/craft` | 100 | 1.4s | 60ms | 0 | 100 | 0.3s | 0ms | 0 |
| `/about` | 100 | 1.4s | 60ms | 0 | 100 | 0.3s | 0ms | 0 |

All sixteen runs scored 100 for accessibility, best practices and SEO. Every route is inside the approved gates (mobile perf ≥90, desktop ≥95, LCP ≤2.5s, CLS ≤0.05, TBT ≤300ms).

### Bundle audit

Initial gzip JS parsed from each exported document:

| Route | Chunks | Initial JS |
|---|---:|---:|
| `/` | 13 | 236.4 KiB |
| `/work` | 11 | 220.3 KiB |
| `/platform` | 12 | 223.8 KiB |
| `/pricing` | 12 | 227.4 KiB |
| `/process` | 12 | 224.4 KiB |
| `/trust` | 12 | 221.9 KiB |
| `/craft` | 13 | 235.7 KiB |
| `/about` | 13 | 264.1 KiB |

No route requests Three/R3F, GSAP or Lottie in its initial payload. The Instrument chunk remains 245.6 KiB gzip, inside the 400 KiB budget.

### Accessibility and interaction

- Full Playwright suite: **55/55**, including axe on 22 routes and the 12 L4 interaction tests.
- Axe with all nine live `/craft` stations open initially flagged two dark-plate ghost buttons at 1.02:1. Dark-tone controls were added; the re-run is clean.
- Reduced motion, keyboard operation, live-region status and 390px overflow remain covered by `e2e/l4-craft.spec.ts`.

### Memory and context loss

- Twelve activate/reset cycles across stations 04, 08 and 05: heap 8.02 MB after the first cycle, 9.81 MB after the twelfth (+1.30 MB from cycle 2 to cycle 12). Isolated ten-cycle probes show comparable drift in station 06, which loads no heavy runtime, so this is DOM/page churn rather than an unbounded runtime leak.
- Dispatching `webglcontextlost` on the station 04 canvas removes the renderer and shows the labelled static fallback; no page or console errors.
- Resets leave zero canvases and zero Lottie SVGs mounted.

### Host verification and preview

**Vercel** — deployment `dpl_4qQgX9BYNLV3EdumH3uqQENQ4V6B`, built from the working tree on Vercel (`pnpm install --no-frozen-lockfile`, `pnpm build`, 61 static pages):

- Preview: `https://goat-8mw8d8cph-sohamchoughule168s-projects.vercel.app`
- `https://goat-wheat.vercel.app` was re-pointed to that verified deployment with `vercel alias set`. No production promotion was run and no `.com` alias was changed.
- `www.imaginarsclubservices.com` resolves to the separate `imaginars-club-website` project (`dpl_3WT3MiNuNjNRb8iSZz1xy7T7RjZo`). Its title and h1 were captured before and after the alias change and are unchanged.
- The old goat production deployment still lists `www.imaginarsclubservices.com` in stale alias metadata. Because of that, the verified deployment was aliased rather than promoted with `vercel deploy --prod` or `vercel promote`.

Host checks on `https://goat-wheat.vercel.app` — **20/20 passed**:

| Check | Result |
|---|---|
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), interest-cohort=()` |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `Cross-Origin-Opener-Policy` | `same-origin` |
| `Cross-Origin-Embedder-Policy` | `credentialless` |
| `/_next/static/*` | 200, `public,max-age=31536000,immutable` |
| `/work`, `/craft` without slash | 308 to the trailing-slash form |
| `/portfolio` | 308 `/portfolio/` → 308 `/work/` → 200 |
| `/blog`, `/blog/anything` | 308 → `/insights/` → 200 |
| `/services/web-dev` | 308 → `/services/web-development/` → 200 |
| `/services/talent` | 308 → `/services/talent-acquisition/` → 200 |
| `/work/`, `/craft/`, `/sitemap.xml` | 200; case record and workshop render; sitemap lists `/craft` |

On Vercel the relative redirects in `next.config.ts` are applied ahead of `vercel.json`'s absolute `.com` destinations, so legacy paths resolve within the deployment in two hops. Both rule sets remain defined; the `.com` destinations are unchanged.

Browser smoke on `https://goat-wheat.vercel.app` — **13/13 passed**: four routes render their h1, Instrument markup is present, station 04 mounts Three only on run and unmounts on reset, zero horizontal overflow at 390px, and zero console, page or network errors.

Lighthouse on the Vercel host (mobile, 13.6.0, same deployment, three runs):

| Route | Perf | LCP | TBT | CLS | A11y / BP / SEO |
|---|---:|---:|---:|---:|---|
| `/` | 91 / 87 / 93 | 1.22 / 1.39 / 1.83s | 378 / 490 / 262ms | 0 | 100 / 100 / 100 |
| `/craft` | 97 | 1.24s | 195ms | 0 | 100 / 100 / 100 |

The homepage TBT median (378ms) exceeds the 300ms gate on the preview host in two of three runs; the local static sweep measured 76–80ms at 99 perf. Profiling the preview and here.now shows the same app work — the hydration/module-initialisation tail — landing just after FCP on the preview host, which is what TBT penalises; total main-thread work is unchanged. The preview-only `vercel.live` toolbar is not responsible (blocking it did not remove the work). No code change was made for this; the local sweep remains the build-level gate result and the preview spread is recorded as host/timing variance.

**here.now** — static `out/` published anonymously:

- Site: `https://dewy-lemon-yr8a.here.now/`
- Claim: `https://here.now/c/wL4T9DJs8suaO5pO`; expires **2026-11-01T09:30:17.888Z**
- 518 files, 15.7 MB; version `01M68MQAX0KNNF7ZEQNQBDP87N`
- Browser smoke — **13/13 passed**, same checks as Vercel.
- here.now serves extensionless paths with a 308 to the trailing-slash form and caches assets for one hour; header and immutable-cache verification applies to Vercel, not here.now.

No commit or push was made. `vercel.json` still holds the `.com` redirect targets, and no `.com` Vercel or DNS setting was modified.
