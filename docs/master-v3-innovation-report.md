# Master Mission V3 — Innovation Report — ImaginarsClub Services

**Date:** 2026-11-09
**Authorized website:** https://goat-wheat.vercel.app/ (Vercel project `goat`)
**Forbidden:** `.com` domain — never touched; verified isolated on a separate project.
**Final deployment:** `https://goat-wheat.vercel.app` (preview alias, target: null — never `--prod` promoted).
**Git:** `main` — checkpoints `3feae54` → `cd090cd` (V3) → `afe0fa6` → `1b2f18a` (Round 2 motion).

---

## 1. What was inherited from V1 and V2

V1/V2 ("$100M tier" 3D architecture, 11 R3F scenes, Tunnel state, GLSL shaders, post-processing, PersistentCanvas) were **mostly dead code** on live routes — verified by an import-graph orphan scan:

- `components/home/*`: all dead except `final-cta.tsx`.
- `components/canvas/scenes/*`: dead except `FooterCTAScene.tsx`.
- `components/v6/*`: only `cursor`, `force-dark`, `magnetic-cursor` alive.
- 10 of 12 `.glsl`/3D shader files deleted by V2 already; remaining WebGL stack (`three`, `@react-three/*`, `tunnel-rat`, `zustand`, `glslify`) removed by V3 per `no-3d.test.ts`.

Live inherited value that V3 preserved and sharpened:

- Institutional token system (bone/ink/cobalt, Geist Sans/Mono, Instrument Serif).
- Approved design spec: `docs/superpowers/specs/2026-10-31-institutional-instrument-upgrade-design.md` (Index → Assemble → Verify motion grammar).
- Canvas-2D `InstrumentField` (eight operating-layer ledger; deterministic; reduced-motion static).
- Scroll sequence (5 photographic stages), fit check, evidence room, command center, trust page, `/craft` workshop (11 stations, 9 runnable + 2 honest gaps).
- Gates: typecheck 0, vitest 111/111 (V2) → 116/116 (V3+), contrast 71/71, token-lint clean, eslint 0 errors, build 61→61 pages, E2E 58/58.

## 2. New creative direction

**Institutional editorial.** Not a rebrand — a sharpening of the existing system into one coherent, art-directed language:

- One signature moment (Instrument Field Canvas ledger); everything else editorial and quiet.
- Static-first HTML; motion is progressive enhancement only.
- No glassmorphism, no particles, no gradient text, no custom cursor, no WebGL on the homepage (spec-enforced).
- No invented proof: all testimonials/results/figures fabricated by prior sessions were removed; remaining stats self-label "Illustrative interface / sample figures / Not client data".

## 3. Visual concepts explored

| Concept | Decision | Rationale |
|---|---|---|
| Full WebGL/Three.js hero | Rejected | `no-3d.test.ts` + mobile TBT baseline (580ms) cannot absorb a GPU stack; spec forbids outside `/craft` |
| CSS 3D hero layers | Adopted | Pure transforms, no WebGL, depth without GPU cost |
| Canvas-2D Instrument Field | Adopted (V3) | Deterministic, scroll-linked, reduced-motion static frame, tier budgets |
| ScrollReveal section motion | Adopted (this session) | Shared gsap/ScrollTrigger/Lenis controller, `gsap.context()` cleanup, reduced-motion safe |
| Vanta/particle backgrounds | Rejected | Spec-forbidden decorative motion |
| Custom cursor / magnetic everywhere | Rejected | Spec-forbidden; harm usability |

## 4. Selected design decisions

- Palette, typography, spacing, motion tokens unchanged from V3 (proven contrast 71/71).
- Homepage = 17-section curated narrative (53,072px → 21,127px of prior stacked layout).
- Motion = one shared controller (`src/lib/motion/scroll.ts`); components use `gsap.context()` and revert on unmount.
- `prefers-reduced-motion`: no canvas, no pin, no scrub, no animation; all content visible final.

## 5. New 3D implementations

**None added to the homepage.** Zero `three`/`@react-three` imports, zero GL rules in next.config — verified by `no-3d.test.ts` and grep. Depth delivered via CSS 3D hero layers and Canvas-2D Instrument Field only. `/craft` remains the sole 3D/experimental surface (unchanged from V3).

## 6. New shaders and motion systems

**Shaders:** none (GLR/GLSL tooling removed by V2; no shaders shipped).

**Motion system:** new `src/components/motion/scroll-reveal.tsx` — section/grid entrance variants using the shared gsap/ScrollTrigger/Lenis owner; `once` semantics; `gsap.context()` revert; no-op under `prefers-reduced-motion`. Wrapped 10 homepage sections.

## 7. Higgsfield assets integrated

**None.** `higgsfeild/` inspected: separate product's Vite/Gradio studio UI assets + lens-study images; not brand-licensed for ImaginarsClub. Rules honoured: folder name never shown, never exposed publicly, no assets shipped, git-ignored, never referenced.

## 8. New interactive components

- `ScrollReveal` (above) — the only new interactive component this session.
- All other interactivity (Instrument Field, fit check, command center tabs/filters, `/craft` stations) inherited from V3 and verified unchanged.

## 9. Service and portfolio improvements

