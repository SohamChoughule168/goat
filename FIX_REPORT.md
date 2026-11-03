# Release report — editorial redesign, interior pages, pricing and responsive handoff

**Prepared:** 22 October 2026  
**Scope:** Editorial redesign, interior-page and service/pillar expansion, pricing/content update, SEO metadata correction, responsive QA, production deployment and a static preview build.

## Live links

- **Production (Vercel alias):** https://goat-wheat.vercel.app
- **Production deployment:** https://goat-hi6sjm93l-sohamchoughule168s-projects.vercel.app
- **Static preview (here.now):** https://placid-tropic-5hg5.here.now/

The here.now preview is anonymous and expires at **2026-10-23T11:02:36.238Z** (24 hours).
Claim URL: https://here.now/c/tJKZvlIRtW6NF-XQ

## What changed

### Editorial redesign

- Replaced generic card grids and UI chrome with an editorial system: serif display type, ruled sections, restrained accent use and quieter navigation/CTAs.
- Reworked the home package area into full-width ruled ledger rows instead of three bordered cards. Each row exposes package, price, support term, “Best for” and three key inclusions, with a direct configure link.
- Marked Growth as **Recommended** rather than “Most common” to avoid an unsupported popularity claim.
- Reworked the pricing hero so the festive offer badge sits on its own line, with a measured 20px gap before the heading.
- Replaced the desktop theme segmented control with a compact appearance popover (System / Light / Dark). The mobile theme control remains a single 44px cycle button.
- Tightened the services headline to “The website is the start. The business is the brief.”
- Added a scroll-linked scene veil that fully clears the WebGL scene once the hero is passed, removing the ghosted clock behind later sections.

### Interior page expansion

Each interior page now opens with a paper-dossier `HeroLedger` carrying an accurate numeral and a short set of **asides** — not invented metrics or headcount. The pages were expanded with practical, service-specific detail drawn from the published offer.

- **Services:** practice map split across Build, Grow, Content & Brand and Enable; institute-module pricing; sticky practice navigation; `PillarMotif` diagrams per practice; delivery standards; FAQ teaser.
- **Work:** proof standards, three representative engagement blueprints, a detailed PRV Financial Services case record with system architecture, delivery artifacts and an NDA band.
- **Insights:** lead editorial feature with a three-sheet folio visual, reading paths, a filterable library with live result counts, and an editorial-standards note.
- **Contact:** four-step response sequence, direct channels beside the form, “what to send” guidance and a fit grid. The page intentionally closes without a second CTA.
- **Estimate:** four-question controlled estimator with a sticky methodology aside, progress indicator, `aria-live` result band, recommended package link and a brief that carries into `/contact`.
- **Process:** four-phase map with client inputs, package table, review cadence and an explicit “what we need from you” section. The four review-cadence rules use a 2×2 grid (`standard-grid--four`) rather than leaving an empty third-column cell.
- **About:** studio frame, timeline, four-practice grid, “what we don’t do”, commitments and a staffing split.
- **Trust:** six written commitments — confidentiality, data, access, IP, dependencies and exit — with a data map and limits stated plainly.
- **Careers:** four-step hiring ledger and process; duplicate step numbering was removed so each step reads `01 NOTE`, `02 EXERCISE`, `03 CONVERSATION`, `04 TRIAL` once.

No case studies, client results, popularity claims or performance metrics were invented. PRV Financial Services remains the only named case study.

### Service and pillar system

Every one of the 18 service pages now uses the same buying sequence: brief, deliverables, process, boundary, commercials and questions. Each page carries a typed price band sourced from the service data, a “Proof, not a promise” frame that states what evidence does and does not exist, related services, and a closing brief CTA. No page invents client results, popularity or performance claims.

The four practice pages (`/services/build`, `/services/grow`, `/services/content`, `/services/enable`) were rebuilt with a practice-specific hero, numbered approach, service index, principles, delivery standards and an explicit boundary. Headlines and principles were rewritten to sound like an operator, not a generic agency:

- Build — “Built to be used.” / “Structure before surface.” / “Blueprint before build.”
- Grow — “Run as a system.” / “Accountable, not busy.”
- Content & Brand — “Made to be remembered.” / “A system, not one-offs.” / “System before assets.”
- Enable — “Applied, not hyped.” / “Bounded, evaluated, owned.”

### Conversion, mobile and type polish

