# GOAT — Diagnostic Audit Report

- Project: `D:\goat` (Next.js 16 marketing site + experimental "Spatial OS" homepage)
- Date: 2026-10-16 · Branch `main` @ `7c93a79` (+ ~102 uncommitted working-tree changes)
- Method: read-only audit (`AUDIT_REPORT.md` is the only file created). Build ran as `pnpm exec next build` to bypass the mutating `prebuild` hook. Evidence in `%TEMP%\opencode\goat_{build,tsc,eslint}.txt`; fresh test run done live.

---

## 1. Executive Summary & Tech Stack

**Verdict: the site builds and deploys, but two P0 defects are shipping today — the production homepage crashes on load, and every successful contact-form submission ends in a failure message.** The 3D performance layer is architecturally broken (adaptive quality never engages, per-frame re-renders everywhere), the type/lint gates are non-functional, and roughly a third of the component tree is dead code.

**Stack:** Next.js 16.3.2 (Turbopack, App Router, `output: 'export'`), React 19.2.8, TypeScript 5, three 0.185.1 + @react-three/fiber/drei/postprocessing, zustand, Tailwind v4, framer-motion (9 files), GSAP (12 files), lenis (2), lucide-react (19), radix-ui (14). pnpm 11.24.0, Node 24.16.0. Deployed to Vercel as a static export; canonical URL `https://www.imaginarsclubservices.com`.

**Fresh verification results:**

| Check | Result |
|---|---|
| `pnpm exec next build` | ✅ exit 0 — 53 static pages (25.6s compile, 6.5s generate) |
| `pnpm exec tsc --noEmit` | ❌ 7 errors (all in stale generated artifact — see §2) |
| `eslint .` (via direct invocation) | ❌ 79 errors / 242 warnings |
| `vitest run` | ✅ 18/18 pass |
| contrast-ci / token-lint | ✅ pass / clean |

---

## 2. Compiler / Type / Build Errors

### 2.1 Build — passes, with two meaningful warnings
`pnpm exec next build` succeeds (53/53 static pages). Warnings worth acting on:

1. **"Specified 'redirects' will not automatically work with `output: 'export'`"** and **"rewrites, redirects, and headers are not applied when exporting"** — this is not cosmetic: the redirect table in `next.config.ts` (including `legacyServiceMap`, 16 legacy `/services/:slug` slugs, plus `/portfolio`, `/blog` variants) and all security headers in `next.config.ts` are **dead**. Only the 4 redirects that also exist in `vercel.json` still work on Vercel. Consequence: legacy URLs 404. (See §4-P1, §5.)
2. **Custom `Cache-Control` header detected for `/_next/static/(.*)`** — also ignored under export.

### 2.2 TypeScript — fails, but only due to a stale artifact
`tsc --noEmit` reports 7× `TS2307 Cannot find module '@/app/api/...'` — **all 7 inside `.next/dev/types/validator.ts`** (written 2026-10-08, stale), a Next-generated file that still references the six deleted API route handlers (`/api/contact`, `/api/estimate`, `/api/analytics/{event,pageview}`, `/api/cron/{analytics-rollup,cache-warm,health-check}`). A fresh `next build` does **not** regenerate or remove `.next/dev`, so `pnpm typecheck` stays red until `.next/dev` is deleted or `next dev` is run again. This masks the real problem: with a clean type cache, `tsc` behavior is untested in CI because of 2.3.

### 2.3 Type safety is not enforced anywhere
`next.config.ts:27-29` sets `typescript.ignoreBuildErrors: true`. Build output confirms: *"Skipping validation of types"*. Combined with the broken `typecheck` script (2.2) there is **no working type gate** on this repo.

### 2.4 Lint — script broken, debt invisible
`package.json` still defines `"lint": "next lint"` — **`next lint` was removed in Next.js 16**, so `pnpm lint` fails outright. Direct `eslint .` reveals the true state: **79 errors / 242 warnings**. Error distribution:

