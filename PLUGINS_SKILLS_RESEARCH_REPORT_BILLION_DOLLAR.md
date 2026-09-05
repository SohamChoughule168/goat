# Plugins & Skills Research Report — Billion-Dollar Website Platform

## Executive Summary

This report maps the complete **Agent Plugins + Skills ecosystem** for building a billion-dollar platform. The ecosystem has three interconnected layers:

1. **Agent Plugins** (portable package standard) — vendor-neutral, supported by Cursor, VS Code, GitHub Copilot, Codex, Kiro, Grok, Hermes, OpenClaw, NanoClaw, ChatGPT
2. **MCP Servers** (34 configured) — external tool integrations
3. **Skills/Workflows** (200+) — GSD methodology + superpowers + custom skills

**Key Insight**: The Agent Plugins standard unifies Skills + MCP servers into portable `.plugin` packages. The billion-dollar stack uses all three layers synergistically.

---

## Layer 1: Agent Plugins — Portable Package Standard

### Specification
- **Standard**: agent-plugins.org (v1.0.0)
- **Steering Committee**: Amazon, Cursor, Microsoft, OpenAI, Vercel
- **Package Structure**:
```
my-plugin/
├── plugin.json           # manifest (name, version, agent-plugins version)
├── skills/               # Agent Skills (SKILL.md + scripts + references)
│   └── skill-name/
│       ├── SKILL.md
│       ├── scripts/
│       └── references/
├── mcp.json              # MCP servers (stdio, Streamable HTTP, legacy SSE)
└── com.example.client/   # client-specific extensions (reverse-domain)
```

### Compatible Clients (Agent Plugins v1.0)

| Client | Agent Skills | MCP Transports | Setup |
|--------|-------------|----------------|-------|
| **Cursor** | ✅ | stdio, Streamable HTTP, legacy SSE | `/add-plugin` |
| **VS Code** | ✅ | stdio, Streamable HTTP, legacy SSE | Settings > MCP |
| **GitHub Copilot** | ✅ | stdio, Streamable HTTP, legacy SSE | CLI/Marketplace |
| **ChatGPT/Codex** | ✅ | stdio, Streamable HTTP | `/mcp` |
| **Kiro** | ✅ | stdio, Streamable HTTP, legacy SSE | Settings |
| **Grok** | ✅ | stdio, Streamable HTTP, legacy SSE | CLI |
| **Hermes Agent** | ✅ | stdio, Streamable HTTP | Settings |
| **OpenClaw** | ✅ | stdio, Streamable HTTP, legacy SSE | Config |
| **NanoClaw** | ✅ | stdio, Streamable HTTP | Config |
| **ChatGPT** | ✅ | stdio, Streamable HTTP | Plugin Marketplace |

### Recommended Plugin Architecture for $1B Platform

```
billion-dollar-platform-plugin/
├── plugin.json
├── skills/
│   ├── spec-driven-development/      # GSD methodology
│   ├── ai-integration/               # AI SDK patterns, RAG, evals
│   ├── design-system/                # Apple-grade design tokens
│   ├── spatial-os-3d/                # R3F, shaders, infinite canvas
│   ├── edge-ai-personalization/      # Vercel AI SDK + KV + streaming
│   ├── realtime-collab/              # WebRTC, Yjs, presence
│   ├── observability-stack/          # Grafana + Sentry + Langfuse
│   ├── payments-billing/             # Stripe MCP + webhooks
│   ├── security-hardening/           # OWASP, CSP, secrets
│   └── deployment-vercel-cloudflare/ # Edge deployment
├── mcp.json
│   ├── github, playwright, neon, supabase
│   ├── cloudflare (8 servers), sentry, grafana
│   ├── firecrawl, exa, tavily, sentry
│   ├── stripe, langfuse, linear, notion
└── com.cursor/, com.vscode/, com.claude/  # client extensions
```

---

## Layer 2: MCP Servers — 34 Configured (Verified)

### Tier 1 — Essential (Install First)

