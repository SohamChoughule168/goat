"use client";

import Link from "next/link";

interface MarqueeItem {
  text: string;
  href: string;
}

const MARQUEE_ITEMS: MarqueeItem[] = [
  { text: "Websites that perform", href: "/services/web-development/" },
  { text: "Admissions systems that convert", href: "/services/ai-driven-websites/" },
  { text: "Student portals that scale", href: "/services/digital-marketing/" },
  { text: "Brand systems that hold", href: "/services/brand-management/" },
  { text: "Digital marketing that acquires", href: "/services/digital-marketing/" },
  { text: "SEM and paid search", href: "/services/sem/" },
  { text: "Video and multimedia", href: "/services/video-editing/" },
  { text: "Thumbnail design", href: "/services/thumbnail-design/" },
  { text: "Online events", href: "/services/online-events/" },
  { text: "Google AI integration", href: "/services/google-ai-integration/" },
  { text: "Talent acquisition support", href: "/services/talent-acquisition/" },
];

/**
 * Infinite Marquee — seamless scrolling text band.
 * Pure CSS animation — no JavaScript required.
 */
export default function InfiniteMarquee() {
  return (
    <section className="marquee-section" aria-label="Services marquee">
      <div className="marquee-wrap">
        <div className="marquee-track">
          {MARQUEE_ITEMS.map((item, index) => (
            <Link key={item.text} href={item.href} className="marquee-item">
              {item.text}
            </Link>
          ))}
          {MARQUEE_ITEMS.map((item, index) => (
            <Link key={item.text + "-2"} href={item.href} className="marquee-item">
              {item.text}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
