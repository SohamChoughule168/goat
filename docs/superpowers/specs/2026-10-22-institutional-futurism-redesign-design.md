# ImaginarsClub Institutional Futurism Redesign

**Status:** Ready for user review  
**Date:** 2026-10-22  
**Owner:** ImaginarsClub studio  
**Scope:** Public marketing site, content model, pricing presentation, lead tools, design system  
**Supersedes:** The current editorial SMB/homepage direction, not the legal entity or existing service URLs

---

## 1. Summary

ImaginarsClub is rebuilding its public site as an institutional technology company rather than a boutique website studio.

The new site must do four things at once:

1. Make a serious education group believe ImaginarsClub can design and run its digital operating layer.
2. Turn the studio's broad service list into a coherent system: **The Institution Stack**.
3. Support a premium commercial anchor, including an **Institutional** engagement from **₹3,00,000**, without losing the existing Starter, Growth and Pro packages.
4. Prove the work with evidence, craft and restraint instead of invented logos, fake dashboards or generic startup theatre.

The approved art direction is **Institutional Futurism**: the warmth of a university prospectus, the precision of an operating system, and the confidence of a company that builds infrastructure.

The site remains a Next.js static export. There is no backend, no real client dashboard and no invented proof. Interactive tools are client-side, clearly labelled where illustrative, and designed to qualify a conversation rather than pretend to be software.

---

## 2. Context

### What exists now

- A 23-route Next.js App Router site with a static export.
- A warm editorial visual system: paper, ink and teal, Instrument Serif accents, hairline rules and restrained motion.
- A 614-line home page, 18 services, seven Field Notes/insights, one verified case study (PRV Financial Services), pricing and several conversion tools.
- A generic background 3D layer and some advanced but underused components.
- Current metadata and copy aimed at coaching classes, tuition institutes and small businesses.
- Pricing that still reads as a discounted website package, including a festive offer.

### The commercial problem

The current site is credible, but it reads as a small studio selling websites. That makes a ₹3,00,000 institutional engagement harder to justify. The design must change the category before it changes the price.

### The opportunity

Education institutions are operationally complex. They run admissions, enquiries, counselling, batches, attendance, assessments, fees, parent communication, reporting and multiple branches. Most are held together by a website, a CRM, spreadsheets, WhatsApp groups and institutional memory.

ImaginarsClub can own the space between "website agency" and "enterprise software vendor": a studio that designs the whole digital operating layer and ships it in phases.

### Constraints

- Static export; no server actions, API routes or database.
- One verified case study; no invented clients, logos, awards, metrics or testimonials.
- Existing service URLs and SEO equity should be preserved.
- The redesign must work at 390px, 768px and 1440px.
- The site must remain fast, accessible and usable without motion or WebGL.
- No commits or pushes unless the user explicitly asks.

---

## 3. Goals and non-goals

### Goals

- Reposition ImaginarsClub as an institutional technology partner.
- Make the offer legible through The Institution Stack.
- Create a distinctive, premium visual and motion system that does not look templated or AI-generated.
- Add a credible Institutional tier from ₹3,00,000 while keeping current package prices.
- Replace discount-led pricing with scope-led pricing.
- Add proof discipline: verified work, labelled reference architectures, no fake enterprise signals.
- Improve information architecture, navigation, search and conversion.
- Add two client-side qualification tools: Scope Architect and Institutional Health Check.
- Preserve or improve performance, accessibility and SEO.

### Non-goals

- Building a real SaaS product, CRM, student portal or admissions dashboard.
- Inventing clients, logos, case studies, testimonials, rankings or outcome metrics.
- A full e-commerce checkout or online payment flow.
- A CMS, database or authenticated client area.
- A generic 3D/WebGL showcase.
- A complete rebrand of the legal entity.
- Renaming existing package SKUs without explicit approval.
- Migrating the domain in this phase; the cutover remains an external dependency.

---

## 4. Audience and positioning

### Primary audience

Owners, directors and decision-makers at:

- Coaching classes and tuition institutes with ambitions beyond a single branch.
- K-12 schools modernising admissions, parent communication and operations.
- Multi-branch education groups with inconsistent branch sites and fragmented reporting.
- Edtech teams that need a credible operating layer around cohorts, content and assessments.

They care about admissions, reputation, operations, parent experience, staff adoption and control. They are not shopping for "a nice website."

### Secondary audience

Small and mid-sized businesses that value engineering discipline. They should find the studio credible without diluting the education focus.

### Positioning statement

> ImaginarsClub designs and builds the digital operating layer for ambitious education institutions: brand, website, admissions, portals, assessments, payments, communications and intelligence, connected as one system.

### Promise

> One institution. One operating layer. Built in phases, owned by you.

### Differentiation

- Institution-specific systems, not generic agency deliverables.
- Senior craft across brand, interface and engineering.
- A visible architecture, not a black-box retainer.
- Fixed phases, named deliverables and honest handover.
- Proof discipline: one verified engagement is better than a wall of borrowed logos.

### Voice

Calm, precise, specific and institutionally confident. Short declaratives. No hype. No "unlock", "elevate", "seamless", "cutting-edge", "revolutionary" or "game-changing". Prefer concrete nouns: admissions, cohorts, fees, portals, handover, evidence.

---

## 5. Art direction

### Concept

**Institutional Futurism** is the tension between a printed prospectus and a live system:

- Warm paper grounds.
- Severe typography.
- Cobalt as a signal, not decoration.
- Hairline grids and ledger numbers.
- Architectural diagrams instead of stock photography.
- Motion that feels engineered, not playful.
- Dark chapters used for gravity, not for a "tech" costume.
- Dark chapters are limited to the Admissions Command Center, the Platform architecture plate and the Trust standards chapter. Every other surface stays on bone.

### Palette

| Token | Value | Use |
|---|---|---|
| `--bone` | `#F2EEE5` | Primary page ground |
| `--bone-2` | `#E7E1D4` | Secondary ground, quiet panels |
| `--bone-3` | `#D8D0BF` | Disabled fields, image mats |
| `--ink` | `#11120F` | Primary text |
| `--ink-2` | `#2A2B26` | Secondary text |
| `--ink-3` | `#66665C` | Muted body text, metadata |
| `--ink-4` | `#8C8A7E` | Decorative or large metadata only; never body |
| `--rule` | `rgba(17,18,15,0.14)` | Hairlines and dividers |
| `--rule-strong` | `rgba(17,18,15,0.28)` | Strong borders, table heads |
| `--cobalt` | `#1F3AD8` | Primary action, active signal, key numerals |
| `--cobalt-deep` | `#152AA6` | Hover and pressed states |
| `--cobalt-soft` | `#C9D0FF` | Selection, diagrams on dark |
| `--dark` | `#0D0F0C` | Dark chapter ground |
| `--dark-2` | `#161914` | Dark panels |
| `--dark-ink` | `#F1EEE5` | Text on dark |
| `--dark-muted` | `#A7A79B` | Secondary text on dark |
| `--live` | `#3E8A63` | Functional positive state only |
| `--warning` | `#A7662A` | Functional warning state only |

