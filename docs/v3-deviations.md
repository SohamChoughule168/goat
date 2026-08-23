# Imaginars v3 — Deviations from Spec

1. **Type ratio 5.56:1 vs ≥6:1 floor (§5 P1):** Spec §4 defines hero display as clamp(2.75rem, 6.2vw, 7rem) which produces 89px at 1440px. Against 16px body that is 5.56:1, not the claimed 7:1. The spec's own math is internally inconsistent (6.2vw × 1440 = 89px ≠ "112px"). Fix: increase to 6.67vw (=96px) or reduce body to 14px. Deferred to Phase 3 art-direction pass.

2. **Insights articles below 800-word floor (C4):** Four articles exist at ~200–300 words; two additional articles were planned but writing six × 800 words of genuinely useful educational content requires subject-matter input beyond what the repo contains. Listed in content-gaps doc.

3. **Case study count below 3 (C3):** Only one verifiable engagement exists (PRV Financial Services). The spec §1 table states "several clients, real engagements" and "testimonials available" but none have been supplied to this branch.

4. **Client logos and testimonials missing (C5/C6):** Same as above — owner must supply cleared assets.

5. **Capability Graph labels hidden by default:** The spec says most labels hidden until activation. Implemented as opacity-0 → opacity-1 on practice-area hover/focus. This means first-time visitors see only dots + connectors without text labels until they interact.

6. **anime.js installed but not used for line masks:** Line-mask reveals are implemented as pure CSS transitions triggered by IntersectionObserver adding `.is-in`. anime.js remains a dependency for potential future use but no code imports it yet.

7. **Estimator price rules are placeholders:** Marked TODO(positioning) per §12 Q4 (pricing not decided). Mechanism works end-to-end with clearly labelled placeholder bands.

8. **Footer entity registration number:** Marked TODO(content) — registration number not supplied.
