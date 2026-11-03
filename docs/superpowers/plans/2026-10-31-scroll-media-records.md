# Scroll Media, Records, and the Removal of 3D Objects — Implementation Plan

**Status:** Ready to execute  
**Date:** 2026-10-31  
**Owner:** ImaginarsClub studio  
**Source spec:** `docs/superpowers/specs/2026-10-31-scroll-media-records-design.md`  
**Target routes:** `/`, `/craft`, `/trust`  
**Deployment:** Vercel **preview** alias `goat-wheat.vercel.app` and here.now only. Never `.com`.

---

## Execution rules

1. **No commits.** The user has explicitly asked for the working tree to stay uncommitted. Every “checkpoint” below is a verification stop, not a commit. Do not run `git add`, `git commit`, `git push`, `vercel promote`, or `vercel --prod`.
2. **No `.com` changes.** Do not touch `imaginarsclubservices.com`, its DNS, or the `imaginars-club-website` Vercel project.
3. **TDD where code is testable.** Write the failing test first, watch it fail, then implement. Content and source-level tests are valid tests in this repo (Vitest runs in `node`, no jsdom).
4. **Assets before integration.** The components reference final filenames. Generate and process the media before wiring the homepage, craft bench and trust page.
5. **Progressive enhancement.** Every new section must render a readable static stack with JavaScript off and under `prefers-reduced-motion: reduce`.
6. **No new runtime dependencies.** `sharp` and `ffmpeg` are already available and are build-time tools only.

**Verification commands used throughout**

```powershell
pnpm typecheck
pnpm lint
pnpm vitest run src/__tests__/<file>.test.ts
pnpm test
pnpm build
pnpm test:e2e
```

---

## Task 1 — Shared scroll progress primitive

**Why:** Three surfaces need the same scroll math. One hook keeps the Lenis owner untouched and prevents three subtly different implementations.

**Files**

- Create `src/lib/motion/stage-progress.ts`
- Create `src/__tests__/stage-progress.test.ts`

### Step 1: write the failing test

`src/__tests__/stage-progress.test.ts`

```ts
import { describe, expect, it } from "vitest";
import { sectionProgress, stageIndex } from "@/lib/motion/stage-progress";

describe("stage progress", () => {
  it("maps overall progress to a frame index", () => {
    expect(stageIndex(0, 5)).toBe(0);
    expect(stageIndex(0.19, 5)).toBe(0);
    expect(stageIndex(0.2, 5)).toBe(1);
    expect(stageIndex(0.79, 5)).toBe(3);
    expect(stageIndex(1, 5)).toBe(4);
  });

  it("clamps progress outside the section", () => {
    expect(stageIndex(-1, 5)).toBe(0);
    expect(stageIndex(2, 5)).toBe(4);
    expect(stageIndex(0.5, 0)).toBe(0);
    expect(stageIndex(0.5, 1)).toBe(0);
  });

  it("measures section travel, not viewport position", () => {
    expect(sectionProgress(0, 4000, 1000)).toBe(0);
    expect(sectionProgress(-1500, 4000, 1000)).toBe(0.5);
    expect(sectionProgress(-3000, 4000, 1000)).toBe(1);
    expect(sectionProgress(-9000, 4000, 1000)).toBe(1);
  });

  it("treats a section shorter than the viewport as complete once it reaches the top", () => {
    expect(sectionProgress(200, 600, 1000)).toBe(0);
    expect(sectionProgress(0, 600, 1000)).toBe(1);
    expect(sectionProgress(-200, 600, 1000)).toBe(1);
  });
});
```

Run it and confirm it fails because the module does not exist:

```powershell
pnpm vitest run src/__tests__/stage-progress.test.ts
```

### Step 2: implement

`src/lib/motion/stage-progress.ts` must export exactly:

```ts
"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";

export interface StageProgressOptions {
  count: number;
  onIndex: (index: number) => void;
}

export function stageIndex(progress: number, count: number): number;
export function sectionProgress(top: number, height: number, viewport: number): number;
export function useStageProgress(
  ref: RefObject<HTMLElement | null>,
  options: StageProgressOptions,
): void;
```

Behaviour:

- `stageIndex` clamps `progress` to `[0, 1]`, returns `0` when `count <= 1`, otherwise `Math.min(count - 1, Math.floor(progress * count))`.
- `sectionProgress` returns `clamp(-top / max(1, height - viewport), 0, 1)`. When `height <= viewport`, return `1` if `top <= 0`, else `0`.
- `useStageProgress` adds one passive `scroll` listener and one `resize` listener, scheduled through a single `requestAnimationFrame`.
- Each frame writes `--stage-progress` as a 4-decimal string on the referenced element and calls `onIndex` only when the integer index changes.
- It uses an `IntersectionObserver` with `rootMargin: "200px 0px"` to attach and detach the scroll listeners when the section is far outside the viewport.
- It returns early and does nothing when `window.matchMedia("(prefers-reduced-motion: reduce)").matches`.
- It must **not** import Lenis or GSAP. `src/lib/motion/scroll.ts` remains the single smooth-scroll owner.
- Cleanup removes both listeners, disconnects the observer, cancels the pending frame, and removes the CSS variable.

### Step 3: verify

```powershell
pnpm vitest run src/__tests__/stage-progress.test.ts
pnpm typecheck
```

**Checkpoint:** 4 tests pass, typecheck clean. No commit.

---

## Task 2 — Generate, review, and process the media

**Why:** The client asked for images and video, not rendered objects. Every asset ships as a WebP derivative or an MP4; sources stay in the session temp directory.

**Files (shipped only)**

```
public/media/institution/hero-desk-720.webp
public/media/institution/hero-desk-1200.webp
public/media/institution/sequence-01-800.webp
public/media/institution/sequence-01-1600.webp
... sequence-02 through sequence-05 ...
public/media/craft/material-poster-1200.webp
public/media/craft/material-still-01-800.webp
... material-still-02 through material-still-06 ...
public/media/craft/material-film.mp4
```

**Temporary workspace:** `C:\Users\soham\AppData\Local\Temp\opencode\scroll-media\` (sources, JPG intermediates, processing script). Nothing from this folder enters the repo.

### Step 1: generate the stills

Use the built-in image tool once per image. Every prompt must end with the same constraint:

> No people, no faces, no hands, no lettering, no numbers, no logos, no signage, no readable text. All paper is blank. Editorial architectural photography, bone / ink / cobalt palette, fine grain, soft directional light.

**Hero — 4:5 vertical, 1 image**

> A bone-and-ink desk still life photographed from a high three-quarter angle: a closed cobalt blue paper folder, a stack of blank ivory paper, a slim black pen, and a small ceramic dish. Soft morning light from the left, long quiet shadows, premium medium-format magazine photography.

**Homepage sequence — 16:9 wide, 5 images**

1. `sequence-01` — “An empty admissions desk at dawn: an open blank ledger, two empty chairs, one window with soft blue morning light, bone walls and ink shadows.”
2. `sequence-02` — “Overhead view of blank ivory enquiry cards arranged in a cobalt blue tray on a bone desk, sharp diagonal shadows.”
3. `sequence-03` — “Macro of a blank ivory document with an embossed circular seal and a cobalt ribbon, raking side light, shallow depth of field.”
4. `sequence-04` — “Still life of an attendance register with blank pages, a fan of blank ID cards, and manila file tabs on a bone surface.”
5. `sequence-05` — “Late-afternoon still life of a closed archive box, a small set of keys, a closed laptop, and warm low light across a bone desk.”

**Craft film stills — 16:9 wide, 6 images**

1. `material-still-01` — paper fibre macro.
2. `material-still-02` — ink on paper macro.
3. `material-still-03` — glass edge macro.
4. `material-still-04` — brushed brass macro.
5. `material-still-05` — plaster macro.
6. `material-still-06` — folded card macro.

Each still is a slow, calm macro study; no camera shake, no hands, no text.

### Step 2: review every image before processing

Open each generated file with the `read` tool. Reject and regenerate if it contains **any** person, face, hand, readable lettering, number, logo, or signage. Do not “fix it in post”. Record the review in the execution notes.

### Step 3: process with sharp

Create `C:\Users\soham\AppData\Local\Temp\opencode\scroll-media\build-media.mjs`:

```js
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const root = "D:/goat";
const source = "C:/Users/soham/AppData/Local/Temp/opencode/scroll-media";

await mkdir(path.join(root, "public/media/institution"), { recursive: true });
await mkdir(path.join(root, "public/media/craft"), { recursive: true });

