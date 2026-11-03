"use client";

import Link from "next/link";

interface MCPSkill {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  color: string;
  features: string[];
  status: "active" | "pending";
}

const MCP_SKILLS: MCPSkill[] = [
  {
    id: "3d-website-architect",
    name: "3D Website Architect",
    category: "Architecture",
    description: "Advanced Three.js, React Three Fiber, GSAP, Framer Motion integration for immersive 3D web experiences",
    icon: "🎨",
    color: "from-cyan-400 to-blue-600",
    features: ["WebGL Scenes", "React Three Fiber", "GSAP Animations", "Framer Motion"],
    status: "active",
  },
  {
    id: "ai-ui-ux-motion-engine",
    name: "AI UI/UX Motion Engine",
    category: "Animation",
    description: "Cinematic scroll reveals, product films, burst effects, reference-led design systems",
    icon: "✨",
    color: "from-pink-400 to-purple-600",
    features: ["Scroll Reveals", "Product Films", "Burst Effects", "Design Systems"],
    status: "active",
  },
  {
    id: "premium-creative-web-engineering",
    name: "Premium Creative Engineering",
    category: "Engineering",
    description: "Awwwards-level polish, cinematic motion, interactive 3D, anti-generic visual design",
    icon: "💎",
    color: "from-emerald-400 to-teal-600",
    features: ["Awwwards Polish", "Cinematic Motion", "Interactive 3D", "Anti-Generic Design"],
    status: "active",
  },
  {
    id: "react-three-fiber",
    name: "React Three Fiber",
    category: "3D",
    description: "Declarative 3D scenes with React renderer for Three.js - product configurators, portfolios, games",
    icon: "🔷",
    color: "from-blue-400 to-indigo-600",
    features: ["Declarative 3D", "Component-Based", "State Management", "Reusable Abstractions"],
    status: "active",
  },
  {
    id: "gsap-scrolltrigger",
    name: "GSAP ScrollTrigger",
    category: "Animation",
    description: "Scroll-driven experiences, timelines, tweens, pinning, scrubbing, parallax effects",
    icon: "🌀",
    color: "from-green-400 to-emerald-600",
    features: ["Scroll-Driven", "Timelines", "Pinning", "Parallax"],
    status: "active",
  },
  {
    id: "web3d-integration-patterns",
    name: "Web3D Integration Patterns",
    category: "Integration",
    description: "Meta-skill combining Three.js, GSAP ScrollTrigger, R3F, Motion, React Spring",
    icon: "🔗",
    color: "from-purple-400 to-fuchsia-600",
    features: ["Library Integration", "Multi-Library", "Scroll-Driven 3D", "Physics Animations"],
    status: "active",
  },
  {
    id: "animated-component-libraries",
    name: "Animated Component Libraries",
    category: "Components",
    description: "Magic UI + React Bits - 150+ TypeScript/Tailwind/Motion components",
    icon: "📦",
    color: "from-orange-400 to-amber-600",
    features: ["Magic UI", "React Bits", "TypeScript", "Tailwind"],
    status: "active",
  },
  {
    id: "lottie-animations",
    name: "Lottie Animations",
    category: "Animation",
    description: "After Effects animation rendering for web and React applications",
    icon: "🎬",
    color: "from-red-400 to-rose-600",
    features: ["After Effects JSON", "dotLottie", "Micro-interactions", "Loading Animations"],
    status: "active",
  },
  {
    id: "rive-interactive",
    name: "Rive Interactive",
    category: "Animation",
    description: "State machine-based vector animation with runtime interactivity",
    icon: "🎭",
    color: "from-indigo-400 to-purple-600",
    features: ["State Machines", "Two-Way Interactivity", "ViewModel Binding", "React Rive"],
    status: "active",
  },
  {
    id: "spline-interactive",
    name: "Spline Interactive",
    category: "3D Design",
    description: "Browser-based 3D design tool with visual editor, animation, and web export",
    icon: "🎯",
    color: "from-rose-400 to-pink-600",
    features: ["Visual Editor", "State Interactions", "React Integration", "Scene Export"],
    status: "active",
  },
  {
    id: "lightweight-3d-effects",
    name: "Lightweight 3D Effects",
    category: "Effects",
    description: "Zdog, Vanta.js, Vanilla-Tilt - pseudo-3D illustrations, animated backgrounds",
    icon: "🔆",
    color: "from-amber-400 to-orange-600",
    features: ["Zdog Pseudo-3D", "Vanta.js Backgrounds", "Vanilla-Tilt", "Decorative Elements"],
    status: "active",
  },
];

export default function MCPSkillsShowcase() {
  return (
    <section className="inst-section mcp-skills-section" aria-labelledby="home-mcp-skills">
      <div className="inst-shell">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <p className="inst-label mcp-label-reveal">MCP Skills Plugin Ecosystem</p>
            <h2 className="inst-h2 mt-5 higgsfield-headline-reveal max-w-[40ch]">
              AI-Powered<br />
              <span className="inst-serif">Skill Library.</span>
            </h2>
            <p className="inst-lede mt-5 higgsfield-lede-reveal max-w-[44ch]">
              200+ AI skills, 10+ animation libraries, 9 3D frameworks — integrated into one
              production-ready creative engine.
            </p>
          </div>
          <div className="higgsfield-mcp-stats">
            <div className="higgsfield-stat">
              <span className="higgsfield-stat-number">200+</span>
              <span className="higgsfield-stat-label">AI Skills</span>
            </div>
            <div className="higgsfield-stat">
              <span className="higgsfield-stat-number">10+</span>
              <span className="higgsfield-stat-label">Animation Libs</span>
            </div>
            <div className="higgsfield-stat">
              <span className="higgsfield-stat-number">9</span>
              <span className="higgsfield-stat-label">3D Frameworks</span>
            </div>
            <div className="higgsfield-stat">
              <span className="higgsfield-stat-number">0</span>
              <span className="higgsfield-stat-label">WebGL Objects</span>
            </div>
          </div>
        </div>

        <div className="higgsfield-mcp-grid">
          {MCP_SKILLS.map((skill) => (
            <article key={skill.id} className="higgsfield-mcp-card">
              <div className="higgsfield-mcp-header">
                <span className="higgsfield-mcp-icon">{skill.icon}</span>
                <span className="higgsfield-mcp-category">{skill.category}</span>
              </div>
              <h3 className="higgsfield-mcp-title">{skill.name}</h3>
              <p className="higgsfield-mcp-description">{skill.description}</p>
              <div className="higgsfield-mcp-features">
                {skill.features.map((feature) => (
                  <span key={feature} className="higgsfield-mcp-feature">{feature}</span>
                ))}
              </div>
              <div className="higgsfield-mcp-footer">
                <span className="higgsfield-mcp-status">
                  {skill.status === "active" ? "● Active" : "○ Pending"}
                </span>
                <Link href="#" className="higgsfield-mcp-link">
                  View Details
                  <span className="ml-1">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
