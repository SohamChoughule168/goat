"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface DeviceSceneProps {
  variant?: "full" | "compact";
  className?: string;
}

const BARS = [42, 68, 50, 82, 58, 92];

export default function DeviceScene({ variant = "full", className = "" }: DeviceSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          root.classList.add("in-view");
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const wrap = rootRef.current;
    const tilt = tiltRef.current;
    if (!wrap || !tilt) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.set(tilt, { transformPerspective: 1000 });
    const ryTo = gsap.quickTo(tilt, "rotationY", { duration: 0.6, ease: "power2.out" });
    const rxTo = gsap.quickTo(tilt, "rotationX", { duration: 0.6, ease: "power2.out" });

    const move = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      ryTo(px * 9);
      rxTo(-py * 7);
    };
    const reset = () => {
      ryTo(0);
      rxTo(0);
    };
    wrap.addEventListener("mousemove", move);
    wrap.addEventListener("mouseleave", reset);
    return () => {
      wrap.removeEventListener("mousemove", move);
      wrap.removeEventListener("mouseleave", reset);
    };
  }, []);

  const compact = variant === "compact";

  return (
    <div ref={rootRef} className={`device-scene group/ds relative ${className}`} data-device>
      <div
        aria-hidden="true"
        className="chip-fade absolute -left-3 top-8 z-10 rounded-full border border-border bg-card/90 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground "
        style={{ animation: "float-y 6s ease-in-out infinite" }}
      >
        Next.js
      </div>
      {!compact && (
        <div
          aria-hidden="true"
          className="chip-fade absolute -right-4 top-1/3 z-10 rounded-full border border-border bg-card/90 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground "
          style={{ animation: "float-y 7s ease-in-out infinite reverse" }}
        >
          WCAG AA · Responsive
        </div>
      )}

      <div ref={tiltRef} className="will-change-transform">
        <div className="rounded-[1.1rem] border border-border bg-[#0c0c13] p-1.5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.65)] sm:p-2">
          <div className="relative overflow-hidden rounded-lg bg-[#0a0a11] ring-1 ring-white/5">
            <div className="flex items-center gap-1.5 border-b border-white/5 px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-white/15" />
              <span className="h-2 w-2 rounded-full bg-white/15" />
              <span className="h-2 w-2 rounded-full bg-primary/50" />
              <div className="ml-3 hidden h-4 flex-1 rounded-sm bg-white/[0.04] sm:block" />
              <div className="ml-auto h-4 w-14 rounded-sm skeleton" />
            </div>

            <div className={`flex gap-2 p-2 ${compact ? "" : "sm:p-3"}`}>
              <div className="hidden w-9 shrink-0 flex-col gap-2 rounded-md bg-white/[0.02] p-1.5 sm:flex">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className={`h-5 rounded ${i === 0 ? "bg-primary/25" : "bg-white/[0.05]"}`} />
                ))}
              </div>

              <div className="min-w-0 flex-1 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  {[0, 1].map((i) => (
                    <div key={i} className="rounded-md bg-white/[0.03] p-2">
                      <div className="h-1.5 w-12 rounded-sm skeleton" />
                      <div className="mt-2 h-3 w-16 rounded-sm bg-white/10" />
                    </div>
                  ))}
                </div>

                <div className="rounded-md bg-white/[0.03] p-2">
                  <svg viewBox="0 0 200 64" className="block h-20 w-full sm:h-24" preserveAspectRatio="none" aria-hidden="true">
                    <defs>
                      <linearGradient id="ds-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#e0b64f" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#e0b64f" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {[16, 32, 48].map((y) => (
                      <line key={y} x1="0" y1={y} x2="200" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                    ))}
                    <path
                      d="M0,52 C22,46 34,32 56,36 S96,18 120,26 S160,12 178,16 L200,10 L200,64 L0,64 Z"
                      fill="url(#ds-fill)"
                      className="opacity-0 transition-opacity duration-700 group-[.in-view]/ds:opacity-100 group-[.in-view]/ds:delay-[1500ms]"
                    />
                    <path
                      data-draw
                      style={{ "--dd": "0.35s" } as React.CSSProperties}
                      pathLength={100}
                      d="M0,52 C22,46 34,32 56,36 S96,18 120,26 S160,12 178,16 L200,10"
                      fill="none"
                      stroke="#e0b64f"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                    <circle cx="200" cy="10" r="2.5" fill="#f4f1ea" className="opacity-0 transition-opacity duration-500 group-[.in-view]/ds:opacity-100 group-[.in-view]/ds:delay-[1900ms]" />
                  </svg>
                </div>

                <div className="flex items-end justify-between gap-1.5 rounded-md bg-white/[0.03] p-2">
                  <div data-bars className="flex h-12 flex-1 items-end gap-1.5">
                    {BARS.map((h, i) => (
                      <div
                        key={i}
                        style={{ height: `${h}%`, "--bd": `${0.55 + i * 0.09}s` } as React.CSSProperties}
                        className={`flex-1 rounded-t-sm ${i === BARS.length - 1 ? "bg-[#e0b64f]/75" : "bg-white/12"}`}
                      />
                    ))}
                  </div>
                </div>

                {!compact && (
                  <div className="space-y-1.5 rounded-md bg-white/[0.03] p-2">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="h-2 w-2 shrink-0 rounded-full bg-primary/40" />
                        <div className="h-1.5 flex-1 rounded-sm skeleton" />
                        <div className="h-1.5 w-8 rounded-sm bg-white/10" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <span className="absolute bottom-1.5 right-2 rounded-sm bg-black/60 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.14em] text-white/40">
              Illustrative interface
            </span>
          </div>

          <div className="mx-auto mt-0 h-1.5 w-1/4 rounded-b-lg bg-[#15151d]" />
        </div>
      </div>
    </div>
  );
}


