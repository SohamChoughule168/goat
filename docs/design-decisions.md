# Imaginars — Design Decisions
**STEP 1 deliverable · status: PROPOSED · awaiting owner review before any code changes**
Inputs: `docs/design-brief.md` (hard spec) + `docs/tokens.css` (single source of truth). Contrast ratios independently recomputed by script; they match the token file exactly.

---

## 1. Positioning — PROPOSED, needs owner sign-off

| Question | Proposed answer |
|---|---|
| What Imaginars does | A senior-led Mumbai studio that designs, builds and grows websites, mobile apps and AI-driven products |
| Who it is for | Founders and marketing leads at SMBs who want senior delivery without agency layers or freelancer risk |
| The one action | Complete the project brief form (`/contact`) — secondary path: WhatsApp |
| Three real proof points | ① **PRV Financial Services** — named client, live site, delivered April 2025 ② Founded 2024 · 18 services across 4 practices ③ Reply within one business day · 100% code/account ownership at handover |

Nothing invented. If any line fails verification at review, it ships cut.

---

## 2. Type scale (locked to tokens)

| Token | Size | Tracking | Leading | Weight | Used for |
|---|---|---|---|---|---|
| `--text-display` | clamp(2.75rem→5.25rem) | −0.035em | 0.98 | 500 (700 allowed >48px hero only) | Hero line, once/page |
| `--text-h1` | clamp(2.25rem→3.5rem) | −0.03em | 1.08 | 500 | Page titles |
| `--text-h2` | clamp(1.75rem→2.5rem) | −0.025em | 1.08 | 500 | Section heads |
| `--text-h3` | 1.375rem | −0.018em | 1.08 | 500 | Sub-sections, card titles |
| `--text-lede` | 1.125rem | −0.01em | 1.5 | 400 | Lede paragraphs, max 46ch |
| `--text-body` | **0.9375rem (15px)** | −0.006em | 1.65 | 400 | Everything default |
| `--text-sm` | 0.8125rem | −0.006em | 1.55 | 400 | Dense meta |
| `--text-micro` | 0.6875rem mono | **+0.14em** uppercase | — | 500 | `.micro` eyebrows, labels |

Fonts loaded (4 files): Satoshi 400/500/700 (local woff2, already in repo) + Geist Mono 500 (`next/font/google`). **Removed:** Clash Display, Zodiak, JetBrains Mono. Serif italics disappear entirely — emphasis becomes weight/color only.

## 3. Color ramp — measured contrast

| Pair | Ratio | Verdict |
|---|---|---|
| text-1 on bg | 18.06 | ✓ headings |
| text-2 on bg | 7.78 | ✓ body |
| text-3 on bg | 5.10 | ✓ meta |
| accent on bg | 11.05 | ✓ |
| accent-ink on accent | 10.97 | ✓ button label |
| text-2 on surface-2 | 7.03 | ✓ card body |
| **text-3 on surface-3** | **4.34** | ⚠ large-text only → rule added below |

**New rule from measurement:** `.micro` / `--text-3` text never sits on `--surface-3`; on raised surfaces meta uses `--text-2`.

## 4. Accent discipline — one hue, four places

`--accent #FFB224`. Appears ONLY as:
1. Header CTA fill (+ closing CTA fill — same element class, counted once)
2. Active navigation / active practice indicator bar
3. Global focus ring
4. One data highlight per page — home: the `<24h` response figure

Everything else is the neutral ramp. All Forge hues (`#ff6a5c/#4fc3ff/#e879c8/#e0b64f`) and `forge.ts` are deleted.

## 5. Signature motion

**Precision reveals**: 10px travel + opacity, 220ms, `cubic-bezier(0.16,1,0.30,1)`, 50ms stagger via `--i`, ONE IntersectionObserver adding `.is-in`, unobserve after fire.
Plus the single hero moment: hairline rule draws across the container (anime.js, `stroke-dashoffset`, 420ms); display line → lede → CTAs fade up 220ms each, staggered off its completion.
Hover: 120ms surface-step + `translateY(-1px)`. Press: `translateY(0.5px)`. Nothing else animates anywhere.

## 6. Homepage sections & skeletons (8 + footer)

