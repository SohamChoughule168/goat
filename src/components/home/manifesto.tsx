"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const STATEMENTS = [
  { text: "Most agencies sell you a department.", accent: false, tone: "#ff6a5c" },
  { text: "You get senior people who ship.", accent: false, tone: "#4fc3ff" },
  {
    text: "Strategy, design, engineering and growth — one accountable roof.",
    accent: true,
    tone: "#e0b64f",
  },
];

function splitWords(text: string) {
  return text.split(" ");
}

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
      items.forEach((item, i) => {
        if (i > 0) gsap.set(item.querySelectorAll("[data-kw]"), { yPercent: 120 });
      });

      const tintEl = () => root.querySelector<HTMLElement>("[data-tint]");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=190%",
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const idx = Math.min(2, Math.floor(self.progress * 3));
            const el = tintEl();
            if (el && el.dataset.tone !== String(idx)) {
              el.dataset.tone = String(idx);
              el.style.background = `radial-gradient(60% 55% at 50% 55%, ${STATEMENTS[idx].tone}26, transparent 70%)`;
              el.style.opacity = String(0.35 + self.progress * 0.4);
            }
          },
        },
      });

      tl.fromTo(
        items[0].querySelectorAll("[data-kw]"),
        { yPercent: 120 },
        { yPercent: 0, stagger: 0.05, duration: 0.4, ease: "power3.out" },
        0
      );

      items.forEach((item, i) => {
        if (i === 0) return;
        const words = item.querySelectorAll("[data-kw]");
        tl.to(items[i - 1], { opacity: 0, yPercent: -10, duration: 0.3, ease: "power2.in" })
          .fromTo(
            item,
            { opacity: 0, yPercent: 12 },
            { opacity: 1, yPercent: 0, duration: 0.22, ease: "power2.out" },
            ">-0.06"
          )
          .fromTo(
            words,
            { yPercent: 120 },
            { yPercent: 0, stagger: 0.03, duration: 0.45, ease: "power3.out" },
            "<"
          );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div id="manifesto" ref={rootRef} className="section-y relative flex min-h-[80dvh] items-center overflow-hidden">
      <div
        data-tint
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-[background,opacity] duration-700"
        style={{ background: "radial-gradient(60% 55% at 50% 55%, #ff6a5c26, transparent 70%)", opacity: 0.35 }}
      />
      <div className="shell relative z-10 w-full">
        <p className="eyebrow mb-10 flex items-center justify-center gap-3">
          <span className="text-primary">◆</span> Chapter I — The studio position
        </p>
        <div className="relative mx-auto min-h-[16rem] max-w-4xl sm:min-h-[18rem]">
          {STATEMENTS.map((s) => (
            <div key={s.text} data-statement>
              <p
                className={`display-2 text-center ${s.accent ? "font-serif italic" : ""}`}
                style={s.accent ? { color: s.tone } : undefined}
              >
                {splitWords(s.text).map((w, i, arr) => (
                  <span key={`${w}-${i}`} aria-hidden="true" className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom">
                    <span data-kw className="inline-block will-change-transform">
                      {w}
                      {i < arr.length - 1 ? "\u00A0" : ""}
                    </span>
                  </span>
                ))}
                <span className="sr-only">{s.text}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