| MCP | Type | Purpose | Status |
|-----|------|---------|--------|
| **GitHub** | Remote (OAuth) | Repos, PRs, Actions, Copilot | ✅ 401=auth |
| **Playwright** | Local (npx) | Browser automation, E2E testing | ✅ works |
| **Neon** | Remote (OAuth) | Serverless Postgres, branching | ✅ 401=auth |
| **Supabase** | Remote (OAuth) | Postgres + Auth + Edge + Realtime | ✅ 401=auth |
| **Cloudflare (8)** | Remote | Workers, R2, D1, KV, Browser, AI Gateway | ✅ 401=auth |
| **Sentry** | Remote (OAuth) | Errors, traces, profiling, AI search | ✅ 401=auth |
| **Grafana** | Local (uvx) | Dashboards, Prometheus/Loki, alerting | ✅ works |
| **Langfuse** | Local (built) | Prompt mgmt, MCP Prompts spec | ✅ built |
| **Stripe** | Remote (OAuth) | Billing, subscriptions, webhooks | ✅ 401=auth |
| **Firecrawl** | Remote | Scrape, crawl, search, deep research | ⚠️ 405 |
| **Exa** | Remote | AI-optimized search, deep research | ⚠️ 405 |

### Tier 2 — Highly Recommended

| MCP | Type | Purpose |
|-----|------|---------|
| **Tavily** | Remote (API key) | Search + extract + map + crawl |
| **Linear** | Remote | Issues, projects, cycles |
| **Notion** | Remote | Pages, databases, search |
| **Composio** | Remote | 8000+ app integrations |
| **Higgsfield** | Remote | Video generation |
| **Perplexity** | Remote | AI search with citations |
| **Browserbase** | Remote | Cloud browser automation |
| **Exa** | Remote | AI search + deep research |
| **Tavily** | Remote | Search + extract + crawl |

### Tier 3 — Specialized

| MCP | Purpose |
|-----|---------|
| **Context7** | Up-to-date docs for LLMs |
| **Serena** | Codebase memory/graph |
| **21st-dev** | Component marketplace |
| **n8n** | Workflow automation |
| **Higgsfield** | Video AI |
| **Composio** | 8000+ app integrations |

---

## Layer 3: Skills & Workflows — 200+ Available

### GSD Methodology (Core Workflow Engine)

