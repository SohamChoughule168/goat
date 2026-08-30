"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const SOCIAL = [
  { label: "Twitter", href: "https://twitter.com/imaginarsclub", icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
    </svg>
  )},
  { label: "LinkedIn", href: "https://linkedin.com/company/imaginarsclub", icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-2.066-.021-4.757-2.886-4.757-2.889 0-3.331 2.235-3.331 2.772v5.793H9.351V9h3.414v1.561h.046c.636-1.206 2.181-4.087 5.48-4.087 5.867 0 6.96 4.157 6.96 9.56V21h-3.555V12.366zM5.005 6.575a3.068 3.068 0 0 1 0-6.136 3.068 3.068 0 0 1 0 6.136zm13.77 10.934h-3.554V12.366h3.554V21zM21 21v-6h-3.555v-2.846c0-.994-.021-2.26-1.381-2.26-1.39 0-1.6 1.086-1.6 2.206v2.914h-3.555V9h3.414v1.561h.046c.636-1.206 2.181-4.087 5.48-4.087 5.867 0 6.96 4.157 6.96 9.56V21z"/>
    </svg>
  )},
  { label: "GitHub", href: "https://github.com/imaginarsclub", icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.037 1.804 2.688 1.284 3.323.98.101-.778.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.305-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A9.86 9.86 0 0112 6.844c.85.004 1.705.115 2.504.337 1.279-1.035 2.558-1.675 3.584-1.675 1.026 0 1.93.296 2.504.337 1.279-1.035 2.558-1.675 3.584-1.675 1.026 0 1.93.296 2.74.436.386-.219.76-.53.962-.852.5-.13 1.02-.2 1.55-.2.53 0 1.05.07 1.55.2.2.32.57.64.96.85.8-.14 1.7-.37 2.74-.436 2.707-.906 3.586-1.674 3.586-1.675.337.51.74.86 1.236 1.605-.42.744-.83 1.534.117 3.176.77.84 1.235 1.91 1.235 3.22 0 4.609-2.807 5.627-5.479 5.927.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.795 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
    </svg>
  )},
  { label: "Email", href: "mailto:hello@imaginarsclub.com", icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  )},
];