Rules:

- Cobalt is used for action and signal, not as a background wash.
- No gradients, glow, glass, frosted cards, neon or iridescent effects.
- No pure black or pure white surfaces.
- Dark chapters use `--dark` with `--dark-ink` and `--cobalt-soft` for diagrams.
- Every text/background pairing must meet WCAG 2.2 AA. `--ink-4` is not a body colour.

### Typography

| Role | Face | Notes |
|---|---|---|
| Display | Geist Sans | Monumental, tight tracking, short lines |
| Body and UI | Geist Sans | 16px minimum, 68ch maximum measure |
| Accent | Instrument Serif italic | Headline emphasis, pull quotes, editorial moments |
| Labels and numerals | Geist Mono | 11–12px, uppercase, tracking `.12em`–`.18em`, tabular numerals |

Type scale:

- Display XL: `clamp(4.5rem, 10vw, 9rem)`, line-height `0.9`, tracking `-0.045em`.
- Display L: `clamp(3.25rem, 7vw, 6rem)`, line-height `0.92`, tracking `-0.04em`.
- H2: `clamp(2.25rem, 4vw, 3.5rem)`, line-height `0.98`, tracking `-0.03em`.
- H3: `clamp(1.375rem, 2vw, 1.75rem)`, line-height `1.1`.
- Lede: `clamp(1.125rem, 1.4vw, 1.375rem)`, line-height `1.5`.
- Body: `1rem`, line-height `1.6`.
- Micro: `0.6875rem`, line-height `1.4`, uppercase.

Rules:

- Instrument Serif is a contrast face, not a body face. Never set long paragraphs in it.
- Use sentence case for headings and UI.
- Use `text-wrap: balance` on display headings and `text-wrap: pretty` on body copy.
- Preload Geist Sans and Instrument Serif. Do not preload Geist Mono.
- Use tabular numerals in ledgers, pricing and data.

### Grid and spacing

- Page maximum: `1440px`.
- Gutter: `clamp(20px, 4vw, 64px)`.
- Grid gap: `clamp(16px, 2vw, 32px)`.
- Section rhythm: `clamp(72px, 10vw, 160px)`.
- Header height: `72px`; anchor offset must account for it.
- 12-column desktop grid; 8-column tablet; 4-column mobile.
- Baseline unit: `8px`.
- Asymmetry is intentional: 7/5, 8/4 and 5/7 splits. Avoid centered stacks of equal cards.
- Cards are not the default container. Use open layouts, rules, ledgers and chapters.
- Controls use `2px` radius. Panels and cards use `0`. No large rounded rectangles.
- Shadows are not part of the visual language. Overlays may use a solid scrim, not a blurred glass panel.

### Layout language

- Every major section begins with a section marker: `01 — THESIS`, `02 — THE STACK`.
- Desktop pages may use a sticky chapter rail on the left or a sticky index on the right.
- Use full-width hairlines to separate chapters.
- Use oversized numerals and negative space as compositional elements.
- Tables are first-class: pricing, capabilities, proof and comparison should read like a prospectus ledger.
- Buttons: cobalt fill with bone text for primary; hairline outline for secondary; text link with arrow for tertiary. Minimum height `44px`.
- Focus states: `2px` cobalt outline with `2px` offset on light; bone outline on cobalt and dark.

### Imagery and plates

- One real studio photograph, art-directed and cropped wide. No stock photography.
- Do not generate people with AI.
- Use bespoke SVG plates: axonometric stack, system map, ledger, blueprint fragment, signal diagram, data sculpture.
- Plates use 1px strokes, limited fills and the palette above. They should look drawn by a studio, not generated by a template.
- Any diagram that implies client work must be labelled `Verified engagement` or `Reference architecture — not a client case study`.
- Do not use generic laptop mockups, floating phone screens or fake browser chrome as the main visual idea.

### Motion

- Motion should feel engineered: precise, short and purposeful.
- Easing: `cubic-bezier(.16,1,.3,1)` for entrances; `cubic-bezier(.65,0,.35,1)` for state changes.
- Durations: `180ms` micro, `320ms` UI, `600ms` reveals, `900ms` cinematic.
- Lenis smooth scrolling may be used on desktop only. It must not fight keyboard or reduced-motion users.
- GSAP ScrollTrigger is allowed for The Stack, chapter progress and restrained reveals. Use `gsap.context()` and clean up.
- Page transitions: top progress line plus a short content fade. Do not block navigation with a full-screen loader.
- Hover: underline movement, arrow shift, hairline emphasis. No bounce, scale-pop or cursor followers.
- Counters only for real numbers. Static when reduced motion is requested.
- Always provide a reduced-motion path: no pin, no scrub, no parallax, no count-up, all content visible.

### Anti-patterns

- Glassmorphism, gradient text, glowing orbs, particle fields, wireframe globes.
- Generic "AI" dashboards and fake analytics.
- Rounded card grids with icons and three-word benefits.
- "Trusted by" logo walls without real clients.
- Stock education photography.
- Custom cursors.
- Autoplay video or audio.
- Scroll-jacking.

---

## 6. Information architecture

### Route map

| Route | Purpose | Status |
|---|---|---|
| `/` | Institutional home and primary conversion | Rebuild |
| `/platform` | The Institution Stack in full | New |
| `/solutions` | Audience index | New |
| `/solutions/coaching-classes` | Coaching-specific systems | New |
| `/solutions/schools` | School-specific systems | New |
| `/solutions/multi-branch-groups` | Multi-branch architecture | New |
| `/solutions/edtech` | Cohort and subscription systems | New |
| `/work` | Proof ledger and reference architectures | Rebuild |
| `/work/[slug]` | Case file | Rebuild |
| `/trust` | Standards, ownership, security and handover | Rebuild |
| `/pricing` | Four tiers, add-ons and terms | Rebuild |
| `/estimate` | Scope Architect | Rebuild/expand |
| `/diagnostic` | Institutional Health Check | New |
| `/insights` | Field Notes index | Rebuild |
| `/insights/[slug]` | Article | Rebuild |
| `/about` | Studio doctrine | Rebuild |
| `/process` | Engagement method | Rebuild |
| `/services` | Capability library | Retain and redesign |
| `/services/[slug]` | Service detail | Retain and redesign |
| `/contact` | Proposal request | Rebuild |
| `/careers` | Studio careers | Rebuild |
| `/faq` | Structured answers | Rebuild |
| `/legal/privacy` | Privacy | Retain, restyle |
| `/legal/terms` | Terms | Retain, restyle |
| `/legal/cookies` | Cookies | Retain, restyle |
| `/design-system` | Internal design reference | Retain, noindex |
| `/rss.xml` | Field Notes feed | Retain |