| # | Section | Skeleton |
|---|---|---|
| S1 | Hero | Left-aligned asymmetric: micro eyebrow → hairline draw → display line → lede (46ch) → primary CTA + secondary. Right half deliberately empty except `.hero-wash`. |
| S2 | Proof strip | Full-width band, **three real numbers** separated by vertical hairlines, mono labels. Static — no marquee. |
| S3 | Offering split | Asymmetric 2-col: LEFT sticky h2 + lede + "All services" link; RIGHT four stacked practice rows (index · title · one-liner · count), hairline-separated, hover surface-step. Rows link to pillar pages. Not a card grid. |
| S4 | Wide statement | One verified sentence, display-size, indented with a left hairline rule. No cards, no columns. |
| S5 | Mechanism strip | Horizontal 4-cell definition list (Discovery → Strategy → Execution → Ownership): top hairline per cell, mono number + term + one line. Explains mechanism, not benefit. |
| S6 | Evidence | PRV Financial Services: LEFT mono meta block (client/sector/year/stack), RIGHT summary + three factual outcome lines + live-site link. Type & hairlines only — DeviceScene mockup deleted (imagery rule). |
| S7 | Insights | Three latest posts as hairline rows (title / category+date micro), list not cards. |
| S8 | Closing CTA | Top rule; one-line offer restatement + primary CTA + secondary contact links. Left-aligned. |
| — | Footer | Existing grouped quiet links, re-skinned to tokens. |

**Adjacency audit:** S2 (3-col numbers) vs S5 (4-col defs) both columnar but separated by S3/S4 and differ structurally (vertical rules vs top rules). S3/S7 both "stacked rows" but non-adjacent. **No adjacent duplicates.**

## 7. Deletion map — bringing the current build under §10

| Current violation/artifact | Action |
|---|---|
| Atmosphere aurora blobs | Deleted (blob ban). Replaced by `.hero-wash` only |
| Spectral-line multi-hue animation | Deleted (multi-hue gradient ban) |
| `btn-forge` gradient hover | Deleted (gradient button ban) |
| `.glass` backdrop-blur panels | Deleted (glassmorphism ban) → `surface--lit` cards |
| Forge hues + `forge.ts` | Deleted (two-accent ban) |
| Clash Display / Zodiak fonts | Removed from `fonts.ts` + all usages |
| ◆ emoji separators/diamonds | Deleted (emoji ban) — replaced by hairlines/micro rules |
| ProofStrip marquee | Replaced by static S2 proof strip (marquee ban) |
| Pinned manifesto + word cascade | Replaced by S4 wide statement (scroll-jack/one-animation bans) |
| Lenis smooth scroll | Uninstalled (scroll-alteration risk, not in spec) |
| GSAP everywhere | Uninstalled — anime.js installed for the hero draw only |
| Custom Cursor + Magnetic buttons | Deleted (decoration beyond spec) |
| KineticHeading word cascades | Deleted (one-entrance-animation rule) |
| ScrollProgress bar + wipe veil route transition | Deleted (>500ms / decoration) |
| HeroCanvas WebGL particles | Deleted (imagery ban + Lighthouse ≥95 target) — hero is type/hairline/wash |
| DeviceScene tilt mockup | Deleted from all pages (§6 imagery rule) — evidence uses live link instead |
| Constellation orbit/glow/auto-cycle | Replaced by S3 offering rows (no JS tabs needed) |
| PillarMotif decorative SVGs | Retained but static hairlines, `--border-strong` stroke, ≤480ms draw or plain reveal — recolored monochrome |
| shadcn zinc defaults | Theme vars mapped to token ramp; radius 6/10/14; no default look ships |

Dependency delta: uninstall `gsap @gsap/react lenis three @types/three`; install `animejs`.

## 8. Open questions for owner (blocking nothing except copy finalization)

1. Approve the four positioning proposals in §1? (Edits welcome — these become literal hero/copy.)
2. Accent choice lock: amber `#FFB224` (recommended) vs lime `#BEF264` — pick one, other is deleted.
3. Keep current 18-service IA and routes as-is under the new skin? (Recommended yes — IA is sound; this pass is visual/motion/copy.)
