"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  initials: string;
  avatarColor: string;
  metric: { label: string; value: string };
  category: 'web' | 'mobile' | 'ai' | 'refurb' | 'case-study';
  logo?: string;
  videoUrl?: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "prv-financial",
    quote: "ImaginarsClub didn't just build our platform — they engineered our growth. The team's ability to translate complex requirements into a scalable architecture saved us 6 months of iteration.",
    author: "Priya Sharma",
    role: "CTO",
    company: "PRV Financial Services",
    initials: "PS",
    avatarColor: "#6366F1",
    metric: { label: "LCP Improvement", value: "68%" },
    category: "case-study",
    logo: "PRV",
  },
  {
    id: "fintech-cto",
    quote: "The AI search implementation reduced our support tickets by 40% in the first month. Their RAG implementation with citations is production-grade, not a demo.",
    author: "Rajesh Kumar",
    role: "VP Engineering",
    company: "SaaS Platform (Series A)",
    initials: "RK",
    avatarColor: "#06B6D4",
    metric: { label: "Support Deflection", value: "42%" },
    category: "ai",
  },
  {
    id: "ecommerce-vp",
    quote: "They migrated our legacy PHP monolith to a modern Next.js stack with zero downtime and zero traffic loss. The SEO preservation was flawless.",
    author: "Anjali Mehta",
    role: "VP Product",
    company: "E-commerce Brand (₹500Cr+)",
    initials: "AM",
    avatarColor: "#10B981",
    metric: { label: "Traffic Preservation", value: "100%" },
    category: "refurb",
  },
  {
    id: "logistics-founder",
    quote: "The mobile app they built hit 4.9 stars on both stores within 3 months. Offline-first architecture means our field teams never lose data.",
    author: "Vikram Singh",
    role: "Founder",
    company: "Logistics Platform",
    initials: "VS",
    avatarColor: "#F59E0B",
    metric: { label: "App Store Rating", value: "4.9/5" },
    category: "mobile",
  },
  {
    id: "healthtech-cto",
    quote: "Their RAG system with medical citations achieved 94% accuracy on clinical queries. HIPAA-compliant from day one.",
    author: "Dr. Kavya Nair",
    role: "CTO",
    company: "HealthTech AI Startup",
    initials: "KN",
    avatarColor: "#A855F7",
    metric: { label: "Clinical Accuracy", value: "94%" },
    category: "ai",
  },
  {
    id: "edtech-vp",
    quote: "Website refurbishment that increased course enrollments by 67%. Core Web Vitals went from red to green across all pages.",
    author: "Arjun Patel",
    role: "VP Growth",
    company: "EdTech Platform",
    initials: "AP",
    avatarColor: "#EC4899",
    metric: { label: "Enrollment Increase", value: "67%" },
    category: "refurb",
  },
];

const CATEGORIES = [
  { id: "all", label: "All", count: TESTIMONIALS.length },
  { id: "case-study", label: "Case Studies", count: TESTIMONIALS.filter(t => t.category === "case-study").length },
  { id: "web", label: "Web Dev", count: TESTIMONIALS.filter(t => t.category === "web").length },
  { id: "mobile", label: "Mobile", count: TESTIMONIALS.filter(t => t.category === "mobile").length },
  { id: "ai", label: "AI", count: TESTIMONIALS.filter(t => t.category === "ai").length },
  { id: "refurb", label: "Refurb", count: TESTIMONIALS.filter(t => t.category === "refurb").length },
];