### Route rules

- Preserve `/services` and `/services/[slug]` for SEO and existing links. Treat them as the capability library, not the primary navigation.
- Preserve `/insights` URLs even though the public name becomes **Field Notes**.
- Preserve existing case-study URLs.
- Preserve the `legacyServiceMap` redirects in `next.config.ts`; inspect the full file before adding new redirects.
- Pricing anchors: `#starter`, `#growth`, `#pro`, `#institutional`.
- If a package display name changes later, do not change its slug or URL.
- `/design-system` is internal, excluded from navigation and marked `noindex`.

### Navigation

Desktop primary:

- Platform → `/platform`
- Solutions → `/solutions`
- Proof → `/work`
- Pricing → `/pricing`
- Company → menu, not a destination

`Company` menu:

- About → `/about`
- Process → `/process`
- Trust → `/trust`
- Field Notes → `/insights`
- Careers → `/careers`
- Contact → `/contact`

`Proof` always points to `/work`; the proof page carries the H1 `Proof, not a logo wall.` Do not add a separate `/proof` route. Trust is a Company item, not a primary destination.

Header actions:

- `Index` button: opens a full-screen index of every public page, solution, service and recent note.
- Primary CTA: `Request a proposal` to `/contact?intent=proposal`.
- Keyboard shortcut: `⌘K` / `Ctrl+K` opens the command palette.

Mobile:

- A visible `Menu` control and a visible `Proposal` CTA. Do not hide the primary conversion behind a hamburger.
- The menu is a full-screen Index with clear sections and direct contact options.
- Focus is trapped while open; Escape closes; focus returns to the trigger.

Footer:

- Institution: Platform, Solutions, Pricing, Scope Architect, Health Check.
- Proof: Work, Trust, Process, Field Notes.
- Company: About, Careers, Contact, FAQ.
- Legal: Privacy, Terms, Cookies.
- Contact block with email, phone, WhatsApp and Mumbai address.
- Colophon: `Designed and engineered in Mumbai. Built as a static export. Type: Geist, Instrument Serif.`
- Do not show fake uptime, fake availability or a fake "systems operational" badge.

### Command palette

- Static index generated at build time from content modules.
- Search pages, solutions, services, case studies and Field Notes.
- Fuzzy match; keyboard-first; `aria-activedescendant`; Escape closes; Enter navigates.
- Show a short empty state with direct links to Platform, Pricing and Contact.
- No network search, no AI answer box, no fake suggestions.

---

## 7. Page specifications

### 7.1 Home

**Purpose:** Establish the category, show the system, prove the work and start a premium conversation.

**Narrative order:**

1. Hero
2. Signal bar
3. Thesis
4. The Institution Stack
5. Capability ledger
6. Proof
7. Admissions Command Center
8. Method
9. Economics
10. Trust
11. Field Notes
12. Final CTA

**Hero**

- Full viewport minus header, bone ground, hairline grid, no background canvas.
- Top-left micro label: `IMAGINARSCLUB / EDUCATION SYSTEMS / MUMBAI`.
- Headline: `The digital` in Geist Sans, `institution.` in Instrument Serif italic. Display XL.
- Subcopy: `We design and build the systems ambitious education groups run on — brand, website, admissions, portals, assessments, payments and intelligence.`
- Primary CTA: `Request a proposal`. Secondary: `Explore the platform`.
- Right or lower-right: a reduced stack plate showing all eight layers, one highlighted.
- Bottom ledger: `18 capabilities`, `8 system layers`, `4 phases`, `Since 2024`. All values must be true.
- No client logos, fake awards or "trusted by" row.

**Signal bar**

- A single hairline band: `For coaching classes, schools, multi-branch groups and edtech teams.`
- Optional right link: `Find your model →` to `/solutions`.

**Thesis**

- Oversized statement: `Most institutes do not have a website problem. They have an operating-system problem.`
- Two-column supporting copy:
  - `A brochure site can win a click. It cannot run admissions, fees, batches, parent communication and reporting.`
  - `We connect the public front door to the systems behind it, then hand you the keys.`
- Link: `See the stack →`.

**The Institution Stack**

- The signature interaction. Eight layers:
  1. Brand
  2. Website
  3. Admissions
  4. Student Portal
  5. Assessments
  6. Payments
  7. Communications
  8. Intelligence
- Desktop: sticky diagram on one side, layer rows on the other. Scroll progress highlights the active layer; clicking or focusing a row opens a detail panel with the problem, what we build, signals and related capabilities.
- Mobile: accordion. No pin, no scroll-jacking.
- Keyboard: rows are buttons; Enter/Space opens; arrow keys move; Escape closes.
- Reduced motion: static list with all details visible.
- The section must communicate `one system`, not eight unrelated services.

**Capability ledger**

- Heading: `Eighteen capabilities. One system.`
- Table grouped by Build, Grow, Content & Brand, Enable.
- Columns: number, capability, outcome, link.
- Mobile: stacked rows with rules.
- Do not list every service as a card. Use the ledger.

**Proof**

- Feature PRV Financial Services as a `Verified engagement`. State its sector: financial services. Do not imply it is an education client.
- Use only published facts from `work.ts`: scope, sector, system and published results. Do not add invented metrics.
- Show a system diagram, not a fake screenshot.
- Separately show two or three `Reference architecture` cards for education:
  - Coaching institute operating layer
  - Multi-branch school group
  - Edtech cohort platform
- Each reference card carries the label `Reference architecture — not a client case study`.

**Admissions Command Center**

