"use client";

import { useEffect, useRef, type ElementType } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface KineticHeadingProps {
  text: string;
  as?: ElementType;
  className?: string;
  accentWords?: number[];
  delay?: number;
}

export default function KineticHeading({
  text,
  as: Tag = "h2",
  className = "",
  accentWords = [],
  delay = 0,
}: KineticHeadingProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll("[data-kw]"),
        { yPercent: 115, rotate: 4 },
        {
          yPercent: 0,
          rotate: 0,
          duration: 0.85,
          ease: "power4.out",
          stagger: 0.04,
          delay,
          scrollTrigger: { trigger: el, start: "top 86%", once: true },
        }
      );
    }, el);
    return () => ctx.revert();
  }, [delay]);

  const words = text.split(" ");
  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} aria-hidden="true" className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
          <span
            data-kw
            className={`inline-block will-change-transform ${accentWords.includes(i) ? "font-serif italic text-primary" : ""}`}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}