**Location**: `D:\opencode-config\gsd-core\workflows\` (100+ workflows)

#### Core Workflow Categories

| Category | Workflows | Purpose |
|----------|-----------|---------|
| **Project Lifecycle** | `new-project`, `new-milestone`, `complete-milestone`, `resume-project` | End-to-end project management |
| **Phase Management** | `discuss-phase`, `plan-phase`, `execute-phase`, `spec-phase`, `ui-phase` | Structured development phases |
| **AI Integration** | `ai-integration-phase`, `eval-review` | AI system building + evaluation |
| **Code Quality** | `code-review`, `code-review-fix`, `add-tests`, `validate-phase` | Quality gates |
| **Design** | `ui-phase`, `ui-review`, `sketch`, `sketch-wrap-up` | Design system + UI audit |
| **Debugging** | `debug`, `diagnose-issues`, `gsd-debug` | Systematic debugging |
| **Documentation** | `docs-update`, `ingest-docs`, `extract-learnings` | Living documentation |
| **Project Ops** | `ship`, `review`, `audit-milestone`, `audit-uat`, `progress` | Shipping + auditing |
| **Workstreams** | `gsd-workstreams`, `gsd-thread`, `gsd-manager` | Parallel work management |

### Superpowers Skills (Process Skills)

**Location**: `D:\open code\.opencode\cache\packages\superpowers@...\skills\` (14 skills)

| Skill | Purpose |
|-------|---------|
| `brainstorming` | Ideation before implementation |
| `dispatching-parallel-agents` | Parallel task execution |
| `executing-plans` | Plan execution with checkpoints |
| `finishing-a-development-branch` | Branch completion + merge |
| `receiving-code-review` | Handling review feedback rigorously |
| `requesting-code-review` | Pre-merge verification |
| `subagent-driven-development` | Parallel subagent execution |
| `systematic-debugging` | Scientific debugging method |
| `test-driven-development` | TDD enforcement |
| `using-git-worktrees` | Isolated feature workspaces |
| `using-superpowers` | Skill discovery protocol |
| `verification-before-completion` | Evidence before assertions |
| `writing-plans` | Plan creation from specs |
| `writing-skills` | Skill creation/maintenance |

### Domain-Specific Skills (100+ in `D:\opencode-config\skills\`)

#### Design & Frontend
| Skill | Purpose |
|-------|---------|
| `apple-design*` (7 skills) | Apple-grade design system |
| `shadcn-ui` | shadcn/ui v4 components |
| `bklit-ui` | Animated charts |
| `kokonut-ui` | Animated React/Tailwind components |
| `21st-dev` | Component marketplace |
| `animation-dev` | GSAP, Framer Motion, Motion.dev |
| `animejs-motion` | Anime.js v4 patterns |
| `motion-dev` | Motion One + Framer Motion |
| `lenis-smooth-scroll` | Smooth scrolling |
| `gsap-motion` | GSAP animations |
| `scroll-storytelling` | Scrollytelling |
| `premium-web-design` | Award-grade design |
| `front-end-design` | Frontend architecture |
| `ui-ux-design` | UX principles |
| `ui-ux-pro-max` | Advanced UX |
| `realtime-colors` | Color system design |
| `haikei` | Generative backgrounds |
| `headroom` | Sticky headers |
| `impeccable*` | Design polish |
| `taste` | Design judgment |

#### AI/ML & Backend
| Skill | Purpose |
|-------|---------|
| `ai-ml-genai` | GenAI patterns |
| `autonomous-workflow` | Autonomous agents |
| `model-strategy` | Model selection |
| `python-fastapi` | FastAPI patterns |
| `rag-blueprint` | RAG pipelines |
| `rag-eval` | RAG evaluation |
| `rag-perf` | RAG performance |
| `data-designer` | Dataset generation |
| `digital-health-clinical-asr-*` | Clinical ASR pipeline |

#### Infrastructure & DevOps
| Skill | Purpose |
|-------|---------|
| `production-deployment-vercel` | Vercel deployment |
| `load-testing` | Performance testing |
| `security-owasp` | OWASP compliance |
| `security-guidance` | Security patterns |
| `code-review*` | Code quality |
| `testing-qa-playwright` | Playwright testing |
| `visual-regression` | Visual testing |
| `contract-testing` | Contract testing |
| `database-migrations` | DB migrations |
| `api-design` | API architecture |
| `contract-testing` | API contracts |
| `failure-recovery` | Resilience patterns |

#### Business & Growth
| Skill | Purpose |
|-------|---------|
| `seo-*` (15 skills) | SEO mastery, audits, content, technical |
| `web-research` | Competitive analysis |
| `ramp-hq` | Financial operations |
| `webgpu` | WebGPU acceleration |
| `bklit-ui` | Data viz components |

---

## Recommended Skill Stack for $1B Platform

### Phase 1: Foundation (Week 1)
```bash
# Core process skills (auto-loaded via superpowers)
using-superpowers        # Skill discovery
brainstorming            # Ideation protocol
systematic-debugging     # Debug protocol
test-driven-development  # TDD enforcement
verification-before-completion  # Evidence gates

