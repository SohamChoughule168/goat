# Overnight Transformation Report — ImaginarsClub Services

**Date:** 2026-11-04 (session) / 2026-11-09 (finalised)
**Authorized website:** https://goat-wheat.vercel.app/ (Vercel project `goat`, team `sohamchoughule168s-projects`)
**Forbidden:** `imaginarsclubservices.com` / `www.imaginarsclubservices.com` — verified isolated; aliased to a different project (`imaginars-club-website-8iwqmm5yj`) and never touched by any command in this session.
**Deployment:** Preview `https://goat-qzu45n899-sohamchoughule168s-projects.vercel.app` promoted via `vercel alias set` to `goat-wheat.vercel.app` (target: null = preview, NOT `--prod`).
**Git checkpoints:** `3feae54` (V2 state) → `cd090cd` (V3 work) → `afe0fa6` (contrast + CSS prune) → `1b2f18a` (Round 2 scroll-reveal motion).

---

## 1. Executive summary

ImaginarsClub Services went from a bloated homepage (40+ stacked sections, 37 retired components, fabricated testimonials, invented client figures, a broken external-API AI studio, and a placeholder Big Buck Bunny video) to a clean, curated, institutional digital experience:

- A 17-section editorial homepage with a single signature moment (the deterministic Canvas-2D "Instrument Field" operating ledger).
- Zero invented proof: all fabricated testimonials, results, and figures removed; every remaining statistic self-labels as illustrative/sample.
- Full motion layer added via `ScrollReveal` using the project's existing shared gsap/ScrollTrigger/Lenis controller with `gsap.context()` cleanup, fully respecting `prefers-reduced-motion`.
- ~1,121 lines (196 selectors) of dead CSS pruned with dynamic-class stem guards.
- All gates green: `typecheck` 0 errors, vitest 116/116, contrast 71/71, token-lint clean, eslint 0 errors, build 61/61 static pages, E2E 58/58, mobile axe clean on 11 routes, zero console errors on 12 live routes, zero horizontal overflow at 390px.
- Deployed and verified live on `https://goat-wheat.vercel.app/`; `.com` domain verified unchanged (title/h1 identical to baseline).

---

## 2. Initial website condition (measured)

Source: `docs/master-v3-plan.md` baseline + live measurement on `https://goat-wheat.vercel.app` before this session.

| Aspect | Before |
|---|---|
| Homepage structure | 40+ stacked sections; ~15 duplicate V1 demo sections |
| Fake/invented proof | 3 invented testimonials; "300% increase in enquiries"; invented portal dashboard figures |
| Broken external call | `higgsfield-studio.tsx` called `api.muapi.ai` with undefined `NEXT_PUBLIC_MUAPI_KEY` |
| Dead/demo tech | `premium-features`, `glass-cards`, `video-3d-parallax` (Big Buck Bunny sample URL), `image-gallery-3d`, `image-stack-3d`, etc. |
| Duplicate UI | duplicate premium footer alongside layout `Footer`; repeated "modules"/"materials" sections |
| Console errors | 6 on live homepage |
| Build/tests | `pnpm build` pass (60 pages); `typecheck` pass; vitest 111/111; contrast 71/71 |

**Authoritative baseline (captured before this session):**
- Desktop Lighthouse: Performance capture flaky in headless env (NO_NAVSTART); Accessibility 100 / Best Practices 96 / SEO 100 / TBT 0ms / CLS 0.

---

## 3. Creative research findings

Research sources consulted (read-only, no assets copied): Awwwards, Godly, SiteInspire, Dribbble, Behance, Three.js / React Three Fiber / Drei showcases, GSAP showcases, Codrops, GitHub open-source patterns, Apple product-page grammar (editorial typography, sticky tables of contents, restrained hero, paper/serif accents).

Key directions that informed the final look:

- **Editorial paper aesthetic:** bone-white paper, ink mono labels, cobalt accents, serif display for numbers/labels, hairline rules — matches the studio's actual field (institutions, admissions systems) rather than generic agency chrome.
- **One signature moment, everything else quiet:** the Instrument Field canvas sits beside restrained editorial sections; no particle fields, no glassmorphism, no gradient text, no custom cursor — per the approved spec (§3 of `docs/superpowers/specs/2026-10-31-institutional-instrument-upgrade-design.md`), which forbids these outside `/craft`.
- **Static-first:** every section is present in server-rendered HTML; motion is progressive enhancement only. With JavaScript off or reduced motion, the page is a complete static document.

Deliberately rejected: Three.js/WebGL on the homepage (project's `no-3d.test.ts` enforces this; mobile TBT baseline could not absorb a GPU stack), Vanta backgrounds, Anime.js, React Spring, hosted Spline runtimes, paid 3D services.

---

## 4. Design improvements implemented

### Visual identity (kept and sharpened, not rebranded)

The existing institutional system was judged coherent and honest and was retained as the single source of truth:

- Palette: bone `#f2eee5`, ink `#11120f`, ink-2 `#2a2b26`, ink-3 `#5c5c53`, ink-4 `#636258`, cobalt `#1f3ad8`, dark `#0d0f0c`.
- Typography: Geist Sans (body/UI), Geist Mono (labels/index), Instrument Serif (display).
- Motion tokens: `cubic-bezier(.16,1,.3,1)` entrances, `.65,0,.35,1` state changes; 180/320/600/900ms durations; 2px hover lift, no scale-pop.

### Sections removed (integrity + curation)

Deleted 37 retired components and their CSS: `testimonial-cards`, `before-after-showcase`, `client-portal-dashboard`, `higgsfield-studio`, `mcp-skills-showcase`, `premium-features`, `glass-cards`, `video-3d-parallax`, `image-gallery-3d`, `image-stack-3d`, `scroll-synced-images`, `depth-parallax-hero`, `scroll-reveal-grid`, `apple-showcase`, `infinite-marquee`, `split-scroll`, `pin-section`, `text-scramble`, `scroll-wipe`, `services-bento`, `featured-grid`, plus legacy `home/*` sections and `motion/*`, `canvas/*`, `spatial/*`, `v6/*` dead files.

### Sections kept / refined

Hero (`cinematic-hero`, fixed fragment keys + paint cost), signal bar, scroll sequence (5 photographic stages), fit check, premise, stack (interactive ledger of 8 operating layers), evidence room (verified PRV record + illustrative blueprints), Instrument Field, capability ledger, command center (illustrative, self-labelled), method, economics, trust commitments, field notes, final CTA. Single footer (`Footer`) instead of duplicate premium footer.

---

## 5. New components

| Component | Purpose | Round |
|---|---|---|
| `src/components/motion/scroll-reveal.tsx` | Entrance choreography for sections using shared gsap/ScrollTrigger/Lenis controller; `gsap.context()` cleanup; reduced-motion skip; `section`/`grid` variants | Round 2 (motion) |
| `src/components/motion/scroll-sequence.tsx` (refined) | Generic pinned image sequence with shared progress hook, static fallback | existing (V3) |

All other motion uses the project's pre-existing shared controller (`src/lib/motion/scroll.ts`) — no second Lenis/ScrollTrigger owner was introduced.

---

## 6. New 3D effects

**None were added.** Per the approved design spec and project policy, the homepage carries **no WebGL/Three.js** (`no-3d.test.ts` enforces zero `three`/`@react-three` imports and zero webpack/Turbopack GL rules). Depth is delivered through:

- CSS 3D space on the hero image layers (pure transforms, no WebGL).
- Canvas-2D `InstrumentField` (deterministic operating-field ledger).
- Sticky/scroll choreography (ScrollReveal + section navigator).

The `InstrumentField` Canvas-2D scene (eight layer plates assembling on scroll, records to ledger spine, handover seal; DPR-capped, offscreen-paused, reduced-motion static frame) was built in V3 and remains the signature visual moment.

---

## 7. Motion and animation improvements

**Round 2 — scroll-reveal motion** (committed `1b2f18a`):

- `ScrollReveal` component: children render final-position (no layout shift); on fine-pointer devices without reduced motion they fade/slide up on section entry via the shared gsap/ScrollTrigger/Lenis controller with `gsap.context()` cleanup and `once` semantics.
- Wrapped 10 homepage sections: thesis, stack, evidence-room, capabilities, command-center, method, economics, trust, notes, final CTA.
- Hero, sequence, fit-check, field, wipe retain their own existing motion.
- Respects `prefers-reduced-motion` (children stay in place, no animation), and degrades gracefully if the motion controller fails to initialize.

Verified: typecheck 0, vitest 116/116, lint 0 errors, build 61/61, E2E 58/58, mobile overflow 0, live routes clean.

---

## 8. Higgsfield assets utilized

**None.** The `higgsfeild/` folder was inspected. It contains a separate product's UI assets (a Vite/Gradio studio app) and lens-study images — not brand-licensed material suitable for ImaginarsClub Services. Per the standing rules:

- Folder name never shown on the website.
- Folder never exposed publicly; no public route created.
- No assets shipped; folder is git-ignored (`/higgsfield/`) and never referenced from the site.

This was a deliberate judgement, not an oversight.

---

## 9. Mobile improvements

- Zero horizontal overflow at 390px on all 12 routes (`/`, `/platform/`, `/solutions/`, `/work/`, `/pricing/`, `/process/`, `/trust/`, `/craft/`, `/about/`, `/contact/`, `/book/`, `/blueprint/`).
- Hero, field (Canvas ledger), command center, and trust sections captured and verified at mobile.
- Existing mobile behaviors preserved: static fallback under reduced motion, 44px touch targets, hero CTA bar sticky at bottom on mobile, navigator sticky on desktop.

---

## 10. Performance measurements

**Recorded (real, not fabricated):**

| Metric | Before (baseline) | After (live) |
|---|---|---|
| Console errors on `/` | 6 | 0 |
| Horizontal overflow @390px | 0 | 0 |
| Homepage inline CSS | 147KB (`institutional.css`) | ~117KB (pruned −1,121 lines total across 4 sheets) |
| Build | 60 static pages | 61 static pages |
| E2E | 10/10 (V2 harness) | 58/58 |
| Mobile axe (serious/critical) | clean (11 routes) | clean (11 routes) |
| Lighthouse desktop (headless env flaky; NO_NAVSTART) | A11y 100 / BP 96 / SEO 100 / TBT 0ms / CLS 0 | A11y 100 / BP 96 / SEO 100 / TBT 0ms / CLS 0 |

Mobile Lighthouse Performance could not be captured reliably in this workstation's headless environment (Lighthouse `NO_NAVSTART` trace errors on both mobile and desktop runs); the trusted sub-metrics above are stable across runs.

---

## 11. Accessibility improvements

- Contrast CI: 71/71 pairings pass (light, dark, institutional modes); `--ink-4` on bone raised from failing 2.99:1 to passing 5.31:1 in V3; trust handover "past" plates raised 0.55 → 0.8 with darkened text ramp (WCAG 2.2 AA).
- Token lint: clean.
- Mobile axe on 11 routes: no serious/critical violations; script walks `content-visibility: auto` subtrees first to avoid false positives.
- Keyboard/anchor/skip-to-content preserved; section navigator anchors verified to scroll; Canvas `aria-hidden`; all annotations are DOM text.

---

## 12. SEO improvements

- All 12 routes serve 200 with `<h1>` and `<title>`.
- `/robots.txt`, `/sitemap.xml`, `/rss.xml` serve 200; sitemap includes `/craft/` and `/blueprint/`.
- Legacy redirects (`/portfolio`, `/blog`, `/services/*`) return 308 (first hop; `.com` destinations never followed — domain isolation).
- Canonical/meta/OG metadata preserved from V3 (`src/lib/seo.ts`).
- No fake reviews, awards, statistics, or invented customers.

---

## 13. Functional testing results

| Check | Result |
|---|---|
| `pnpm typecheck` | Pass, 0 errors |
| `pnpm vitest run` | 116/116 passed, 17 files |
| `node scripts/contrast-ci.mjs` | 71/71 passed |
| `node scripts/token-lint.mjs` | clean |
| `pnpm lint` | 0 errors, 5 benign `` alt suggestions |
| `pnpm build` | Pass, 61/61 static pages |
| `pnpm test:e2e` | 58/58 passed |
| Live route sweep | 12/12 routes 200, 0 console errors, 0 junk markers |
| Live functional checks | 24/24 pass (anchors, navigator scroll, header+footer links 21/21, robots/sitemap/rss, 404, contact form, legacy redirects) |
| Live mobile overflow | 0 on home; 0 across all 12 routes |
| `.com` isolation | Unchanged (title/h1 identical to baseline) |

---

## 14. Build and deployment results

- `pnpm build`: 61/61 static pages, TypeScript clean, 53 RSC aliases generated.
- Preview deployed: `goat-qzu45n899-sohamchoughule168s-projects.vercel.app` (READY, target: null — preview).
- Promoted: `vercel alias set` → `https://goat-wheat.vercel.app` now points to the new preview deployment.
- **Never ran `vercel deploy --prod` or `vercel promote`; never touched `.com` aliases/DNS.** Verified after both deploys: `www.imaginarsclubservices.com` and `imaginarsclubservices.com` still resolve to the separate `imaginars-club-website` project with identical title/h1.

---

## 15. Before-and-after screenshots

`docs/screenshots/overnight/live/`:

- `home-1440-hero.png`, `home-1440-field.png`, `home-1440-command.png`, `home-1440-sequence.png`, `home-1440-evidence.png` (desktop, pre-promotion QA).
- `home-390-hero.png`, `home-390-field.png`, `home-390-command.png` (mobile).
- `final-home-hero.png`, `final-home-field.png`, `final-home-command.png`, `final-home-trust.png`, `final-work.png`, `final-trust.png` (live, post-promotion).

(`docs/screenshots/v3/` holds the V3 before/after set: `before-home-desktop.png`, `before-mobile-01.png`, `v3-local-desktop-01…26.png`, `v3-local-mobile-01…`.)

---

## 16. Remaining limitations

- Mobile Lighthouse Performance score could not be captured (headless `NO_NAVSTART`); trusted sub-metrics (TBT, CLS, BP, SEO, A11y) are stable.
- Token-level selector pruning follow-up noted in V3 progress; this session pruned whole retired sections (1,121 lines) plus 196 dead selectors.
- `vercel.json` still declares the `.com` redirect targets as historical config; these are unchanged and point only at the separate `.com` project — no production alias modification.

---

## 17. Recommended future improvements

1. Capture a reliable mobile Lighthouse score in a non-headless environment; if TBT stays under 300ms, the site meets its mobile performance target.
2. Token-level CSS pruning follow-up (V3 known issue) for further bundle reduction.
3. Consider AVIF conversion for hero/sequence images (currently WebP).
4. Monitor the contact form's Formspree/mailto path (`NEXT_PUBLIC_FORMSPREE_ENDPOINT` not set in repo) before treating it as a production lead capture.
5. Keep `/craft` as the sole experimental/3D surface; do not port WebGL to the homepage.

---

**Deployment URL:** https://goat-wheat.vercel.app/  
**Final build verified:** `1b2f18a` — aliased and live; `.com` domain untouched.
