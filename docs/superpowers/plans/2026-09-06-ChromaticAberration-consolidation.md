# ChromaticAberration Consolidation Remediation Proposal

Date: 2026-09-06
Project: goat
Status: DRAFT - Awaiting human approval before any code changes

## Problem Statement

Live site `https://goat-wheat.vercel.app` and local Spatial OS render path show repeated runtime errors:

```
Error: Convolution effects cannot be merged (ChromaticAberrationEffect)
    at eD.updateMaterial
```

Playwright diagnostics confirm Next.js error overlay `This page couldn't load` with `__next_error__` despite 200 HTTP responses. Console shows `THREE.WebGLRenderer: Context Lost` and duplicated ChromaticAberration errors.

## Evidence

### Duplicate implementations found

1. `src/components/v6/post-processing-pipeline.tsx`
   - Defines custom `ChromaticAberrationShader` with uniforms `uAmount`, `uResolution`
   - Uses `ShaderPass` with custom shader
   - Controlled by `enableChromaticAberration` flag
   - Lines: Shader definition 27-32, usage 149, 212-213, 293

2. `src/components/spatial/postprocessing/PostProcessing.tsx`
   - Imports `ChromaticAberrationEffect` from `postprocessing` library
   - Instantiates `new ChromaticAberrationEffect({...})` when `quality === 'high'`
   - Lines: import line 3, instantiation lines 39

3. `src/components/canvas/PersistentCanvas.tsx`
   - Imports `ChromaticAberration` from `@react-three/postprocessing`
   - Documents post-processing chain: Bloom, ChromaticAberration, Vignette, SMAA, Noise
   - Lines: import 13, usage 26, 175

4. `src/components/spatial/scenes/HeroScene.tsx`
   - Uses `uChromaticAberration` uniform in shader material `HeroMonolith`
   - No post-processing effect instance, but uniform driven by scroll
   - Lines: 40, 100

### Additional signals
- `src/shaders/hero/monolith.frag` references `uChromaticAberration`
- Grep for `ChromaticAberration` returns 17 matches across 6 files
- Mix of three different post-processing stacks:
  - `postprocessing` library `ChromaticAberrationEffect`
  - `@react-three/postprocessing` `ChromaticAberration`
  - Custom `ChromaticAberrationShader` via `ShaderPass`

## Root Cause Hypothesis

1. Multiple active ChromaticAberration passes in the same render pipeline cause convolution pass merging conflict.
2. v6 pipeline and Spatial PostProcessing pipeline both mount on intersecting views, leading to duplicate effect registration.
3. Shader uniform `uChromaticAberration` in HeroScene coexists with post-processing effect, creating feedback/conflict.
4. PersistentCanvas global post-processing chain conflicts with section-specific pipelines in SpatialCanvas.

## Risks

- Continuing duplicate effects will keep `Convolution effects cannot be merged` errors and cause WebGL context loss.
- Unclear which ChromaticAberration implementation is desired for v6 vs Spatial vs Canvas.
- Removing wrong instance may regress visual design tokens.
- No single source of truth for ChromaticAberration parameters, amount, quality gating.

## Proposed Remediation

### Design Decisions Required
- Choose ONE ChromaticAberration implementation per render context:
  - Spatial OS: prefer `postprocessing` library `ChromaticAberrationEffect` with quality gating
  - v6 marketing pipeline: keep custom `ChromaticAberrationShader` or migrate to shared effect
  - Canvas/PersistentCanvas: deprecate global `ChromaticAberration` import, rely on section pipelines

### Consolidation Plan
1. Audit active render trees:
   - Confirm which components mount simultaneously: `SpatialCanvas` vs `v6/post-processing-pipeline` vs `PersistentCanvas`
2. Create shared ChromaticAberration factory `src/lib/postprocessing/ChromaticAberrationFactory.ts`
   - Single API: `createChromaticAberration({quality, amount})`
   - Internally chooses implementation per context
3. Refactor `src/components/spatial/postprocessing/PostProcessing.tsx`:
   - Use factory, remove direct `new ChromaticAberrationEffect`
   - Ensure effect is only added once per composer
4. Refactor `src/components/v6/post-processing-pipeline.tsx`:
   - Remove duplicate custom shader if factory covers v6
   - Or keep custom shader but isolate from Spatial pipeline
5. Refactor `src/components/canvas/PersistentCanvas.tsx`:
   - Remove imported `ChromaticAberration` from `@react-three/postprocessing`
   - Document that post-processing is now section-owned
6. Harmonize shader uniform `uChromaticAberration` in `HeroScene.tsx`
   - Map uniform to factory amount, or remove uniform if effect handles it
7. Add guard to prevent duplicate effect registration:
   - Track composer effects in WeakMap, skip if already present
8. Tests & validation:
   - Vitest: effect factory unit tests
   - Playwright: console error-free load, no Convolution merge error
   - Visual regression on Hero section

### Files to Change
- `src/lib/postprocessing/ChromaticAberrationFactory.ts` [new]
- `src/components/spatial/postprocessing/PostProcessing.tsx`
- `src/components/v6/post-processing-pipeline.tsx`
- `src/components/canvas/PersistentCanvas.tsx`
- `src/components/spatial/scenes/HeroScene.tsx`
- `src/shaders/hero/monolith.frag` [if uniform removed]

### Out of Scope
- No changes to live v6 design system tokens
- No changes to `https://goat-wheat.vercel.app` until proposal approved
- No Vercel redeploy until validation passes locally

## Acceptance Criteria
- No `Convolution effects cannot be merged` errors in browser console
- Playwright load of home page shows no `__next_error__`
- ChromaticAberration visible in Hero section with consistent amount across pipelines
- Build passes, Vitest passes, Contrast CI passes

## Next Steps After Approval
1. Implement factory and refactor steps above
2. Run local dev + Playwright regression
3. Create PR with before/after console logs
4. Human sign-off before Vercel deploy

---

**HARD-GATE:** Awaiting explicit human approval to proceed with implementation. Do NOT modify code until approved.