- Dark chapter.
- A client-side interactive demo with clearly labelled sample data.
- Tabs: Overview, Enquiries, Cohorts, Fees.
- Controls: branch filter and term filter. Use local fixture data only.
- Visual language: ledger tables, cobalt signal bars, simple SVG/CSS charts. No chart library.
- Label: `Illustrative interface · sample data`.
- No fake "live" indicator. No real institution names.
- CTA: `Scope a system like this →` to `/estimate`.
- Lazy-load the interactive module when it approaches the viewport.
- Provide a table alternative and keyboard access to all controls.

**Method**

- Four phases: Diagnose, Architect, Build, Operate.
- Horizontal timeline with named deliverables and decision gates.
- Link: `How we work →` to `/process`.
- No vague "discovery" language without outputs.

**Economics**

- Four compact tiers: Starter, Growth, Pro, Institutional.
- Show `Engagements from ₹29,999` and `Institutional from ₹3,00,000`.
- Primary CTA: `Request a proposal`. Secondary: `Compare engagements →` to `/pricing`.
- No festive banner, countdown or struck-through discount theatre.

**Trust**

- Six commitments: ownership, security, accessibility, performance, handover, continuity.
- Each links to `/trust`.
- Claims must be substantiated or written as commitments, not certifications.

**Field Notes**

- Three latest notes.
- Heading: `Field Notes`.
- Link: `All notes →` to `/insights`.

**Final CTA**

- Headline: `Bring the institution online.`
- Copy: `Tell us what is fragmented. We will map the system.`
- Primary CTA: `Request a proposal`.
- Secondary: `Scope your build →`.

### 7.2 Platform

**Purpose:** Explain the productised system behind the studio.

**Sections:**

- Hero: `One institution. One operating layer.`
- The fragmentation problem: website, CRM, ERP, spreadsheets, WhatsApp, disconnected reporting.
- The Stack: full detail for all eight layers. Each layer includes:
  - What it is.
  - What it replaces.
  - What we build.
  - Signals that it needs attention.
  - Related capabilities.
  - Related audience solution.
- Architecture plate: brand, public site, admissions, portal, assessments, payments, communications and intelligence connected by a clear system map.
- The architecture plate is the page's single dark chapter. Return to bone for engagement models and reference architectures.
- Engagement models: platform sprint, phased rollout, care and iteration.
- Reference architectures, clearly labelled.
- CTA: `Request a proposal`.

**Rules:**

- Do not imply ImaginarsClub sells a licensed SaaS platform.
- Describe modules and engagements, not imaginary product SKUs.
- Every layer must connect to at least one existing service, package entitlement or add-on. Do not invent a service page to make the diagram work.
- The connection map is deliberate:

| Layer | Existing connection |
|---|---|
| Brand | `brand-management` |
| Website | `web-development`, `website-refurbishment`, `ai-driven-websites` |
| Admissions | `digital-marketing`, `sem`, `meta-advertising`, `google-business-profile`, `generative-engine-optimization`, `answer-engine-optimization` |
| Student Portal | Pro package student portal, `mobile-app-development` |
| Assessments | Online test / exam module add-on |
| Payments | Fee payment integration add-on |
| Communications | SMS / WhatsApp broadcast add-on, `social-media-marketing` |
| Intelligence | AI analytics and lead-scoring add-ons, Growth analytics setup |

### 7.3 Solutions

**`/solutions` index:**

- Hero: `Built for the way your institution actually runs.`
- Four audience rows with the operating problem, the system response and a link.
- No equal card grid; use a ledger or split rows.

**Audience pages:**

Each page follows one structure:

- Hero with audience name and the core operational tension.
- `What changes at your scale`.
- `The system we would build` with relevant stack layers.
- `A typical 90-day sequence` (diagnose, architect, build, handover), labelled as indicative.
- `Reference architecture` or verified proof. If no client exists, label the architecture.
- Recommended package or engagement.
- CTA: `Request a proposal`.

Audience content:

| Audience | Core problem | System emphasis |
|---|---|---|
| Coaching classes | Enquiries leak, batches are manual, parents need updates, fees are tracked in spreadsheets | Admissions, batches, assessments, payments, communications |
| Schools | Admissions are fragmented, parent communication is ad hoc, multiple systems do not talk | Admissions, parent portal, notices, payments, reporting |
| Multi-branch groups | Branch sites drift, local SEO is inconsistent, leadership lacks consolidated reporting | Brand system, branch sites, local SEO, central dashboard, governance |
| Edtech | Cohorts, content, assessments and subscriptions live in different tools | Cohort portal, assessments, subscriptions, learner analytics, communications |

### 7.4 Work

**`/work`:**

- Hero: `Proof, not a logo wall.`
- Proof ledger. With one verified case, do not render an empty filter bar; feature PRV and keep the ledger structure ready for more cases. When more verified work exists, add sector filters. Never show a filter with zero results.
- Columns: institution, sector, scope, year, evidence.
- PRV is the only verified case and is in financial services, not education. Present it as engineering proof, not as an education client. It is a feature, not one row in a fake grid.
- Reference architectures are a separate labelled section and are never counted as client work.
- No invented client names or logo marks.

**`/work/[slug]`:**

- Case file structure:
  - Context.
  - Constraint.
  - System architecture.
  - What was built.
  - Evidence and results.
  - What we would do next.
  - Related capabilities.
- Use only published facts. If a metric has no source, do not show it.
- Testimonial only with written approval.
- No fake browser screenshots. Use diagrams, typography and real artefacts.

### 7.5 Trust

**Purpose:** Reduce perceived risk for a premium buyer.

**Sections:**

- `How we work when it matters.`
- Ownership: domain, content, accounts and code according to the contract.
- Security: least-privilege access, 2FA, secret handling, backups.
- Data: data map, consent, retention and third-party processors.
- Accessibility: WCAG 2.2 AA target across public pages.
- Performance: budgets and measurement.
- Handover: documentation, training and runbook.
- Continuity: care plans and escalation.
- What we need from you: access, content, approvals and one decision-maker.
- Evidence: only certifications or audits actually held. Otherwise state commitments, not badges.

**Rules:**

- The evidence standards section may use one dark plate. The rest of the page stays on bone.
- No fake uptime status.
- No security certification badges unless real.
- Link to legal pages and process.

### 7.6 Pricing

**Purpose:** Make a premium engagement legible without discount retail cues.

**Hero:**

- `Clear scope. Serious systems.`
- `Engagements from ₹29,999. Institutional programs from ₹3,00,000.`
- Primary CTA: `Request a proposal`.
- Secondary: `Scope your build →`.

**Tiers:**

