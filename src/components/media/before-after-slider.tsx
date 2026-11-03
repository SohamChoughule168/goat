"use client";

import { useRef, useState } from "react";

interface BeforeAfterItem {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
  title: string;
  description: string;
}

const BEFORE_AFTER_ITEMS: BeforeAfterItem[] = [
  {
    before: "/media/institution/sequence-01-1600.webp",
    after: "/media/institution/sequence-02-1600.webp",
    beforeAlt: "Before — paper sheets",
    afterAlt: "After — overlapping sheets",
    title: "Brand Identity",
    description: "From scattered materials to a unified system that holds across every branch.",
  },
  {
    before: "/media/institution/sequence-03-1600.webp",
    after: "/media/institution/sequence-04-1600.webp",
    beforeAlt: "Before — ink in water",
    afterAlt: "After — paper in light",
    title: "Admissions Pipeline",
    description: "From three inboxes and spreadsheets to one tracked path with reporting.",
  },
];

/**
 * Before/After Slider — interactive comparison slider.
 * Users drag the handle to reveal the "after" image underneath.
 * Pure CSS + minimal JS — no libraries.
 */
export default function BeforeAfterSlider() {
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dragPosition, setDragPosition] = useState(50);

  const item = BEFORE_AFTER_ITEMS[active];

  return (
    <section className="inst-section-tight beforeafter-section" aria-labelledby="home-beforeafter">
      <div className="inst-shell">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <p className="inst-label beforeafter-label-reveal">Before & After</p>
            <h2 className="inst-h2 mt-5 beforeafter-headline-reveal max-w-[34ch]">
              Real work.<br />
              <span className="inst-serif">Real results.</span>
            </h2>
          </div>
          <div className="beforeafter-nav">
            {BEFORE_AFTER_ITEMS.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`beforeafter-dot ${index === active ? "active" : ""}`}
                onClick={() => setActive(index)}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="beforeafter-wrap">
          <div className="beforeafter-container" ref={containerRef}>
            <div className="beforeafter-before">
              <img
                src={item.before}
                alt={item.beforeAlt}
                width={800}
                height={600}
                loading="lazy"
                decoding="async"
                className="beforeafter-img"
              />
              <div className="beforeafter-label beforeafter-label-before">Before</div>
            </div>

            <div className="beforeafter-after">
              <img
                src={item.after}
                alt={item.afterAlt}
                width={800}
                height={600}
                loading="lazy"
                decoding="async"
                className="beforeafter-img"
              />
              <div className="beforeafter-label beforeafter-label-after">After</div>
              <div className="beforeafter-slider" style={{ left: `${dragPosition}%` }} />
            </div>
          </div>

          <div className="beforeafter-copy">
            <h3 className="beforeafter-title">{item.title}</h3>
            <p className="beforeafter-description">{item.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
