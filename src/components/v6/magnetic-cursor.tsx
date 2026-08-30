"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface MagneticElement {
  el: HTMLElement;
  strength: number;
  radius: number;
  onEnter?: () => void;
  onLeave?: () => void;
}

const elementsRef = new Map<HTMLElement, MagneticElement>();

declare global {
  interface Window {
    registerMagnetic?: (el: HTMLElement, config: MagneticElement) => () => void;
  }
}

if (typeof window !== "undefined") {
  window.registerMagnetic = (el: HTMLElement, config: MagneticElement) => {
    elementsRef.set(el, config);

    const handleMouseEnter = () => {
      config.onEnter?.();
    };
    const handleMouseLeave = () => {
      config.onLeave?.();
    };

    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      elementsRef.delete(el);
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  };
}

interface MagneticCursorProps {
  strength?: number;
  radius?: number;
  className?: string;
}

export default function MagneticCursor({
  strength = 0.3,
  radius = 100,
  className = "",
}: MagneticCursorProps) {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    function animate() {
      raf = requestAnimationFrame(animate);
      if (!visible) return;

      const ring = ringRef.current;
      const dot = dotRef.current;
      if (!ring || !dot) return;

      ring.style.transform = `translate(${mousePos.x}px, ${mousePos.y}px)`;
      dot.style.transform = `translate(${mousePos.x}px, ${mousePos.y}px)`;
    }
    raf = requestAnimationFrame(animate);

    function onMouseMove(e: MouseEvent) {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
      if (!visible) setVisible(true);
    }

    function onMouseEnter() {
      setHovered(true);
    }

    function onMouseLeave() {
      setHovered(false);
      setVisible(false);
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [visible, hovered]);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="v6-cursor-dot"
        style={{ background: "var(--text-primary)" }}
        aria-hidden="true"
      />
      <div
        ref={ringRef}
        className={`v6-cursor-ring ${hovered ? "is-active" : ""}`}
        style={{ borderColor: hovered ? "rgba(129,140,248,0.6)" : "rgba(255,255,255,0.28)" }}
        aria-hidden="true"
      />
      <div
        ref={labelRef}
        className={`v6-cursor-label ${hovered ? "is-visible" : ""}`}
        style={{ background: hovered ? "rgba(99,102,241,0.92)" : "rgba(99,102,241,0.92)" }}
        aria-hidden="true"
      />
    </>
  );
}

// Magnetic button component
interface MagneticButtonProps {
  children: React.ReactNode;
  strength?: number;
  radius?: number;
  href?: string;
  className?: string;
  style?: React.CSSProperties;
  onMouseEnter?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
}

export function MagneticButton({
  children,
  strength = 0.4,
  radius = 120,
  className = "",
  style,
  href,
  onMouseEnter,
  onMouseLeave,
  onClick,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<any>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const unregister = (window as any).registerMagnetic?.(el, {
      strength,
      radius,
      onEnter: () => setHovered(true),
      onLeave: () => setHovered(false)
    });
    return () => unregister?.();
  }, [strength, radius]);

  const isLink = !!href;
  const Tag = isLink ? "a" : "button";

  return (
    <Tag
      ref={ref}
      className={`magnetic-btn relative overflow-hidden ${className}`}
      style={{
        ...style,
        transform: hovered ? "scale(1.02)" : "scale(1)",
        transition: "transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)"
      }}
      onMouseEnter={(e) => { setHovered(true); onMouseEnter?.(e); }}
      onMouseLeave={(e) => { setHovered(false); onMouseLeave?.(e); }}
      onClick={onClick}
      href={href}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
    </Tag>
  );
}