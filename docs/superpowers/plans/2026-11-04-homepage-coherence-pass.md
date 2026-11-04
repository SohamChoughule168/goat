# Homepage Coherence Pass — restore the approved institutional homepage, remove rogue sections

**Date:** 2026-11-04
**Status:** In progress
**Snapshot:** `459ac82ea3a8df5d3203d194b645df2115ce6f98` (full working tree incl. untracked; dangling commit, nothing moved)
**Authority:** `docs/superpowers/specs/2026-10-31-institutional-instrument-upgrade-design.md` +
`docs/superpowers/specs/2026-10-31-scroll-media-records-design.md` (both user-approved).

## Why this pass exists

Between 2026-11-01 and 2026-11-03, uncontrolled sessions added 20+ sections to
`src/app/(site)/page.tsx` (now 34 `<section>` elements, 6 console errors on the live
preview). Several of these violate the approved design and the user's own recorded
instructions:

- Fabricated proof: `testimonial-cards.tsx` (invented people), `before-after-showcase.tsx`
  ("300% increase in enquiries"), `client-portal-dashboard.tsx` (unlabelled invented figures),
  `before-after-slider.tsx` ("Real work. Real results." over stock imagery).
- Off-brief promotion: `higgsfield-studio.tsx` (third-party AI-model advertising),
  `mcp-skills-showcase.tsx` (agent-tool catalogue), `premium-features.tsx`
  (self-referential "features of this website" cards).
- Anti-patterns the spec forbids: glassmorphism (`glass-cards.tsx`), gradient mesh
  (`gradient-mesh.tsx`), generic 3D/CSS effect demos reusing the same five photos
  (`image-gallery-3d`, `image-stack-3d`, `scroll-synced-images`, `depth-parallax-hero`,
  `scroll-reveal-grid`, `apple-showcase`, `infinite-marquee`, `split-scroll`,
  `pin-section`, `text-scramble`, `scroll-wipe`, `services-bento`, `featured-grid`).
- A placeholder external video (`video-3d-parallax.tsx` → Big Buck Bunny on a Google bucket).
- A duplicated footer (`premium-footer.tsx` renders alongside the layout `Footer`).

The approved homepage is: hero → signal bar → sequence → fit check → premise → stack →
evidence room → capability ledger → command centre → method → economics → trust → field
notes → final CTA. Everything above is out of scope of that design.

## Actions

1. **Recompose `src/app/(site)/page.tsx`** to the approved 14-section structure. Keep the
   institutional copy exactly (tests assert it). Drop `PremiumFooter` (layout already
   renders `Footer`).
2. **Hero:** keep `institution-hero.tsx` (spec 5.1: split layout, still, legend). Fix its
   React fragment-key warning, stop per-pointermove re-renders (write CSS vars via rAF),
   hide duplicate overlay images from assistive tech.
3. **Sequence:** add an `id` prop to `scroll-sequence.tsx`; set `id="home-sequence"` so the
   SectionNavigator anchor works.
4. **Section navigator:** update items to the real sections (Hero, Sequence, Stack,
   Evidence, Capabilities, Command Center, Method, Pricing, Trust).
5. **Delete** the rogue components (home + media + premium footer) and other orphaned
   component files confirmed by a repo-wide import scan.
6. **Prune dead CSS** from `src/styles/*.css` with a logical (selector-can-never-match)
   rule using PostCSS: drop a selector only if one of its positive class tokens no longer
   appears anywhere in `src/` sources. Keep Tailwind-generated CSS untouched.
7. **Tests:** extend `home-copy.test.ts` to lock the policy (no fabricated-proof imports,
   no rogue component names on the homepage). Existing tests must keep passing.
8. **Gates:** `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`, `pnpm test:e2e`,
   plus Lighthouse + axe + visual screenshots on the built export.
9. **Deploy:** `vercel deploy` (preview) → `vercel alias set <url> goat-wheat.vercel.app`.
   Never `--prod`/promote, never touch `.com`. Verify `.com` title/h1 unchanged after.
10. **Record** results in this plan + final report.

## Guardrails

- All prior work is preserved in snapshot `459ac82` before any deletion.
- No fabricated content is added; no client, testimonial or metric is invented.
- Static export (`output: "export"`, `trailingSlash: true`) is preserved.
- Reduced-motion behaviour stays: no pin/parallax/video mount.
- No new dependencies.

## Progress log

- [x] Snapshot commit created (dangling, tree untouched).
- [x] Before evidence captured: live preview 34 sections; 390px overflow 0; 6 console
      errors; `.com` title/h1 recorded for isolation check.

**SUPERSEDED — completed by the V3 session on the same day, with a different hero
decision.** See `docs/master-v3-plan.md` and `docs/master-v3-innovation-report.md`.
Deviations from this plan, all deliberate:

- The mounted hero is `cinematic-hero.tsx` (the one actually rendered since V2); it was
  kept and fixed (fragment keys, paint cost). `institution-hero.tsx` was unused and has
  been deleted; `home-copy.test.ts` was retargeted to `cinematic-hero.tsx`.
- CSS pruning removed whole retired-component sections (31KB) rather than doing a
  selector-level pass; a token-level prune remains a documented follow-up.
- A new signature section, `InstrumentField` (Canvas 2D operating field), was added to the
  curated homepage, which now runs: hero → signal bar → sequence → fit check → premise →
  stack → evidence → field → capabilities → wipe → command → method → economics → trust →
  notes → final CTA (17 sections, 53,072px → 21,127px).
