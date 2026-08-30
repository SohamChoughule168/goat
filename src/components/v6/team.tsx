"use client";

import { useEffect, useRef, useState, Suspense, lazy } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const TeamWebGL = lazy(() => import("./team-webgl").then(m => ({ default: m.default })));

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  initials: string;
  linkedin: string;
  twitter: string;
  skills: string[];
  color: string;
  avatarGradient: string;
}

const TEAM: TeamMember[] = [
  {
    name: "Arjun Patel",
    role: "Founder & CEO",
    bio: "15+ years building scalable web platforms. Ex-Google, ex-Stripe. Obsessed with Core Web Vitals and developer experience.",
    initials: "AP",
    linkedin: "https://linkedin.com/in/arjunpatel",
    twitter: "https://twitter.com/arjunpatel",
    skills: ["Architecture", "Performance", "Strategy"],
    color: "#6366F1",
    avatarGradient: "linear-gradient(135deg, #6366F1 0%, #818CF8 100%)",
  },
  {
    name: "Meera Krishnan",
    role: "CTO",
    bio: "Ex-Meta, ex-Netflix. Distributed systems and ML infrastructure. Built recommendation systems serving 100M+ users.",
    initials: "MK",
    linkedin: "https://linkedin.com/in/meerakrishnan",
    twitter: "https://twitter.com/meerakrishnan",
    skills: ["ML Systems", "Distributed Systems", "AI"],
    color: "#06B6D4",
    avatarGradient: "linear-gradient(135deg, #06B6D4 0%, #22D3EE 100%)",
  },
  {
    name: "Rohit Verma",
    role: "VP Engineering",
    bio: "12+ years shipping products at scale. Ex-Flipkart, ex-Razorpay. Obsessed with developer experience and shipping velocity.",
    initials: "RV",
    linkedin: "https://linkedin.com/in/rohitverma",
    twitter: "https://twitter.com/rohitverma",
    skills: ["Platform Engineering", "DevEx", "Scale"],
    color: "#10B981",
    avatarGradient: "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
  },
  {
    name: "Sneha Reddy",
    role: "Design Director",
    bio: "Ex-Airbnb, ex-Figma. Design systems that scale. Champion of accessibility and design-engineering collaboration.",
    initials: "SR",
    linkedin: "https://linkedin.com/in/snehareddy",
    twitter: "https://twitter.com/snehareddy",
    skills: ["Design Systems", "Accessibility", "Brand"],
    color: "#A855F7",
    avatarGradient: "linear-gradient(135deg, #A855F7 0%, #C084FC 100%)",
  },
  {
    name: "Karan Malhotra",
    role: "AI Lead",
    bio: "Ex-OpenAI, ex-Hugging Face. RAG, fine-tuning, and production ML. Published at NeurIPS, ICML. Building reliable AI products.",
    initials: "KM",
    linkedin: "https://linkedin.com/in/karanmalhotra",
    twitter: "https://twitter.com/karanmalhotra",
    skills: ["LLMs", "RAG", "MLOps"],
    color: "#F59E0B",
    avatarGradient: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
  },
  {
    name: "Ananya Iyer",
    role: "Head of Delivery",
    bio: "Ex-Thoughtworks, ex-Atlassian. Agile at scale. Ensures every project ships on time, on budget, with zero surprises.",
    initials: "AI",
    linkedin: "https://linkedin.com/in/ananyaiyer",
    twitter: "https://twitter.com/ananyaiyer",
    skills: ["Delivery", "Agile", "Client Success"],
    color: "#EC4899",
    avatarGradient: "linear-gradient(135deg, #EC4899 0%, #F472B6 100%)",
  },
];

const ICONS = {
  LinkedInIcon: (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-2.066-.021-4.757-2.886-4.757-2.889 0-3.331 2.235-3.331 2.772v5.793H9.351V9h3.414v1.561h.046c.636-1.206 2.181-4.087 5.48-4.087 5.867 0 6.96 4.157 6.96 9.56V21h-3.555V12.366zM5.005 6.575a3.068 3.068 0 0 1 0-6.136 3.068 3.068 0 0 1 0 6.136zm13.77 10.934h-3.554V12.366h3.554V21zM21 21v-6h-3.555v-2.846c0-.994-.021-2.26-1.381-2.26-1.39 0-1.6 1.086-1.6 2.206v2.914h-3.555V9h3.414v1.561h.046c.636-1.206 2.181-4.087 5.48-4.087 5.867 0 6.96 4.157 6.96 9.56V21z"/>
    </svg>
  ),
  TwitterIcon: (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
    </svg>
  ),
  CheckIcon: (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="M22 4L12 14.01l-3-3" />
    </svg>
  ),
};

export default function Team() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [showNetwork, setShowNetwork] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cleanup = () => {};
    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        // Header reveal
        gsap.fromTo(root.querySelector<HTMLElement>(".team-header"),
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: root,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Team cards stagger
        const cards = root.querySelectorAll<HTMLElement>(".team-card");
        gsap.fromTo(cards,
          { opacity: 0, y: 40, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: root,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Network visualization trigger
        ScrollTrigger.create({
          trigger: root,
          start: "top 50%",
          onEnter: () => setShowNetwork(true),
          onLeaveBack: () => setShowNetwork(false),
        });
      }, root);
      cleanup = () => ctx.revert();
    })();

    return () => cleanup();
  }, []);

  return (
    <section ref={rootRef} className="v6-section border-t border-[var(--border-subtle)]" aria-label="Our Team">
      <div className="shell">
        <div className="team-header section-header">
          <span className="section-badge">The people who ship</span>
          <h2 className="section-title">Senior-led. No juniors learning on your dime.</h2>
          <p className="section-subtitle">
            Every project is led by principals with 10+ years shipping at scale.
            You work directly with the people who architect and build.
          </p>
        </div>

        {/* Team Grid */}
        <div className="card-grid mt-10" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
          {TEAM.map((member, index) => (
            <article key={member.name} className="team-card relative overflow-hidden stagger-children animate" style={{ animationDelay: `${index * 80}ms` }}>
              <div className="relative aspect-square overflow-hidden">
                <div 
                  className="w-full h-full flex items-center justify-center text-3xl font-bold transition-all duration-500" 
                  style={{ 
                    background: member.avatarGradient,
                    color: "white"
                  }}
                >
                  {member.initials}
                </div>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/95 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Social links on hover */}
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 translate-y-4 transition-all duration-500 ease-out">
                  <div className="flex gap-2 justify-center">
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full glass-strong hover:border-[var(--brand-primary)] transition-all" aria-label={`${member.name} on LinkedIn`}>
                      <ICONS.LinkedInIcon style={{ color: "var(--text-secondary)" }} />
                    </a>
                    <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full glass-strong hover:bg-[var(--brand-primary)] hover:text-white hover:border-[var(--brand-primary)] transition-all" aria-label={`${member.name} on Twitter`}>
                      <ICONS.TwitterIcon style={{ color: "var(--text-secondary)" }} />
                    </a>
                  </div>
                </div>
                
                {/* Skill tags overlay on hover */}
                <div className="absolute top-4 left-4 right-4 opacity-0 group-hover:opacity-100 translate-y-4 transition-all duration-500 ease-out delay-100">
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {member.skills.map((s) => (
                      <span key={s} className="badge badge-primary text-xs" style={{ 
                        background: `${member.color}20`, 
                        borderColor: `${member.color}40`, 
                        color: member.color 
                      }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold flex-shrink-0" style={{ 
                    background: member.avatarGradient,
                    color: "white"
                  }}>
                    {member.initials}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>{member.name}</h3>
                    <p className="text-sm" style={{ color: member.color }}>{member.role}</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{member.bio}</p>
                
                {/* Always visible skill pills */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {member.skills.map((s) => (
                    <span key={s} className="badge badge-primary text-xs" style={{ 
                      background: `${member.color}15`, 
                      borderColor: `${member.color}30`, 
                      color: member.color 
                    }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Animated border on hover */}
              <div className="absolute inset-0 border-2 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ 
                borderImage: `linear-gradient(135deg, ${member.color}, ${member.color}00) 1`
              }} />
            </article>
          ))}
        </div>

        {/* Collaboration Network Visualization */}
        <div className="mt-16 relative" style={{ opacity: showNetwork ? 1 : 0, transform: showNetwork ? "translateY(0)" : "translateY(20px)", transition: "all 800ms ease-out" }}>
          <div className="text-center mb-8">
            <p className="micro text-[var(--brand-primary)] mb-2">Team Collaboration Graph</p>
            <h3 className="font-semibold text-xl" style={{ color: "var(--text-primary)" }}>How we work together</h3>
            <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>Real-time visualization of cross-functional collaboration patterns</p>
          </div>
          
          <div className="relative" style={{ minHeight: 320, borderRadius: 20 }}>
            <div className="absolute inset-0 glass-strong border border-[var(--border-subtle)] rounded-2xl" />
            <Suspense fallback={<div className="w-full h-[320px] flex items-center justify-center"><span className="text-[var(--text-muted)]">Loading network...</span></div>}>
              <TeamWebGL team={TEAM} />
            </Suspense>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="glass-strong p-6 rounded-2xl text-center stagger-children animate">
            <p className="stat-value font-mono" style={{ color: "var(--brand-primary)" }}>10+</p>
            <p className="micro mt-1">Years Avg Experience</p>
          </div>
          <div className="glass-strong p-6 rounded-2xl text-center stagger-children animate" style={{ animationDelay: "100ms" }}>
            <p className="stat-value font-mono" style={{ color: "var(--success)" }}>6</p>
            <p className="micro mt-1">Senior Principals</p>
          </div>
          <div className="glass-strong p-6 rounded-2xl text-center stagger-children animate" style={{ animationDelay: "200ms" }}>
            <p className="stat-value font-mono" style={{ color: "var(--brand-secondary)" }}>4</p>
            <p className="micro mt-1">Practices Covered</p>
          </div>
          <div className="glass-strong p-6 rounded-2xl text-center stagger-children animate" style={{ animationDelay: "300ms" }}>
            <p className="stat-value font-mono" style={{ color: "var(--brand-accent)" }}>100%</p>
            <p className="micro mt-1">Direct Access</p>
          </div>
        </div>
      </div>
    </section>
  );
}