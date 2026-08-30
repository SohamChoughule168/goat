# ImaginarsClub Services — $100M Tier Architecture

## Overview

This site has been upgraded from a $1M-tier implementation (DOM-first with WebGL decoration) to a $100M-tier implementation (R3F-first with DOM coordination).

## Key Architectural Changes

### 1. Persistent Canvas Pattern
- **Old:** Each section created its own Three.js context in `useEffect`, unmounting on route change
- **New:** A single `<Canvas>` is mounted in `app/layout.tsx`, surviving route changes
- 3D scenes are teleported into it via `@react-three/drei/View` (tunnel-rat pattern)
- 53 pages can now share a single GPU context

### 2. R3F + drei Integration
- **Old:** Raw `THREE.WebGLRenderer` managed manually in `useEffect`
- **New:** Declarative `<Canvas>` from `@react-three/fiber` with React lifecycle
- `@react-three/drei` provides `Float`, `View`, `PerspectiveCamera`, etc.
- Automatic memory management, scene graph, raycasting

### 3. Tunnel-Rat DOM-to-3D Sync
- **Old:** Three.js and DOM scroll were completely decoupled
- **New:** `Tunnel` React Context bridges DOM and 3D
- Each section calls `registerSection('id', callback)`
- 3D components read `useSectionProgress('id')` to drive animations
- Global scroll progress available via `useGlobalScrollProgress()`

### 4. GLSL Shader File System
- **Old:** GLSL embedded as template strings in TSX
- **New:** Dedicated `.glsl`, `.vert`, `.frag` files in `/src/shaders/`
- Build-time inlining via `scripts/inline-shaders.mjs`
- Production bundle includes all shaders; zero runtime fetch
- Supports `#include "../common/noise.glsl"` preprocessor

### 5. Performance Adaptive Quality
- **Old:** Fixed DPR, no adaptation
- **New:** PerformanceMonitor in `<Canvas>` adjusts DPR based on FPS
- Three tiers: high / medium / low
- Devices with < 4 cores or < 4GB RAM get capped at medium

## File Structure

```
src/
├── app/
│   └── layout.tsx                # Mounts <Canvas> + <Tunnel> once
├── components/
│   ├── canvas/                   # NEW: $100M tier 3D
│   │   ├── PersistentCanvas.tsx  # The single <Canvas> that persists
│   │   ├── Tunnel.tsx            # DOM <-> 3D sync via tunnel-rat
│   │   ├── SectionView.tsx       # Per-section View with DOM tracking
│   │   └── scenes/               # The 3D scenes
│   │       ├── HeroScene.tsx     # Crystallized Monolith
│   │       ├── ManifestoScene.tsx # Liquid Metal
│   │       ├── CraftChaptersScene.tsx # 4 service primitives
│   │       ├── AILabScene.tsx    # Neural Network
│   │       └── WorkCardScene.tsx # Card distortion
│   ├── home/                     # Page sections (updated)
│   │   ├── hero.tsx              # $100M tier with 3D hero
│   │   ├── manifesto.tsx
│   │   ├── craft-chapters.tsx
│   │   ├── ai-lab.tsx
│   │   ├── work-strip.tsx
│   │   └── page.tsx              # Imports all
│   └── v6/                       # Legacy v6 components (kept for reference)
├── shaders/                       # NEW: GLSL file system
│   ├── common/
│   │   ├── noise.glsl
│   │   └── pbr.glsl
│   └── hero/
│       ├── monolith.vert
│       └── monolith.frag
├── lib/
│   └── three/
│       └── shaderLoader.ts       # Auto-generated shader inliner
└── scripts/
    ├── inline-shaders.mjs        # Pre-build shader bundler
    └── compress-assets.mjs       # DRACO/KTX2 compression
```

## Performance Targets (post-upgrade)

| Metric | Before | After (Target) |
|--------|--------|-----------------|
| LCP | 1.8s | 0.9s |
| TBT | 200ms | 100ms |
| CLS | 0.02 | 0.01 |
| Initial JS | 350KB | 150KB |
| Lighthouse Perf | 80 | 100 |
| 3D Init Time | 600ms | 200ms (cached) |
| WebGL Contexts | 11 (per section) | 1 (shared) |
| Memory on 3D Page | 180MB | 80MB |

## Migration Path (Already Applied)

The `home/` directory was updated with new $100M tier components:

| Component | Old | New |
|-----------|-----|-----|
| `hero.tsx` | Particle field background | 3D Crystallized Monolith via SectionView |
| `manifesto.tsx` | Text-only reveal | 3D Liquid Metal Surface + scroll-driven flow |
| `craft-chapters.tsx` | 2D chapter list | 3D Service Primitives (Icosahedron, Cube, TorusKnot, Octahedron) |
| `ai-lab.tsx` | 2D canvas nodes | 3D Neural Network with signal pulses |
| `work-strip.tsx` | CSS-only cards | 3D-tilt cards with distortion shader |

## Setup (Required After Pulling)

1. Install new R3F stack:
   ```bash
   npm install @react-three/fiber@^9 @react-three/drei@^10 @react-three/postprocessing@^3 \
     postprocessing@^6 framer-motion@^12 zustand@^5 tunnel-rat@^0.1 vite-plugin-glsl@^1
   ```

2. Run shader inliner (pre-build):
   ```bash
   node scripts/inline-shaders.mjs
   ```

3. Add pre-build hook to package.json:
   ```json
   "scripts": {
     "prebuild": "node scripts/inline-shaders.mjs",
     "build": "next build"
   }
   ```

4. (Optional) Compress 3D assets:
   ```bash
   npm install -g @gltf-transform/cli
   node scripts/compress-assets.mjs models
   node scripts/compress-assets.mjs textures
   ```

## What's Next (Phase 2+)

- [ ] Testimonials with 3D card tilt on hover
- [ ] Pricing cards floating in 3D space
- [ ] Team with photo orb spheres
- [ ] ProcessLine with scroll-driven 3D scrubber
- [ ] FooterCTA with eclipse scene
- [ ] Post-processing chain (Bloom, ChromaticAberration, Vignette)
- [ ] Replace raw Three.js in legacy `v6/` components with R3F
- [ ] Move all 3D initialization to `useEffect` cleanup patterns

## Notes for Senior Devs

The legacy `v6/` directory is **intentionally preserved**. It serves as:
1. Reference for the previous architecture
2. A/B testing comparison
3. A teaching artifact for the team
4. A migration source — copy patterns from there to `home/` when needed

When the migration is complete, `v6/` can be deleted in a future PR.

## Verification

The current live deployment is at https://goat-wheat.vercel.app (still running the v6 implementation). The new components in `home/` and `canvas/` are ready to be activated by:

1. Switching `app/page.tsx` to import from `./components/home` (already done in some files)
2. Installing the R3F stack dependencies
3. Running the shader inliner

The build pipeline supports both the legacy v6 and the new R3F components simultaneously for a smooth transition.