- The final CTA heading is split into two balanced sentences instead of a hard `<br />`; it sets two lines on desktop and four balanced lines at 390px with no orphaned word.
- The CTA grid now switches to two columns at `lg`, so the tablet layout stacks rather than squeezing the action panel.
- Pillar approach sections put the heading before the diagram on mobile, matching the reading order; the diagram follows at 390px.
- Service-row micro labels were raised from 9–10px to 10–11px for legibility while retaining the ledger hierarchy.
- The header keeps a short “Start” label on mobile and the full “Start a project” label from `md`; the footer exposes WhatsApp beside email.

### SEO and social metadata

- Service metadata now uses the service description rather than its short tagline. All 18 descriptions were rewritten to roughly 130–160 characters, which also improves the `Service` structured data.
- The `Pillar` type now requires a `metaDescription`; all four practice pages have one and their routes use it.
- Home and pricing titles/descriptions were shortened to fit the title template and search-result widths.
- The file-convention OG route was replaced with a static `opengraph-image.png` plus alt text because the generated route did not emit tags in the static export and served the wrong content type. `og:image`, dimensions, alt, `twitter:image` and `twitter:image:alt` are now present on every route and resolve to `https://www.imaginarsclubservices.com/opengraph-image.png`.

### Pricing and offers

- Starter **₹29,999** (was ₹49,999)
- Growth **₹59,999** (was ₹89,999)
- Pro **₹1,49,999** (was ₹2,59,999)
- Festive offer: **Dusshera & Diwali — save up to ₹1,10,000**
- Monthly care: **₹2,500 / ₹5,000 / ₹8,000**
- App care: **₹7,000**; priority support: **₹12,000**
- Add-ons: student portal **₹15,000**, online tests **₹12,000**, fee payments **₹10,000**, multi-branch **₹15,000**, advanced SEO **₹12,000**, broadcast **₹5,000 + ₹1,000/month**
- AI monthly add-ons: chatbot **₹5,000**, lead scoring **₹7,500**, admissions **₹10,000**, content **₹3,500**, analytics **₹5,000**

Terms retained: no guaranteed rankings or results; non-refundable after work starts; monthly plans are optional; domain/hosting is required and quoted separately.

### Content and contact

- Contact details now use **+91 93728 09022**, **imaginarsclubs@gmail.com** and **https://www.imaginarsclubservices.com**.
- Navigation is sourced from `src/content/site.ts`; Pricing is available in the mobile menu and desktop header.
- The synthetic studio image is explicitly labelled as illustrative in its caption and alt text.
- Removed unsupported claims and invented proof points. No guaranteed rankings or results are promised.

### Responsive fixes

- **Trust / data map:** stacked cards below `md`; desktop table retained.
- **Process / packages:** `PACKAGE_ROWS` cards below `md`; desktop table retained.
- **Pricing comparison:** sticky first column, fixed table layout, horizontal-scroll region and a visible mobile swipe cue.
- **Process review cadence:** four rules in a two-column grid at desktop (`574.5px 574.5px` measured), collapsing to a single column on mobile. No empty grid cell.
- **Estimate:** sticky methodology aside drops below the card on narrow screens; ledger values use short labels (`Published prices`, `Practice, scope, time`, `Budget band`, `Fixed after scope`) to avoid awkward wrapping.
- At 390px: no page overflow; trust shows 4 cards with the table hidden; process shows 3 cards with the table hidden; pricing wrapper is 342px wide with 608px scroll width.
- At desktop: pricing table and wrapper are both 1152px; no overflow.

### Final defect pass

- **Studio frame reveal and lazy load:** the image plane carried its own `data-reveal="mask"` clip, which gave it a zero-area intersection so the reveal observer never fired. The mask is now driven by the outer `.studio-frame`; once visible, the clip opens and the lazy image loads. Production at 390px reaches `studio-frame is-in`, `clip-path: inset(0px)` and `currentSrc` `studio-team-1200.webp`; desktop reaches the same state with the 2000px source.
- **Work hero bar:** the black stripe behind the `/work` hero was the archive-wall WebGL scene peeking through. The background canvas is now suppressed on `/work` only, while the case-file scene remains on `/work/[slug]`. Production `/work` reports `canvases: 0` and no overflow.
- **Mobile header CTA:** the short “Start” label remains at 65×44px. Home inline links use a coarse-pointer pseudo-element that expands the effective tap height without changing layout.
- **Header/footer and route aliases:** regenerated the static preview with an `index.html` copy inside each route directory so trailing-slash URLs serve pages rather than directory listings.

## Verification

