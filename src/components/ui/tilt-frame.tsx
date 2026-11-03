"use client";

import { useCallback, useRef, type ReactNode } from "react";

type TiltFrameProps = {
  children: ReactNode;
  className?: string;
  max?: number;
};

/**
 * TiltFrame — pointer-reactive CSS 3D tilt for flat media. Mouse only,
 * skipped under reduced motion; the resting state is always flat.
 */
export default function TiltFrame({ children, className, max = 6 }: TiltFrameProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el || e.pointerType !== "mouse") return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.setProperty("--tilt-y", `${(px * max).toFixed(2)}deg`);
      el.style.setProperty("--tilt-x", `${(-py * max).toFixed(2)}deg`);
    },
    [max]
  );

  const reset = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
  }, []);

  return (
    <div
      ref={ref}
      className={className ? `tilt-frame ${className}` : "tilt-frame"}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </div>
  );
}
