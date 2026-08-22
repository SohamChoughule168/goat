# Imaginars — Design Brief

**Direction:** dark, precise, technical. The Linear / Vercel / Raycast register.
**Companion file:** `docs/tokens.css` — every value referenced here is defined there.
**How to use this:** re-read between sessions. This is a hard specification, not inspiration. §10 is a ban list — treat a violation as a build failure.

---

## 0. Read this part first

The reason the last build came out anonymous is not the toolchain. Superpowers, 71 GSD skills, a shadcn MCP and an anime.js MCP are all *capability*. None of them supply taste, and taste in this context is almost entirely a function of constraint.

"Modern, creative, best colors, animations" is four directions with no destination. Given that instruction, any model converges on the statistical center of everything it has ever seen labelled *modern website*: a violet-to-pink gradient, glassmorphic cards over blurred colored blobs, Inter at 700, and a 40-pixel fade-up on every element. That output is not a failure of the model. It is the correct answer to the question that was asked. It looks generic because it *is* the average.

Premium is what happens when the number of decisions is small and each one is defensible. One typeface plus one mono. One accent, used on five percent of the screen. One entrance animation, everywhere. The restraint is the product. Everything below exists to remove the agent's freedom to average.

**Positioning (to be confirmed by owner):**

- What Imaginars actually does, in one sentence a stranger would understand: `PROPOSED — see docs/design-decisions.md §1`
- Who it is for, specifically: `PROPOSED`
- The one thing a visitor must do on this page: `PROPOSED`
- Three real proof points: `PROPOSED`

---

## 1. Typography

Two typefaces. Four weights total. Satoshi for everything, Geist Mono for micro-labels and data only.

**Inter is banned.** Not because it is a bad typeface — it is an excellent one — but because it is the default of the entire category and now reads as *nobody chose this*. Satoshi occupies the same functional space with tighter, more geometric forms.

The rules that matter more than the font choice:

- **Tracking scales inversely with size.** Display type at `-0.035em`, body at `-0.006em`, and positive tracking *only* on small uppercase mono (`0.14em`).
- **Cap heading weight at 500.** `700` is permitted for the hero display line only, and only above 48px.
- **Never pure white body text.** `--text-1` is `#F2F4F5`.
- **Three text tiers, and use all three.** `--text-1` headings, `--text-2` body, `--text-3` meta.
- **Body copy is 15px, not 18px.** `--measure` caps prose at 62ch; the lede at 46ch.

Signature move: the mono eyebrow — 11px uppercase, `0.14em`, `--text-3`, above section headings (`.micro`). Never for body copy.

## 2. Color

A cool neutral canvas with exactly one warm accent (`#FFB224`). Cold gray-blue surfaces, one warm amber. Do not add a second hue. Depth comes from the four-step surface ramp plus hairline borders — not shadows.

**Accent discipline.** `--accent` covers ≤~5% of any viewport and appears in exactly four places: primary CTA fill, active navigation indicator, focus ring, one deliberate data highlight per page. Accent body text, gradient headings, glowing accent shadows, second accents: forbidden.

Contrast measured: body 7.78:1, headings 18.06:1, meta 5.10:1, ink-on-accent 10.97:1. Re-measure if you change anything.

## 3. Depth without glassmorphism

Glassmorphism (`backdrop-filter: blur()` on translucent white cards) banned. Colored blobs, mesh gradients, box-shadow glows banned. Replacement:

1. A lighter surface (ramp step).
2. A hairline border (`--border` / `--border-strong`).
3. The lit top edge (`.surface--lit`) — 1px highlight along card top, brightest center.
4. An inset highlight on raised surfaces.

Exactly one background gradient site-wide: `.hero-wash`, accent radial behind hero at 6% opacity. No mesh. No orbs. No second color.

## 4. Layout

12-column grid, `1120px` container. Section rhythm `--section-y` (96–160px). All measurements off the 4px scale. Left-aligned hero. Never centered long-form prose. Vary section rhythm — if two adjacent sections share a skeleton, rebuild one. Nested radii shrink: inner = outer − padding.

## 5. Motion

One signature idea: precision reveals. 10px vertical + opacity, 220ms, `cubic-bezier(0.16, 1, 0.30, 1)`, 50ms sibling stagger, one IntersectionObserver, unobserve after firing.

