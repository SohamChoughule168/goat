"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!fine || reduced || !dot || !ring || !label) return;

    document.documentElement.classList.add("has-cursor");

    const dx = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power2.out" });
    const dy = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power2.out" });
    const rx = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const ry = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

    let visible = false;
    let currentLabel = "";

    const move = (e: MouseEvent) => {
      if (!visible) {
        visible = true;
        gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);

      const target = e.target as HTMLElement | null;
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      const interactive = target?.closest(
        "a, button, [role='button'], input, textarea, select, label, summary"
      );

      const nextLabel = labelled?.dataset.cursor ?? "";
      if (nextLabel !== currentLabel) {
        currentLabel = nextLabel;
        ring.classList.toggle("cursor-solid", !!nextLabel);
        if (nextLabel) {
          label.textContent = nextLabel;
          gsap.to(ring, {
                width: "auto",
            height: 34,
            borderRadius: 999,
            paddingLeft: 14,
            paddingRight: 14,
            backgroundColor: "rgba(255,255,255,0.95)",
            duration: 0.32,
            ease: "power3.out",
          });
          gsap.to(label, { opacity: 1, duration: 0.25, delay: 0.05 });
          gsap.to(dot, { opacity: 0, duration: 0.2 });
        } else {
          gsap.to(ring, {
            width: 36,
            height: 36,
            paddingLeft: 0,
            paddingRight: 0,
            backgroundColor: "rgba(255,255,255,0)",
            duration: 0.3,
            ease: "power3.out",
          });
          gsap.to(label, { opacity: 0, duration: 0.15 });
          gsap.to(dot, { opacity: 1, duration: 0.2 });
        }
      }

      if (!currentLabel) {
        gsap.to(ring, {
          scale: interactive ? 1.8 : 1,
          opacity: interactive ? 0.9 : 1,
          duration: 0.25,
          overwrite: "auto",
        });
        gsap.set(dot, { scale: e.buttons > 0 ? 0.7 : 1 });
      }
    };
    const leave = () => {
      visible = false;
      gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    };

    window.addEventListener("mousemove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("mousemove", move);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[90] hidden h-1.5 w-1.5 -ml-[3px] -mt-[3px] rounded-full bg-white opacity-0 mix-blend-difference md:block"
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[89] hidden h-9 w-9 -ml-[18px] -mt-[18px] items-center justify-center rounded-full border border-white/70 opacity-0 mix-blend-difference md:flex"
      >
        <span
          ref={labelRef}
          className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-black opacity-0"
        />
      </div>
    </>
  );
}
