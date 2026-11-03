# ImaginarsClub — Scroll Media, Records, and the Removal of 3D Objects

**Status:** Approved for implementation  
**Date:** 2026-10-31  
**Owner:** ImaginarsClub studio  
**Scope:** Homepage hero and operating view, `/craft` station 04, `/trust` handover section, legacy 3D removal  
**Amends:** `docs/superpowers/specs/2026-10-31-institutional-instrument-upgrade-design.md`  
**Approval:** User approved on 2026-10-31 with “yes go but remeber dont launch on .com i want the two links here.now and vercel.app”. Deployment is limited to the Vercel preview alias `goat-wheat.vercel.app` and a here.now publication. The `.com` domain, its DNS and its separate `imaginars-club-website` project are out of scope.

> This design is written to the working tree only. Per the user's standing instruction, it is **not committed**.

---

## 1. Summary

The client has two objections to the current build:

1. The operating-view dashboard publishes revenue (`Fees collected ₹1.84 Cr`) and rupee receipt rows. The client does not want earnings shown, because of tax exposure.
2. The 3D object scenes are wrong for the brief. The client wants the premium feel of Apple-style scroll, delivered with images and video — not modelled objects.

This design removes every rendered 3D object from the live site, removes every earnings figure, and replaces the two visual anchors with three media systems:

- **A — Editorial scroll sequence.** A pinned, full-bleed sequence of five generated stills on the homepage. Images crossfade and drift as the visitor scrolls; the copy holds still.
- **B — Film bench.** `/craft` station 04 becomes a scroll-scrubbed 8-second film of material studies. The film loads only when the station is run.
- **C — Handover cinema.** `/trust` gains a pinned stack of four document artefacts that assemble on scroll. No photography, no WebGL; the documents are real DOM.

The site remains a static Next.js export. There is no backend, no autoplay audio, no scroll-jacking, and no invented client proof.

---

## 2. What the client asked for, read literally

| Client words | Design interpretation |
|---|---|
| “we dont need to show this how much we earned cause it will lead to tax” | Remove revenue, collection and receivable figures everywhere. Keep prices the studio charges; a price is not earnings. |
| “the site is static no animation 3d animations graphics apple style” | The site remains a static export. Motion is progressive enhancement, not a runtime dependency. No WebGL, no object scenes, no autoplay. |
| “when we say 3d animtion we dont need objects 3d animated we want images videos and all” | Depth comes from photography, film, scale, parallax and stacking — not geometry. |
| “3d animated has we scroll it will feel premimum” | Scroll is the timeline. Pinned stages and scroll-linked crossfades, in the Apple product-page grammar. |

The apparent contradiction (“static” vs “animated as we scroll”) is resolved by making the **default state static**: every image, caption and document is present in the HTML. Scroll only changes which frame is emphasised. With JavaScript off, reduced motion on, or a failed runtime, the content is a readable static stack.

---

## 3. Removal inventory

### 3.1 Rendered 3D removed from live routes

| Surface | File(s) | Replacement |
|---|---|---|
| Homepage “Instrument” canvas | `src/components/home/instrument/*` | Hero still + layer legend; new scroll sequence below the hero |
| `/craft` station 04 R3F bench | `src/components/craft/bench-material.tsx`, `src/components/craft/stations/station-04-material.tsx` | `station-04-film.tsx` + `FilmScrub` |
| Homepage legend data | `src/components/home/instrument/plates.ts` | Move presentational fields to `src/content/institution.ts` |

### 3.2 Dead 3D systems removed after a zero-reference audit

These are not mounted on any live route today. They are deleted only after `grep` confirms no live import. Files that import each other are deleted as one cohort; `pnpm typecheck` is the gate that proves the cohort is closed:

- `src/components/canvas/` — persistent canvas, tunnel, section view, post-processing, scene set.
- `src/components/spatial/` — canvas and scenes.
- `src/components/experience/` — delete everything under it except `kit/`: scene canvas, router, scene map, experience layer and `scenes/`. **Keep `experience/kit/`**: `bus` is used by the contact form, `random` and `tier` by tests.
- `src/components/v6/` WebGL-only files — `team-webgl.tsx`, `craft-webgl.tsx`, `gpu-particle-system.tsx`, `particle-field.tsx`, `post-processing-pipeline.tsx`.
- `src/components/home/page.tsx` and the legacy `src/components/home/*` sections that exist only to feed it (`hero.tsx`, `manifesto.tsx`, `craft-chapters.tsx`, `ai-lab.tsx`, `work-strip.tsx`, `testimonials.tsx`, `pricing.tsx`, `team.tsx`, `process-line.tsx`, `final-cta.tsx`), **only if** the audit finds no route imports.
- `src/lib/three/support.ts` (used only by the removed instrument and experience layer).
- `src/shaders/` and `src/lib/three/shaderLoader.ts` (generated by `scripts/inline-shaders.mjs`; only the removed 3D used it).
- `src/__tests__/experience-scene-map.test.ts`.

If the audit finds any live import, the file stays and the deletion is dropped from this change. No route is allowed to break for the sake of cleanup.

### 3.3 Build and dependency cleanup