| Check | Result |
| --- | --- |
| `pnpm typecheck` | pass |
| `pnpm lint` | pass |
| `pnpm test` | 31/31 pass; contrast and token lint pass |
| `pnpm build` | pass |
| Route sweep | 45 routes / 90 checks, 0 failures |
| Full-site audit | 23 routes — home, services, pricing, work, contact, 4 pillars and 18 services — static checks and runtime checks at 1440 and 390: no missing h1, empty section, overflow, console error or bad response |
| Service/pillar content | all 18 services expose brief, deliverables, process, boundary, commercials, questions and related services; all 4 pillars expose hero, approach, index, principles, standards and boundary |
| Metadata lengths | all titles and descriptions inside audit limits; 18 service descriptions and 4 pillar meta descriptions rewritten to spec |
| OG / Twitter | `og:image`, `og:image:width/height/alt`, `twitter:image`, `twitter:image:alt` present; image resolves as `image/png` (57,871 bytes) |
| Interaction sweep | theme, mobile menu, studio image: 0 errors |
| Full-page review | force-revealed desktop screenshots of about, trust, careers and process; all sections rendered |
| Process grid | computed review grid `574.5px 574.5px` (two columns), no empty cell |
| Careers ledger | `01 NOTE`, `02 EXERCISE`, `03 CONVERSATION`, `04 TRIAL`; no duplicate numbering |
| Estimate ledger | `01 BASIS Published prices`, `02 ADJUSTS Practice, scope, time`, `03 OUTPUT Budget band`, `04 QUOTE Fixed after scope` |
| Production expanded routes | `/estimate`, `/process`, `/about`, `/trust`, `/careers` at 1440 and 390: 200, no overflow, no page errors |
| Preview expanded routes | same five routes at 1440: 200, no overflow, two-column process grid |
| Base routes on both hosts | `/`, `/services`, `/pricing`, `/work`, `/insights`, `/contact`, `/faq` at 1440 on production and preview: 200, no overflow; expanded routes verified separately above |
| Production deploy | `/`, `/services`, `/services/web-development`, `/services/build`, `/pricing` and `/services/brand-management`: 200 |
| Final production deploy | latest deployment aliased to `https://goat-wheat.vercel.app`; home and `/work` return 200; `/work` has `canvases: 0` and no overflow |
| Final production interactions | mobile studio frame reaches `is-in`, `clip-path: inset(0px)`, image loaded from `studio-team-1200.webp`; mobile header CTA is 65×44; studio image variants return 200 |
| Preview deploy | home, services, service and pillar routes at trailing-slash URLs: 200 and serving the page, not a directory listing |
| Final preview deploy | `https://placid-tropic-5hg5.here.now/`; `/work/`, `/services/`, `/pricing/`, `/about/`, `/contact/`, `/insights/` and `/work/prv-financial-services/` all return 200 with the expected titles; `/images/studio-team-1200.webp` returns `image/webp`; unknown paths return 404 |
| Final preview interactions | 390px home: studio `is-in`, clip `inset(0px)`, image 342×255 webp, CTA 65×44, no overflow. 1440px `/work/`: 0 canvases, no overflow |

The here.now build includes physical aliases for Next 16 segment-prefetch paths
(`__next.!KHNpdGUp.*.__PAGE__.txt`) and an `index.html` copy inside each route
directory. Without those aliases the static host returned 404s for segment
prefetches and directory listings for trailing-slash URLs even though every page
rendered. Vercel handles both natively.

## Remaining action

- **Activate FormSubmit** before relying on the live contact form for email delivery.
- **Domain cutover:** canonical, sitemap, robots and OG URLs still point at `www.imaginarsclubservices.com`, which currently serves the previous site. Point that domain at the `goat` Vercel project before treating the new build as fully live for search.
- The current static preview expires at **2026-10-23T11:02:36.238Z**; use the claim URL above to retain it.
- No commits or pushes were made. `FIX_REPORT.md` remains untracked by design.
- Optional: inspect the WebGL-enabled scene on a real GPU. Automated smoke tests used SwiftShader software rendering; the CSS fallback is also verified.

## Verify locally

```powershell
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

Screenshot QA uses Playwright from `D:\goat`. Serve `out` on port 8091 with
`static-server.js`, then run:

```powershell
$env:NODE_PATH="D:\goat\node_modules"
node C:\Users\soham\AppData\Local\Temp\opencode\qa-final.js
node C:\Users\soham\AppData\Local\Temp\opencode\qa-round2.js
node C:\Users\soham\AppData\Local\Temp\opencode\qa-process-full.js
```

Production and preview smoke tests:

```powershell
node C:\Users\soham\AppData\Local\Temp\opencode\verify-prod-round2.js
node C:\Users\soham\AppData\Local\Temp\opencode\verify-preview-round2.js
node C:\Users\soham\AppData\Local\Temp\opencode\verify-base-hosts.js
```