| Tier | Price | Best for | Commercial role |
|---|---|---|---|
| Starter | ₹29,999 | Single-branch institutes needing a credible front door and enquiry flow | Entry |
| Growth | ₹59,999 | Growing institutes needing a stronger site, content and lead system | Core |
| Pro | ₹1,49,999 | Institutes ready for portals, assessments, payments or deeper integration | Advanced |
| Institutional | From ₹3,00,000 | Multi-branch groups and institutions replacing fragmented systems | Premium anchor |

Rules:

- Preserve the `starter`, `growth` and `pro` slugs.
- Use `Starter` as the public name. `Launch` may be used later only as an approved display alias; do not create a new SKU or URL.
- Use the existing package features and entitlements from `packages.ts`. Rewrite labels for clarity; do not add entitlements that are not sold.
- Do not lead with struck-through original prices. The published price is the price. If `original` remains in data for proposals, do not render it on the cards.
- Do not label a tier `Most popular` without evidence. Use `Recommended for growing institutes` or a factual descriptor.
- `featured: true` on Growth may drive visual emphasis only. It must never render a `Most popular` or `Best value` label.
- Institutional card: `From ₹3,00,000`, `Proposal after a scope workshop`, and a short list: discovery, architecture, multi-branch system, integrations, phased rollout, training, support per scope. These describe the engagement shape, not fixed entitlements; the written proposal is the scope.
- If commercial policy prefers not to publish the anchor, show `Custom` and keep ₹3,00,000 in the proposal. The approved direction is to publish the anchor.

**Add-ons:**

- Preserve the existing three groups: Care & maintenance, AI add-ons, Modules & growth. Do not rename them to Care, Growth and Modules; `Growth` is already a tier name and the existing labels are clearer.
- Use a secondary ledger below the tiers.
- Current add-ons and prices remain the source of truth.
- Do not let add-ons dilute the four-tier story.

**Offer removal:**

- Remove `OFFER` (Dusshera & Diwali, save up to ₹1,10,000) from the pricing hero, metadata and navigation.
- If a promotion is legally required, show one quiet line below the table with an end date. Do not use countdowns or festive decoration.

**Supporting sections:**

- `What is not included`: domain, hosting, media spend, third-party licences.
- `How a proposal works`: scope conversation, written proposal, start.
- `Terms`: no guaranteed rankings or results; non-refundable once work starts; monthly plans optional; domain/hosting/media quoted separately.
- FAQ.
- Final CTA.

### 7.7 Estimate / Scope Architect

**Purpose:** Turn a vague budget conversation into a qualified scope.

**Flow:**

1. Institution type: coaching, school, multi-branch group, edtech, other.
2. Scale: branches, students, staff, current systems.
3. Priorities: choose up to three stack layers.
4. Timeline and budget range, including `Not sure`.

**Output:**

- Recommended starting point: Starter, Growth, Pro or Institutional.
- Suggested layer sequence.
- Indicative range anchored to published prices.
- `What we need to confirm`.
- Primary CTA: `Request a proposal` with the summary prefilled.
- Secondary: copy summary or open WhatsApp/email.

**Rules:**

- Rule-based only. No hidden dynamic pricing.
- State clearly: `Indicative only. Final scope and price follow a discovery conversation.`
- No backend, no PII storage.
- Accessible step navigation, back, reset and progress.
- Preserve answers in component state; optional URL encoding only if it contains no personal data.
- If the contact form is unavailable, provide a working mailto/WhatsApp fallback.

### 7.8 Diagnostic / Institutional Health Check

**Purpose:** Give a prospect a useful, honest read on their operating gaps.

**Format:**

- Eight statements, one per stack layer, scored 0–3.
- Example: `Our website routes enquiries into a follow-up system we can inspect.`
- Progress indicator and accessible radio groups.

**Result:**

- Score bands:
  - 0–8: Fragmented.
  - 9–16: Connected.
  - 17–24: Compounding.
- Show the two weakest layers.
- Recommend one first step and one relevant solution page.
- Do not gate the result behind an email.
- Optional CTA: `Send this result to the studio`.
- State: `This is a conversation starter, not an audit.`

**Rules:**

- No backend.
- No fake benchmark data.
- Shareable URL may encode answers only; no personal data.
- Results announced to screen readers.

### 7.9 Field Notes

- Public name: `Field Notes`.
- Route remains `/insights`.
- Index: featured note, category filter, chronological list.
- Categories: Systems, Admissions, Brand, Operations.
- Article template: 68ch measure, sticky table of contents, reading time, published and updated dates, studio byline, related notes.
- Preserve existing seven articles, slugs and URLs, but map them into the new categories in Phase 4. Existing categories such as `AI & Technology` and `SEO & Search` are agency taxonomy and must not survive into the institutional navigation.
- Audit existing articles for stale package references and claims that cannot be substantiated. Rewrite or remove them; do not carry SMB-era claims into the new positioning unchanged.
- RSS preserved.
- No invented author personas.

### 7.10 About

- Hero: `A studio for institutions.`
- Real story: Mumbai, founded 2024, independent studio, education systems focus. Do not claim a headcount or seniority the studio cannot evidence.
- One real studio photograph.
- Doctrine: five beliefs about institutions, systems and craft.
- `What we do` and `What we do not do`.
- No fake team count, fake offices or fake awards.
- Links: Process, Trust, Careers, Contact.

### 7.11 Contact

- Hero: `Request a proposal.`
- Form fields:
  - Name.
  - Institution.
  - Role.
  - Email.
  - Phone or WhatsApp.
  - Institution type.
  - Branches.
  - Budget range.
  - Timeline.
  - `What is fragmented?`
  - Consent.
- Budget options:
  - ₹29,999–₹59,999.
  - ₹60,000–₹1,50,000.
  - ₹1,50,000–₹3,00,000.
  - ₹3,00,000+.
  - Not sure.
- Response expectation: `We reply within one business day` only if operationally true. Default to `We will reply with next steps` until the promise is confirmed. Remove the `24h` ledger value from Contact if the promise is not confirmed.
- Direct contact: email, phone, WhatsApp, address.
- FormSubmit is the current delivery mechanism. If it is not activated, do not silently fail: show a clear mailto/WhatsApp fallback.
- Accessible validation, error summary and success state.

### 7.12 Process

- Four phases with outputs and gates.
- Typical durations, labelled scope-dependent.
- What the client provides.
- What happens after launch.
- Link to Trust and Pricing.

### 7.13 Careers

- `Work on institution-scale problems.`
- Real open roles only.
- Speculative application path.
- No fake perks, fake growth or fake culture stats.

