"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

export default function MagneticCursor() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicking, setClicking] = useState(false);
  const [label, setLabel] = useState("");
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const labelEl = labelRef.current;
    if (!dot || !ring || !labelEl) return;

    let mouseX = 0;
    let mouseY = 0;
    let dotX = 0;
    let dotY = 0;
    let ringX = 0;
    let ringY = 0;
    let animationId: number;

    const animate = () => {
      dotX += (mouseX - dotX) * 0.25;
      dotY += (mouseY - dotY) * 0.25;
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;

      dot.style.transform = `translate(${dotX}px, ${dotY}px)`;
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
      labelEl.style.transform = `translate(${mouseX}px, ${mouseY}px)`;

      animationId = requestAnimationFrame(animate);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!visible) setVisible(true);
    };

    const onMouseDown = () => {
      setClicking(true);
      dot.style.width = "16px";
      dot.style.height = "16px";
      dot.style.background = "var(--color-cobalt-500)";
      ring.style.width = "60px";
      ring.style.height = "60px";
      ring.style.borderColor = "var(--color-cobalt-500)";
    };

    const onMouseUp = () => {
      setClicking(false);
      dot.style.width = "8px";
      dot.style.height = "8px";
      dot.style.background = "var(--color-brand-500)";
      ring.style.width = "40px";
      ring.style.height = "40px";
      ring.style.borderColor = "var(--color-brand-500)";
    };

    const onMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, .magnetic, .magnetic-strong, .card-interactive, .btn, .command-tab, .command-bar, .ledger-row, .wipe-card, .sequence-rail-item, .instrument-legend-item, .craft-chapter-link")) {
        const text = target.getAttribute("data-magnetic-label") || 
                     target.getAttribute("aria-label") || 
                     target.textContent?.trim().slice(0, 30);
        if (text) {
          setLabel(text);
          labelEl.style.opacity = "1";
        }
        if (target.classList.contains("magnetic-strong")) {
          ring.style.width = "60px";
          ring.style.height = "60px";
          ring.style.borderColor = "var(--color-cobalt-500)";
        } else {
          ring.style.width = "50px";
          ring.style.height = "50px";
        }
      }
    };

    const onMouseLeave = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, .magnetic, .magnetic-strong, .card-interactive, .btn, .command-tab, .command-bar, .ledger-row, .wipe-card, .sequence-rail-item, .instrument-legend-item, .craft-chapter-link")) {
        setLabel("");
        labelEl.style.opacity = "0";
        if (!clicking) {
          ring.style.width = "40px";
          ring.style.height = "40px";
          ring.style.borderColor = "var(--color-brand-500)";
        }
      }
    };

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseenter", onMouseEnter, true);
    document.addEventListener("mouseleave", onMouseLeave, true);

    animate();

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseenter", onMouseEnter, true);
      document.removeEventListener("mouseleave", onMouseLeave, true);
      cancelAnimationFrame(animationId);
    };
  }, [reduced, visible, clicking]);

  if (reduced) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{
          position: "fixed",
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: "var(--color-brand-500)",
          pointerEvents: "none",
          zIndex: "var(--z-cursor)",
          transform: "translate(-50%, -50%)",
          transition: "width 300ms cubic-bezier(0.34, 1.56, 0.64, 1), height 300ms cubic-bezier(0.34, 1.56, 0.64, 1), background 200ms",
          willChange: "transform, width, height, background",
        }}
      />
      <div
        ref={ringRef}
        className="cursor-ring"
        style={{
          position: "fixed",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          border: "1px solid var(--color-brand-500)",
          pointerEvents: "none",
          zIndex: "calc(var(--z-cursor) - 1)",
          transform: "translate(-50%, -50%)",
          transition: "width 400ms cubic-bezier(0.34, 1.56, 0.64, 1), height 400ms cubic-bezier(0.34, 1.56, 0.64, 1), border-color 200ms",
          willChange: "transform, width, height, border-color",
        }}
      />
      <div
        ref={labelRef}
        className="cursor-label"
        style={{
          position: "fixed",
          padding: "4px 10px",
          borderRadius: "var(--radius-full)",
          background: "var(--surface-card)",
          border: "1px solid var(--border-default)",
          fontFamily: "var(--font-mono)",
          fontSize: "10px",
          color: "var(--text-secondary)",
          pointerEvents: "none",
          zIndex: "var(--z-cursor)",
          transform: "translate(-50%, -50%)",
          opacity: "0",
          transition: "opacity 200ms",
          whiteSpace: "nowrap",
          maxWidth: "200px",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {label}
      </div>
    </>
  );
}