- 31 × `react-hooks/purity` ("Cannot call impure function during render")
- 19 × `@typescript-eslint/no-explicit-any`
- 11 × setState-in-effect ("Calling setState synchronously within an effect")
- 9 × refs-during-render
- 5 × create-components-during-render
- 4 × misc (`empty-object-type`, use-before-declare, modify-after-render, write-to-value)

Warning distribution: 235 × unused vars, 7 × exhaustive-deps. Error hotspots include `src/lib/hooks/performance-optimizer.tsx`, `src/components/canvas/PersistentCanvas.tsx:50,63`, `src/components/spatial/SpatialCanvas.tsx`, `glsl-loader.mjs`, and most of `scripts/*.mjs`. None of this blocks the build, and no CI step runs it.

### 2.5 Minor
`vitest.config.ts` loads as CJS with ESM syntax (`vitest.config.ts:1:1` warning) — rename to `.mts` or set `"type": "module"`.

---

## 3. Critical Bugs (P0)

### P0-1 — The homepage `/` throws on mount: `ai-tools` region has no registered component
**Severity: critical — production homepage blanks/crashes for every visitor.** Build-invisible because the component is loaded with `ssr: false` and nothing type-checks it.

- The region registry is seeded with **5 regions** (`src/lib/spatial/types.ts:126-217`: marketing, portal, **ai-tools**, dev, playground).
- The renderer maps **all** registry regions unguarded (`src/components/spatial/SpatialCanvas.tsx:361-431`): `const RegionComponent = REGION_COMPONENTS[region.id]` (:362), `const BackgroundComponent = RegionBackgrounds[region.id]` (:363), rendered at :407 `<BackgroundComponent intensity={1} />` and :427 `<RegionComponent />`.
- Both lookup tables have the `ai-tools` entry commented out (`SpatialCanvas.tsx:99` and :112-114). Lookups are typed `Record<string, …>`, so TypeScript/ESLint cannot flag the missing key.
- For `ai-tools` both components are `undefined` → React throws **"Element type is invalid: expected a string … but got: undefined"** as soon as `SpatialCanvas` mounts in the browser. There is **no root error boundary** — only `src/app/(site)/error.tsx`, which does not cover `/` (it's outside the `(site)` group). Result: React unmounts the root → blank page.
- The static export build passed because `src/app/page.tsx` loads `SpatialCanvas` via `dynamic(..., { ssr: false })`; `out/` (exported 2026-10-12) contains the shell but no signal of the runtime crash.

**Repro:** `pnpm dev` → open `http://localhost:3000/` → console shows the invalid-element-type error; page does not render.
**Fix (S):** guard or filter — e.g. in the render loop `if (!RegionComponent || !BackgroundComponent) return null;` (or `.filter(id => REGION_COMPONENTS[id] && RegionBackgrounds[id])` when building `regionElements`); re-enable the AI-tools entries when the scene ships. Add `src/app/error.tsx` (and consider `global-error.tsx`) regardless.

### P0-2 — Contact form: every successful submission ends in "Sending failed"
**Severity: critical — the primary lead-capture flow always shows failure UI.** File: `src/components/forms/contact-form.tsx`.

- Submit handler is `async`: `await fetch(...)` at :101 (or the mailto assignment at :111).
- On success it calls `setState({status:"success", …})` (:114) and then **`e.currentTarget.reset()` (:115)**.
- React nulls `event.currentTarget` after the synchronous dispatch returns; by the time the `await` resumes, it is `null` → `TypeError` → caught by :117-121 → `setState({status:"error", message:"Sending failed. …"})` overwrites the success state in the same batch.
- This happens on **both** paths: Formspree success also ends in the error state. Additionally the mailto branch (:107-111) treats "opened the user's mail client" as success — no server-side record exists.

**Repro:** submit the form on `/contact` with valid input → observe "Sending failed" despite the request succeeding. **Fix (S):** capture the form before awaiting (`const form = e.currentTarget;` at the top of the handler, or use a `ref`) and call `form.reset()`; separate the mailto path's messaging from the POST path's success state.

---

## 4. Functional / Logic Bugs (P1)

### P1-1 — Adaptive-performance system is inert, and every consumer re-renders every frame
File: `src/lib/hooks/performance-optimizer.tsx`. Three compounding defects:

1. **Quality never changes.** `qualityRef` is never updated from measured FPS (:63-95), so `quality` is permanently `"high"`; `onQualityChange` reports `"high"` forever. Every `shouldReduce*` flag from `useAdaptiveQuality` is dead weight.
2. **The FPS math is wrong.** `framesRef.current.push(metrics.fps)` pushes the stale closure value (the effect deps omit `metrics.fps`), and `avgFps` computes `1000 / (delta / framesRef.current.length)` — producing absurd values, so `isOptimal` is always true even if the banner above it were read.
3. **Architecture:** each `usePerformanceMonitor()` instance runs its own `requestAnimationFrame` loop that calls `setState` with a **new object every frame**; `useAdaptiveQuality()` internally calls `usePerformanceMonitor()` again, so every component that uses both runs **two loops**. 19 files import these hooks (`rg` count), including always-mounted components (`PersistentCanvas`), `SpatialCanvas`, its scene components, and `final-cta` which appears on ~20 pages. Net effect on `/`: **≥9–11 concurrent 60 fps loops all forcing React re-renders continuously** — a self-inflicted re-render storm on the heaviest page. `PerformanceContext`/`PerformanceProvider` (:23-38) exist but have **zero consumers** anywhere in the codebase.

Also: `detectDeviceTier()` (:97-103) reads `navigator` **during render** (31 purity-lint errors stem from this family of issues), `const mounted = true` (:64) is dead, and `(navigator as any)` accounts for 2 of the 19 `no-explicit-any` errors.
**Fix (M-L):** throttle metrics to ~1 Hz, or publish via context with equality-gated updates; fix the FPS math; collapse the two hooks into one provider; then delete the dead context or make it the single source.

### P1-2 — `PersistentCanvas` never receives quality signals
`src/components/canvas/PersistentCanvas.tsx`: a local `quality` state is set by drei's `<PerformanceMonitor>` and by a DPR effect but is **never used** — `effectiveQuality` comes from the inert hook (always `"high"`). Effect: post-processing (Bloom + ChromaticAberration + Noise + SMAA ×8) and DPR are permanently maxed; the drei monitor is decorative. `View` is imported but unused (also `canvas/PostProcessing.tsx` dead-imports). Lint errors at :50 and :63.
**Fix (S-M):** wire `effectiveQuality` to the real measured signal (or delete the local state and the DPR effect if degradation is out of scope).

### P1-3 — Homepage mounts 6–7 simultaneous WebGL contexts
`SpatialCanvas.tsx:361-431` renders **one `<Canvas>` per region** — all 5 regions mount immediately (`gl={{antialias:true}}`), inactive ones hidden only by `opacity:0` (`:381`); they keep rendering. Plus the Minimap `<Canvas>` (`:597`) plus the root-layout `PersistentCanvas` = **up to 7 concurrent WebGL contexts / render loops on `/`**. Mobile browsers commonly cap contexts at 8; this is the single biggest GPU/memory risk on the page, and hidden regions' scenes burn GPU for nothing.
**Fix (M):** render only the active region's canvas (mount/unmount on transition) or consolidate to one shared canvas with region scenes toggled by visibility.

### P1-4 — Minimap toggle is hard-wired dead
`SpatialCanvas.tsx:451` passes `showMinimap={true}`; :540 calls `onMinimapToggle(!true)` (= always `false`); :461 renders `{true && <Minimap …/>}`. Clicking the toggle button does nothing and can never hide the minimap.
**Fix (S):** store `showMinimap` in state (`const [showMinimap, setShowMinimap]`, pass both through), or delete the button.

### P1-5 — Global listener leak in the camera controller (persists across route changes)
`initialize()` in `src/lib/spatial/CameraController.ts` attaches window/canvas listeners (pointer, wheel, touch, keyboard, resize — invoked from `SpatialCanvas.tsx:265-269`) and **there is no `removeEventListener` anywhere in the file** (`rg` verified), nor any store `destroy()`. Two consequences: (a) navigating away from `/` leaves the key/scroll-hijack handlers attached globally for the rest of the session; (b) React StrictMode (`reactStrictMode: true`) double-invokes the effect in dev, duplicating every listener. Note: `SpatialCanvas`'s own scroll/key handlers *do* clean up (:317, :357) — the leak is specifically the controller's.
**Fix (S):** add a `destroy()` on the controller (remove all listeners) + effect cleanup in `SpatialCanvas`.

### P1-6 — `/estimate` ships its placeholder as the final answer
`src/app/(site)/estimate/EstimateClient.tsx:60` renders literally `TODO(positioning: pricing rules table)` where the price band should be. The entire four-question flow funnels into a TODO string; the page's headline promise ("Indicative price band") is unfulfilled. Also `aria-label` reads "Step 5 of 4" in the complete state (:34 sets `step = steps.length`, :49 renders `step + 1`).
**Fix (S for rules, pricing decision needed):** implement the band logic or remove the result promise until it exists; fix the aria counter.

### P1-7 — All legacy/unified redirects are dead under `output: 'export'`
Build warnings confirm `next.config.ts` redirects are ignored: the 16-entry `legacyServiceMap` slugs, `/portfolio`, and the `/blog` redirect family now **404** (only the 4 redirects duplicated in `vercel.json` survive). Given the site's SEO-sensitive service pages, this is active link-equity loss for the old URL set.
**Fix (S):** move the full redirect table into `vercel.json` (host-level) or accept 404s deliberately; verify with `curl -I` after deploy.

### P1-8 — No real submission backend configured
`NEXT_PUBLIC_FORMSPREE_ENDPOINT` appears nowhere in the repo or `.env.local` → the live path is the mailto fallback (P0-2's second branch): leads exist only if the visitor's device has a configured mail client. Meanwhile `vercel.json` still declares crons hitting the six deleted `/api/*` routes (daily 404s) and a `functions` glob (`app/api/**/*.ts`) that now matches nothing.
**Fix (S):** set the Formspree endpoint (or reinstate a route handler + submission store); delete the dead `functions`/`crons` blocks.

---

## 5. Config / Security / Performance (P2)

**Toolchain gates**
- `pnpm typecheck` fails on a stale `.next/dev/types/validator.ts` (see §2.2). Fix: `rm -rf .next/dev` (regenerates on next dev) and keep it out of the tsc run (e.g. `--include` scoping or regenerate in a pretest step).
- `ignoreBuildErrors: true` disables type validation at build — remove after fixing whatever it currently hides.
- `"lint": "next lint"` is broken (Next 16 removed it) — replace with `eslint .`; add lint/type/test steps to CI so the 79 errors can't rot further.

**Dead code (≈30% of `src/components`)** — verified by import graph:
- `components/home/*`: all files dead **except `final-cta.tsx`** (hero, pricing, testimonials, team, process-line, manifesto, work-strip, ai-lab, craft-chapters, and `home/page.tsx` itself are unimported).
- `components/canvas/scenes/*`: dead except `FooterCTAScene.tsx` (used by final-cta); drags `SectionView`, `Tunnel`-size machinery.
- `components/v6/*`: alive only `cursor`, `force-dark`, `magnetic-cursor`; dead: `smooth-scroll`, `preloader`, `nav`, `hero`, `post-processing-pipeline`, and the rest.
- `components/canvas/PostProcessing.tsx`, the `AIToolsRegion/AIToolsBackground` stubs, `glsl-loader.mjs` + the Turbopack `.glsl` rule (`node_modules/glsl-loader` is not installed — dead loader), the entire `webpack:` block in `next.config.ts` (Turbopack is the builder), `vite.config.ts`, `regionRegistry` snapshot export + collaborator API in `RegionRegistry.ts`.
- Unused deps: `@vercel/analytics`, `next-sitemap`, `animejs`, `lottie-react` (0 references in `src`); `next/image` unused → the images/sharp config in `next.config.ts` is moot.

**Observability / ops**
- No analytics anywhere: `@vercel/analytics` unused, GA env var in `vercel.json` (`NEXT_PUBLIC_GA_ID`) referenced by no code, and the deleted `/api/analytics/*` routes removed the last in-repo tracking.
- `vercel.json`: stale `functions` glob, 4 crons → deleted routes, unused env vars. `buildCommand` runs `pnpm prebuild && pnpm build` → **prebuild executes twice** (pnpm auto-runs `prebuild`), and prebuild rewrites tracked files (`src/lib/three/shaderLoader.ts`, `public/precomputed/scenes.json`) → git churn on every deploy.
- `"start": "next start"` cannot serve an `output: 'export'` build (Next errors out with the export/start incompatibility) — document/remove; deploy and preview via a static server or `vercel`.
- Security headers defined in `next.config.ts` are dead under export; the copies in `vercel.json` still apply on Vercel, but any non-Vercel static hosting of `out/` currently serves **no** security headers.

**Content/SEO**
- `/rss.xml` route works (`force-static`, GET-only — export-safe) but does not XML-escape titles/excerpts; an `&` in a title breaks the feed.
- Root repo hygiene: `build_final.txt`, `build_repro.txt`, `lint_out.txt`, `server_run.log`, empty `typecheck_out.txt`, `.serena/`, `.playwright-mcp/` — audit scratch that should not live at the repo root.

**Performance (non-blocking but notable)**
- `RegionRegistry.setActiveRegion` animates via a raw `requestAnimationFrame` loop calling zustand `set()` every frame (`RegionRegistry.ts:91-108`) — acceptable, but combined with P1-1/P1-3 it compounds; consider `transitionProgress` outside React (ref) or a CSS-driven transition.
- Bundled animation stack is heavy (GSAP + framer-motion + lenis + three); fine for the design language, but prune dead importers (§5 dead code) to shrink client bundles.

---

## 6. Recommended Fix Order (dependency-aware)

**Phase 0 — ship-stoppers (same day, ~1–2 h)**
1. **P0-1** homepage crash: guard `regionElements` (or restore AI-tools entries) + add `src/app/error.tsx`. *Verify:* open `/` locally, console clean, each nav button switches regions.
2. **P0-2** contact form: capture form element before `await`; separate mailto messaging. *Verify:* manual submit on `/contact` → success state, fields reset, mail client opens (mailto path).

**Phase 1 — restore guardrails (this week, ~half day)**
3. Fix type cache (`rm -rf .next/dev`), delete `ignoreBuildErrors`, fix `"lint": "eslint ."`, wire `typecheck`/`lint`/`test` into CI. *Depends on Phase 0 only for a green baseline.*
4. **P1-8/P1-7**: set Formspree endpoint; move redirect table to `vercel.json`; delete dead `functions`/`crons`/GA env from `vercel.json`.

**Phase 2 — performance architecture (1–2 weeks, M–L)**
5. **P1-1 + P1-2**: rebuild the perf hook layer (single provider, throttled updates, correct FPS math), then wire `PersistentCanvas` to real quality. *Do this before touching region canvases — the canvas consolidation (P1-3) becomes trivial once quality signals are honest.*
6. **P1-3**: render only the active region's `<Canvas>` (drops `/` from ~7 WebGL contexts to 2).
7. **P1-4/P1-5**: minimap toggle (or delete); `CameraController.destroy()` + effect cleanup.

**Phase 3 — product completeness (2–4 weeks)**
8. **P1-6**: estimate pricing rules (or remove the "indicative band" promise).
9. Analytics decision (Vercel Analytics vs GA vs none) — then either delete the unused deps or wire one.

**Phase 4 — hygiene (ongoing, S each)**
10. Dead-code sweep (`home/*`, `v6/*`, `canvas/scenes/*`, `glsl-loader.mjs`, webpack block, `vite.config.ts`), dependency prune, RSS escaping, `start` script alignment, root-file cleanup, vitest config ESM rename.

*Each phase is independently shippable; nothing in Phase 2+ should start before Phase 0–1 so regressions stay attributable.*