- `next.config.ts`: remove `@react-three/*` and `three` from `optimizePackageImports`; remove the `three` cache group, the `three/examples/jsm` alias, the `/models` cache header and the “CORS for 3D assets” comment.
- `package.json`: remove `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `postprocessing`, `tunnel-rat`, `@types/three`, and any other package left with zero references after the audit. `zustand` is removed only if `canvas/Tunnel.tsx` goes and no other import remains.
- `prebuild`: drop `precompute-scenes.mjs`. Keep `inline-shaders.mjs` only if `src/shaders` stays; otherwise drop it too.
- `scripts/precompute-scenes.mjs`, `scripts/compress-models.mjs`, `scripts/compress-textures.mjs`: delete if nothing references them, and remove their `package.json` script entries at the same time.
- Do not remove `gsap`, `lenis`, `lottie-web`, `framer-motion`, `sharp` or `glslify` unless the audit proves zero references. GSAP still runs the process timeline and craft station 05; Lottie runs the trust seal and craft station 08.

---

## 4. The operating view: fees become records

`src/components/home/command-center.tsx` is rewritten around three views: **Enquiries / Admissions / Records**.

### 4.1 Removed

- `ViewId` value `fees`.
- `fees` from every `branchData` entry.
- `feeRows`.
- `formatCrore`, `billed`, and the `fees` KPI group.
- Every `₹` amount in the component.

### 4.2 Replacement: Records

Rows are documents and operational states, not money:

| Student | Record | Branch | Status |
|---|---|---|---|
| Aarav Deshmukh | ID card | Main | Issued |
| Diya Nair | Attendance | North | Verified |
| Vivaan Kulkarni | Term report | Online | Issued |
| Ananya Iyer | Transfer certificate | Main | Pending |
| Rehan Shaikh | Attendance | North | Verified |
| Saanvi Bhat | ID card | Online | Issued |

KPIs for Records (derived from the existing illustrative branch counts, still labelled sample data):

- **Documents issued** — `Math.round(qualified × 2.4)`
- **Attendance logged** — `93 + (fill % 3)` percent
- **Active batches** — `Math.round(fill ÷ 2)`
- **Records complete** — `94 + (fill % 3)` percent

The bar chart heading becomes “Monthly records” in this view; otherwise it stays “Monthly intake”. Status tones reuse the existing `qualified` and `pending` dot styles; no new colour tokens.

### 4.3 Copy changes on the homepage

- Signal bar: “Built for institutions where enquiries, admissions and parents all arrive at once.”
- Thesis: “enquiries in three inboxes, records in a spreadsheet, batch updates sent from a personal phone…”
- Operating-view lede: “Enquiries, admissions and records share one set of definitions. Branch, source and owner stay attached from first contact to handover.”
- Final CTA: “A working session starts with the enquiry path, the admissions process and the reports you do not trust.”
- `/platform` engagement line: “where enquiries, admissions and parent communication break.”

**Prices charged remain.** The economics section and `/pricing` are not earnings and are not changed.

---

## 5. A — Homepage editorial scroll sequence

### 5.1 Hero

The hero keeps its split layout, headline, lede, verified proof line and both CTAs. The right-hand “Instrument” plate becomes a single editorial still:

- Label: **The operating layers** (was “The Instrument”).
- Image: a bone-and-ink desk still life with a cobalt folder; 4:5 crop; no people, no text.
- The four-layer legend remains, moved to `src/content/institution.ts` as presentational data: Brand / Website / Admissions / Intelligence, with the existing 01–08 index gap.
- Caption: “Four of eight layers, from brand to intelligence.”
- The image is a plain `<img>` with a 720/1200 `srcset`, explicit width and height, `loading="lazy"`, `fetchPriority="low"` and `decoding="async"`. The H1 remains the intended LCP.

### 5.2 Sequence section

Placed after the signal bar, before `FitCheck`. Dark (`inst-dark`) to separate it from the bone hero.

- Label: **One day, four layers**
- H2: **From the first enquiry to the final record.**
- Lede: “The same definitions move through every branch. Nothing is re-keyed between the desk, the record and the report.”
- Height: `calc(100svh * 4)` on desktop; `calc(100svh * 3.2)` on mobile.
- Stage: `position: sticky` beneath the header, `height: calc(100svh - var(--header-h))`. The stage clips its own frames with `overflow: clip`; the section itself sets no overflow, so sticky is not broken by a scroll container.
- Frames (all 16:9, no people, no readable text):

| # | Stage | Caption |
|---|---|---|
| 01 | Empty admissions desk at dawn, open blank ledger | **Enquiry.** A parent asks. Source, branch and owner attach to the record. |
| 02 | Overhead of blank enquiry cards in a cobalt tray | **Qualification.** Every counsellor applies the same definition of qualified. |
| 03 | Macro of a blank document with an embossed seal and cobalt ribbon | **Admission.** The offer, the seat and the batch update in one move. |
| 04 | Attendance register, blank ID cards, file tabs | **Record.** Attendance, documents and communication stay on one file. |
| 05 | Archive box, keys, closed laptop, late light | **Handover.** Accounts, code and the runbook leave with you. |

- Visual behaviour: active frame `opacity: 1`, `scale(1)`; inactive frames `opacity: 0`, `scale(1.04)`. The crossfade is 700ms; the scale drift is tied to progress, not a loop.
- Progress rail: 01–05 with a hairline that fills; `aria-hidden`.
- Footer note: “Illustrative sequence. No client records are shown.”
- CTA link: “See how the platform is assembled” → `/platform`.

### 5.3 Static fallback

- `prefers-reduced-motion`: the section collapses to a normal-flow editorial stack, all five frames visible, no sticky, no transforms.
- JavaScript off: a `<noscript>` style block applies the same static stack.
- If an image fails: the frame's caption remains on a bone plate, so the narrative is never lost.

---

## 6. B — `/craft` film bench

Station 04 is renamed and rebuilt.

### 6.1 Content

- `id: "film-bench"` (was `material-bench`).
- `skill: "ai-ui-ux-motion-engine"` (the R3F skill is retired; this station demonstrates cinematic media direction and scroll-linked playback).
- Title: **Film bench.**
- Summary: “One eight-second film, scrubbed by the station's own progress. No renderer, no model, no autoplay.”
- Detail: “The film loads only when you run the station. Scroll position maps to time; the tone chips grade the frame. Reset unmounts the video and returns the poster. This replaces the R3F material bench with real footage.”
- Runtime: “Scroll-scrubbed MP4”
- Payload: “≈2 MB, on run”
- Fallback: “Poster + first frame”
- Poster: “Six materials, one take, no renderer.”
- Status: live, span wide (unchanged grid balance).

`CRAFT_LEDGER` is updated: “Initial JS — No R3F or WebGL, poster only”; the “Instrument chunk 245.6 KB” row becomes “Film payload — ≈2 MB, on run”. `craft.ts` metadata and any copy referencing the homepage Instrument are updated.

### 6.2 Behaviour

- Poster first. `Run station` mounts the video; `Reset` unmounts it and restores the poster.
- The video is `muted`, `playsInline`, `preload="metadata"`, no audio track, no native controls in scrub mode.
- There is no autoplay. The only play call is a muted `play()` followed immediately by `pause()` after the explicit **Run station** click, used to unlock seeking on iOS. If that fails, the station shows a **Play film** button that plays the film normally once, not scrubbed.
- Scroll progress is measured against the station's own passage through the viewport — no page-level pin, no scroll-jacking.
- Tone chips (Bone / Ink / Cobalt) apply CSS `filter` grading to the video and poster.
- Mode chips become **Film / Contact sheet**. Contact sheet shows six stills in a grid at their native positions; Film returns to the scrub.
- Reduced motion: the video is not mounted. The station shows the poster and a normal `<video controls>` on request. No scroll mapping.
- Failure: if the video errors, the poster and a text note remain; the station does not break the page.

### 6.3 Asset

`public/media/craft/material-film.mp4` — 1600×900, 8s, H.264, CRF 23, no audio, `+faststart`, target ≤2.5 MB. Poster `material-poster-1200.webp`.

The film is built from six generated macro stills: paper fibre, ink on paper, glass edge, brushed brass, plaster, folded card. Slow 4% zooms and 0.8s crossfades; no camera shake, no text, no hands.

---

## 7. C — `/trust` handover cinema

Placed after the dark “delivery seal” section and before the data map.

### 7.1 Copy

- Label: **The handover**
- H2: **What you actually receive.**
- Lede: “Trust is easier to check than to claim. These are the artefacts that leave with you.”
- Note: “Illustrative documents. Client files are confidential.”

### 7.2 Plates

| # | Title | Body |
|---|---|---|
| 01 | The diagnosis | A written account of where enquiries, admissions and parent communication break. |
| 02 | The scope | What is built, what is not, and who owns each seam. |
| 03 | The runbook | Accounts, environments and the steps to run the system without us. |
| 04 | The keys | Ownership transferred in your name, not ours. |

Each plate is real DOM: a paper card with a cobalt tab, typed lines, a seal mark and a signature rule. No photography, no canvas, no SVG illustration of an object.

### 7.3 Behaviour

- Section height `calc(100svh * 3.2)`; sticky stage.
- As progress advances, plates rise from below, straighten from a 1.5° rotation and stack with a 12px offset. The active plate is fully opaque; the previous plates recede to 0.55.
- Progress rail with 01–04.
- All four articles remain in the accessibility tree in order; transforms are visual only.
- Mobile and reduced motion: normal flow, four cards stacked, no sticky.

---

## 8. Component architecture

### 8.1 New files

| File | Purpose |
|---|---|
| `src/components/media/scroll-sequence.tsx` | Generic pinned image sequence: frame list, captions, progress rail, static fallback. |
| `src/components/media/film-scrub.tsx` | Scroll-mapped video with poster, unlock gesture, tone filter, error fallback. |
| `src/components/home/institution-sequence.tsx` | Homepage section wrapper: copy + five frames. |
| `src/components/trust/handover-cinema.tsx` | Four document plates + sticky stack. |
| `src/content/institution.ts` | Presentational layer data and the five sequence frames. |
| `src/content/trust.ts` (optional) | The four handover plates, if the page file grows too large. |
| `src/lib/motion/stage-progress.ts` | Shared scroll-progress hook. |

### 8.2 `stage-progress.ts`

```ts
useStageProgress(ref, {
  count,
  onIndex(index: number): void,
}): void
```

- Adds a passive `scroll` listener and a `resize` listener.
- Uses one `requestAnimationFrame` per frame; writes `--stage-progress` to the element and calls `onIndex` only when the integer index changes.
- Observes the section with `IntersectionObserver`; detaches scroll work when it is far outside the viewport.
- Returns early and does nothing when `prefers-reduced-motion: reduce` matches.
- Never creates a Lenis instance or a ScrollTrigger; `src/lib/motion/scroll.ts` remains the single owner of smooth scroll.

### 8.3 `scroll-sequence.tsx`

Props:

```ts
interface SequenceFrame {
  src: string;
  srcSet?: string;
  alt: string;
  stage: string;
  caption: string;
  width: number;
  height: number;
}