const jobs = [
  // hero: 4:5
  ["hero-source", "institution/hero-desk", 4 / 5, [720, 1200]],
  // sequence: 16:9
  ["sequence-01", "institution/sequence-01", 16 / 9, [800, 1600]],
  ["sequence-02", "institution/sequence-02", 16 / 9, [800, 1600]],
  ["sequence-03", "institution/sequence-03", 16 / 9, [800, 1600]],
  ["sequence-04", "institution/sequence-04", 16 / 9, [800, 1600]],
  ["sequence-05", "institution/sequence-05", 16 / 9, [800, 1600]],
  // contact-sheet stills: 16:9
  ["material-still-01", "craft/material-still-01", 16 / 9, [800]],
  ["material-still-02", "craft/material-still-02", 16 / 9, [800]],
  ["material-still-03", "craft/material-still-03", 16 / 9, [800]],
  ["material-still-04", "craft/material-still-04", 16 / 9, [800]],
  ["material-still-05", "craft/material-still-05", 16 / 9, [800]],
  ["material-still-06", "craft/material-still-06", 16 / 9, [800]],
];

for (const [name, out, ratio, widths] of jobs) {
  for (const width of widths) {
    const height = Math.round(width / ratio);
    await sharp(path.join(source, `${name}.png`))
      .resize(width, height, { fit: "cover", position: "attention" })
      .webp({ quality: 82, effort: 5 })
      .toFile(path.join(root, "public/media", `${out}-${width}.webp`));
  }
}

// Video poster and 1600x900 intermediates for ffmpeg.
await sharp(path.join(source, "material-still-01.png"))
  .resize(1200, 675, { fit: "cover", position: "attention" })
  .webp({ quality: 82, effort: 5 })
  .toFile(path.join(root, "public/media/craft/material-poster-1200.webp"));

for (let i = 1; i <= 6; i += 1) {
  const file = `material-still-0${i}`;
  await sharp(path.join(source, `${file}.png`))
    .resize(1600, 900, { fit: "cover", position: "attention" })
    .jpeg({ quality: 92 })
    .toFile(path.join(source, `${file}-1600.jpg`));
}
```

Run it with `node` from the repo root.

**Size targets**

- `hero-desk-720.webp` ≤ 90 KB; `hero-desk-1200.webp` ≤ 180 KB.
- Each sequence `-800` ≤ 90 KB; each `-1600` ≤ 160 KB.
- `material-poster-1200.webp` ≤ 150 KB.
- Each `material-still-0N-800.webp` ≤ 100 KB.

If an output exceeds its target, lower WebP quality to 78 and re-run; do not upscale.

### Step 4: build the 8-second film

Six stills, 2.0 seconds each, five 0.8-second crossfades: `6 × 2.0 − 5 × 0.8 = 8.0` seconds.

```powershell
ffmpeg -y `
  -loop 1 -t 2 -i material-still-01-1600.jpg `
  -loop 1 -t 2 -i material-still-02-1600.jpg `
  -loop 1 -t 2 -i material-still-03-1600.jpg `
  -loop 1 -t 2 -i material-still-04-1600.jpg `
  -loop 1 -t 2 -i material-still-05-1600.jpg `
  -loop 1 -t 2 -i material-still-06-1600.jpg `
  -filter_complex "
    [0:v]zoompan=z='min(zoom+0.0009,1.04)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=48:s=1600x900:fps=24,setsar=1[v0];
    [1:v]zoompan=z='min(zoom+0.0009,1.04)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=48:s=1600x900:fps=24,setsar=1[v1];
    [2:v]zoompan=z='min(zoom+0.0009,1.04)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=48:s=1600x900:fps=24,setsar=1[v2];
    [3:v]zoompan=z='min(zoom+0.0009,1.04)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=48:s=1600x900:fps=24,setsar=1[v3];
    [4:v]zoompan=z='min(zoom+0.0009,1.04)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=48:s=1600x900:fps=24,setsar=1[v4];
    [5:v]zoompan=z='min(zoom+0.0009,1.04)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=48:s=1600x900:fps=24,setsar=1[v5];
    [v0][v1]xfade=transition=fade:duration=0.8:offset=1.2[x1];
    [x1][v2]xfade=transition=fade:duration=0.8:offset=2.4[x2];
    [x2][v3]xfade=transition=fade:duration=0.8:offset=3.6[x3];
    [x3][v4]xfade=transition=fade:duration=0.8:offset=4.8[x4];
    [x4][v5]xfade=transition=fade:duration=0.8:offset=6.0,format=yuv420p[v]
  " `
  -map "[v]" -t 8 -r 24 -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p `
  -movflags +faststart -an public/media/craft/material-film.mp4
```

### Step 5: verify the media

```powershell
ffprobe -v error -show_entries format=duration,size -show_entries stream=width,height,codec_name -of default=noprint_wrappers=1 public/media/craft/material-film.mp4
Get-ChildItem public/media -Recurse -File | Select-Object FullName,Length
```

Required:

- Duration `8.0` seconds (tolerance ±0.05), 1600×900, `h264`, no audio stream.
- MP4 ≤ 2.5 MB.
- Every WebP within its size target.
- No source PNGs or JPGs under `public/`.

**Checkpoint:** 19 shipped files, film ≤ 2.5 MB, every image reviewed. No commit.

---

## Task 3 — Institution content data

**Why:** The hero legend and the five sequence frames must be data, not JSX scattered across two components.

**Files**

- Create `src/content/institution.ts`
- Create `src/__tests__/institution-content.test.ts`

### Step 1: write the failing test

```ts
import { describe, expect, it } from "vitest";
import {
  institutionFrames,
  institutionHero,
  institutionLayers,
} from "@/content/institution";

describe("institution content", () => {
  it("keeps the four visible layers and the deliberate index gap", () => {
    expect(institutionLayers.map((layer) => layer.index)).toEqual([
      "01",
      "02",
      "03",
      "08",
    ]);
    expect(institutionLayers.map((layer) => layer.title)).toEqual([
      "Brand",
      "Website",
      "Admissions",
      "Intelligence",
    ]);
  });

  it("keeps the hero still at a 4:5 ratio", () => {
    expect(institutionHero.width / institutionHero.height).toBeCloseTo(0.8, 2);
    expect(institutionHero.srcSet).toContain("720w");
    expect(institutionHero.srcSet).toContain("1200w");
  });

  it("publishes five 16:9 frames with real captions", () => {
    expect(institutionFrames).toHaveLength(5);
    for (const frame of institutionFrames) {
      expect(frame.width / frame.height).toBeCloseTo(16 / 9, 2);
      expect(frame.srcSet).toContain("800w");
      expect(frame.srcSet).toContain("1600w");
      expect(frame.alt.length).toBeGreaterThan(20);
      expect(frame.stage.length).toBeGreaterThan(3);
      expect(frame.caption.length).toBeGreaterThan(30);
      expect(frame.caption).not.toContain("₹");
    }
  });
});
```

### Step 2: implement

Export exactly these types and values:

```ts
export type InstitutionTone = "ink" | "bone" | "bone-2" | "cobalt";

export interface InstitutionLayer {
  id: "brand" | "website" | "admissions" | "intelligence";
  index: string;
  title: string;
  meta: string;
  tone: InstitutionTone;
}

export interface InstitutionFrame {
  src: string;
  srcSet: string;
  alt: string;
  stage: string;
  caption: string;
  width: number;
  height: number;
}

export const institutionLayers: InstitutionLayer[];
export const institutionHero: {
  src: string;
  srcSet: string;
  alt: string;
  width: number;
  height: number;
};
export const institutionFrames: InstitutionFrame[];
```

Layer copy is carried from `src/components/home/instrument/plates.ts`:

| id | index | title | meta | tone |
|---|---|---|---|---|
| brand | 01 | Brand | Identity and governance | ink |
| website | 02 | Website | Public front door | bone |
| admissions | 03 | Admissions | Enquiry to enrolment | bone-2 |
| intelligence | 08 | Intelligence | One reporting layer | cobalt |

Frame copy is exactly the table in spec §5.2. `src`/`srcSet` use the filenames from Task 2. `width: 1600`, `height: 900` for every frame.

Hero: `width: 1200`, `height: 1500`, `alt: "A bone-and-ink desk still life with a closed cobalt folder and blank paper."`

### Step 3: verify

```powershell
pnpm vitest run src/__tests__/institution-content.test.ts
pnpm typecheck
```

