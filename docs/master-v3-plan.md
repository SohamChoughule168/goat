# Master Mission V3 — Working Plan

**Started:** 2026-11-04
**Branch:** `main` · **Checkpoint commit:** `3feae54` (V2 state preserved)
**Authorized deploy target:** `https://goat-wheat.vercel.app/` (Vercel project `goat`, org `sohamchoughule168s-projects`)
**Forbidden:** the `.com` domain — which is aliased to a *different* project (`imaginars-club-website`). Project `goat` is fully isolated from it. Never run `vercel --prod` against any other project, never touch aliases of `imaginars-club-website`.

## Verified starting state (measured, not assumed)

| Gate | Result |
|---|---|
| `pnpm run build` | Pass — 60 static pages, `out/` export |
| `pnpm run typecheck` | Pass (exit 0) |
| `pnpm test` (vitest) | Pass — 111/111 tests, 16 files |
| `node scripts/contrast-ci.mjs` | Pass — 71/71 pairings |
| `node scripts/token-lint.mjs` | **Fail** — 5 `rgba()` violations (depth-parallax-hero, gradient-mesh ×2, image-stack-3d, split-scroll) |
| `pnpm run lint` | **Fail** — 257 errors, all inside private `higgsfield/**` (fixed via ignore) |
| Live homepage | 40+ stacked sections; ~15 duplicate V1 demo sections; 4 integrity violations; 1 broken external-API component |

## Diagnosis — what is wrong with the V2 output

1. **Integrity violations** (contradict the site's own published trust policy "Testimonials that have not been approved"):
   - `testimonial-cards.tsx` — three invented people/quotes.
   - `before-after-showcase.tsx` — invented results ("300% increase in enquiries") attributed to named institutions.
   - `client-portal-dashboard.tsx` — invented operational figures presented as a client dashboard.
2. **Broken/fake functionality + exposure:**
   - `higgsfield-studio.tsx` — calls `https://api.muapi.ai` from the browser with `NEXT_PUBLIC_MUAPI_KEY` (undefined in production; no such key exists in Vercel). Inner tooling name leaked into the UI. Auto-fires on mount.
   - `mcp-skills-showcase.tsx` — lists the repository's internal agent skills on the public homepage.
3. **Duplicate content:** "modules" sections appear 4×, materials/surfaces sections 3×; blurring the site's argument.
4. **Tech-demo sections** (`premium-features`, `glass-cards`, `video-3d-parallax` w/ Big Buck Bunny sample URL, etc.) — showcase *technique*, not the business. `/craft` exists precisely for that; the homepage is the sales path.
5. **Security:** no secrets found in tracked source; the `NEXT_PUBLIC_MUAPI_KEY` pattern must be removed anyway.

## V3 direction — "The Operating Field"

Keep and sharpen the approved institutional system (bone / ink / cobalt, Instrument Serif, Index → Assemble → Verify). Replace breadth with depth:
one homepage story, one signature generative moment, zero invented proof.

### Workstreams

- **WS1 Integrity & security (P0)** — delete the five violating/leftover components + dead media components; rewrite `src/app/(site)/page.tsx` to a curated 17-section narrative; prune their CSS from `institutional.css`; update SectionNavigator labels; add guard tests.
- **WS2 Signature experience** — new `InstrumentField` (Canvas 2D, deterministic, scroll-linked): the eight operating layers assemble as a hairline axonometric field; enquiry signals travel; handover completes the record. DPR-capped, offscreen-paused, reduced-motion static frame, lite-tier simplification. No WebGL — the project's `no-3d.test.ts` and performance budget stay intact.
- **WS3 Quality** — token-lint green, ESLint green, a11y fixes, media hygiene, Lighthouse ≥ 90.
- **WS4 Close-out** — build, capture after-screenshots, axe scan, deploy preview → verify → promote to `goat-wheat.vercel.app`, report `docs/master-v3-innovation-report.md`.

### Decisions (with rationale)

- **No three.js/WebGL.** The project deliberately removed it (V2), enforces `no-3d.test.ts`, and its mobile Lighthouse baseline (TBT 580 ms) cannot absorb a 150 KB GPU stack for decoration. The "3D laboratory" ambition is delivered as: CSS 3D space, Canvas 2D procedural field, SVG axonometric drawing, scroll choreography. Documented as a deliberate trade-off.
- **No higgsfield assets shipped.** The folder contains a separate product's UI assets (a Vite/Gradio studio app) and lens-study webp files — not brand-licensed material. Treated as private reference only; the folder is git-ignored and never referenced from the site.
- **Keep the photographed institutional system.** It is coherent, honest and already art-directed.

### Definition of done

Build ✅ · typecheck ✅ · vitest (incl. new integrity tests) ✅ · contrast ✅ · token-lint ✅ · lint ✅ · no fake proof in `src/` ✅ · axe no critical issues · Lighthouse mobile ≥ 90 where realistically achievable · preview verified · deployed to `goat-wheat.vercel.app` · `.com` untouched (different project — verified via `vercel alias ls`).
