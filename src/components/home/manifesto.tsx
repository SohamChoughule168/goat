"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const STATEMENTS = [
  { text: "Most agencies sell you a department.", accent: false },
  { text: "You get senior people who ship.", accent: false },
  {
    text: "Strategy, design, engineering and growth — one accountable roof.",
    accent: true,
  },
];

export default function Manifesto() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-statement]");
      gsap.set(items, { opacity: (i) => (i === 0 ? 1 : 0), yPercent: (i) => (i === 0 ? 0 : 12) });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=170%",
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
        },
      });
      items.forEach((item, i) => {
        if (i === 0) return;
        tl.to(items[i - 1], { opacity: 0, yPercent: -10, duration: 0.35, ease: "power2.in" })
          .fromTo(
            item,
            { opacity: 0, yPercent: 12 },
            { opacity: 1, yPercent: 0, duration: 0.35, ease: "power2.out" },
            ">-0.08"
          );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div id="manifesto" ref={rootRef} className="section-y flex min-h-[80dvh] items-center">
      <div className="shell w-full">
        <p className="eyebrow mb-10 text-center">The studio position</p>
        <div className="relative mx-auto min-h-[16rem] max-w-4xl sm:min-h-[18rem]">
          {STATEMENTS.map((s) => (
            <div key={s.text} data-statement>
              <p
                className={`display-2 text-center ${
                  s.accent ? "font-serif italic text-primary" : ""
                }`}
              >
                {s.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
