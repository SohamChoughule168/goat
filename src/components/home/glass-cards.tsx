"use client";

import Link from "next/link";

interface GlassCard {
  title: string;
  subtitle: string;
  description: string;
  href: string;
  image: string;
  imageAlt: string;
}

const GLASS_CARDS: GlassCard[] = [
  {
    title: "Digital Presence",
    subtitle: "Websites that perform",
    description:
      "Fast, accessible public sites built for coaching institutes, schools and edtech teams — designed to convert enquiries into admissions.",
    href: "/services/web-development/",
    image: "/media/institution/sequence-01-1600.webp",
    imageAlt: "Paper sheets in morning light",
  },
  {
    title: "Admissions System",
    subtitle: "Track every enquiry",
    description:
      "A single admissions pipeline with source tagging, ownership, follow-up stages and reporting the front office trusts — no more spreadsheets.",
    href: "/services/ai-driven-websites/",
    image: "/media/institution/sequence-02-1600.webp",
    imageAlt: "Overlapping blank sheets",
  },
  {
    title: "Student Portal",
    subtitle: "One place for learners",
    description:
      "Role-based access for students, parents and staff. Batch schedules, results and attendance — all in one secure, auditable system.",
    href: "/services/digital-marketing/",
    image: "/media/institution/sequence-03-1600.webp",
    imageAlt: "Cobalt ink dispersing in water",
  },
];

/**
 * Apple-style Glassmorphism Cards — backdrop blur, subtle borders,
 * soft shadows, and 3D tilt on hover. Pure CSS — no WebGL.
 */
export default function GlassCards() {
  return (
    <section className="inst-section glass-section" aria-labelledby="home-glass">
      <div className="inst-shell">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <p className="inst-label">Built as one system</p>
            <h2 className="inst-h2 mt-5 max-w-[30ch]">
              Three modules,<br />
              <span className="inst-serif">one accountable team.</span>
            </h2>
          </div>
        </div>

        <div className="glass-grid">
          {GLASS_CARDS.map((card, index) => (
            <article key={card.title} className="glass-card">
              <Link href={card.href} className="glass-link">
                <div className="glass-image-wrap">
                  <img
                    src={card.image}
                    alt={card.imageAlt}
                    width={400}
                    height={300}
                    loading="lazy"
                    decoding="async"
                    className="glass-image"
                  />
                  <div className="glass-overlay" />
                </div>
                <div className="glass-content">
                  <span className="glass-index">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="glass-title">{card.title}</h3>
                  <p className="glass-subtitle">{card.subtitle}</p>
                  <p className="glass-description">{card.description}</p>
                  <span className="glass-arrow">→</span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
