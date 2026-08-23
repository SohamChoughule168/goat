"use client";

import { useEffect, useRef } from "react";

interface P {
  x: number; y: number;
  vx: number; vy: number;
  s: number; a: number; phase: number;
}

export default function ImaginationEngine({
  className = "",
  density = "full",
}: {
  className?: string;
  density?: "full" | "lite";
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let inView = true;
    let W = 0, H = 0;

    const COUNT = density === "lite" ? 40 : 90;
    const CONNECT_DIST = 120;
    interface Pt { x: number; y: number; vx: number; vy: number; s: number; a: number; ph: number }
    let pts: Pt[] = [];
    const mouse = { x: -9999, y: -9999 };

    function getCol() {
      const cs = getComputedStyle(document.documentElement);
      return {
        line: cs.getPropertyValue("--color-border").trim() || "#393D45",
        dot: cs.getPropertyValue("--color-accent").trim() || "#759EFD",
      };
    }

    function resize() {
      W = container!.clientWidth;
      H = container!.clientHeight;
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      canvas!.style.width = W + "px";
      canvas!.style.height = H + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seed() {
      pts = Array.from({ length: COUNT }, (_, i) => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.25,
        s: 0.8 + Math.random() * 2,
        a: 0.12 + Math.random() * 0.25,
        ph: Math.random() * Math.PI * 2,
      }));
    }

    let cols = { line: "#393D45", dot: "#759EFD" };
    try { cols = getCol(); } catch {}

    const mo = new MutationObserver(() => { try { cols = getCol(); } catch {} });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    function onMove(e: MouseEvent) {
      const r = container!.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    }
    function onLeave() { mouse.x = -9999; mouse.y = -9999; }

    window.addEventListener("mousemove", onMove, { passive: true });
    container!.addEventListener("mouseleave", onLeave);

    const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; }, { threshold: 0 });
    io.observe(container);
    const vis = () => { inView = !document.hidden; };
    document.addEventListener("visibilitychange", vis);

    const ro = new ResizeObserver(() => { resize(); seed(); });
    ro.observe(container);

    let t = 0;
    function tick() {
      raf = requestAnimationFrame(tick);
      if (!inView || document.hidden) return;
      t += 0.008;
      ctx!.clearRect(0, 0, W, H);

      for (const p of pts) {
        p.vx += Math.sin(t * 0.6 + p.ph) * 0.002;
        p.vy += Math.cos(t * 0.4 + p.ph) * 0.0015;
        const dxm = mouse.x - p.x;
        const dym = mouse.y - p.y;
        const dm = Math.sqrt(dxm * dxm + dym * dym);
        if (dm < 160 && dm > 0) {
          const f = (1 - dm / 160) * 0.015;
          p.vx += (dxm / dm) * f;
          p.vy += (dym / dm) * f;
        }
        p.vx *= 0.992; p.vy *= 0.992;
        p.x += p.vx; p.y += p.vy;
        if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20; if (p.y > H + 20) p.y = -20;
      }

      ctx!.lineWidth = 0.5;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < CONNECT_DIST * CONNECT_DIST) {
            const al = (1 - Math.sqrt(d2) / CONNECT_DIST) * 0.07;
            ctx!.strokeStyle = cols.line.replace(")", `,${al})`).replace("rgb(", "rgba(");
            ctx!.beginPath();
            ctx!.moveTo(pts[i].x, pts[i].y);
            ctx!.lineTo(pts[j].x, pts[j].y);
            ctx!.stroke();
          }
        }
      }

      for (const p of pts) {
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.s, 0, Math.PI * 2);
        ctx!.fillStyle = cols.dot.replace(")", `,${p.a})`).replace("rgb(", "rgba(");
        ctx!.fill();
      }
    }
    tick();

    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      container!.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", vis);
    };
  }, [density]);

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
