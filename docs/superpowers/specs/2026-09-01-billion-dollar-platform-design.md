# ImaginarsClub — $1 Billion Platform Architecture
## Spatial OS + Edge-First AI Personalization + 6 Core Modules

---

## 1. EXECUTIVE SUMMARY

**Vision**: Transform the $100M marketing site into a **full product platform** — a "Spatial OS" where the marketing site, client portal, AI tools, and developer experience exist as regions in a single infinite WebGL canvas, with edge-first AI personalization adapting every pixel in real-time per visitor.

**North Star Metrics**:
- Lighthouse: 100/100/100/100 (perfect scores non-negotiable)
- TTFB: < 500ms globally (edge-deployed)
- WCAG: 2.2 AAA compliance
- Real-time latency: < 100ms p99 (WebRTC/WebSocket)
- AI response: < 2s p95 (proposals, ROI, personalization)
- Uptime: 99.99% SLA (multi-region active-active)

**Timeline**: 6 months | **Team**: 5-7 senior engineers (2-3 3D/R3F, 2 AI/edge, 1 infra/platform, 1 full-stack lead)

---

## 2. ARCHITECTURAL PRINCIPLES

| Principle | $100M Tier | $1B Tier |
|-----------|------------|----------|
| **Rendering** | R3F persistent canvas + DOM sections | **Spatial OS** — single infinite WebGL world; DOM = UI overlays only |
| **Navigation** | Route-based (Next.js App Router) | **Spatial navigation** — zoom/pan/fly-to; URLs map to camera positions |
| **State** | Zustand (scroll, quality, camera) | **CRDT + Zustand** — conflict-free replicated state for real-time collab |
| **AI** | None (static content) | **Edge-first** — Vercel AI SDK + KV + streaming; local WebGPU fallback |
| **Assets** | Procedural + inlined shaders | **USDZ/glTF pipeline** + Gaussian splatting + neural radiance fields |
| **Auth** | None | **Edge auth** — Clerk/Auth.js on Vercel Edge Middleware |
| **Data** | Static JSON/MDX | **Turso (libSQL) + Redis + Vector DB** — edge-replicated |

---

## 3. SPATIAL OS — INFINITE CANVAS ARCHITECTURE

### 3.1 Core Concept
```
┌─────────────────────────────────────────────────────────────────┐
│                    SINGLE WebGL CANVAS                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   MARKETING  │  │   PORTAL     │  │   AI TOOLS   │  ...     │
│  │   REGION     │  │   ZONE       │  │   ZONE       │          │
│  │  (Hero, etc) │  │  (Dashboard) │  │ (Proposal,   │          │
│  │              │  │              │  │  ROI, Play)  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│         │                │                │                      │
│         └────────────────┼────────────────┘                      │
│                          ▼                                       │
│              CAMERA CONTROLLER                                    │
│         (fly-to, zoom, pan, smooth transitions)                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Camera Controller
- **Type**: `OrthographicCamera` for 2D UI overlays + `PerspectiveCamera` for 3D regions
- **Transitions**: `gsap.to(camera.position, { duration: 1.2, ease: "expo.inOut" })` between regions
- **URL Sync**: `window.history.pushState({}, '', '/portal/projects/abc')` ↔ camera position
- **Deep Linking**: Every region has a canonical URL; direct navigation flies camera there
- **State Persistence**: Camera position saved to `localStorage` + synced via CRDT for collab

### 3.3 Region System
```typescript
// Each region registers its bounds in world space
interface Region {
  id: string;                    // 'marketing', 'portal', 'ai-tools', 'dev', 'playground'
  bounds: Box3;                  // World-space bounding box
  cameraPosition: Vector3;       // Default camera position for this region
  cameraTarget: Vector3;         // Look-at target
  lodLevels: LODConfig[];        // Level-of-detail per distance
  streaming: boolean;            // Stream assets on approach
  collaborators: UserPresence[]; // Real-time presence (if authenticated)
}

