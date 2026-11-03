"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import ScrollImageReveal from "@/components/media/scroll-image-reveal";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

interface BentoItem {
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  href: string;
  span?: "wide" | "tall";
}

const BENTO_ITEMS: BentoItem[] = [
  {
    title: "Web Development",
    subtitle: "Fast public sites that carry the institution.",
    image: "/media/institution/sequence-01-1600.webp",
    imageAlt: "Paper sheets in morning light",
    href: "/services/web-development/",
  },
  {
    title: "Mobile App Development",
    subtitle: "Student and parent access in the pocket.",
    image: "/media/institution/sequence-02-1600.webp",
    imageAlt: "Overlapping blank sheets",
    href: "/services/mobile-app-development/",
  },
  {
    title: "AI-Driven Websites",
    subtitle: "Content and enquiry routing that answer before staff do.",
    image: "/media/institution/sequence-03-1600.webp",
    imageAlt: "Cobalt ink dispersing in water",
    href: "/services/ai-driven-websites/",
  },
  {
    title: "Digital Marketing",
    subtitle: "Acquisition strategy tied to admissions.",
    image: "/media/institution/sequence-04-1600.webp",
    imageAlt: "Paper sheets in warm afternoon light",
    href: "/services/digital-marketing/",
  },
  {
    title: "SEM & Paid Search",
    subtitle: "Paid search that buys intent.",
    image: "/media/institution/sequence-05-1600.webp",
    imageAlt: "Quiet room at dusk",
    href: "/services/sem/",
  },
  {
    title: "Brand Management",
    subtitle: "One identity every branch can use.",
    image: "/media/institution/sequence-01-1600.webp",
    imageAlt: "Paper sheets in morning light",
    href: "/services/brand-management/",
  },
];

export default function ServicesBento() {
  const reduced = useReducedMotion();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (reduced) return;
    const handleMove = (event: MouseEvent) => {
      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const y = (event.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        const rx = Math.max(-1, Math.min(1, y)) * 4;
        const ry = Math.max(-1, Math.min(1, x)) * -4;
        card.style.setProperty("--tilt-x", `${rx}deg`);
        card.style.setProperty("--tilt-y", `${ry}deg`);
      });
    };
    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, [reduced]);

  return (
    <section className="inst-section-tight bento-section" aria-labelledby="home-bento">
      <div className="inst-shell">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <p className="inst-label">Capabilities in practice</p>
            <h2 className="inst-h2 mt-5 max-w-[30ch]">
              Six capabilities,<br />
              <span className="inst-serif">one system.</span>
            </h2>
          </div>
        </div>

        <div className="bento-grid">
          {BENTO_ITEMS.map((item, index) => (
            <article
              key={item.title}
              className={`bento-card ${item.span === "wide" ? "bento-wide" : ""} ${item.span === "tall" ? "bento-tall" : ""}`}
              data-tilt={tilt.x.toFixed(2)}
            >
              <Link href={item.href} className="bento-link">
                <ScrollImageReveal
                  ref={(el) => {
                    if (el) cardRefs.current[index] = el;
                  }}
                  src={item.image}
                  alt={item.imageAlt}
                  width={800}
                  height={600}
                  revealDelay={index * 0.08}
                  className="bento-image"
                />
                <div className="bento-content">
                  <span className="bento-index">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="bento-title">{item.title}</h3>
                  <p className="bento-subtitle">{item.subtitle}</p>
                  <span className="bento-arrow">→</span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