### 7.14 FAQ

- Grouped: pricing, process, ownership, timelines, support, results.
- Include the honest answer: no guaranteed admissions, rankings or revenue outcomes.
- Use `FAQPage` structured data.
- Link answers to relevant pages.

### 7.15 Legal

- Preserve current legal copy.
- Restyle only; do not rewrite legal meaning without review.
- Update the effective date only if the copy changes.

### 7.16 Design system

- Internal reference for tokens, type, spacing, components, motion and accessibility.
- Mark `noindex`; exclude from primary navigation.
- Use it to prevent drift between pages.

---

## 8. Content model

All content remains typed TypeScript modules. No CMS in this phase.

### `site`

- Positioning, navigation, CTAs, contact, social links, metadata defaults.
- Remove coaching-only positioning from the root metadata. Coaching remains a solution audience, not the whole brand.

### `platformLayers`

| Field | Type | Purpose |
|---|---|---|
| `id` | string | Anchor and stable key |
| `number` | string | `01`–`08` |
| `name` | string | Layer name |
| `promise` | string | One-sentence value |
| `problem` | string | What breaks without it |
| `deliverables` | string[] | What we build |
| `signals` | string[] | Symptoms |
| `relatedServices` | string[] | Service slugs |
| `relatedSolution` | string | Solution slug |

### `solutions`

- slug, audience, headline, tension, problems, system, sequence, reference, recommendedTier, CTA.
- Four audience pages in v1.

### `packages`

- Existing `PackageTier` fields.
- Add `institutional` to `PackageSlug`.
- Add optional `priceLabel` (`from` or `custom`) and `scopeNote`.
- Preserve `starter`, `growth`, `pro` slugs.
- Remove `OFFER` from public rendering.

### `proof`

- `type`: `case-study`. Reference architectures live in their own module and are never mixed into verified work.
- `verified`: derive this from the existing `status: "verified"`; do not keep two competing truth fields.
- `client`, `sector`, `scope`, `year`. `scope` maps to the existing `services` array; do not duplicate it as free text.
- `results`: optional published evidence items, each with label, value and source note. Reuse `work.ts` fields; do not introduce a second metrics shape.
- `diagram`: plate key.
- `testimonial`: only with written approval.

### `referenceArchitectures`

- `slug`, `title`, `audience`, `problem`, `layers`, `sequence`, `diagram`, `disclaimer`.
- Three entries: coaching institute operating layer, multi-branch school group, edtech cohort platform.
- Always labelled `Reference architecture — not a client case study`. Never counted as verified work.

### `services`

- Keep all 18 services.
- Add `layerIds`, `audienceSlugs` and `outcome`.
- Preserve existing slugs and redirects.

### `insights`

- Keep existing seven.
- Replace `insightCategories` with `Systems`, `Admissions`, `Brand`, `Operations`.
- Map each existing article to one of the new categories in Phase 4. Preserve slugs, authors, dates and RSS.
- Keep `category` and `readingTime`; both already exist in the content model. Add optional `updated`.
- Public label: Field Notes.

### `trust`

- Commitments, evidence, standards, client responsibilities.
- No certification badges unless real.

### `diagnostic`

- Eight questions, one per layer, with 0–3 options and result copy.

### `scope`

- Four steps, options, mapping to tiers and indicative ranges.

### Content rules

- Every number needs a source in content or a visible label.
- Every illustrative interface is labelled.
- Every reference architecture is labelled.
- No invented clients, logos, testimonials, awards, rankings or results.
- No `lorem ipsum` in production.
- Prefer specific nouns and short sentences.
- Use `₹` with Indian digit grouping.
- Use sentence case.
- Do not use "we are passionate" or "we help brands grow".

---

## 9. Technical architecture

### Framework and rendering

- Keep Next.js App Router with static export.
- No server actions, API routes, database or authenticated area.
- All new interactive tools are client components.
- Content is statically generated from TypeScript modules.
- Preserve route-level static output. Staging aliases are handled by the existing publish pipeline.

### Styling and tokens

- Consolidate the competing token systems:
  - `src/app/globals.css`
  - `src/styles/premium-tokens.css`
  - `src/styles/editorial.css`
  - `src/styles/experience.css`
- The old `$1B` neutral/teal/purple system in `premium-tokens.css` must not leak into the new public UI.
- Create one institutional token layer and one public stylesheet. Avoid three sources of truth.
- Keep Tailwind 4 and existing utilities where useful. Do not rewrite working primitives for style purity.
- Use CSS custom properties for colour, type, spacing, motion and layout.

### Component architecture

New primitives under `src/components/institutional/`:

- `InstitutionalShell`
- `ChapterRail`
- `SectionMarker`
- `StackDiagram`
- `StackPanel`
- `LedgerTable`
- `ProofCard`
- `ReferenceCard`
- `CommandCenter`
- `ScopeArchitect`
- `HealthCheck`
- `CommandPalette`
- `IndexMenu`
- `HairlineGrid`
- `Plate`

Retain and refactor:

- `Header`, `Footer`.
- `MotionProvider` for reveal semantics.
- `StudioFrame` for the real photograph.
- `HeroLedger` for interior hero numerals.
- Existing form and SEO helpers where they still fit.

Avoid:

- A new UI kit.
- A chart library for the Command Center.
- A command-palette library; use Radix Dialog plus a custom combobox.
- A new form library; use native forms and existing validation.
- New heavy dependencies.

### R3F and the current canvas

- Remove the generic R3F background from the site layout in Phase 1. Remove `ExperienceLayer`'s `SceneCanvas`; keep or replace its CSS plate/damp only if the new art direction still needs them.
- Do not make 3D a dependency of top-level marketing pages. If a case-study scene survives the audit, it must be lazy-loaded and must not affect LCP, CLS or INP.
- Audit whether case-study scenes earn their weight. If not, remove them and then remove unused three/R3F dependencies.
- Do not remove dependencies until no route imports them.

### Motion implementation

- Keep GSAP, Lenis and Framer Motion where they earn their place.
- Use `gsap.context()` and cleanup in every component.
- Use `matchMedia` and `prefers-reduced-motion` to disable pinning, scrub, parallax and counters.
- Lenis desktop-only; ensure keyboard and anchor navigation still work.
- Use transforms and opacity for animation. Avoid layout thrash.
- Use native View Transitions only as progressive enhancement; never as a requirement.

### Forms and tools