// Region registry (singleton)
const regionRegistry = new Map<string, Region>();
```

### 3.4 Navigation Modes
| Mode | Trigger | Behavior |
|------|---------|----------|
| **Fly-to** | Click nav link / deep link | Smooth camera animation (1-2s) |
| **Zoom** | Scroll wheel / pinch | Continuous zoom; crossfade UI overlays |
| **Pan** | Drag (empty space) | Free camera movement within region bounds |
| **Focus** | Click 3D object | Orbit around object; show detail panel |
| **Mini-map** | Corner toggle | 2D overview with region labels + current position |

---

## 4. EDGE-FIRST AI PERSONALIZATION LAYER

### 4.1 Architecture
```
┌────────────────────────────────────────────────────────────────┐
│                      VERCEL EDGE NETWORK                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ Edge Middle │  │   KV Store  │  │  AI SDK     │             │
│  │   ware      │  │ (embeddings)│  │ (streaming) │             │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘             │
│         │                │                │                     │
│         └────────────────┼────────────────┘                     │
│                          ▼                                      │
│         PERSONALIZATION ENGINE (Edge Function)                 │
│  • Visitor fingerprint → embedding lookup                      │
│  • Context assembly (referrer, geo, time, history)             │
│  • Prompt construction + model routing                         │
│  • Streaming response → HTML fragments / JSON patches          │
└────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────────────┐
│                      ORIGIN (Vercel Functions)                 │
│  • Heavy LLM (GPT-4o, Claude) for complex generation           │
│  • RAG pipeline (Pinecone/Weaviate) for case studies           │
│  • WebGPU fallback (WebLLM) for instant local inference        │
└────────────────────────────────────────────────────────────────┘
```

### 4.2 Personalization Targets (Real-time, < 2s p95)
| Target | Method | Edge/Local/Cloud |
|--------|--------|------------------|
| **Hero copy/headline** | Edge streaming (Vercel AI SDK) | Edge |
| **3D scene parameters** (colors, density, animation speed) | KV lookup → uniform injection | Edge |
| **Case study selection** | Vector similarity (visitor embedding × case study embeddings) | Edge |
| **Proposal generation** | Streaming LLM + RAG | Cloud (origin) |
| **ROI calculator defaults** | Edge ML (ONNX) | Local (WebGPU) |
| **Code snippets in playground** | Edge template + streaming | Edge |
| **Collaborative cursors/presence** | WebRTC data channels | Edge (relay) |

### 4.3 Model Routing Strategy
```typescript
// Multi-model router (edge function)
async function routeModel(task: AITask): Promise<ModelConfig> {
  const { complexity, latencyBudget, privacy } = task;
  
  if (privacy === 'high' && latencyBudget < 100) {
    return { model: 'webllm-qwen2-0.5b', runtime: 'webgpu', location: 'client' };
  }
  if (complexity === 'low' && latencyBudget < 500) {
    return { model: 'gpt-4o-mini', runtime: 'vercel-ai-sdk', location: 'edge' };
  }
  if (complexity === 'high' || latencyBudget > 2000) {
    return { model: 'claude-3.5-sonnet', runtime: 'origin', location: 'cloud' };
  }
  return { model: 'gpt-4o', runtime: 'vercel-ai-sdk', location: 'edge' };
}
```

### 4.4 Visitor Embedding Pipeline
1. **Anonymous ID**: `crypto.randomUUID()` stored in `localStorage` + `httpOnly` cookie
2. **Behavior Events**: Page regions visited, 3D interactions, scroll depth, dwell time
3. **Embedding Update**: Batch every 30s → edge function → `text-embedding-3-small` → KV
4. **Similarity Search**: `KV.get(embedding)` → cosine similarity → top-k case studies/content
5. **Cold Start**: Default embedding = generic "enterprise buyer" persona

---

## 5. SIX CORE MODULES — DETAILED SPEC

### 5.1 Module 1: Client Portal / Dashboard
**Region**: `portal` (world-space: x: 0-100, y: 0, z: -100 to 0)

| Feature | Implementation |
|---------|----------------|
| **Auth** | Clerk on Edge Middleware; JWT in httpOnly cookie; session hydrated at edge |
| **Project Grid** | 3D cards floating in space; `InstancedMesh` for 100+ projects at 60fps |
| **Project Detail** | Fly-to camera → expand card into full 3D workspace |
| **Deliverables** | 3D file browser (glTF/USDZ preview in-scene) |
| **Billing** | Stripe Billing Portal embedded via `<iframe>` with postMessage sync |
| **Team** | Presence avatars (real-time via WebRTC); role badges |
| **Notifications** | Spatial toast system — 3D particles floating to notification bell |

**Tech Stack**: Next.js App Router (authenticated routes) + R3F + Zustand + WebRTC + Clerk

### 5.2 Module 2: AI Proposal Generator
**Region**: `ai-tools/proposal` (world-space: x: -200 to -100, z: 0-100)

| Feature | Implementation |
|---------|----------------|
| **Input Form** | Conversational UI (Vercel AI SDK `useChat`) — multi-step, voice input |
| **Context Injection** | Visitor embedding + selected case studies + pricing rules |
| **Streaming Output** | Markdown sections stream → 3D document unfolds in real-time |
| **3D Visualization** | Timeline Gantt in 3D; tech stack as floating icons; team avatars |
| **Export** | PDF (react-pdf), Notion, GitHub Issue, interactive 3D link |
| **Iteration** | "Regenerate section" → partial re-stream; version history |

**Tech Stack**: Vercel AI SDK (edge streaming) + R3F + RAG (Pinecone) + `react-pdf`

### 5.3 Module 3: Interactive ROI Calculator
**Region**: `ai-tools/roi` (world-space: x: 100 to 200, z: 0-100)

| Feature | Implementation |
|---------|----------------|
| **3D Visualization** | Time-series as extruded bars in 3D; camera orbits on parameter change |
| **Parameters** | Sliders (investment, timeline, team size, conversion lift) → live 3D update |
| **Monte Carlo** | WebWorker runs 10k simulations → confidence bands in 3D |
| **Scenarios** | Save/load named scenarios; share via URL with embedded params |
| **Benchmarking** | Anonymous industry benchmarks from KV (updated weekly) |
| **Export** | Executive summary PDF + interactive link for stakeholders |

**Tech Stack**: WebWorker (Monte Carlo) + R3F (3D charts) + ONNX Runtime Web (edge ML)

### 5.4 Module 4: Design System Playground
**Region**: `playground` (world-space: x: -100 to 100, z: 100 to 200)

| Feature | Implementation |
|---------|----------------|
| **Component Explorer** | 3D gallery — each component a floating card; click to expand |
| **Live Editor** | Monaco Editor embedded; changes hot-reload 3D preview |
| **Theme Builder** | Visual token editor (colors, spacing, radii) → generates CSS vars |
| **Token Inspector** | Click any 3D element → see all design tokens applied |
| **Code Export** | React + Tailwind + R3F boilerplate; copy to clipboard / download ZIP |
| **Accessibility Audit** | Real-time axe-core scan → violations highlighted in 3D |

**Tech Stack**: Monaco Editor + R3F + `postcss` (theme compile) + axe-core

### 5.5 Module 5: Real-time Collaboration
**Infrastructure**: Global WebRTC mesh + TURN servers (Cloudflare Calls / LiveKit)

| Feature | Implementation |
|---------|----------------|
| **Presence** | 3D avatars with name labels; cursor trails in world space |
| **Cursors** | `InstancedMesh` for 50+ cursors; color = user hash |
| **Voice** | Spatial audio (Web Audio API + WebRTC); volume by distance |
| **Annotations** | 3D sticky notes attached to objects; rich text + @mentions |
| **Co-browsing** | Synced camera position (opt-in); "Follow me" mode |
| **Permissions** | Role-based (owner/editor/viewer); CRDT for conflict-free edits |

**Tech Stack**: Yjs (CRDT) + WebRTC + LiveKit/Cloudflare Calls + Web Audio API

### 5.6 Module 6: Developer Portal
**Region**: `dev` (world-space: x: -200 to -100, z: -100 to 0)

| Feature | Implementation |
|---------|----------------|
| **API Reference** | OpenAPI 3.1 → 3D endpoint graph; nodes = endpoints, edges = relationships |
| **SDK Playground** | TypeScript REPL (Monaco) with auto-complete from generated types |
| **Webhook Tester** | Public URL per developer; request inspector in 3D timeline |
| **Auth Flow Visualizer** | Animated OAuth2/OIDC flow diagram with live token inspection |
| **Rate Limit Dashboard** | 3D heatmap of usage by endpoint/time |
| **CLI Integration** | `npm create imaginars@latest` scaffolds project with auth + 3D |

**Tech Stack**: OpenAPI Generator + Monaco + R3F + `hono` (edge API) + `zod` (validation)

---

## 6. TECHNICAL STACK — CONSOLIDATED

### 6.1 Frontend (Next.js 15 + React 19)
| Category | Technology | Version |
|----------|------------|---------|
| Framework | Next.js (App Router, Turbopack) | 15.x |
| React | React 19 + Server Components | 19.x |
| 3D Engine | @react-three/fiber + @react-three/drei | 9.x / 10.x |
| Post-FX | @react-three/postprocessing + postprocessing | 3.x / 6.x |
| Physics | @react-three/rapier (WASM) | 2.x |
| Animation | GSAP + Framer Motion | 3.x / 12.x |
| State | Zustand + Yjs (CRDT) | 5.x / 13.x |
| Auth | Clerk (Edge Middleware) | Latest |
| AI | Vercel AI SDK + AI SDK RSC | 4.x |
| Vector DB | Pinecone (serverless) | Latest |
| Edge KV | Vercel KV / Upstash Redis | Latest |
| Database | Turso (libSQL) — edge-replicated SQLite | Latest |
| Real-time | LiveKit / Cloudflare Calls | Latest |
| WebGPU | WebLLM / ONNX Runtime Web | Latest |

### 6.2 Asset Pipeline
| Asset Type | Format | Pipeline |
|------------|--------|----------|
| 3D Models | glTF 2.0 (Draco + KTX2) | `gltf-transform` CLI → `/public/models/` |
| Textures | KTX2 (Basis Universal) | `gltf-transform` → `/public/textures/` |
| Shaders | GLSL ES 3.00 | `inline-shaders.mjs` → `shaderLoader.ts` |
| Fonts | WOFF2 (subset) | `fonttools` subset → `/public/fonts/` |
| Video | AV1 (MP4 fallback) | `ffmpeg` → `/public/video/` |

### 6.3 Performance Budgets (Enforced in CI)
| Metric | Budget | Tool |
|--------|--------|------|
| Initial JS (gzipped) | < 150KB | `next-bundle-analyzer` |
| Initial CSS (gzipped) | < 20KB | `critters` |
| 3D Init Time | < 200ms | Custom perf mark |
| LCP | < 1.0s | Lighthouse CI |
| TBT | < 100ms | Lighthouse CI |
| CLS | < 0.01 | Lighthouse CI |
| INP | < 100ms | Lighthouse CI |
| WebGL Memory | < 100MB | `performance.memory` |

---

## 7. INFRASTRUCTURE & DEPLOYMENT

### 7.1 Vercel Configuration
```json
// vercel.json
{
  "regions": ["iad1", "sfo1", "lhr1", "hnd1", "sin1", "syd1"],
  "functions": {
    "app/api/**/*.ts": { "runtime": "edge", "maxDuration": 30 },
    "app/ai/**/*.ts": { "runtime": "nodejs20.x", "maxDuration": 60 }
  },
  "headers": [
    { "source": "/(.*)", "headers": [
      { "key": "X-Content-Type-Options", "value": "nosniff" },
      { "key": "X-Frame-Options", "value": "DENY" },
      { "key": "Permissions-Policy", "value": "camera=(), microphone=(), xr-spatial-tracking=(self)" }
    ]}
  ],
  "crons": [
    { "path": "/api/cron/embedding-refresh", "schedule": "0 */6 * * *" },
    { "path": "/api/cron/benchmark-update", "schedule": "0 2 * * 1" }
  ]
}
```

### 7.2 Multi-Region Active-Active
- **Primary**: `iad1` (US East)
- **Secondaries**: `sfo1`, `lhr1`, `hnd1`, `sin1`, `syd1`
- **Failover**: Automatic via Vercel Global Load Balancer (< 30s)
- **Data Replication**: Turso (libSQL) multi-region + Upstash Redis Global
- **Edge Config**: Feature flags + personalization rules replicated globally

### 7.3 Observability
| Layer | Tool | Purpose |
|-------|------|---------|
| **Frontend** | Vercel Analytics + Web Vitals | RUM, Core Web Vitals |
| **3D Performance** | Custom `PerformanceMonitor` + `stats.js` | FPS, draw calls, memory |
| **AI Latency** | Vercel AI SDK `onFinish` callbacks | Token usage, streaming latency |
| **Real-time** | LiveKit Analytics | Connection quality, bandwidth |
| **Errors** | Sentry (Next.js + React 19 support) | Error tracking, replay |
| **Uptime** | Better Uptime / PagerDuty | 99.99% SLA monitoring |

---

## 8. MIGRATION PATH FROM $100M TIER

### 8.1 Reusable Components (Zero Refactor)
| Component | Status | Notes |
|-----------|--------|-------|
| `PersistentCanvas` | ✅ Keep | Becomes Spatial OS root canvas |
| `Tunnel` / `SectionView` | ✅ Keep | Region registration system |
| All 5 Scene components | ✅ Keep | Become marketing regions |
| `premium-tokens.css` | ✅ Keep | Extend with 3D tokens |
| `PerformanceMonitor` | ✅ Keep | Add WebGPU detection |
| `shaderLoader.ts` | ✅ Keep | Add USDZ/glTF shader variants |

### 8.2 New Folder Structure (Additive)
```
src/
├── app/
│   ├── (marketing)/          # Existing marketing routes
│   ├── (portal)/             # NEW: Authenticated portal routes
│   ├── (ai-tools)/           # NEW: AI tool routes
│   ├── (playground)/         # NEW: Design system playground
│   ├── (dev)/                # NEW: Developer portal
│   ├── api/
│   │   ├── ai/               # NEW: Edge AI functions
│   │   ├── collab/           # NEW: WebRTC signaling
│   │   ├── webhooks/         # NEW: Developer webhooks
│   │   └── cron/             # NEW: Embedding refresh, benchmarks
│   ├── layout.tsx            # UPDATED: Spatial OS camera provider
│   └── globals.css           # UPDATED: 3D tokens + spatial styles
├── components/
│   ├── canvas/               # EXISTING: 3D scenes
│   │   ├── regions/          # NEW: Region registration + camera controller
│   │   ├── spatial/          # NEW: Infinite canvas, mini-map, navigation
│   │   └── scenes/           # EXISTING + NEW module scenes
│   ├── portal/               # NEW: Dashboard, projects, billing
│   ├── ai-tools/             # NEW: Proposal, ROI, Playground
│   ├── playground/           # NEW: Design system playground
│   ├── dev/                  # NEW: API ref, SDK, webhook tester
│   ├── collab/               # NEW: Avatars, cursors, annotations
│   └── ui/                   # EXISTING: shadcn + premium tokens
├── lib/
│   ├── spatial/              # NEW: Camera controller, region registry
│   ├── ai/                   # NEW: Edge AI helpers, model router
│   ├── collab/               # NEW: Yjs provider, WebRTC helpers
│   ├── db/                   # NEW: Turso client, schema
│   └── three/                # EXISTING: shaderLoader
├── hooks/
│   ├── useCamera.ts          # NEW: Spatial camera controller
│   ├── useRegion.ts          # NEW: Region registration
│   ├── usePresence.ts        # NEW: Real-time presence
│   └── useAI.ts              # NEW: Edge AI streaming hooks
├── shaders/                  # EXISTING + NEW module shaders
└── scripts/
    ├── inline-shaders.mjs    # EXISTING
    ├── compress-assets.mjs   # EXISTING
    └── generate-embeddings.mjs # NEW: Visitor/content embeddings