const FOOTER_LINKS = {
  Craft: [
    { label: "Web Development", href: "/services/web-development" },
    { label: "Mobile App Development", href: "/services/mobile-app-development" },
    { label: "AI-Driven Websites", href: "/services/ai-driven-websites" },
    { label: "Website Refurbishment", href: "/services/website-refurbishment" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Our Work", href: "/work" },
    { label: "Process", href: "/process" },
    { label: "Team", href: "/team" },
    { label: "Careers", href: "/careers" },
  ],
  Resources: [
    { label: "Insights", href: "/insights" },
    { label: "Pricing", href: "/pricing" },
    { label: "FAQ", href: "/faq" },
    { label: "Documentation", href: "/docs" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/legal/privacy" },
    { label: "Terms of Service", href: "/legal/terms" },
    { label: "Cookie Policy", href: "/legal/cookies" },
    { label: "Security", href: "/security" },
  ],
};

const FOOTER_ITEMS = [
  "Web Development", "Mobile Apps", "AI Websites", "Refurbishment", "AI / ML Models", "Mumbai"
];

export default function FooterCta() {
  const magnetRef = useRef<HTMLAnchorElement>(null);
  const rootRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

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
        // CTA reveal
        gsap.fromTo(root.querySelector<HTMLElement>(".footer-cta-content"),
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: { trigger: root, start: "top 85%", toggleActions: "play none none reverse" },
          }
        );

        // Stats reveal
        gsap.fromTo(root.querySelectorAll<HTMLElement>(".footer-stat"),
          { opacity: 0, y: 30, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.2)",
            scrollTrigger: { trigger: root, start: "top 75%", toggleActions: "play none none reverse" },
          }
        );

        ScrollTrigger.create({
          trigger: root,
          start: "top 80%",
          onEnter: () => setInView(true),
        });
      }, root);
      cleanup = () => ctx.revert();
    })();

    return () => cleanup();
  }, []);

  // Magnetic button
  useEffect(() => {
    const el = magnetRef.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    
    let raf = 0;
    const pos = { x: 0, y: 0 };
    function onMove(e: MouseEvent) {
      const r = el!.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      pos.x = (e.clientX - cx) * 0.3;
      pos.y = (e.clientY - cy) * 0.3;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el!.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
      });
    }
    function reset() {
      cancelAnimationFrame(raf);
      el!.style.transform = "";
    }
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", reset);
    return () => {
      cancelAnimationFrame(raf);
      el?.removeEventListener("mousemove", onMove);
      el?.removeEventListener("mouseleave", reset);
    };
  }, []);

  return (
    <footer ref={rootRef} className="relative border-t border-[var(--border-subtle)] overflow-hidden" aria-label="Footer">
      {/* Marquee */}
      <div className="v6-marquee" aria-hidden="true">
        <div className="v6-marquee-track">
          {[0, 1].map((dup) => (
            <span key={dup} className="inline-flex gap-14 shrink-0">
              {FOOTER_ITEMS.map((it) => (
                <span key={it} className="inline-flex items-center gap-14 font-semibold" style={{ fontSize: "clamp(1rem, 2vw, 1.4rem)", letterSpacing: "-0.01em", color: "var(--text-tertiary)" }}>
                  {it}
                  <span className="inline-block w-1.5 h-1.5 rounded-full animate-pulse-glow" style={{ background: "var(--brand-primary)", animationDelay: `${FOOTER_ITEMS.indexOf(it) * 0.2}s` }} />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="shell v6-section footer-cta-content text-center">
        {/* Animated gradient background */}
        <div className="absolute inset-0 -z-10 opacity-0" style={{ opacity: inView ? 0.5 : 0, transition: "opacity 1000ms ease" }}>
          <div className="absolute inset-0 bg-[var(--gradient-radial-premium)]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] opacity-30" style={{ background: "var(--gradient-orb)" }} />
        </div>

        <p className="v6-label justify-center" style={{ display: "inline-flex" }}>Ready to build</p>
        <h2 className="v6-footer-cta-title mt-8" data-lines aria-label="Let's build something they remember.">
          <span className="line-mask"><span>Let&rsquo;s build</span></span>
          <span className="line-mask"><span className="gradient-text">something remarkable.</span></span>
        </h2>
        <p className="lede mx-auto mt-8 max-w-[46ch]" style={{ color: "var(--text-secondary)" }}>
          Tell us what you are building. You get an honest assessment, a clear scope,
          and a reply within one business day — in writing.
        </p>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="footer-stat glass-strong p-5 rounded-2xl text-center">
            <p className="stat-value font-mono" style={{ color: "var(--brand-primary)" }}>24h</p>
            <p className="micro mt-1">Reply Guarantee</p>
          </div>
          <div className="footer-stat glass-strong p-5 rounded-2xl text-center">
            <p className="stat-value font-mono" style={{ color: "var(--success)" }}>100%</p>
            <p className="micro mt-1">Code Ownership</p>
          </div>
          <div className="footer-stat glass-strong p-5 rounded-2xl text-center">
            <p className="stat-value font-mono" style={{ color: "var(--brand-secondary)" }}>0</p>
            <p className="micro mt-1">Hidden Fees</p>
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <a ref={magnetRef} href="/contact" className="v6-magnet" data-cursor="Start Project" style={{ height: 64, paddingInline: 44, fontSize: 16 }}>
            Start a Project
          </a>
        </div>
        <p className="micro mt-8">hello@imaginarsclub.com — replies within 24h, in writing</p>
      </div>

      {/* Footer Links */}
      <div className="shell border-t border-[var(--border-subtle)] py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true" style={{ color: "var(--brand-primary)" }}>
                <rect x="6" y="6" width="20" height="20" rx="2.5" transform="rotate(45 16 16)" stroke="currentColor" strokeWidth="2" />
                <path d="M11 20.5 16 11l5 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-semibold text-lg" style={{ color: "var(--text-primary)" }}>ImaginarsClub</span>
            </div>
            <p className="text-sm max-w-xs" style={{ color: "var(--text-tertiary)" }}>
              Senior-led digital studio building websites, mobile apps, and AI systems that ship. 
              Mumbai-based, globally operating. 100% code ownership at handover.
            </p>
            <div className="flex items-center gap-4 mt-6">
              {SOCIAL.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg glass-strong hover:bg-[var(--brand-primary)] hover:text-white hover:border-[var(--brand-primary)] transition-all duration-300" aria-label={s.label}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>{category}</h4>
              <ul className="space-y-3 list-none p-0 m-0">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="link-line text-sm" style={{ color: "var(--text-secondary)" }}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-4 text-sm" style={{ color: "var(--text-muted)" }}>
          <p>ImaginarsClub Services — Mumbai, India</p>
          <p>Designed & built in-house. No templates. No metered billing.</p>
          <p>© {new Date().getFullYear()} ImaginarsClub. All rights reserved.</p>
        </div>
      </div>

      {/* Scroll to top */}
      <a href="#top" className="fixed bottom-8 right-8 z-[100] p-3 rounded-full glass-strong border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/10 transition-all duration-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible" aria-label="Back to top">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </a>
    </footer>
  );
}