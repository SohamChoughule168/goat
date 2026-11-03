"use client";

import ScrollImageReveal from "@/components/media/scroll-image-reveal";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  image: string;
  imageAlt: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "ImaginarsClub rebuilt our institute's public site and admissions system from the ground up. Everything works together now — enquiries, records, and reporting in one place.",
    name: "Rajesh Kumar",
    role: "Director, Delhi Public Institute",
    image: "/media/institution/sequence-01-1600.webp",
    imageAlt: "Paper texture in morning light",
  },
  {
    quote:
      "The handover was clean. We own the domains, code, and accounts. Any developer can pick it up without us.",
    name: "Priya Sharma",
    role: "Principal, North Branch School",
    image: "/media/institution/sequence-02-1600.webp",
    imageAlt: "Overlapping paper sheets",
  },
  {
    quote:
      "No more spreadsheets and WhatsApp batches. The admissions pipeline is visible to the whole team.",
    name: "Amit Patel",
    role: "Founder, GrowthHub Coaching",
    image: "/media/institution/sequence-03-1600.webp",
    imageAlt: "Ink dispersing in water",
  },
];

export default function TestimonialCards() {
  return (
    <section className="testimonial-section" aria-labelledby="home-testimonials">
      <div className="inst-shell">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <p className="inst-label text-[var(--ink-2)]">What institutions say</p>
            <h2 className="inst-h2 mt-5 max-w-[30ch]">
              Trusted by<br />
              <span className="inst-serif">institutions that ship.</span>
            </h2>
          </div>
        </div>

        <div className="testimonial-grid">
          {TESTIMONIALS.map((item, index) => (
            <article key={item.name} className="testimonial-card">
              <figure className="testimonial-image">
                <ScrollImageReveal
                  src={item.image}
                  alt={item.imageAlt}
                  width={160}
                  height={160}
                  revealDelay={index * 0.1}
                  className="testimonial-image-img"
                />
              </figure>
              <blockquote className="testimonial-quote">
                <span className="testimonial-quote-mark">“</span>
                {item.quote}
              </blockquote>
              <div className="testimonial-meta">
                <p className="testimonial-name">{item.name}</p>
                <p className="testimonial-role">{item.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
