"use client";

import Link from "next/link";

interface FeatureCard {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  imageAlt: string;
  href: string;
  badge: string;
}

const FEATURE_CARDS: FeatureCard[] = [
  {
    title: "Digital Presence",
    subtitle: "Websites that perform",
    description:
      "Fast, accessible public sites built for coaching institutes, schools and edtech teams — designed to convert enquiries into admissions.",
    image: "/media/institution/sequence-01-1600.webp",
    imageAlt: "Paper sheets in morning light",
    href: "/services/web-development/",
    badge: "01",
  },
  {
    title: "Admissions System",
    subtitle: "Track every enquiry",
    description:
      "A single admissions pipeline with source tagging, ownership, follow-up stages and reporting the front office trusts — no more spreadsheets.",
    image: "/media/institution/sequence-02-1600.webp",
    imageAlt: "Overlapping blank sheets",
    href: "/services/ai-driven-websites/",
    badge: "02",
  },
  {
    title: "Student Portal",
    subtitle: "One place for learners",
    description:
      "Role-based access for students, parents and staff. Batch schedules, results and attendance — all in one secure, auditable system.",
    image: "/media/institution/sequence-03-1600.webp",
    imageAlt: "Cobalt ink dispersing in water",
    href: "/services/digital-marketing/",
    badge: "03",
  },
  {
    title: "Digital Marketing",
    subtitle: "Acquisition strategy",
    description:
      "Data-driven strategies tied to admissions, not impressions. SEO, GEO, Meta ads and local discovery that convert.",
    image: "/media/institution/sequence-04-1600.webp",
    imageAlt: "Paper sheets in warm afternoon light",
    href: "/services/digital-marketing/",
    badge: "04",
  },
];

/**
 * Apple Premium Feature Cards — glassmorphism with shine effect,
 * 3D tilt hover, and reveal animations. Pure CSS — no WebGL.
 */
export default function PremiumFeatures() {
  return (
    <section className="inst-section premium-section" aria-labelledby="home-premium">
      <div className="inst-shell">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <p className="inst-label premium-label-reveal">Built as one system</p>
            <h2 className="inst-h2 mt-5 premium-headline-reveal max-w-[30ch]">
              Four modules,<br />
              <span className="inst-serif">one accountable team.</span>
            </h2>
          </div>
        </div>

        <div className="premium-grid">
          {FEATURE_CARDS.map((card, index) => (
            <article key={card.title} className="premium-card">
              <Link href={card.href} className="premium-link">
                <div className="premium-image-wrap">
                  <img
                    src={card.image}
                    alt={card.imageAlt}
                    width={800}
                    height={600}
                    loading="lazy"
                    decoding="async"
                    className="premium-image"
                  />
                  <div className="premium-shine" />
                  <span className="premium-badge">{card.badge}</span>
                </div>
                <div className="premium-content">
                  <span className="premium-subtitle">{card.subtitle}</span>
                  <h3 className="premium-title">{card.title}</h3>
                  <p className="premium-description">{card.description}</p>
                  <span className="premium-arrow">→</span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