**Checkpoint:** 3 tests pass. No commit.

---

## Task 4 — `ScrollSequence` component and its CSS

**Why:** One generic pinned sequence serves the homepage today and any future editorial sequence without duplicating scroll code.

**Files**

- Create `src/components/media/scroll-sequence.tsx`
- Modify `src/styles/institutional.css`
- Modify `src/app/layout.tsx` (one global `<noscript>` block)
- Create `src/__tests__/scroll-sequence.test.ts` (source contract)

### Step 1: write the failing source-contract test

```ts
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync("src/components/media/scroll-sequence.tsx", "utf8");

describe("scroll sequence contract", () => {
  it("server-renders every caption and image", () => {
    expect(source).toContain("figcaption");
    expect(source).toContain("frame.caption");
    expect(source).toContain("frame.alt");
    expect(source).toContain("frame.srcSet");
  });

  it("uses the shared progress hook and no second scroll owner", () => {
    expect(source).toContain("useStageProgress");
    expect(source).not.toContain("lenis");
    expect(source).not.toContain("ScrollTrigger");
  });

  it("does not mark inactive frames aria-hidden", () => {
    expect(source).not.toContain("aria-hidden={index");
  });
});
```

### Step 2: implement the component

`src/components/media/scroll-sequence.tsx` is a client component with this public surface:

```ts
"use client";

import type { ReactNode } from "react";

export interface SequenceFrame {
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
  frames: readonly SequenceFrame[];
  note?: string;
  action?: ReactNode;
}

export default function ScrollSequence(props: ScrollSequenceProps): ReactNode;
```

Render contract:

- A `<section className="inst-sequence" ref={sectionRef} aria-labelledby={headingId} data-active={active}>`.
- Inside, one `.sequence-sticky` containing:
  - `.inst-shell.sequence-intro`: label, `<h2 id={headingId}>`, lede.
  - `.inst-shell.sequence-body`: `.sequence-stage` with all five `<figure className="sequence-frame" data-active={index === active}>`, then `.sequence-rail` (`aria-hidden="true"`).
  - `.inst-shell.sequence-foot`: optional note and action.
- Every frame renders `<img src srcSet sizes="(max-width: 767px) 100vw, 90vw" alt width height decoding="async">`.
- Frame `0` uses `loading="eager"` and `fetchPriority="low"`; frames `1–4` use `loading="lazy"`.
- Every frame renders `<figcaption className="sequence-caption">` with the index, the stage word, and the caption body. Inactive frames stay in the accessibility tree; only opacity changes.
- The rail fill is driven by `--stage-progress`; the active number is driven by `data-active`. No `aria-live`.
- `useStageProgress(sectionRef, { count: frames.length, onIndex: setActive })`.

### Step 3: add the CSS

Append a clearly labelled block to `src/styles/institutional.css`:

```css
/* Editorial scroll sequence */
.inst-sequence {
  position: relative;
  height: calc(100svh * 4);
  background: var(--ink);
  color: var(--dark-ink);
  border-bottom: 1px solid var(--dark-rule);
}

.sequence-sticky {
  position: sticky;
  top: var(--header-h);
  height: calc(100svh - var(--header-h));
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  gap: clamp(0.9rem, 2.5vh, 1.75rem);
  padding-block: clamp(1.5rem, 4vh, 3rem) clamp(1rem, 2.5vh, 1.75rem);
  overflow: clip;
  background: var(--ink);
}

.sequence-lede {
  max-width: 54ch;
  margin-top: 1rem;
  color: var(--dark-muted);
}

.sequence-body {
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.sequence-stage {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: clip;
  border: 1px solid var(--dark-rule);
  background: var(--dark-2);
}

.sequence-frame {
  position: absolute;
  inset: 0;
  margin: 0;
  opacity: 0;
  transition: opacity 700ms var(--ease-state);
}

.sequence-frame[data-active="true"] {
  opacity: 1;
  z-index: 2;
}

.sequence-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(calc(1.04 - var(--stage-progress, 0) * 0.04));
}

.sequence-caption {
  position: absolute;
  inset: auto 0 0;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.4rem 0.75rem;
  padding: clamp(1rem, 2.5vw, 1.75rem);
  background: rgba(17, 18, 15, 0.88);
  color: var(--dark-ink);
}

.sequence-caption-index,
.sequence-caption-stage {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--cobalt-soft);
}

.sequence-caption-body {
  flex: 1 1 28ch;
  max-width: 64ch;
  font-size: clamp(0.875rem, 1.1vw, 1rem);
  line-height: 1.5;
}

.sequence-rail {
  position: relative;
  height: 1.25rem;
}

.sequence-rail::before,
.sequence-rail-fill {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  height: 1px;
}

.sequence-rail::before {
  right: 0;
  background: var(--dark-rule);
}

.sequence-rail-fill {
  width: calc(var(--stage-progress, 0) * 100%);
  background: var(--cobalt-soft);
}

.sequence-rail ol {
  position: relative;
  display: flex;
  justify-content: space-between;
  margin: 0;
  padding: 0;
  list-style: none;
}

.sequence-rail li {
  font-family: var(--font-mono);
  font-size: 0.5625rem;
  letter-spacing: 0.12em;
  color: var(--dark-muted);
}

.sequence-rail li[data-active="true"] {
  color: var(--dark-ink);
}

@media (max-width: 767px) {
  .inst-sequence {
    height: calc(100svh * 3.2);
  }
}

@media (prefers-reduced-motion: reduce) {
  .inst-sequence {
    height: auto;
  }

  .sequence-sticky {
    position: static;
    height: auto;
    display: block;
    overflow: visible;
  }

  .sequence-intro {
    padding-block: 3rem 1.5rem;
  }

  .sequence-stage {
    display: grid;
    gap: 1.25rem;
    border: 0;
    background: transparent;
  }

  .sequence-frame {
    position: static;
    opacity: 1;
  }

  .sequence-frame img {
    transform: none;
    aspect-ratio: 16 / 9;
  }

  .sequence-rail {
    display: none;
  }
}
```

### Step 4: add the no-JS fallback

In `src/app/layout.tsx`, immediately inside `<body>` before the skip link, add:

```tsx
<noscript>
  <style>{`
    .inst-sequence{height:auto!important}
    .sequence-sticky{position:static!important;height:auto!important;display:block!important;overflow:visible!important}
    .sequence-intro{padding-block:3rem 1.5rem!important}
    .sequence-stage{display:grid!important;gap:1.25rem!important;border:0!important;background:transparent!important}
    .sequence-frame{position:static!important;opacity:1!important;transform:none!important}
    .sequence-frame img{transform:none!important;aspect-ratio:16/9}
    .sequence-rail{display:none!important}
    .handover{height:auto!important}
    .handover-sticky{position:static!important;height:auto!important;display:block!important}
    .handover-stack{position:static!important;display:grid!important;gap:1.25rem!important}
    .handover-plate{position:static!important;opacity:1!important;transform:none!important}
  `}</style>
</noscript>
```

The handover rules are inert until Task 9 adds the markup.

### Step 5: verify

```powershell
pnpm vitest run src/__tests__/scroll-sequence.test.ts
pnpm typecheck
```

**Checkpoint:** source contract passes, typecheck clean. No commit.

---

## Task 5 — Homepage integration: hero, sequence, copy

**Why:** This removes the last rendered 3D object from the homepage and replaces the earnings-adjacent copy with records language.

**Files**

- Create `src/components/home/institution-sequence.tsx`
- Modify `src/components/home/institution-hero.tsx`
- Modify `src/app/(site)/page.tsx`
- Modify `src/app/(site)/platform/page.tsx`
- Modify `src/styles/institutional.css`
- Delete `src/components/home/instrument/` (all five files)
- Create `src/__tests__/home-copy.test.ts`

### Step 1: write the failing tests

```ts
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const home = readFileSync("src/app/(site)/page.tsx", "utf8");
const hero = readFileSync("src/components/home/institution-hero.tsx", "utf8");

describe("homepage media and records copy", () => {
  it("removes the published earnings figure", () => {
    expect(home).not.toContain("₹1.84");
    expect(home).not.toContain("Fees collected");
    expect(home).not.toContain("fees and parents");
  });

  it("uses the records language in the signal bar and final CTA", () => {
    expect(home).toContain("enquiries, admissions and parents");
    expect(home).toContain("the admissions process and the reports you do not trust");
  });

  it("mounts the sequence and no longer mounts the Instrument stage", () => {
    expect(home).toContain("InstitutionSequence");
    expect(hero).not.toContain("InstrumentStage");
    expect(hero).toContain("institutionHero");
    expect(hero).toContain("institutionLayers");
  });
});
```

