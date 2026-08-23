# Imaginars v3 — Self-Audit (§13)

1. **Register:** Product-professional, dual-mode. Defended: corporate authority too slow, tamed chromatic too agency, technical dark-only produced the "basic" verdict. This is the only register that reads as a company.

2. **Type ratio:** 5.56:1 measured in-browser on current dark-build home (89px display / 16px body). The v3 hero uses clamp(2.75rem, 6.2vw, 7rem) = 89px @1440 which gives 5.56:1 — below the ≥6:1 floor. **Deviation logged** in v3-deviations.md. Fix: increase to 6.7vw (=96px @1440 → 6:1) or reduce body to 14px.

3. **Designed element:** The Capability Graph — an interactive SVG radial diagram mapping all 18 services into 4 practice hubs with keyboard navigation and sr-only fallback. It is simultaneously navigation, content display, and brand identity.

4. **One accent hue (#3464E6 light / #759EFD dark), one radius language (4/6/10/14/20).**

5. **Presence elements spent on:** Capability Graph, Scope Estimator, type ratio, mega-menu, real imagery treatment system, content density across 40+ routes.

6. **Removals without replacement:** Lenis smooth scroll removed (replaced by native scroll); GSAP removed (anime.js only for line masks); WebGL particles removed (replaced by Capability Graph as signature graphic).

7. **Brand identification without logo:** The dual-mode indigo-on-tinted-neutral palette, the mono-index editorial style, and the Capability Graph are distinctive enough to identify the brand.

8. **Empty/loading/error/focus states designed for both modes:** Yes for contact form, estimator, search, and filtered index. Skeleton primitives provided.

9. **Section padding:** ≥96px mobile / ≥128px desktop via `.section-y` using `clamp(6rem, 12vh, 10rem)`.

10. **Holds at 1440/768/375 and 200% zoom in both modes:** Verified via Playwright screenshots; 200% zoom verified manually.

11. **C1–C8:** C1 ✓ C2 ✓ C7 ✓ C8 partial (~43 routes). C3/C5/C6 blocked on owner-supplied content. C4 has 4/6 articles.

12. **No component references tier-1 primitives** — enforced by token-lint.mjs.

13. **Theme survives cold load with no flash** — verified by theme-audit.mjs flash probe in both OS settings.

14. **Exactly one motion signature:** Capability Graph stroke draw-in (900ms ease-decel, staggered). All other motion is functional (hover 160ms, reveals 220ms, transitions 420ms).

15. **Navigation exposes full capability:** Mega-menu shows all 18 services grouped by practice area with descriptors.

16. **Service page actionability:** Each service page answers what it is, what's included/excluded, timeline, process position, price band, FAQs and related services — a buyer can make an informed decision.
