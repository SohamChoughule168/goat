# Imaginars v3 — Repository Inventory (Phase 0)
**Branch:** `v3-professional` (from `main` @ `a4bbf3b`) · **Date:** 2026-08-22

## 1. Content layer state

### Services — `src/content/services.ts`
**18 services** across **4 practice areas** (build / grow / content / enable).

Fields populated today: `slug`, `title`, `pillar`, `tagline`, `description` (≈25–35 words), `deliverables[]` (4–6 items), `faqs[]` (**2–3**, spec floor is ≥3 — six services have exactly 2), `legacySlugs[]`.

| Service | desc | deliverables | faqs | timeline | exclusions | priceBand | process | related | caseRef |
|---|---|---|---|---|---|---|---|---|---|
| web-development | ✓ | ✓(6) | 3 | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| mobile-app-development | ✓ | ✓(5) | 3 | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| ai-driven-websites | ✓ | ✓(5) | 2 | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| website-refurbishment | ✓ | ✓(5) | 2 | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| digital-marketing | ✓ | ✓(5) | 2 | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| social-media-marketing | ✓ | ✓(5) | 2 | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| sem | ✓ | ✓(5) | 2 | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| generative-engine-optimization | ✓ | ✓(4) | 2 | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| answer-engine-optimization | ✓ | ✓(4) | 2 | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| meta-advertising | ✓ | ✓(5) | 2 | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| google-business-profile | ✓ | ✓(5) | 2 | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| google-marketplace | ✓ | ✓(4) | 2 | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| brand-management | ✓ | ✓(4) | 2 | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| video-editing | ✓ | ✓(4) | 2 | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| thumbnail-design | ✓ | ✓(4) | 2 | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| online-events | ✓ | ✓(4) | 2 | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| google-ai-integration | ✓ | ✓(5) | 2 | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| talent-acquisition | ✓ | ✓(4) | 2 | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |

No service has a long-form body. Long-form copy is Phase-2 work; exclusions/priceBand need owner input (see gaps doc).

### Case studies — `src/content/work.ts`
**1** (`prv-financial-services`). Outcomes are qualitative (delivered / on schedule / owned) — **no quantified metrics exist in the repo**. Proof links live and verified.

### Insights — `src/content/insights.ts`
**4 articles**: generative-engine-optimization-guide, website-performance-that-converts, ai-in-web-development-practical-view, write-a-brief-that-builds-a-better-website. Body length ≈ **200–300 words each** (floor: ≥800). Author is "Team ImaginarsClub".

### Client logos / testimonials
**Zero** in the repository. The previous site's testimonials were removed as unverifiable. Spec §1 states logos and testimonials are *available* — they have not been supplied to this branch.

### Positioning
`content/positioning.md` does not exist. Spec §12 questions unanswered.

## 2. Hardcoded colour values in components

| File | Count | Values |
|---|---|---|
| `src/app/layout.tsx` | 1 | `themeColor: "#08090A"` (viewport export) |
| `src/app/opengraph-image.tsx` | 6 | Forge-era OG card: `#0a0a0f` bg, `#f4f1ea` text, `#6c63e8` accent |
| `src/app/icon.svg` | 2 | ink + violet mark colours |

All other components reference semantic CSS variables only (`grep -rE '#[0-9a-fA-F]{6}' src/components src/app` → above; `rgb(`/`oklch(` → 0 hits). These are replaced in Phase 1 when the token layer lands.

## 3. Fonts currently loaded

`src/lib/fonts.ts` → Satoshi **400/500/700** (local woff2, self-hosted, `next/font/local`, swap) + Geist Mono **500** (`next/font/google`). Variables: `--font-satoshi`, `--font-geist-mono`. Files: `src/fonts/Satoshi-{400,500,700}.woff2`. No Clash Display on this branch (removed in commit `cef2344`); woff2 recoverable from git history if a future spec wants it.

## 4. Route count

Production build prerenders **42 routes** total, of which indexable content routes = **31**:

- 8 static pages (/ , about, services, work, insights, contact, legal/privacy, legal/terms)
- 18 × /services/[slug]
- 4 × /insights/[slug]
- 1 × /work/[slug]

Excluded from indexable count: design-kit (noindex), sitemap.xml, robots.txt, opengraph-image, icon.svg, _not-found.

**v3 target ≥40 → gap of ~9 routes**, closed by Phase 2's tree (pricing, estimate, process, trust, careers(+slug), faq, legal/cookies, +2 case studies, +2 articles).

## 5. Real image assets

None in the repository. `public/` contains only framework scaffolding icons; all imagery previously shipped was stock placeholders removed during the v1 rebuild. `docs/screenshots/**` are documentation captures, not site assets. Per spec §1, usable client visuals exist outside the repo and must be supplied (gaps doc G-IMG).