```

### 8.3 Phase-by-Phase Migration (6 Months)

| Month | Phase | Deliverable | Team Allocation |
|-------|-------|-------------|-----------------|
| **1** | **Foundation** | Spatial OS camera + region system; Edge auth + KV; Migrate marketing to regions | 2 3D, 1 AI, 1 Infra, 1 Lead |
| **2** | **AI Layer** | Edge AI personalization pipeline; Model router; Visitor embeddings; Streaming UI | 1 AI, 1 Edge, 1 3D |
| **3** | **Module 1** | Client Portal (auth, projects, 3D grid, billing) | 2 Full-stack, 1 3D |
| **4** | **Modules 2-3** | AI Proposal Generator + ROI Calculator | 2 AI, 1 3D, 1 Full-stack |
| **5** | **Modules 4-6** | Playground + Dev Portal + Collab infrastructure | 2 Full-stack, 1 3D, 1 AI |
| **6** | **Hardening** | Lighthouse 100 × 4; WCAG AAA; Load testing; Multi-region failover; Docs | All hands |

---

## 9. RISK MITIGATION

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Spatial OS complexity** | High | High | Prototype camera controller Week 1; fallback to route-based if needed |
| **WebGPU availability** | Medium | Medium | ONNX Runtime WASM fallback; graceful degradation to edge AI |
| **Real-time sync conflicts** | Medium | High | Yjs CRDT + automated conflict resolution tests |
| **Edge function cold starts** | Low | Medium | Pre-warm critical functions; provisioned concurrency for AI |
| **3D bundle size** | High | High | Code-split per region; lazy-load module scenes; Draco/KTX2 |
| **Multi-region data consistency** | Medium | High | Turso strong consistency mode; saga patterns for cross-region writes |
| **AI cost overruns** | Medium | Medium | Token budgets per feature; caching; local-first for simple tasks |

---

## 10. SUCCESS CRITERIA (Definition of Done)

| Criterion | Measurement | Target |
|-----------|-------------|--------|
| **Lighthouse** | `lhci autorun` in CI | 100/100/100/100 |
| **WCAG** | `axe-core` + manual audit | 2.2 AAA (0 violations) |
| **TTFB (global)** | Vercel Analytics p95 | < 500ms |
| **AI Latency** | Vercel AI SDK `onFinish` p95 | < 2s |
| **Real-time Latency** | LiveKit stats p99 | < 100ms |
| **Uptime** | Better Uptime 30-day | 99.99% |
| **Bundle Size** | `next build` + analyzer | < 150KB initial JS |
| **3D Init** | Custom perf marks | < 200ms |
| **Collab Sync** | Yjs awareness latency | < 50ms |
| **Accessibility** | Screen reader + keyboard test | 0 critical issues |

---

## 11. APPROVAL & NEXT STEPS

**Spec Status**: ✅ Draft complete — ready for review

**Next Action**: Review this spec. If approved, I'll invoke `writing-plans` skill to create the detailed implementation plan with task breakdown, dependencies, and sprint assignments.

---

*Document Version: 1.0 | Author: Principal Engineer | Date: 2026-09-01*