### Step 2: implement the hero

`institution-hero.tsx` keeps the headline, lede, proof line, CTAs and the four-item ledger. Replace the aside contents:

- `aria-label="The operating layers: four of eight operating layers"`
- Head label: `The operating layers`; right value stays `01 — 08`.
- `<figure className="hero-inst-still">` with a plain `<img>`:
  - `src={institutionHero.src}`
  - `srcSet={institutionHero.srcSet}`
  - `sizes="(max-width: 1023px) 90vw, 40vw"`
  - `width={institutionHero.width}` `height={institutionHero.height}`
  - `alt={institutionHero.alt}`
  - `loading="lazy"` `fetchPriority="low"` `decoding="async"`
- `<dl className="layer-legend">` mapping `institutionLayers`:
  - `<div className="layer-label" data-tone={layer.tone}>`
  - swatch span (`aria-hidden`), index, title, meta.
- Caption: “Four of eight layers, from brand to intelligence.”

CSS: replace the whole `.instrument*` block (institutional.css lines ~612–812) with `.hero-inst-still` and `.layer-legend` rules. Keep the same two-column, hairline grammar. Rename `instrument-label*` selectors to `layer-label*`. Remove `.instrument-canvas`, `.instrument-plot`, `.instrument-static`, `.instrument-datum`, `.instrument-plate*` rules. Delete `src/components/home/instrument/` after the import is gone.

### Step 3: implement the sequence wrapper

`src/components/home/institution-sequence.tsx` is a server component:

```tsx
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ScrollSequence from "@/components/media/scroll-sequence";
import { institutionFrames } from "@/content/institution";

export default function InstitutionSequence() {
  return (
    <ScrollSequence
      label="One day, four layers"
      title="From the first enquiry to the final record."
      lede="The same definitions move through every branch. Nothing is re-keyed between the desk, the record and the report."
      frames={institutionFrames}
      note="Illustrative sequence. No client records are shown."
      action={
        <Link href="/platform" className="inst-link">
          See how the platform is assembled
          <ArrowUpRight size={14} strokeWidth={1.5} className="inst-link-arrow" />
        </Link>
      }
    />
  );
}
```

Insert `<InstitutionSequence />` in `page.tsx` **after** the signal bar and **before** `<FitCheck />`.

### Step 4: copy changes

In `src/app/(site)/page.tsx`:

- Signal bar: “Built for institutions where enquiries, admissions and parents all arrive at once.”
- Thesis: “…enquiries in three inboxes, records in a spreadsheet, batch updates sent from a personal phone…”
- Operating-view lede: “Enquiries, admissions and records share one set of definitions. Branch, source and owner stay attached from first contact to handover.”
- Final CTA: “A working session starts with the enquiry path, the admissions process and the reports you do not trust.”

In `src/app/(site)/platform/page.tsx`, the Diagnose engagement line becomes: “A written account of where enquiries, admissions and parent communication break.”

**Prices stay.** Do not change `OFFER`, `PACKAGES`, `formatINR`, `/pricing`, or the economics cards.

### Step 5: verify

```powershell
pnpm vitest run src/__tests__/home-copy.test.ts
pnpm typecheck
rg -n "InstrumentStage|components/home/instrument|instrument-canvas|instrument-plot" src
```

`rg` must return no matches. If it returns a live import outside the deleted directory, fix the import before continuing.

**Checkpoint:** homepage no longer mounts a canvas; sequence is in the server HTML. No commit.

---

## Task 6 — Fees become Records

**Why:** The client’s first objection is tax exposure. No visible earnings figure may survive.

**Files**

- Rewrite `src/components/home/command-center.tsx`
- Create `src/__tests__/command-center.test.ts`
- Modify `src/styles/institutional.css` only if a records-specific rule is needed (none expected)

### Step 1: write the failing test

```ts
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync("src/components/home/command-center.tsx", "utf8");

describe("command centre records view", () => {
  it("publishes no rupee symbol or earnings language", () => {
    expect(source).not.toContain("₹");
    expect(source.toLowerCase()).not.toContain("fees");
    expect(source.toLowerCase()).not.toContain("receipt");
    expect(source.toLowerCase()).not.toContain("collected");
    expect(source.toLowerCase()).not.toContain("billed");
  });

  it("ships the records tab and its KPI labels", () => {
    expect(source).toContain('"records"');
    expect(source).toContain("Documents issued");
    expect(source).toContain("Attendance logged");
    expect(source).toContain("Active batches");
    expect(source).toContain("Records complete");
  });

  it("keeps the illustrative-data disclaimer", () => {
    expect(source).toContain("Illustrative interface / sample figures");
    expect(source).toContain("Not client data");
  });
});
```

### Step 2: implement

`ViewId` becomes `"enquiries" | "admissions" | "records"`.

`branchData` becomes:

```ts
const branchData: Record<
  BranchId,
  { enquiries: number; qualified: number; fill: number }
> = {
  all: { enquiries: 1248, qualified: 412, fill: 78 },
  main: { enquiries: 542, qualified: 186, fill: 82 },
  north: { enquiries: 438, qualified: 141, fill: 76 },
  online: { enquiries: 268, qualified: 85, fill: 70 },
};
```

`recordRows`:

```ts
const recordRows = [
  { name: "Aarav Deshmukh", detail: "ID card", branch: "main", status: "issued" },
  { name: "Diya Nair", detail: "Attendance", branch: "north", status: "verified" },
  { name: "Vivaan Kulkarni", detail: "Term report", branch: "online", status: "issued" },
  { name: "Ananya Iyer", detail: "Transfer certificate", branch: "main", status: "pending" },
  { name: "Rehan Shaikh", detail: "Attendance", branch: "north", status: "verified" },
  { name: "Saanvi Bhat", detail: "ID card", branch: "online", status: "issued" },
];
```

Row shape across all three tables: `{ name: string; detail: string; branch: string; source: string; status: string }`. Rename `course` to `detail`. For records, `source` is `""`.

`tables.records`:

```ts
records: {
  rows: recordRows,
  caption: "Recent records",
  columns: ["Student", "Record", "Branch", "Status"],
}
```

Third cell: `view === "enquiries" ? row.source : branchLabel[row.branch]`.

KPIs:

```ts
enquiries: [
  { label: "Enquiries", ... },
  { label: "Qualified", ... },
  { label: "Qualified rate", ... },
  { label: "Enrolled", value: enrolled.toLocaleString("en-IN") },
],
admissions: [ /* unchanged */ ],
records: [
  { label: "Documents issued", value: Math.round(data.qualified * 2.4).toLocaleString("en-IN") },
  { label: "Attendance logged", value: `${93 + (data.fill % 3)}%` },
  { label: "Active batches", value: Math.round(data.fill / 2).toLocaleString("en-IN") },
  { label: "Records complete", value: `${94 + (data.fill % 3)}%` },
],
```

Remove `formatCrore`, `billed`, `feeRows`, `fees` from `branchData`, and every rupee amount. `rowCaption` returns `"Recent records"` for records. `stageLabel` maps `issued`/`verified` → “Issued”/“Verified”, `pending` → “Pending”. `stageTone` maps issued/verified → `qualified`, pending → `pending`. Bar heading: `view === "records" ? "Monthly records" : "Monthly intake"`.

### Step 3: verify

```powershell
pnpm vitest run src/__tests__/command-center.test.ts
pnpm typecheck
rg -n "₹|fees collected|feeRows|formatCrore" src/components/home/command-center.tsx
```

`rg` must return no matches.

**Checkpoint:** records view works from the existing `qualified`/`pending` dot styles; no new colour tokens. No commit.

---

## Task 7 — Craft content: station 04 becomes the film bench

**Why:** The station advertises R3F and the homepage Instrument. Both are being removed.

**Files**

- Modify `src/content/craft.ts`
- Modify `src/__tests__/craft.test.ts`

### Step 1: update the failing test

Change the expected `SKILLS` array index 3 to `"ai-ui-ux-motion-engine"`. Add:

```ts
it("replaces the R3F material bench with the film bench", () => {
  const film = CRAFT_STATIONS.find((station) => station.index === "04");
  expect(film?.id).toBe("film-bench");
  expect(film?.skill).toBe("ai-ui-ux-motion-engine");
  expect(film?.title).toBe("Film bench.");
  expect(film?.payload).toBe("≈2 MB, on run");
});

it("retires every R3F and homepage-Instrument reference", () => {
  expect(CRAFT_STATIONS.some((station) => station.skill === "react-three-fiber")).toBe(false);
  const serialized = JSON.stringify(CRAFT_STATIONS);
  expect(serialized).not.toContain("homepage Instrument");
  expect(serialized).not.toContain("R3F material bench");
});
```

Run `pnpm vitest run src/__tests__/craft.test.ts` and confirm the new assertions fail.

### Step 2: implement

Station 04 becomes:

```ts
{
  id: "film-bench",
  index: "04",
  skill: "ai-ui-ux-motion-engine",
  title: "Film bench.",
  summary:
    "One eight-second film, scrubbed by the station's own progress. No renderer, no model, no autoplay.",
  detail:
    "The film loads only when you run the station. Scroll position maps to time; the tone chips grade the frame. Reset unmounts the video and returns the poster. This replaces the R3F material bench with real footage.",
  runtime: "Scroll-scrubbed MP4",
  payload: "≈2 MB, on run",
  fallback: "Poster + first frame",
  poster: "Six materials, one take, no renderer.",
  status: "live",
  span: "wide",
}
```

Update the two stale references:

- Station 03 detail: “This is the same grammar as the homepage **sequence**…”
- Station 06 detail: “This is the pattern behind the homepage **layer legend**…”

Update `CRAFT_LEDGER`:

```ts
{ label: "Initial JS", value: "No R3F, GSAP or Lottie", note: "poster only" },
{ label: "Film payload", value: "≈2 MB, on run", note: "on run" },
```

Keep the remaining three rows.

`CRAFT_STATS` stays `{ stations: 11, live: 9, pending: 2 }` and the span counts stay `2 wide / 1 two-thirds / 4 half / 4 third`.

### Step 3: verify

```powershell
pnpm vitest run src/__tests__/craft.test.ts
pnpm typecheck
```

**Checkpoint:** 8 craft tests pass. No commit.

---

## Task 8 — Film bench component

**Why:** Replace the R3F bench with a real scroll-scrubbed film, poster-first, load-on-run.

**Files**

- Create `src/components/media/film-scrub.tsx`
- Create `src/components/craft/stations/station-04-film.tsx`
- Modify `src/components/craft/station-posters.tsx` (`PosterMaterial` → `PosterFilm`)
- Modify `src/components/craft/craft-lab.tsx` (key `film-bench` → `StationFilm`)
- Modify `src/styles/craft.css`
- Delete `src/components/craft/stations/station-04-material.tsx`
- Delete `src/components/craft/bench-material.tsx`
- Modify `e2e/l4-craft.spec.ts`

### Step 1: write the failing E2E test

Replace the existing station 04 test with:

```ts
test("station 04 loads a scroll-scrubbed film only on run", async ({ page }) => {
  await page.goto("/craft");

  const bench = page.locator(station("04"));
  await expect(bench.locator("canvas")).toHaveCount(0);
  await expect(bench.locator("video")).toHaveCount(0);
  await expect(bench.locator(".craft-poster svg")).toBeVisible();

  await bench.getByRole("button", { name: /run station/i }).click();

  const video = bench.locator("video");
  await expect(video).toHaveCount(1);
  await expect(video).toHaveAttribute("preload", "metadata");
  await expect(video).toHaveAttribute("playsinline", "");
  await expect(video).not.toHaveAttribute("controls", /.*/);
  await expect(video).not.toHaveAttribute("autoplay", /.*/);

  await bench.getByRole("button", { name: /^cobalt$/i }).click();
  await expect(bench.locator(".craft-film-frame")).toHaveAttribute("data-tone", "cobalt");

  await bench.getByRole("button", { name: /^contact sheet$/i }).click();
  await expect(bench.locator(".craft-film-sheet img")).toHaveCount(6);

  await bench.getByRole("button", { name: /^reset$/i }).click();
  await expect(bench.locator("video")).toHaveCount(0);
  await expect(bench.locator(".craft-poster svg")).toBeVisible();
});
```

Also add at the top of the craft suite:

```ts
test("no station mounts a WebGL canvas on first paint", async ({ page }) => {
  await page.goto("/craft");
  await expect(page.locator(".craft-station canvas")).toHaveCount(0);
});
```

### Step 2: implement `FilmScrub`

`src/components/media/film-scrub.tsx`:

```ts
"use client";

export type FilmTone = "bone" | "ink" | "cobalt";

export interface FilmScrubProps {
  src: string;
  poster: string;
  alt: string;
  tone: FilmTone;
  reducedMotion?: boolean;
  onError?: () => void;
}

export default function FilmScrub(props: FilmScrubProps): ReactNode;
```

Behaviour:

- Render a `<figure className="craft-film-frame" data-tone={tone}>` with a `<video>` and a visually hidden `<figcaption>` carrying `alt`.
- Video attributes: `muted`, `playsInline`, `preload="metadata"`, `poster`, no `controls`, no `autoPlay`, `aria-hidden="true"`.
- On mount, call `video.play()` then `video.pause()` immediately. This is the iOS seek unlock. If the promise rejects, render a **Play film** button that calls `video.play()` once with controls enabled; do not loop.
- Scroll mapping: on `scroll`/`resize`, schedule one `requestAnimationFrame`; compute `progress = clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height), 0, 1)`; when `readyState >= 1`, set `video.currentTime = progress * video.duration` using `fastSeek` when available. No state update per scroll.
- On unmount: cancel the frame, remove listeners, `video.pause()`, remove `src`, call `video.load()`.
- On `error`, call `onError`; the poster and a text note remain.
- If `reducedMotion` is true, do not mount the scroll mapping or the unlock. The station handles the controls-mode video.

### Step 3: implement the station

`station-04-film.tsx` state:

```ts
type FilmMode = "film" | "sheet";
const [live, setLive] = useState(false);
const [tone, setTone] = useState<FilmTone>("bone");
const [mode, setMode] = useState<FilmMode>("film");
const [failed, setFailed] = useState(false);
const [controls, setControls] = useState(false);
const reduced = useReducedMotion();
```

Controls:

- **Run station** / **Remount** — sets `live`; in reduced motion sets `controls` and status “Reduced motion: poster with a normal video player.”
- **Reset** — `setLive(false)`, resets tone/mode/failed/controls, unmounts video.
- Tone group: Bone / Ink / Cobalt, `aria-pressed`.
- Mode group: Film / Contact sheet, `aria-pressed`.

Stage content when live:

- `mode === "film"` and not reduced: `<FilmScrub src="/media/craft/material-film.mp4" poster="/media/craft/material-poster-1200.webp" alt="Six material studies: paper, ink, glass, brass, plaster and folded card." tone={tone} reducedMotion={false} onError={() => setFailed(true)} />`
- `mode === "film"` and reduced: `<video className="craft-film-video" src="/media/craft/material-film.mp4" poster="/media/craft/material-poster-1200.webp" controls playsInline preload="metadata" />`
- `mode === "sheet"`: `<div className="craft-film-sheet">` with six `<img>` elements, `src="/media/craft/material-still-0N-800.webp"`, `alt` naming the material, `width={800}` `height={450}` `loading="lazy"`.
- If `failed`: poster image plus “Film unavailable. The poster and contact sheet remain.”

Status copy:

- Poster: “Poster. The film is not loaded.”
- Mounted: “Film mounted. Scroll to scrub; no autoplay.”
- Contact sheet: “Contact sheet. Six stills at their native positions.”
- Reset: “Video unmounted. Poster restored.”

`PosterFilm` replaces `PosterMaterial` in `station-posters.tsx`. Redraw the SVG as a **filmstrip/contact sheet**, not an isometric object:

- A 16:9 frame with six vertical panels.
- A vertical playhead line.
- Labels `00:00 / 08:00`, `FILM / CONTACT SHEET`, `SIX MATERIALS, ONE TAKE`.
- No plates, polygons or wireframe cube.

### Step 4: CSS

Replace the `.craft-bench*` block in `craft.css` with `.craft-film-*` rules. Required classes:

```css
.craft-film-frame { position: relative; height: 100%; margin: 0; background: var(--ink); overflow: clip; }
.craft-film-frame video { display: block; width: 100%; height: 100%; object-fit: cover; }
.craft-film-frame[data-tone="bone"] video,
.craft-film-frame[data-tone="bone"] img { filter: saturate(0.9) contrast(1.02); }
.craft-film-frame[data-tone="ink"] video,
.craft-film-frame[data-tone="ink"] img { filter: grayscale(0.75) contrast(1.08); }
.craft-film-frame[data-tone="cobalt"] video,
.craft-film-frame[data-tone="cobalt"] img { filter: saturate(1.15) hue-rotate(-6deg) contrast(1.04); }
.craft-film-sheet { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--rule); height: 100%; }
.craft-film-sheet img { width: 100%; height: 100%; object-fit: cover; }
.craft-film-controls { display: flex; flex-wrap: wrap; gap: 0.8rem; align-items: center; padding: 0.75rem 0; }
.craft-film-readout { font-family: var(--font-mono); font-size: 0.5625rem; letter-spacing: 0.06em; color: var(--ink-4); }
```

On mobile, the contact sheet becomes two columns. Under `prefers-reduced-motion`, no transforms or transitions.

### Step 5: wire the lab and delete the old bench

- `craft-lab.tsx`: import `StationFilm from "./stations/station-04-film"`; map `"film-bench": StationFilm`.
- Delete `station-04-material.tsx` and `bench-material.tsx`.
- `rg -n "bench-material|station-04-material|PosterMaterial|material-bench" src` must return no matches.

### Step 6: verify

```powershell
pnpm typecheck
pnpm build
pnpm test:e2e --grep "station 04|WebGL canvas"
```

**Checkpoint:** station 04 poster-first, video only on run, reset unmounts it, no canvas. No commit.

---

## Task 9 — `/trust` handover cinema

**Why:** Replace the abstract trust claim with artefacts a buyer can check, using DOM paper cards rather than photography or canvas.

**Files**

- Create `src/content/trust.ts`
- Create `src/components/trust/handover-cinema.tsx`
- Modify `src/app/(site)/trust/page.tsx`
- Modify `src/styles/evidence.css` or `src/styles/institutional.css` (pick `evidence.css`; the section belongs to the trust page)
- Create `src/__tests__/trust-content.test.ts`
- Modify `e2e/l3-evidence.spec.ts`
- Modify `e2e/no-js.spec.ts` (created in Task 11)

### Step 1: write the failing content test

```ts
import { describe, expect, it } from "vitest";
import { handoverPlates } from "@/content/trust";

describe("handover plates", () => {
  it("publishes four artefacts in order", () => {
    expect(handoverPlates.map((plate) => plate.index)).toEqual([
      "01",
      "02",
      "03",
      "04",
    ]);
    expect(handoverPlates.map((plate) => plate.title)).toEqual([
      "The diagnosis",
      "The scope",
      "The runbook",
      "The keys",
    ]);
  });

  it("writes a real body for every plate and no money", () => {
    for (const plate of handoverPlates) {
      expect(plate.body.length).toBeGreaterThan(40);
      expect(plate.body).not.toContain("₹");
    }
  });
});
```

### Step 2: implement the content

`src/content/trust.ts`:

```ts
export interface HandoverPlate {
  index: string;
  title: string;
  body: string;
}

export const handoverPlates: HandoverPlate[] = [ /* spec §7.2 exactly */ ];
```

### Step 3: implement the component

`HandoverCinema` is a client component:

```ts
"use client";

interface HandoverCinemaProps {
  plates: readonly HandoverPlate[];
}

export default function HandoverCinema({ plates }: HandoverCinemaProps): ReactNode;
```

Render:

- `<section className="handover" ref={sectionRef} aria-labelledby={headingId}>`
- `.handover-sticky.inst-shell` as a two-column grid: `.handover-copy` and `.handover-stack`.
- Copy: label “The handover”, H2 “What you actually receive.”, lede “Trust is easier to check than to claim. These are the artefacts that leave with you.”, note “Illustrative documents. Client files are confidential.”
- `.handover-rail` with 01–04, `aria-hidden`.
- `.handover-stack` with all four `<article className="handover-plate" data-state={index < active ? "past" : index === active ? "active" : "ahead"} style={{ "--plate-i": index }}>`.
- Each plate: cobalt tab span, index, `<h3>`, body `<p>`, three decorative typed lines (`aria-hidden`), a seal mark span and a signature rule span.
- `useStageProgress(sectionRef, { count: plates.length, onIndex: setActive })`.
- No `aria-hidden` on the articles. Transforms are visual only.
- No images, SVG or canvas.

### Step 4: add the page section

In `src/app/(site)/trust/page.tsx`, import `HandoverCinema` and `handoverPlates`, and insert:

```tsx
<HandoverCinema plates={handoverPlates} />
```

Between the `ev-seal-section` closing `</section>` and the `data-map` section.

### Step 5: CSS

Add to `src/styles/evidence.css`:

```css
.handover {
  position: relative;
  height: calc(100svh * 3.2);
  background: var(--bone);
  border-bottom: 1px solid var(--rule);
}

.handover-sticky {
  position: sticky;
  top: var(--header-h);
  height: calc(100svh - var(--header-h));
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
  gap: clamp(2rem, 6vw, 5rem);
  align-items: center;
  overflow: clip;
}

.handover-note {
  margin-top: 1.5rem;
  font-family: var(--font-mono);
  font-size: 0.625rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-4);
}

.handover-stack {
  position: relative;
  height: min(52vh, 460px);
}

.handover-plate {
  position: absolute;
  inset: 0;
  max-width: 34rem;
  margin-left: auto;
  padding: clamp(1.25rem, 3vw, 2rem);
  background: var(--bone);
  border: 1px solid var(--rule-strong);
  box-shadow: 0 18px 40px rgba(17, 18, 15, 0.08);
  transition:
    transform 700ms var(--ease-state),
    opacity 700ms var(--ease-state);
}

.handover-plate[data-state="past"] {
  transform: translateY(calc(var(--plate-i) * -6px));
  opacity: 0.55;
}

.handover-plate[data-state="active"] {
  transform: none;
  opacity: 1;
  z-index: 3;
}

.handover-plate[data-state="ahead"] {
  transform: translateY(56px) rotate(1.5deg);
  opacity: 0;
  z-index: 1;
}

.handover-tab {
  position: absolute;
  top: 0;
  left: 1.5rem;
  width: 4rem;
  height: 0.35rem;
  background: var(--cobalt);
}

.handover-lines {
  display: grid;
  gap: 0.4rem;
  margin-top: 1.25rem;
}

.handover-lines span {
  display: block;
  height: 1px;
  background: var(--rule);
}

.handover-lines span:nth-child(2) { width: 82%; }
.handover-lines span:nth-child(3) { width: 64%; }

.handover-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.5rem;
}

.handover-seal {
  width: 2.25rem;
  height: 2.25rem;
  border: 1px solid var(--cobalt);
  border-radius: 50%;
  box-shadow: inset 0 0 0 3px var(--bone), inset 0 0 0 4px var(--cobalt);
}

.handover-sign {
  flex: 1;
  max-width: 10rem;
  height: 1px;
  background: var(--rule-strong);
}

@media (max-width: 900px), (prefers-reduced-motion: reduce) {
  .handover { height: auto; }
  .handover-sticky {
    position: static;
    height: auto;
    display: block;
    padding-block: 3rem;
    overflow: visible;
  }
  .handover-stack {
    display: grid;
    gap: 1.25rem;
    height: auto;
    margin-top: 2rem;
  }
  .handover-plate {
    position: static;
    max-width: none;
    opacity: 1;
    transform: none;
  }
  .handover-rail { display: none; }
}
```

Ensure the plate body text is `var(--ink-2)` on bone and at least 16px; the seal is decorative (`aria-hidden`).

### Step 6: E2E

In `e2e/l3-evidence.spec.ts` add:

```ts
test("trust publishes four handover plates and no canvas", async ({ page }) => {
  await page.goto("/trust");
  await expect(page.locator(".handover-plate")).toHaveCount(4);
  await expect(page.locator(".handover-plate").first()).toContainText("The diagnosis");
  await expect(page.locator(".handover").locator("canvas")).toHaveCount(0);
});

test("reduced motion shows the handover plates stacked", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/trust");
  await expect(page.locator(".handover-plate")).toHaveCount(4);
  const positions = await page.locator(".handover-plate").evaluateAll((plates) =>
    plates.map((plate) => getComputedStyle(plate).position),
  );
  expect(new Set(positions)).toEqual(new Set(["static"]));
});
```

### Step 7: verify

