"use client";

import { useEffect, useRef } from "react";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    const pos = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    const labelPos = { x: -100, y: -100 };
    let visible = false;
    let raf = 0;

    function onMove(e: MouseEvent) {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!visible) {
        visible = true;
        ringPos.x = pos.x; ringPos.y = pos.y;
        labelPos.x = pos.x; labelPos.y = pos.y;
        dot!.classList.remove("is-hidden");
        ring!.classList.remove("is-hidden");
      }
      const target = (e.target as HTMLElement)?.closest?.("[data-cursor]") as HTMLElement | null;
      const text = target?.dataset.cursor;
      if (text) {
        label!.textContent = text;
        label!.classList.add("is-visible");
        ring!.classList.add("is-active");
        dot!.classList.add("is-hidden");
      } else {
        label!.classList.remove("is-visible");
        ring!.classList.remove("is-active");
        dot!.classList.remove("is-hidden");
      }
    }
    function onLeave() {
      visible = false;
      dot!.classList.add("is-hidden");
      ring!.classList.add("is-hidden");
      label!.classList.remove("is-visible");
    }

    function tick() {
      if (!dot || !ring || !label) return;
      ringPos.x += (pos.x - ringPos.x) * 0.18;
      ringPos.y += (pos.y - ringPos.y) * 0.18;
      labelPos.x += (pos.x - labelPos.x) * 0.3;
      labelPos.y += (pos.y - labelPos.y) * 0.3;
      dot!.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%,-50%)`;
      ring!.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%,-50%)`;
      label!.style.transform = `translate(${labelPos.x}px, ${labelPos.y + 48}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="v6-cursor-dot is-hidden" aria-hidden="true" />
      <div ref={ringRef} className="v6-cursor-ring is-hidden" aria-hidden="true" />
      <div ref={labelRef} className="v6-cursor-label" aria-hidden="true" />
    </>
  );
}