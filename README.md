# ImaginarsClub Services — Studio Website

Production website for [ImaginarsClub Services](https://www.imaginarsclubservices.com), a senior-led digital studio in Mumbai. Dark-first editorial design, one signature WebGL hero, GSAP/Lenis motion system, and an honesty-first content model: every published claim must trace to a source.

## Stack

- Next.js 16 (App Router, RSC, Turbopack) · React 19 · TypeScript strict
- Tailwind CSS v4 + shadcn/ui (Radix primitives)
- GSAP + ScrollTrigger · Lenis smooth scroll
- Three.js hero scene (lazy chunk, tiered fallbacks)
- File-based typed content layer (`src/content`), zod-validated contact flow

## Commands

```bash
npm run dev        # develop at localhost:3000
npm run build      # production build
npm run start      # serve production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm test           # vitest (content + redirect integrity gates)
```

## Environment variables (all optional)

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Enables transactional email delivery of contact leads. Without it, leads are logged to server console. |
| `CONTACT_FROM_EMAIL` | Verified Resend sender address. |
| `CONTACT_TO_EMAIL` | Inbox receiving enquiries (defaults to the studio Gmail). |

No other credentials required; no database.

## Editing content

All copy lives in `src/content/` as typed modules — no CMS, no deploy-time surprises:

- `site.ts` — name, contact details, hours, nav
- `services.ts` — 4 practice pillars + 18 services (deliverables, FAQs, legacy URL slugs)
- `work.ts` — case studies. **Every entry requires `status: "verified"` and real proof links**; the build's test suite enforces this policy.
- `insights.ts` — articles (structured blocks, rendered statically)

`src/__tests__/redirects.test.ts` cross-checks every legacy URL in `next.config.ts` against the content layer, so retiring or renaming a service can never silently break an indexed URL.

## Architecture notes

- Motion is coordinated by a single `MotionProvider`: Lenis instance, reveal registry (`data-reveal` attributes work from any server component), anchor scrolling, reduced-motion kill switch.
- The Three.js hero mounts only after capability detection (`lib/three/support.ts`) and degrades to a static art fallback on low-end devices, reduced-motion, or WebGL failure. It never participates in LCP.
- Fonts (Clash Display / Satoshi / Zodiak / JetBrains Mono) are self-hosted via `next/font/local`.