- No backend.
- Contact via FormSubmit plus a visible mailto/WhatsApp fallback.
- Scope Architect and Health Check compute locally and store nothing.
- Optional URL state must contain no personal data.
- Use accessible step/field patterns and `aria-live` for results.
- Provide a print-friendly scope summary? Optional; not required for v1.

### SEO

- Update the site description and tagline to the institutional positioning.
- Home title: `ImaginarsClub — Digital systems for education institutions`.
- Platform title: `The Institution Stack — ImaginarsClub`.
- Solutions title: `Solutions for coaching classes, schools and education groups — ImaginarsClub`.
- Work title: `Proof — ImaginarsClub`.
- Pricing title: `Pricing — ImaginarsClub`.
- Estimate title: `Scope your institution build — ImaginarsClub`.
- Diagnostic title: `Institutional Health Check — ImaginarsClub`.
- Trust title: `Trust and standards — ImaginarsClub`.
- Field Notes title: `Field Notes — ImaginarsClub`.
- About title: `Studio — ImaginarsClub`.
- Canonicals remain on `https://www.imaginarsclubservices.com` until the domain cutover.
- Sitemap includes all public routes. Exclude `/design-system`.
- JSON-LD: `Organization`, `WebSite`, `BreadcrumbList`, `Service`, `FAQPage`, `Article`. Do not invent unsupported schema types.
- OG image: typographic institutional plate with the stack motif; 1200×630; no fake dashboard.
- Preserve `/rss.xml` for Field Notes.

### Analytics

- No third-party analytics in v1 unless approved.
- If analytics is added, use a privacy-respecting tool, document events and respect consent.
- Candidate events: `proposal_click`, `scope_complete`, `diagnostic_complete`, `pricing_view`, `case_view`.
- Do not send form contents or personal data to analytics.

### Accessibility

- WCAG 2.2 AA target.
- Semantic landmarks, one `h1` per page, ordered headings.
- Skip link to main content.
- Keyboard support for Stack, Index, command palette, tabs, filters and forms.
- Focus visible on every interactive element; focus returns after dialogs.
- Minimum 44×44px tap targets.
- Contrast checked for all token pairs; no colour-only meaning.
- `prefers-reduced-motion` honoured globally.
- Form errors announced; `aria-describedby`; success state announced.
- Decorative SVG `aria-hidden`; meaningful diagrams have text alternatives.
- No autoplay audio/video.
- Test at 200% zoom and 320px width.

### Performance

- No 3D on top-level marketing pages or the home page. A surviving case-study scene is lazy-loaded, non-essential and absent on mobile and reduced motion.
- Hero LCP is text, not an image or canvas.
- Fonts via `next/font`, latin subset, `display: swap`; preload only Geist Sans and Instrument Serif.
- Verify the `₹` glyph is present in the chosen subsets. If it is not, load the needed subset or a matching fallback; never let prices render in a mismatched face.
- One real photograph, responsive WebP/AVIF, lazy below the fold.
- Inline the stack plate as optimized SVG; avoid large raster diagrams.
- Lazy-load the Command Center, command palette index and below-fold interactive modules.
- No third-party embeds in the critical path.
- Budgets:
  - LCP ≤ 2.5s on mobile 4G.
  - CLS ≤ 0.05.
  - INP ≤ 200ms.
  - Home initial JS ≤ 200KB gzip.
  - Initial page weight ≤ 1.2MB.
  - Lighthouse mobile: performance target ≥ 90, hard floor ≥ 85; accessibility, best practices and SEO ≥ 95.
- Do not regress the current baseline.

### Testing and QA

Automated:

- Unit tests for package data, diagnostic scoring, scope mapping and command-palette filtering.
- Component tests for Stack, tabs, forms and result states.
- Playwright at 390, 768 and 1440:
  - Every public route returns 200.
  - No horizontal overflow.
  - No console errors.
  - Navigation, Index, command palette, Stack, Command Center, Scope Architect, Health Check and contact fallback work.
  - Keyboard-only path for each interactive module.
  - Reduced-motion path.
- Build gates:
  - `pnpm lint`
  - `pnpm exec tsc --noEmit`
  - `pnpm test -- --run`
  - `pnpm build`
  - `pnpm budget` if configured
  - `pnpm test:lighthouse` if configured
- Automated accessibility scan with existing tooling where available; otherwise a manual checklist.

Manual:

- Visual review at 390, 768 and 1440.
- Keyboard review.
- Screen-reader spot check.
- Contrast review for each token pairing.
- Content audit for unlabelled claims.
- Preview review on the deployed static build.

Known QA constraints:

- Start the local static server and run Playwright in the same command. A detached `Start-Process` server dies when the tool invocation ends.
- Use `domcontentloaded` plus selector waits for production previews; `networkidle` can time out.
- Use viewport screenshots after stepwise scrolling; full-page screenshots are unreliable with reveals and lazy images.
- `img.complete` can lag; wait for the specific image element.

---

## 10. Phases

### Phase 1 — Foundation, navigation and home

- Consolidate tokens and typography.
- Build the grid, section markers, buttons, rules and focus system.
- Refactor Header, Footer, Index menu and command palette shell.
- Build the home narrative: hero, signal bar, thesis, The Stack, capability ledger, proof, Command Center, method, economics, trust, Field Notes, final CTA.
- Remove the generic background 3D from the marketing shell.
- Add responsive and reduced-motion behavior.

**Exit criteria:**

- Home feels like the approved direction at 390, 768 and 1440.
- The Stack works with keyboard and reduced motion.
- No horizontal overflow, no console errors.
- Build gates pass.
- User reviews the visual direction before Phase 2.

### Phase 2 — Platform, solutions, work and trust

- Build `/platform`.
- Build `/solutions` and four audience pages.
- Rebuild `/work` as a proof ledger and `/work/[slug]` as a case file.
- Build `/trust`.
- Add reference architecture content and labels.
- Preserve `/services` and cross-link it.

**Exit criteria:**

- The system story is coherent across Platform, Solutions and Services.
- No fake proof.
- All new routes pass responsive and keyboard checks.
- User reviews before Phase 3.

### Phase 3 — Commercial surfaces

- Rebuild `/pricing` with four tiers and Institutional.
- Remove festive-offer prominence.
- Rebuild `/estimate` as Scope Architect.
- Build `/diagnostic`.
- Update `/contact` with proposal intent and fallback delivery.
- Add pricing anchors and structured data.

**Exit criteria:**

- A premium buyer can understand scope and price without a discount cue.
- Scope Architect and Health Check work without a backend.
- Contact fallback works if FormSubmit is inactive.
- User reviews before Phase 4.