```powershell
pnpm vitest run src/__tests__/trust-content.test.ts
pnpm typecheck
pnpm build
pnpm test:e2e --grep "handover"
```

**Checkpoint:** four plates in order, static under reduced motion, no canvas. No commit.

---

## Task 10 — Remove the dead 3D systems and dependencies

**Why:** The client asked for no 3D objects. Removing the live surfaces is not enough; dead WebGL cohorts still keep Three and R3F in the dependency graph and invite regressions.

**Files**

- Delete dead cohorts listed below, **only after a zero-reference audit**
- Modify `next.config.ts`
- Modify `package.json` via `pnpm remove`
- Delete scene-precompute build steps and scripts
- Create `src/__tests__/no-3d.test.ts`

### Step 1: audit before deleting

Run and save the output in the execution notes:

```powershell
rg -n "@react-three|from \"three\"|from 'three'|tunnel-rat|zustand|postprocessing|glslify|vite-plugin-glsl" src next.config.ts vite.config.ts package.json -g "*.ts" -g "*.tsx" -g "*.json"
rg -n "components/(canvas|spatial|experience|v6)|components/home/(page|hero|manifesto|craft-chapters|ai-lab|work-strip|testimonials|pricing|team|process-line)" src -g "*.ts" -g "*.tsx"
rg -n "src/shaders|lib/three|lib/spatial|three/support|shaderLoader" src scripts -g "*"
```

Deletion rule: a cohort goes only when every reference originates **inside that cohort** or inside another cohort already scheduled for deletion. If any live route or kept component imports a file, the file stays and the deletion of that cohort is dropped.

### Step 2: delete the cohorts

Expected deletable cohorts after the live-surface work:

| Cohort | Files | Condition |
|---|---|---|
| Live instrument | `src/components/home/instrument/` | Already deleted in Task 5. |
| Craft bench | `src/components/craft/bench-material.tsx`, `station-04-material.tsx` | Already deleted in Task 8. |
| Persistent canvas | `src/components/canvas/` | No live import. |
| Spatial canvas | `src/components/spatial/` and `src/lib/spatial/` | No live import. |
| Experience scenes | `src/components/experience/*` except `kit/` | No live import. |
| Experience kit WebGL | `kit/hooks.ts`, `kit/input.ts`, `kit/materials.tsx`, `kit/primitives.tsx`, `kit/sculpture.tsx`, `kit/studio.tsx` | No external import. |
| V6 WebGL | `team-webgl.tsx`, `craft-webgl.tsx`, `gpu-particle-system.tsx`, `particle-field.tsx`, `post-processing-pipeline.tsx`, `advanced-shaders.ts` | No live import. |
| Legacy home | `src/components/home/page.tsx`, `hero.tsx`, `manifesto.tsx`, `craft-chapters.tsx`, `ai-lab.tsx`, `work-strip.tsx`, `testimonials.tsx`, `pricing.tsx`, `team.tsx`, `process-line.tsx` | Each must have zero imports from `src/app` or kept components. `final-cta.tsx` stays; it is used by several live routes. |
| V6 legacy | `smooth-scroll.tsx`, `preloader.tsx`, `nav.tsx`, `force-dark.tsx`, `cursor.tsx`, `magnetic-cursor.tsx`, `cinematic-scroll.tsx`, `sound-design.tsx`, `footer-cta.tsx` | Delete only if the legacy-home audit removes their last import. |
| Three helpers | `src/lib/three/`, `src/shaders/`, `src/lib/three/shaderLoader.ts` | No live import. |
| Scene test | `src/__tests__/experience-scene-map.test.ts` | Deleted with the scene map. |

Keep:

- `src/components/experience/kit/bus.ts`, `random.ts`, `tier.ts`, `types.ts` — used by `contact-form.tsx` and `experience-kit.test.ts`.
- `src/lib/instrument/palette.ts` — used by station 06.
- `src/components/home/final-cta.tsx` — used by `/work/[slug]`, `/services`, `/insights`, `/about`.

After deletion, re-run the audit. `rg` must show no `@react-three`, `three`, `tunnel-rat`, `zustand`, `postprocessing`, `glslify` or `vite-plugin-glsl` in `src`.

### Step 3: remove dependencies

```powershell
pnpm remove three @react-three/fiber @react-three/drei @react-three/postprocessing postprocessing tunnel-rat @types/three glslify vite-plugin-glsl
pnpm remove zustand
```

`zustand` is safe only if Step 2 removed `src/components/canvas/Tunnel.tsx` and `src/lib/spatial/`. If the audit finds another import, keep it and record why.

Do **not** remove `gsap`, `lenis`, `lottie-web`, `framer-motion`, `sharp` or `vite`/`vitest`.

### Step 4: clean configuration and build steps

`next.config.ts`:

- `optimizePackageImports`: `["framer-motion"]` only.
- Remove the `turbopack.rules` GLSL block.
- Remove the `webpack` three alias and the `three` cache group.
- Remove the `zustand` cache group if the package is gone.
- Remove the `/models` cache header and the “CORS for 3D assets” comment.
- Keep the `framer` and `vendor` cache groups.

`package.json`:

- Remove `prebuild` entirely (`inline-shaders.mjs` and `precompute-scenes.mjs` are both retired).
- Remove `precompute:scenes`, `compress:models`, `compress:textures`.
- Keep `postbuild` (`add-static-rsc-aliases.mjs`).
- Delete `scripts/precompute-scenes.mjs`, `scripts/compress-models.mjs`, `scripts/compress-textures.mjs`, `scripts/inline-shaders.mjs`.
- Delete `vite.config.ts` and `glsl-loader.mjs` if `rg` shows no test or build consumer. `vitest.config.ts` stays.

### Step 5: add the regression test

`src/__tests__/no-3d.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const pkg = JSON.parse(readFileSync("package.json", "utf8")) as {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
};

describe("3D removal", () => {
  it("ships no Three, R3F or postprocessing dependency", () => {
    for (const name of [
      "three",
      "@react-three/fiber",
      "@react-three/drei",
      "@react-three/postprocessing",
      "postprocessing",
      "tunnel-rat",
      "@types/three",
      "zustand",
    ]) {
      expect(pkg.dependencies).not.toHaveProperty(name);
      expect(pkg.devDependencies).not.toHaveProperty(name);
    }
  });

  it("keeps the single Lenis owner", () => {
    const scroll = readFileSync("src/lib/motion/scroll.ts", "utf8");
    expect(scroll).toContain("new LenisClass");
  });
});
```

### Step 6: verify

```powershell
pnpm typecheck
pnpm lint
pnpm build
rg -n "react-three|three|tunnel-rat|postprocessing" out/_next/static -g "*.js"
```

`rg` against the built chunks must return no matches. If it returns a vendor chunk, inspect whether the match is a substring in unrelated code; Three/R3F identifiers must be absent.

**Checkpoint:** no Three/R3F dependency, no 3D chunk, build succeeds. No commit.

---

## Task 11 — E2E coverage: sequence, no-JS, mobile axe

**Why:** The new sections are visual; the regression risk is layout and fallback, not pure functions.

**Files**

- Modify `e2e/smoke.spec.ts`
- Create `e2e/no-js.spec.ts`
- Modify `e2e/a11y.spec.ts`

### Step 1: homepage sequence test

Add to `e2e/smoke.spec.ts`:

```ts
test.describe("homepage editorial sequence", () => {
  test("renders five captions and no hero canvas", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".sequence-frame")).toHaveCount(5);
    await expect(page.locator(".sequence-caption")).toHaveCount(5);
    await expect(page.locator(".hero-inst canvas")).toHaveCount(0);
    await expect(page.locator(".inst-sequence")).toContainText(
      "From the first enquiry to the final record.",
    );
  });

  test("scrolls the sequence to a later frame", async ({ page }) => {
    await page.goto("/");
    const sequence = page.locator(".inst-sequence");
    await sequence.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, window.innerHeight * 1.5));
    await expect(sequence).not.toHaveAttribute("data-active", "0");
  });

  test("publishes no rupee symbol in the operating view", async ({ page }) => {
    await page.goto("/");
    const command = page.locator(".command-center-shell");
    await expect(command).not.toContainText("₹");
    await expect(command).toContainText("Records");
  });
});
```

### Step 2: no-JS test