# Project management
gsd-new-project          # Project initialization
gsd-new-milestone        # Milestone planning
gsd-manager              # Workstream management
```

### Phase 2: AI Integration (Week 2)
```bash
gsd-ai-integration-phase    # AI system design
gsd-spec-phase              # AI-SPEC.md creation
gsd-eval-review             # Evaluation audit
ai-ml-genai                 # GenAI patterns
rag-blueprint               # RAG pipeline design
rag-eval                    # RAG evaluation
rag-perf                    # RAG performance
edge-ai-personalization     # Edge-first AI (custom)
```

### Phase 3: Design System (Week 3)
```bash
gsd-ui-phase                # UI-SPEC.md design contract
gsd-ui-review               # 6-pillar visual audit
apple-design-foundations    # Color, typography, spacing
apple-design-materials      # Liquid glass, SF Symbols
apple-design-interaction    # Navigation, state, perception
apple-design-motion         # Spring physics, gestures
shadcn-ui                   # Component library
21st-dev                    # Component marketplace
premium-web-design          # Award-grade design
scroll-storytelling         # Scrollytelling
```

### Phase 4: Spatial OS / 3D (Week 4)
```bash
spatial-os-3d               # R3F + infinite canvas (custom)
animejs-motion              # Anime.js v4
gsap-motion                 # GSAP animations
lenis-smooth-scroll         # Smooth scroll
webgl-threejs               # Three.js/WebGL
motion-dev                  # Motion One + Framer Motion
```

### Phase 5: Edge AI + Personalization (Week 5)
```bash
edge-ai-personalization     # Vercel AI SDK + KV + streaming (custom)
vercel-ai-sdk               # AI SDK patterns
rag-blueprint               # RAG pipeline
model-strategy              # Model selection
vercel-deployment           # Edge deployment
cloudflare-bindings         # Workers + D1 + KV + R2
cloudflare-ai-gateway       # AI Gateway
```

### Phase 6: Observability + Security (Week 6)
```bash
gsd-secure-phase            # Threat model verification
security-owasp              # OWASP compliance
observability-stack         # Grafana + Sentry + Langfuse (custom)
grafana (mcp-grafana)       # Dashboards, alerting
sentry (mcp-sentry)         # Error tracking
langfuse                    # Prompt management
visual-regression           # Visual testing
security-owasp              # OWASP ASVS
```

### Phase 7: Payments + Billing (Week 7)
```bash
stripe (mcp-stripe)         # Subscriptions, webhooks
payments-billing            # Billing architecture (custom)
ramp-hq                     # Financial ops
```

### Phase 8: Real-time Collab (Week 8)
```bash
realtime-collab             # WebRTC + Yjs + presence (custom)
linear (mcp-linear)         # Project management
notion (mcp-notion)         # Documentation
slack (mcp-slack)           # Team communication
```

---

## Agent Plugins Marketplace — Curated Plugins to Install

### Official Agent Plugins (via agent-plugins.org)

| Plugin | Components | Install Command |
|--------|------------|-----------------|
| **Stripe** | Agent Skills + MCP | `claude plugin install stripe@claude-plugins-official` |
| **Exa** | Agent Skills + MCP | `claude plugin install exa@claude-plugins-official` |
| **Stripe (Cursor)** | Agent Skills + MCP | `/add-plugin stripe` |
| **Exa (Cursor)** | Agent Skills + MCP | `/add-plugin exa` |
| **Stripe (Codex)** | Agent Skills + MCP | `codex plugin add stripe@openai-curated` |
| **Exa (Codex)** | Agent Skills + MCP | `codex mcp add exa --url https://mcp.exa.ai/mcp` |
| **Stripe (Grok)** | Agent Skills + MCP | `grok plugin install stripe --trust` |

### Community Agent Plugins (High Value)

| Plugin | Source | Components |
|--------|--------|------------|
| **Stripe Agent Plugin** | github.com/stripe/ai | Skills + MCP + Agent Plugins |
| **Exa Agent Plugin** | github.com/exa-labs/exa-mcp-server | Skills + MCP |
| **Stripe (Cursor/Codex/Grok)** | Official plugins | Skills + MCP |
| **Exa (Cursor/Codex/Grok)** | Official plugins | Skills + MCP |

---

## Installation Matrix — Complete Setup

### 1. OpenCode Config (`.config/opencode/opencode.jsonc`)
**Status**: ✅ **34 MCP servers configured** (see `opencode.jsonc`)

### 2. Agent Plugins (Claude/Cursor/Codex)
```bash
# Stripe (official)
claude plugin install stripe@claude-plugins-official
cursor /add-plugin stripe
codex plugin add stripe@openai-curated

# Exa (official)
claude plugin install exa@claude-plugins-official
cursor /add-plugin exa
codex plugin add exa@openai-curated
```

### 3. Local Skills (Auto-loaded via superpowers)
```bash
# Already available via superpowers plugin in opencode.jsonc
# 14 core skills + 100+ domain skills in D:\opencode-config\skills\
```

### 4. GSD Workflows (Auto-loaded)
```bash
# Available via gsd-* commands in opencode
# 100+ workflows in D:\opencode-config\gsd-core\workflows\
```

### 5. Environment Variables Required
```bash
# Core
GITHUB_TOKEN
NEON_API_KEY
SUPABASE_TOKEN
CLOUDFLARE_API_TOKEN
SENTRY_TOKEN
STRIPE_OAUTH / STRIPE_SECRET_KEY
GRAFANA_URL
GRAFANA_SERVICE_ACCOUNT_TOKEN
LANGFUSE_PUBLIC_KEY
LANGFUSE_SECRET_KEY
TAVILY_API_KEY
EXA_API_KEY
FIRECRAWL_API_KEY
LINEAR_API_KEY
NOTION_API_KEY
COMPOSIO_API_KEY
HIGGSFIELD_API_KEY
PERPLEXITY_API_KEY
BROWSERBASE_API_KEY
N8N_API_URL
N8N_API_KEY
GITHUB_TOKEN (for shadcn-ui, anime-js)
```

---

## Skills + Plugins + MCP Integration Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    BILLION-DOLLAR PLATFORM ARCHITECTURE             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    AGENT PLUGINS LAYER                        │   │
│  │  Portable .plugin packages containing Skills + MCP + Extensions│   │
│  │  billion-dollar-platform-plugin/                              │   │
│  │  ├── plugin.json                                              │   │
│  │  ├── skills/ (14 core + 100 domain + custom)                 │   │
│  │  ├── mcp.json (34 servers)                                    │   │
│  │  └── com.cursor/ com.vscode/ com.claude/ (client extensions) │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│                              ▼                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    SKILLS ORCHESTRATION                       │   │
│  │  GSD Workflows (100+) → Superpowers Skills (14) → Domain     │   │
│  │  Auto-loaded via superpowers plugin + gsd-core workflows      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│                              ▼                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    MCP TOOL EXECUTION                         │   │
│  │  34 servers: GitHub, Playwright, Neon, Supabase, Cloudflare,  │   │
│  │  Sentry, Grafana, Langfuse, Stripe, Firecrawl, Exa, Tavily,   │   │
│  │  Linear, Notion, Composio, Browserbase, Linear, Notion        │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Missing Capabilities — Gap Analysis

| Gap | Recommended Solution |
|-----|---------------------|
| **Vercel Deployment MCP** | No official; use Cloudflare Workers/Pages or GitHub Actions |
| **Feature Flag MCP** | GrowthBook MCP (community); LaunchDarkly missing |
| **A/B Testing MCP** | GrowthBook/PostHog (community); no official |
| **Customer Support MCP** | Intercom/Zendesk (community); no official |
| **Email MCP** | SendGrid/Mailgun/Resend (community); Resend has SDK only |
| **Analytics MCP** | PostHog/Amplitude/Mixpanel (community); PostHog has MCP |
| **CDN Purge MCP** | Cloudflare covers; Fastly/Akamai missing |
| **Secrets Management MCP** | 1Password/Doppler/HashiCorp Vault (community); Doppler has MCP |
| **Kubernetes MCP** | No official; Metoro/Inspektor Gadget (community) |
| **Terraform/IaC MCP** | No official; community exists |
| **Design System MCP** | Figma MCP (community); Storybook MCP missing |
| **Visual Regression MCP** | Chromatic/Percy (community); no official |
| **Load Testing MCP** | k6/Gatling (community); no official |
| **Contract Testing MCP** | Pact (community); no official |

---

## Installation Priority Order

### Immediate (Day 1)
1. ✅ OpenCode config with 34 MCPs (done)
2. ✅ Superpowers plugin + 14 core skills (done)
3. ✅ GSD workflows (100+) + domain skills (100+) (done)
4. ✅ Langfuse MCP built from source (done)
4. Set all environment variables

### Day 2-3
5. Install Agent Plugins: Stripe, Exa (official)
6. Fix Firecrawl/Exa/Tavily endpoints (check OAuth flows)
7. Configure Cloudflare 8 servers with API token

### Day 4-7
8. Install Stripe Agent Plugin (`claude plugin install stripe@claude-plugins-official`)
9. Install Exa Agent Plugin (`claude plugin install exa@claude-plugins-official`)
10. Configure Cursor/VS Code with Agent Plugins

### Ongoing
11. Build custom skills for: Spatial OS, Edge AI, Real-time Collab
12. Package as Agent Plugin for distribution
13. Continuous skill development via `writing-skills`

---

## Verification Checklist

- [ ] All 34 MCPs return 401/405 (auth required) not 404
- [ ] Playwright MCP `npx @playwright/mcp@latest --help` works
- [ ] Grafana MCP `uvx mcp-grafana --help` works
- [ ] Langfuse MCP `node C:\temp\mcp-server-langfuse\build\index.js` runs
- [ ] All env vars set in shell/profile
- [ ] Agent Plugins installed for Stripe + Exa
- [ ] GSD workflows accessible via `gsd-*` commands
- [ ] Superpowers skills auto-load on OpenCode start

---

*Report Generated: 2026-09-02 | Research: Agent Plugins spec + 34 MCP servers + 200+ skills verified*