No new service content added (V3 already completed all 18 service pages, 4 practice pillars, `/work` PRV case record, `/platform` system map). This session's focus was homepage integrity + motion + gates, which is the correct priority: the sales path (homepage) was fixed before adding more surface area.

## 10. Conversion improvements

- Primary CTAs ("Check fit in 60 seconds", "Book a working session", "Scope Architect") preserved and verified on live.
- Section navigator anchors verified to scroll to `#home-sequence`, `#home-field`, `#home-trust`.
- Header + footer links: 21/21 resolve (200/308 first hop).
- `/robots.txt`, `/sitemap.xml`, `/rss.xml` all 200; sitemap includes `/craft/` and `/blueprint/`.
- Legacy redirects return 308 (first hop only; `.com` destinations never followed).
- Contact form renders with all fields + submit button (no submission triggered — read-only testing).

## 11. Performance optimizations

- 196 dead CSS selectors / ~1,121 lines removed across `institutional.css` (−517), `editorial.css` (−531), `experience.css` (−68), `evidence.css` (−24); `experience.css` reduced to its one live rule (`.tilt-frame`).
- Dynamic-class stem guards (two-segment stem protection) so dynamically composed classes like `cp-swatch-${tone}` were not falsely pruned — verified every removed family has zero references.
- Unused `useRef` import removed from `cinematic-hero.tsx`.
- Mobile overflow: 0 on all 12 routes; mobile axe clean on 11 routes.

## 12. Accessibility improvements

- Contrast CI 71/71 pass across light/dark/institutional modes.
- Trust handover "past" plates: opacity 0.55 → 0.8 with darkened text ramp (WCAG 2.2 AA).
- Token lint clean.
- Canvas `aria-hidden`; annotations in DOM text; keyboard/skip-to-content preserved.
- Mobile axe: no serious/critical violations on 11 routes (script walks `content-visibility` subtrees first to avoid false positives).

## 13. Security findings

- No secrets in tracked source; `NEXT_PUBLIC_MUAPI_KEY` pattern (dead AI studio) removed with the component.
- `NEXT_PUBLIC_FORMSPREE_ENDPOINT` not set — contact form falls back to mailto; documented as a follow-up, not treated as production lead capture.
- No debugging info exposed; no unnecessary public endpoints added.
- `.com` domain isolation verified before and after every deploy: aliases unchanged, point to separate project.

## 14. MCPs and skills actually used

- `premium-creative-web-engineering` — router/quality bar for static-first, one-primary-motion, performance-budget decisions.
- `3d-website-architect` — informed the no-WebGL-on-homepage decision and CSS-3D/Canvas-2D depth strategy.
- Playwright (browser automation) — live route screenshots, overflow checks, console-error scans, functional checks (24/24), mobile screenshots.
- Vitest / contrast-ci / token-lint / eslint — gate suite.
- Vercel CLI — preview deploy + `alias set` promotion (read-only alias listing for `.com` isolation verification).
- Context7/web research — not needed for this session (all approaches drawn from project specs and verified patterns); no external libraries installed.

## 15. Testing results

| Check | Result |
|---|---|
| `pnpm typecheck` | Pass, 0 errors |
| `pnpm vitest run` | 116/116 passed, 17 files |
| `node scripts/contrast-ci.mjs` | 71/71 passed |
| `node scripts/token-lint.mjs` | clean |
| `pnpm lint` | 0 errors |
| `pnpm build` | Pass, 61/61 static pages |
| `pnpm test:e2e` | 58/58 passed |
| `node scripts/v3-a11y-mobile.mjs` | clean, 11 routes |
| Live route sweep | 12/12 routes 200, 0 console errors, 0 junk markers |
| Live functional checks | 24/24 pass |
| Live mobile overflow | 0 |
| `.com` isolation | Unchanged |

## 16. Deployment status

**Live:** `https://goat-wheat.vercel.app/` — preview deployment `goat-qzu45n899-sohamchoughule168s-projects.vercel.app` aliased via `vercel alias set` (target: null, NOT `--prod`). All 12 routes verified live; `.com` domain untouched.

## 17. Remaining issues / limitations

- Mobile Lighthouse Performance score could not be captured (headless `NO_NAVSTART` trace errors); trusted sub-metrics stable (TBT 0ms, CLS 0, BP 96, SEO 100, A11y 100 on desktop capture).
- Token-level selector-pruning follow-up (V3 known issue) — this session pruned whole retired sections + 196 dead selectors.
- Contact form email backend (`NEXT_PUBLIC_FORMSPREE_ENDPOINT`) not configured — falls back to mailto; documented follow-up.

## 18. Recommended next development mission

1. Capture reliable mobile Lighthouse Performance in a non-headless environment; confirm TBT < 300ms.
2. Token-level CSS pruning follow-up for further bundle reduction.
3. AVIF conversion for hero/sequence images.
4. Configure `NEXT_PUBLIC_FORMSPREE_ENDPOINT` (or remove mailto fallback) before treating the contact form as production lead capture.
5. Keep `/craft` as the sole experimental surface; do not port WebGL to the homepage.

---

**Final state:** tree clean at `1b2f18a`, deployed and live on `https://goat-wheat.vercel.app/`. `.com` domain never touched.