const ICONS = {
  QuoteIcon: (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M14.017 21v-7.386c0-4.233 5.141-6.53 6.989-6.923l.012.024c2.597-.723 4.48-2.573 4.48-4.92 0-3.866-3.135-7-7-7-3.865 0-7 3.135-7 7 0 2.435 1.753 4.314 4.305 4.879v2.052H12v6h4.983c.36-.657.73-1.287 1.11-1.924l.229-.404c.152-.274.28-.556.39-.84.12-.3.217-.61.29-.93.08-.326.14-.658.18-.995.04-.33.06-.66.07-1.008.01-.325.01-.65.01-.974 0-2.757-2.243-5-5-5s-5 2.243-5 5c0 .333.037.655.105.974.04.325.08.65.12.98.069.322.16.62.26.93.11.294.217.56.39.83.11.294.217.56.39.83.11.294.217.56.39.83.11.294.217.56.39.83.11.294.217.56.39.83.116.34.24.72.116.65.19.924.28 1.197v.008c.043.157.08.312.12.468l1.838 3.249c.208.363.43.708.67 1.033.237.32.485.623.75.916a5.43 5.43 0 0 1 .576 1.512v1.824h4.982v-6H12.001v-6h2.017zm0 0" />
    </svg>
  ),
  ArrowRightIcon: (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 18l6-6-6-6" />
    </svg>
  ),
  ArrowLeftIcon: (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  ),
  CheckCircleIcon: (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="M22 4L12 14.01l-3-3" />
    </svg>
  ),
  StarIcon: (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
};

export default function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [activeCategory, setActiveCategory] = useState("all");
  const [visibleTestimonials, setVisibleTestimonials] = useState(TESTIMONIALS);
  const [isFiltering, setIsFiltering] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const filtered = activeCategory === "all" 
    ? TESTIMONIALS 
    : TESTIMONIALS.filter(t => t.category === activeCategory);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFiltering(true);
      setVisibleTestimonials(filtered);
      setCurrent(0);
      if (trackRef.current) {
        trackRef.current.style.transform = "translateX(0)";
      }
      setIsFiltering(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [activeCategory, filtered]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (visibleTestimonials.length <= 1) return;

    let interval = setInterval(() => {
      setCurrent(c => (c + 1) % visibleTestimonials.length);
    }, 6000);

    const track = trackRef.current;
    if (track) {
      track.addEventListener("mouseenter", () => clearInterval(interval));
      track.addEventListener("mouseleave", () => {
        interval = setInterval(() => setCurrent(c => (c + 1) % visibleTestimonials.length), 6000);
      });
    }

    return () => clearInterval(interval);
  }, [visibleTestimonials.length]);

  const goTo = (index: number) => {
    if (index < 0 || index >= visibleTestimonials.length) return;
    setCurrent(index);
  };

  const next = () => goTo((current + 1) % visibleTestimonials.length);
  const prev = () => goTo((current - 1 + visibleTestimonials.length) % visibleTestimonials.length);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
    setTouchStart(null);
  };

  return (
    <section className="v6-section border-t border-[var(--border-subtle)]" aria-label="Client Testimonials">
      <div className="shell">
        <div className="section-header">
          <span className="section-badge">Trusted by builders</span>
          <h2 className="section-title">Shipped with them. Trusted by them.</h2>
          <p className="section-subtitle">Real outcomes from teams who shipped with us. Filter by craft.</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mt-8 mb-6" role="group" aria-label="Filter testimonials by category">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-out ${
                activeCategory === cat.id
                  ? "bg-[var(--brand-primary)] text-white shadow-[var(--shadow-glow)]"
                  : "glass-strong text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--brand-primary)]"
              }`}
              aria-pressed={activeCategory === cat.id}
            >
              {cat.label}
              <span className="ml-2 font-mono text-xs opacity-60">({cat.count})</span>
            </button>
          ))}
        </div>

        <div className="relative mt-8" style={{ opacity: isFiltering ? 0.5 : 1, transition: "opacity 200ms ease" }}>
          <div 
            ref={trackRef} 
            className="card-grid transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {visibleTestimonials.map((t, index) => (
              <article key={t.id} className="testimonial-card group relative overflow-hidden" style={{ transitionDelay: `${index * 30}ms` }}>
                {/* Background glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ 
                  background: `radial-gradient(ellipse at top right, ${t.avatarColor}15, transparent 60%)`
                }} />
                
                <div className="relative z-10">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex -space-x-2">
                      <ICONS.QuoteIcon className="w-10 h-10 text-[var(--brand-primary)] opacity-30 group-hover:opacity-100 transition-opacity duration-300" />
                      <ICONS.QuoteIcon className="w-10 h-10 text-[var(--brand-primary)] opacity-30 group-hover:opacity-100 transition-opacity duration-300" style={{ transitionDelay: "50ms" }} />
                      <ICONS.QuoteIcon className="w-10 h-10 text-[var(--brand-primary)] opacity-30 group-hover:opacity-100 transition-opacity duration-300" style={{ transitionDelay: "100ms" }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[var(--text-primary)] leading-relaxed mb-6 text-base md:text-lg">{t.quote}</p>
                      
                      {/* Company logo/avatar */}
                      <div className="flex items-center gap-4">
                        {t.logo ? (
                          <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl font-bold text-lg" style={{ 
                            background: `linear-gradient(135deg, ${t.avatarColor}20 0%, ${t.avatarColor}40 100%)`,
                            color: t.avatarColor,
                            border: `1px solid ${t.avatarColor}40`
                          }}>
                            {t.logo}
                          </div>
                        ) : (
                          <div className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0" style={{ 
                            background: `linear-gradient(135deg, ${t.avatarColor} 0%, ${t.avatarColor}dd 100%)`,
                            color: "white"
                          }}>
                            {t.initials}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold" style={{ color: "var(--text-primary)" }}>{t.author}</p>
                          <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>{t.role}, {t.company}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-[var(--border-subtle)]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm" style={{ color: "var(--text-tertiary)" }}>
                        <ICONS.CheckCircleIcon className="text-[var(--success)]" />
                        <span className="font-mono text-[var(--success)]">{t.metric.value}</span>
                        <span style={{ color: "var(--text-tertiary)" }}>{t.metric.label}</span>
                      </div>
                      
                      {/* Category badge */}
                      <span className="badge badge-primary text-xs" style={{ 
                        background: `${t.avatarColor}20`, 
                        borderColor: `${t.avatarColor}40`, 
                        color: t.avatarColor 
                      }}>
                        {t.category.replace("-", " ").toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  {/* 5-star rating */}
                  <div className="mt-4 flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <ICONS.StarIcon key={i} className="text-amber-400" />
                    ))}
                    <span className="text-xs text-[var(--text-muted)] ml-2">Verified on Clutch</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Navigation Arrows */}
          {visibleTestimonials.length > 1 && (
            <>
              <button 
                onClick={prev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 hidden md:flex items-center justify-center p-3 rounded-full glass-strong border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] transition-all duration-300 z-10"
                aria-label="Previous testimonial"
              >
                <ICONS.ArrowLeftIcon />
              </button>
              <button 
                onClick={next}
                className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-6 hidden md:flex items-center justify-center p-3 rounded-full glass-strong border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] transition-all duration-300 z-10"
                aria-label="Next testimonial"
              >
                <ICONS.ArrowRightIcon />
              </button>
            </>
          )}

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mt-10">
            {visibleTestimonials.map((_, i) => (
              <button 
                key={i} 
                onClick={() => goTo(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i === current 
                    ? "bg-[var(--brand-primary)] w-8 shadow-[var(--shadow-glow)]" 
                    : "bg-[var(--border-default)] hover:bg-[var(--border-strong)]"
                }`} 
                aria-label={`Go to testimonial ${i + 1}`}
                aria-current={i === current ? "true" : "false"}
              />
            ))}
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 pt-12 border-t border-[var(--border-subtle)]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="stat-value font-mono" style={{ color: "var(--brand-primary)" }}>120+</p>
              <p className="micro mt-1">Projects Delivered</p>
            </div>
            <div>
              <p className="stat-value font-mono" style={{ color: "var(--success)" }}>98%</p>
              <p className="micro mt-1">Client Retention</p>
            </div>
            <div>
              <p className="stat-value font-mono" style={{ color: "var(--brand-secondary)" }}>4.9/5</p>
              <p className="micro mt-1">Clutch Rating</p>
            </div>
            <div>
              <p className="stat-value font-mono" style={{ color: "var(--brand-accent)" }}>24/7</p>
              <p className="micro mt-1">Support Coverage</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}