`e2e/no-js.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("homepage sequence and trust plates survive without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  await page.goto("/");
  await expect(page.locator(".sequence-caption")).toHaveCount(5);
  for (const caption of await page.locator(".sequence-caption").all()) {
    await expect(caption).toBeVisible();
  }

  await page.goto("/trust");
  await expect(page.locator(".handover-plate")).toHaveCount(4);
  for (const plate of await page.locator(".handover-plate").all()) {
    await expect(plate).toBeVisible();
  }

  await context.close();
});
```

### Step 3: mobile axe

In `e2e/a11y.spec.ts`, add a mobile project or a loop:

```ts
for (const route of ["/", "/craft", "/trust"]) {
  test(`${route} has no serious violations at 390px`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const blocking = results.violations.filter(
      ({ impact }) => impact === "serious" || impact === "critical",
    );
    expect(blocking.map(({ id }) => id)).toEqual([]);
  });
}
```

### Step 4: verify

```powershell
pnpm build
pnpm test:e2e
```

All prior tests plus the new ones must pass.

**Checkpoint:** E2E green, including no-JS and mobile axe. No commit.

---

## Task 12 — Full quality gates

Run in this order and record the exact numbers.

```powershell
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
```

Required:

- Typecheck clean.
- Lint clean.
- Vitest: all tests pass, including the new `stage-progress`, `institution-content`, `scroll-sequence`, `home-copy`, `command-center`, `trust-content`, `no-3d`, and updated `craft`.
- Contrast CI and token lint pass (they are inside `pnpm test`).
- Build emits **61 HTML documents** (same as the last build; if the count changes, explain why).
- E2E: all specs pass, including 55 prior tests plus new coverage.
- `rg -n "react-three|three|tunnel-rat|postprocessing" out/_next/static -g "*.js"` returns no match.
- `Get-ChildItem out/_next/static/chunks -File | Measure-Object Length -Sum` shows no chunk returning after the 3D removal that matches the old 245.6 KB instrument chunk.

**Checkpoint:** every gate green. No commit.

---

## Task 13 — Lighthouse and visual QA

### Step 1: local Lighthouse sweep

Serve the static export:

```powershell
node scripts/serve-out.mjs
```

In a second shell, run three mobile runs and one desktop run for `/`, and one mobile run for each of `/craft`, `/trust`, `/platform`, `/work`, `/pricing`, `/process`, `/services`, `/about`.

Use Lighthouse 13.6.0, the same version as the baseline:

```powershell
$chrome = (Get-ChildItem "$env:LOCALAPPDATA\ms-playwright\chromium-*\chrome-win\chrome.exe" | Select-Object -First 1).FullName
$env:CHROME_PATH = $chrome
npx --yes lighthouse@13.6.0 http://127.0.0.1:4173/ --quiet --chrome-flags="--headless=new" --output=json --output-path=baseline/scroll-home-mobile-1.json
```

Repeat for runs 2 and 3 and for the other routes. Desktop:

```powershell
npx --yes lighthouse@13.6.0 http://127.0.0.1:4173/ --preset=desktop --quiet --chrome-flags="--headless=new" --output=json --output-path=baseline/scroll-home-desktop.json
```

Report the range, not the best run. Gates:

- Mobile performance ≥ 90; desktop ≥ 95.
- Accessibility 100.
- LCP ≤ 2.5s; CLS ≤ 0.05; INP ≤ 200ms; TBT ≤ 300ms.
- If TBT exceeds 300ms on the local gzip server, profile before changing code. Do not hide the result.

### Step 2: visual screenshots

Capture `/` at 1440, 1024, 768 and 390 widths:

- Hero still and layer legend do not overlap the header.
- Sequence stage is clipped, captions are readable on the scrim, rail is visible.
- No horizontal overflow at 390px.
- `/craft` station 04 poster, run state, contact sheet.
- `/trust` handover at 1440 and 390; plates stacked under reduced motion.

Use the existing `scripts/screenshot.mjs` or a short Playwright one-off. Store screenshots in the session temp directory, not the repo.

### Step 3: reduced-motion and no-JS browser pass

- `prefers-reduced-motion: reduce`: sequence is a static stack of five images with captions; trust is four stacked plates; craft station 04 does not mount a scrubbed video.
- JavaScript off: same static stacks; all captions and plates visible.
- Keyboard: tab through the film bench controls; every button has a visible focus ring and `aria-pressed` where applicable.

**Checkpoint:** gates met or variance documented honestly. No commit.

---

## Task 14 — Deploy the preview and publish here.now

**Why:** The user asked for exactly two links: the Vercel preview alias and here.now. Never `.com`.

### Step 1: capture the `.com` baseline

```powershell
$before = Invoke-WebRequest -Uri "https://imaginarsclubservices.com" -UseBasicParsing
$before.Content | Select-String -Pattern "<title>.*</title>|<h1.*</h1>" -AllMatches
```

Record the title (`ImaginarsClub Services — Digital studio for ambitious businesses`) and H1 (`We build digital experiences that win.`).

### Step 2: deploy a Vercel preview

```powershell
vercel deploy
```

- Do **not** pass `--prod`.
- Capture the deployment URL and ID.
- Alias it:

```powershell
vercel alias set <deployment-url> goat-wheat.vercel.app
```

### Step 3: verify the preview

```powershell
node scripts/preview-smoke.mjs
```

Update the script's `base` to the deployment URL for the run, or inline the route list. Required:

- All 22 host routes return 200.
- `/` contains `From the first enquiry to the final record.`, five `.sequence-caption` entries, and no `₹` in `.command-center-shell`.
- `/craft` station 04 has no `<canvas>` before Run; Run mounts a `<video>`.
- `/trust` has four `.handover-plate` entries.
- No console errors in a Playwright smoke pass.
- Headers: HSTS, `X-Content-Type-Options`, immutable `/_next/static` caching.

### Step 4: publish here.now

Load the `here-now` skill and follow its workflow. The repo also has `deploy-here-now.ps1`.

Preferred: update the existing site if the claim window/credentials allow it:

```powershell
.\deploy-here-now.ps1 -Path out -Slug dewy-lemon-yr8a
```

If the anonymous claim has expired, publish a new site:

```powershell
.\deploy-here-now.ps1 -Path out
```

Record the new URL, version ID, claim link and expiry. Run the same route smoke against the here.now URL (it 308s extensionless paths to trailing slashes).

### Step 5: prove `.com` is unchanged

```powershell
$after = Invoke-WebRequest -Uri "https://imaginarsclubservices.com" -UseBasicParsing
$after.Content | Select-String -Pattern "<title>.*</title>|<h1.*</h1>" -AllMatches
```

The title and H1 must match the baseline exactly. Do not run any command that targets the `.com` project, its DNS or its aliases.

### Step 6: update the record

Update `docs/PHASE_0_BASELINE.md` with:

- New deployment ID and preview URL.
- New alias target.
- here.now URL, version, claim link, expiry.
- Local Lighthouse ranges (three mobile runs + desktop).
- E2E counts.
- The honest TBT note if the preview spread recurs.
- A one-line statement that `.com` was not deployed.

Update this plan with the same deployment record at the bottom.

**Checkpoint:** two links live, `.com` unchanged, all changes uncommitted. Do not commit.

---

## Definition of done

- [ ] Hero has an editorial still and the four-layer legend; no canvas anywhere in the hero.
- [ ] Homepage has the five-frame pinned sequence with captions and a progress rail.
- [ ] No `₹` or earnings figure remains in `command-center.tsx` or the homepage source.
- [ ] Fees tab is gone; Records tab ships with documents, attendance, batches and completeness.
- [ ] `/craft` station 04 is `film-bench`, poster-first, video only on Run, reset unmounts it.
- [ ] `/trust` has four handover plates, sticky on desktop, stacked on mobile and reduced motion.
- [ ] JavaScript off shows all five sequence captions and all four handover plates.
- [ ] `three`, R3F, drei, postprocessing, tunnel-rat and zustand are gone from `package.json` and the built chunks.
- [ ] `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`, `pnpm test:e2e` all pass.
- [ ] Lighthouse mobile ≥ 90, desktop ≥ 95, accessibility 100, with the three-run range recorded.
- [ ] Vercel preview aliased to `goat-wheat.vercel.app`; here.now published; both smoke-tested.
- [ ] `imaginarsclubservices.com` title and H1 unchanged.
- [ ] Working tree uncommitted; no push, no production promotion.

---

## Deployment record (fill after Task 14)

- Vercel deployment:
- Preview URL:
- Alias:
- here.now URL:
- here.now version / claim / expiry:
- Local Lighthouse mobile runs:
- Local Lighthouse desktop:
- E2E:
- `.com` before / after:
