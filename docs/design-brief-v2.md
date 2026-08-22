# Imaginars — Design Brief v2: Editorial Color Blocks

**Supersedes v1.** The dark direction stays on staging for comparison; it is not deleted.
**Companion file:** `docs/editorial-tokens.css` — every value here is defined there, and every contrast ratio is measured.
**Register:** DixonBaxi, Koto, Instrument, Collins, Work & Co. Bold flat color fields, enormous type, the work shown large.

---

## 0. Why v1 came out basic

v1 was a ban list. It had twenty prohibitions and almost no positive requirements. OpenCode followed it exactly, deleted 1,503 lines, and shipped what was left — and what was left had nothing in it that generates visual power. Subtraction cannot create presence. Minimalism only reads as expensive when what survives is exceptionally crafted and the content underneath is substantial.

So v2 inverts the structure: §2 defines presence mechanics with numeric minimums. The ban list is short and sits at the back (§10).

Real client work is the single most valuable asset on this site, and v1 buried it. §5 exists to put it front and centre.

## 1. Strategic position

Bold editorial color-block work is the register where a small studio beats a large one: flat saturated color, type at scale, real work shown big, and the confidence to leave a field with one sentence in it. The failure mode of the register is timidity — colors slightly muted, type slightly too small, images slightly too contained.

## 2. Presence mechanics — the core of this brief

1. **Field inversion** — full-bleed saturated color edge to edge, changing per section (`.field` system).
2. **Extreme scale contrast** — largest:smallest type ratio > **10:1** (mega 137px @1440 vs 11px micro = 12.4:1).
3. **Display leading below 1.0** — `--leading-mega: 0.88`.
4. **The work, enormous** — case images ≥**60vw**, alternating full-bleed and two-thirds. No uniform thumbnail grids.
5. **Type as graphic** — a key phrase or wordmark set enormous and cropped by the viewport edge. One per page.
6. **Mono indices + heavy rules** — `01 / 02 / 03`; rules at 2px, dividers at 4px.
7. **Reveal by uncovering** — field wipe (`clip-path`) and line mask; not fade-ups.

### Presence floor
- ≥3 chromatic fields (paper/ink neutrals excluded)
- ≥1 mega statement at **≥120px** @1440
- ≥2 work images at **≥60vw**
- 1 type-as-graphic moment
- Type ratio ≥10:1
- 1 field containing a single sentence and nothing else

A page that clears §10 but misses this floor is a build failure.

## 3. Color

Warm paper `#F4F1EA`, warm ink `#12100E`, five saturated fields with fixed inks:
cobalt `#1A2FC4` (8.28:1) · violet `#3D1580` (11.51:1) · chartreuse `#D6F24B` (15.06:1) · jade `#00A878` (6.21:1) · vermilion `#FF5B2E` (6.14:1) · paper-on-ink 16.83:1.

Max three chromatic fields per page. Never two colors inside one field. No two saturated brights adjacent. Map hues to practice areas so color carries wayfinding.

## 4. Typography

Clash Display 600 display · Satoshi 400/500 text · Geist Mono 500 micro. Three families, four files. Inter banned. Tracking −0.04em mega → +0.14em micro only. Body 16px.

## 5. The work module

Three case studies, `.work-item`, alternating `--wide` / `--split`. Mono index, client name as heading, one-line problem, outcome number where real. Images ≥60vw, aspect 4/3, sharp corners, hover scale to 1.04 (images only). No usable image → not on homepage; one strong client gets a full field of its own.

## 6. Motion

Line mask (600ms, 70ms stagger, editorial ease) and field wipe (600ms, `cubic-bezier(0.65,0,0.35,1)`), both anime.js territory; everything else CSS 140–300ms. One marquee permitted (48s+, real words, pause on hover, reduced-motion safe). Reduced motion honored completely.

## 7. Copy

Mega statement ≤12 words, something only you would say ("Imagination, engineered." stays). Lede ≤22 words. Real numbers or cut the claim. Banned phrasing list from v1 stands.

## 8. Field map

| # | Section | Field |
|---|---------|-------|
| 01 | Hero | paper |
| 02 | Proof strip | ink |
| 03 | Selected work | paper |
| 04 | Practice areas | cobalt |
| 05 | Wide statement | vermilion |
| 06 | Mechanism | paper |
| 07 | Evidence | chartreuse |
| 08 | Closing CTA | ink |
| — | Footer | paper |

## 9. v1 reversals
Marquee permitted (slow) · 600ms for masks/wipes · three typefaces · image scale 1.04 · 2px/4px rules · radius 0/2px sharp. Everything else from v1 stands.

## 10. Still banned
Multi-hue gradients · gradient text · glassmorphism · blobs/mesh · Inter/4th family/5th weight · emoji icons · stock photos & abstract renders · pure #FFF/#000 · radius >2px rectangular · uniform 3-up thumbnail grids · scroll-jacking/parallax/typewriter/counting · carousels · placeholders/invented stats/fake logos · >3 chromatic fields per page · two colors in one field · field-ink overrides.

## 11. Acceptance checklist
Presence floor with measured numbers · Playwright screenshots 1440×900 + 390×844 · type ratio ≥10:1 measured · mega ≥120px @1440 · two work images ≥60vw · adjacency checked · all values trace to tokens · contrast re-measured per field · four font files verified · keyboard pass · reduced-motion verified · CLS <0.05 · Lighthouse ≥95 perf+a11y · axe clean · 18 tests green · SEO untouched · zero placeholders.

## 12. Build order
STEP 0 setup (branch, Playwright, Clash restore, tokens, design-kit fields) → STOP.
STEP 1 work module first → STOP. STEP 2 hero (+ type-as-graphic, report px size) → STOP.
STEP 3 remaining fields per map. STEP 4 full verification (screenshots, axe, Lighthouse, checklist) — staging only, no .com promotion until sign-off.