interface ScrollSequenceProps {
  label: string;
  title: ReactNode;
  lede: string;
  frames: SequenceFrame[];
  note?: string;
  action?: ReactNode;
}
```

- Server-renders all frames and captions.
- First frame is visible by default; the rest are `opacity: 0` but present.
- Images use explicit width/height, `decoding="async"`, and `loading="lazy"` except the first.
- No `aria-live`; the five captions are read in order.

### 8.4 `film-scrub.tsx`

Props: `src`, `poster`, `alt`, `tone`, `onError?`, `reducedMotion?`.

- Owns the unlock, seek, and cleanup.
- `requestAnimationFrame`-throttled `currentTime` writes; no state update per scroll.
- Destroys the video element on unmount.

### 8.5 CSS

- Add `.inst-sequence`, `.sequence-stage`, `.sequence-frame`, `.sequence-caption`, `.sequence-rail` to `src/styles/institutional.css`.
- Add `.handover-*` beside the trust styles.
- Add `.craft-film-*` to `src/styles/craft.css`.
- Remove the `.instrument-canvas`, `.instrument-plot`, `.instrument-static` rules that no longer have a consumer; rename `.instrument-legend` to `.layer-legend` if the class is no longer semantically honest.

---

## 9. Asset pipeline

### 9.1 Generation

Images are generated with the built-in image tool, in the site's bone / ink / cobalt palette, as editorial still-life and architectural photography. Every prompt specifies: **no people, no faces, no hands, no lettering, no numbers, no logos, no signage, blank paper**.

Deliverables:

| Asset | Count | Source ratio | Derivatives |
|---|---|---|---|
| Hero plate | 1 | 4:5 | 720w, 1200w WebP |
| Homepage sequence | 5 | 16:9 | 800w, 1600w WebP |
| Craft film stills | 6 | 16:9 | 1600w source for ffmpeg; poster 1200w WebP |

Sources are kept in the session temp directory, not in `public/` or the repo. Only derivatives ship.

### 9.2 Processing

- `sharp` (already a dependency) crops to the target ratio and writes WebP at quality 82, effort 5.
- `ffmpeg` (installed, 9.0) builds the film:
  - 8 seconds, 1600×900, 24 fps.
  - Each still holds ~1.6s with a 4% zoom; 0.8s crossfades.
  - `-c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p -movflags +faststart -an`.
- Verify the MP4 is ≤2.5 MB and the poster ≤150 KB before wiring it in.

### 9.3 Review gate

Every generated image is reviewed before shipping for accidental text, faces, hands or logos. Any image that contains them is regenerated, not shipped.

---

## 10. Performance, accessibility, and fallbacks

### 10.1 Budgets

- Homepage initial image payload: ≤250 KB above the fold; sequence images load lazily at ≤160 KB each.
- Film: 0 bytes until `Run station`; ≤2.5 MB on run.
- No Three.js, R3F, drei, postprocessing or tunnel-rat in any route bundle.
- Expected removal: the 245.6 KB gzip instrument chunk plus the R3F/runtime chunks.
- Added: one small client component per surface, estimated ≤6 KB gzip each, sharing the progress hook.

### 10.2 Gates

- Mobile LCP ≤2.5s, CLS ≤0.05, INP ≤200ms, TBT ≤300ms.
- Lighthouse mobile performance ≥90, desktop ≥95, accessibility 100.
- Measure three runs and report the range; do not cherry-pick.
- `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm test:e2e`, contrast CI and token lint all pass.

### 10.3 Accessibility

- All captions and document text are real DOM.
- Images carry descriptive alt text; decorative rails are `aria-hidden`.
- No motion is required to understand any section.
- `prefers-reduced-motion` removes sticky stages, transforms and video mounting.
- Overlay text sits on a solid scrim of at least 80% ink; contrast is verified by the existing contrast CI.
- Keyboard focus order follows the DOM; no focus traps.
- The film's Run/Reset, tone and mode buttons are real buttons with `aria-pressed` and visible focus.

### 10.4 No-JS and failure

- `<noscript>` styles turn each stage into a static stack.
- A failed image leaves its caption; a failed video leaves its poster and note.
- The command center remains usable in its default Enquiries view without JavaScript, as today.

---

## 11. Testing

### 11.1 Unit and content

- Update `src/__tests__/craft.test.ts`: station 04 skill is `ai-ui-ux-motion-engine`; the eleven-station order and 9 live / 2 pending counts are preserved.
- Delete `src/__tests__/experience-scene-map.test.ts` with the scene map.
- Add `src/__tests__/command-center.test.ts` as a source-level test: read `command-center.tsx` and assert it contains no `₹`, no `fees`, no `fees collected`, and that `Records` is present. This avoids adding a DOM test stack for one check.
- Add a content test asserting the homepage source contains no `₹1.84` and no “Fees collected”.
- Extend `content-integrity.test.ts` for the new sequence and handover copy lengths if the file already validates section copy.

### 11.2 E2E

- Homepage: hero proof line and both CTAs still present; sequence renders five captions; no console errors; no `canvas` element in the hero; no `₹` in the operating view.
- `/craft`: station 04 poster visible, Run mounts a video, Reset unmounts it; no WebGL canvas on the page.
- `/trust`: four handover plates present; reduced-motion mode shows them stacked.
- JS-disabled pass: homepage sequence captions and trust plates are visible.
- Axe pass on `/`, `/craft`, `/trust` in desktop and mobile.

### 11.3 Visual and performance

- Screenshot the homepage at 1440, 1024, 768 and 390 widths; check the sequence stage, caption contrast and no overlap with the sticky header.
- Lighthouse local and on the Vercel preview.
- Verify no 3D chunks in the build output (`grep` the `.next` static chunks for `three` / `react-three`).

---

## 12. Deployment

- Build the static export locally and run the host checks.
- Deploy a **preview** to Vercel and alias `goat-wheat.vercel.app`; do not promote production.
- Never touch `imaginarsclubservices.com`, its DNS, or the separate `imaginars-club-website` project.
- Republish the here.now preview only if the existing site is still within its claim window; record the new URL and expiry.
- Update `docs/PHASE_0_BASELINE.md` and the relevant plan with the new measurements.
- Leave all changes uncommitted unless the user asks for a commit.

---

## 13. Out of scope

- No backend, API, database, auth, portal or CMS.
- No changes to prices, packages or the verified PRV proof.
- No new 3D, WebGL, Spline, Rive or Lottie object scenes.
- No autoplay audio or video.
- No scroll-jacking; no wheel interception beyond the existing Lenis owner.
- No change to the `.com` site or its aliases.
- No client data or invented client results.

---

## 14. Approval

Approved when the user confirms:

1. Fees become **Records**; all earnings figures are removed; prices remain.
2. The homepage gains the five-frame scroll sequence and loses the Instrument canvas.
3. `/craft` station 04 becomes the scroll-scrubbed film bench.
4. `/trust` gains the four-plate handover cinema.
5. Dead 3D code and dependencies are removed only where the reference audit proves zero live imports.
6. Generated imagery is used, with the no-people/no-text review gate.