One hero moment: a hairline rule draws itself across the viewport on load (`stroke-dashoffset`, 420ms); display line and lede reveal off its completion. anime.js earns its place here and nowhere else. Everything else: CSS transitions.

Banned: scroll-jacking, stacked parallax, bounce/elastic easing, >500ms animations, typewriter effects, unjustified marquees, counting-number animations over invented statistics, `scale(1.05)` hovers, animating everything. Hover states 120ms, 1px lift. `prefers-reduced-motion` fully honored.

## 6. Components

`.btn`: 40px, 6px radius, 14px/500, dark ink on accent fill. Secondary: transparent + `--border-strong`. Press = `translateY(0.5px)`. Inputs inset on `--surface-1`, brighten border on focus. Focus-visible: 2px accent ring, 2px offset — never removed without replacement.

Icons: Lucide, 1.5px stroke, 16 or 20px, `--text-3`. No emoji anywhere in the UI.

Imagery: no stock office people, no abstract 3D blobs, no generic gradient renders. Without real product UI or photography: type, hairlines, space.

## 7. Copy

Headline ≤8 words, states what the thing does, no adjectives. Subhead ≤22 words. Real numbers beat adjectives. Banned phrasing: "Elevate your —", "Supercharge your —", "Unlock the power of —", "Take your — to the next level", "seamless", "cutting-edge", "revolutionary", "one-stop solution", "leverage" as a verb, placeholder text. If a real number isn't available, cut the claim.

## 8. Page structure

Compact nav, hairline bottom border, gains background opacity on scroll. Left-aligned hero (mono eyebrow → display → lede → primary CTA + secondary). Proof strip: three real numbers, vertical hairlines. Core offering as asymmetric split. A differentiator explaining mechanism. One specific piece of evidence. Closing CTA restating offer in one line. Quiet footer. Nine sections maximum — cutting two is nearly always an improvement.

## 9. Acceptance checklist

- [ ] Screenshots at 1440×900 and 390×844
- [ ] Grayscale test: hierarchy readable without accent
- [ ] Squint test: headline first, CTA second
- [ ] Zero §10 violations
- [ ] Every value traces to tokens.css
- [ ] Exactly one accent hue; ≤5% coverage
- [ ] Four font weights loaded
- [ ] Contrast ≥4.5:1 body, ≥3:1 large — measured
- [ ] Full keyboard pass, visible focus
- [ ] CLS < 0.05
- [ ] prefers-reduced-motion verified
- [ ] No adjacent sections sharing a skeleton
- [ ] Lighthouse ≥95 perf + accessibility
- [ ] Zero placeholders, fake logos, invented statistics

## 10. Hard bans

1. Violet/indigo/blue-to-pink gradients. Any multi-hue gradient.
2. Gradient text on headings.
3. Glassmorphism — backdrop-filter blur on translucent cards.
4. Blurred colored blobs, orbs, mesh gradients.
5. Inter. Third typefaces. Fifth weight.
6. font-weight 700+ under 48px (hero display excepted above 48px).
7. Emoji as icons or anywhere in the UI.
8. Stock photos of people; abstract 3D renders; generic gradient art.
9. Pure #000 or #FFF.
10. Box-shadow glows for depth/attention.
11. Three consecutive centered-heading + three-icon-card sections.
12. border-radius above 16px on rectangular elements.
13. Centered prose; prose wider than 62ch.
14. Animations >500ms; bounce/elastic; scroll-jacking; stacked parallax; typewriter; scale(1.05) hovers.
15. Focus outlines removed without replacement.
16. Carousels and sliders.
17. "Trusted by" logo walls with placeholder logos.
18. shadcn/ui default zinc theme.
19. Two accent colors.
20. Banned phrases; placeholder text.

## 11. Build order

STEP 1 — Decisions doc, no code. STOP for review.
STEP 2 — Token layer only; render button/input/card; screenshot. STOP.
STEP 3 — Hero only (eyebrow, display, lede, CTAs, hairline draw via anime.js). Screenshots 1440/390. STOP for approval.
STEP 4 — Remaining sections one at a time; confirm no shared skeleton with previous.
STEP 5 — §9 checklist, Playwright screenshots + keyboard pass, report failures rather than fixing silently.

Constraints: every value traces to tokens; CSS transitions everywhere; anime.js ONLY for the hero draw; real copy only; ask when genuinely underspecified — never average toward a default.

*Stack note: fire skills at checkpoints, not all at once.*