### Phase 4 — Editorial, launch and hardening

- Rebuild Field Notes, About, Process, Careers and FAQ.
- Map the existing seven Field Notes into Systems, Admissions, Brand and Operations. Preserve slugs, authors, dates, URLs and RSS. Audit every existing article for stale package references or claims that cannot be substantiated; rewrite or remove them.
- Restyle legal pages without changing legal meaning.
- Update metadata, sitemap, robots, RSS and JSON-LD.
- Full accessibility, performance and responsive QA.
- Deploy preview and production alias when approved.
- Update `FIX_REPORT.md`.
- No commits unless explicitly requested.

**Exit criteria:**

- All routes pass.
- Accessibility and performance budgets met.
- Preview reviewed.
- Production alias confirmed.
- User sign-off.

---

## 11. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Thin proof (one verified case) | Feature PRV; separate reference architectures; never fake logos or metrics |
| Premium direction becomes cold or unusable | Warm bone ground, serif accents, real photography, generous spacing, usability checks |
| Motion overwhelms content | Restrained durations, reduced-motion parity, performance budgets |
| Static export limits tools | Client-side computation, no PII, mailto/WhatsApp fallback |
| Scope creep into SaaS | Marketing site only; Command Center is labelled illustrative |
| Package rename confusion | Preserve SKUs and URLs; optional display alias only |
| Domain cutover blocked | Keep canonicals on the existing domain; document the dependency |
| FormSubmit inactive | Visible fallback and clear error state |
| Dark mode complexity | Light-first with dark chapters; no global toggle in v1 unless separately approved |
| Content gaps | Write real copy in each phase; no lorem ipsum; no placeholder claims |
| Performance regression from fonts/SVG | Subset fonts, optimize SVG, lazy-load below-fold modules, monitor budgets |
| Browser differences | Progressive enhancement; no WebGL dependency; test Chromium, Firefox and WebKit where available |

---

## 12. Success metrics

### Qualitative

- A stranger shown the home page for five seconds describes the company as an education systems/institution partner, not a website agency.
- A multi-branch decision-maker would take a proposal call after reviewing Platform, Work and Pricing.
- The site feels designed by a studio with a point of view, not generated from a template.
- The team can explain the offer in one sentence without listing 18 services.

### Commercial

- Increase in qualified proposal requests.
- Increase in Scope Architect completions.
- Increase in Institutional and Pro enquiries.
- Increase in pricing-to-contact conversion.
- Better budget-range signal from contact forms.
- No increase in unqualified "cheap website" enquiries.

Instrument only if analytics is approved; otherwise use qualitative review and form submissions.

### Technical

- All public routes return 200.
- No horizontal overflow at 320, 390, 768 and 1440.
- No console errors.
- WCAG 2.2 AA checks pass.
- Lighthouse targets met.
- Build, typecheck, unit and E2E gates pass.
- Initial JS and page weight budgets met.
- No unlabelled illustrative claims.

---

## 13. Acceptance criteria

### Visual

- Bone, ink and cobalt system applied consistently.
- Geist, Instrument Serif and Geist Mono used as specified.
- Hairline grid, ledger numerals and section markers visible.
- Dark chapters only where intended.
- No glass, gradient text, generic 3D, stock photography or card-grid sameness.
- The Stack is the signature interaction and remains legible on mobile.
- Every page looks intentional at 390, 768 and 1440.

### Content

- Root positioning is institutional, not coaching-only.
- 18 services remain represented.
- One verified case study; PRV is framed as financial-services engineering proof, not an education client.
- Reference architectures labelled and never counted as client work; no empty work filters.
- Command Center labelled illustrative.
- Pricing has four tiers, including Institutional; `featured` creates visual emphasis only, never a popularity claim.
- Festive offer removed from prominent surfaces.
- Any response-time promise is confirmed or removed.
- No invented clients, logos, awards, metrics or testimonials.
- No lorem ipsum.

### Functional

- All routes and redirects work.
- Header, mobile menu, Index and command palette work by keyboard.
- The Stack opens and closes with keyboard and pointer.
- Command Center tabs and filters work.
- Scope Architect completes and produces a summary.
- Health Check completes and produces a result.
- Contact form validates and falls back if delivery is unavailable.
- Reduced-motion mode shows all content and disables pin/scrub.

### Accessibility

- WCAG 2.2 AA target met.
- Skip link, landmarks and heading order correct.
- Focus visible and returned after dialogs.
- Tap targets at least 44px.
- Contrast checked for all text.
- Forms and results announced.
- No colour-only meaning.

### Performance and SEO

- LCP, CLS and INP budgets met.
- Home initial JS and page weight budgets met.
- Lighthouse thresholds met or explicitly approved.
- Metadata, canonical, sitemap, robots, RSS and JSON-LD correct.
- OG image renders.
- Old service URLs preserved.

### Process

- User reviews each phase.
- No commit or push without explicit request.
- Preview is reviewed before production alias.
- `FIX_REPORT.md` updated with final verification.

---

## 14. Open questions

1. **Global dark mode:** Recommendation is light-first with dark chapters, and no global theme toggle in v1. Confirm whether the existing toggle should be removed or retained behind a later phase.
2. **Starter vs Launch:** Recommendation is to preserve `Starter` as the public name and SKU. Confirm whether `Launch` should be used as a display alias.
3. **R3F:** Recommendation is to remove the generic marketing background immediately and audit case-study scenes. Confirm whether any 3D scene must survive.
4. **Institutional price display:** Recommendation is `From ₹3,00,000` with proposal-only scope. Confirm whether the public site should show the anchor or `Custom`.
5. **Proof:** If more verified work exists, it should be added. Otherwise reference architectures remain clearly labelled.
6. **Domain and FormSubmit:** Both are external launch dependencies. Confirm access and activation ownership.
7. **Analytics:** Confirm whether any analytics is approved. If not, no instrumentation in v1.
8. **Studio photography:** Confirm the existing studio photograph is cleared for broad marketing use.
9. **Response promise:** `site.ts` currently states `We reply to every enquiry within one business day.` Confirm this is operationally true, or remove it before launch. Do not carry an unverified service promise into the redesign.

---

## 15. Approval

This spec is ready for review when:

- The positioning and art direction are accepted.
- The route map and navigation are accepted.
- The pricing presentation and Institutional anchor are accepted.
- The proof and honesty rules are accepted.
- The phase boundaries are accepted.
- The open questions are resolved or explicitly deferred.

No implementation begins until the user signs off on this document.
