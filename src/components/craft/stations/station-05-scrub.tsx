"use client";

import { useEffect, useRef, useState } from "react";
import type { CraftStation as CraftStationData } from "@/content/craft";
import CraftStation from "@/components/craft/craft-station";
import { PosterScrub } from "@/components/craft/station-posters";
import { getScrollMotion } from "@/lib/motion/scroll";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

const MARKS = [
  { index: "01", label: "Content", note: "static export" },
  { index: "02", label: "Route", note: "one canonical" },
  { index: "03", label: "Budget", note: "LCP + CLS" },
  { index: "04", label: "Verify", note: "axe + keys" },
];

export default function StationScrub({ station }: { station: CraftStationData }) {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const [live, setLive] = useState(false);
  const [runId, setRunId] = useState(0);
  const [status, setStatus] = useState("Static four-mark sequence.");
  const mode = live && !reduced ? "scrub" : "static";

  useEffect(() => {
    if (!live) return;

    if (reduced) {
      if (fillRef.current) fillRef.current.style.transform = "scaleY(1)";
      if (readoutRef.current) readoutRef.current.textContent = "100%";
      return;
    }

    let cancelled = false;
    let revert: (() => void) | null = null;

    void getScrollMotion()
      .then(({ gsap, ScrollTrigger }) => {
        if (cancelled) return;
        const root = rootRef.current;
        const fill = fillRef.current;
        if (!root || !fill) return;

        const ctx = gsap.context(() => {
          gsap.fromTo(
            fill,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "top 80%",
                end: "bottom 30%",
                scrub: 0.3,
                onUpdate: (self) => {
                  if (readoutRef.current) {
                    readoutRef.current.textContent = `${Math.round(self.progress * 100)}%`;
                  }
                },
              },
            },
          );
        }, root);

        revert = () => ctx.revert();
        setStatus("Scrub linked to this frame. Reset releases it.");
        ScrollTrigger.refresh();
      })
      .catch(() => {
        if (cancelled) return;
        if (fillRef.current) fillRef.current.style.transform = "scaleY(1)";
        if (readoutRef.current) readoutRef.current.textContent = "100%";
        setStatus("Motion unavailable; the finished sequence is shown.");
      });

    return () => {
      cancelled = true;
      revert?.();
    };
  }, [live, runId, reduced]);

  function run() {
    setLive(true);
    setRunId((value) => value + 1);
    setStatus(
      reduced
        ? "Reduced motion: finished sequence, no scrub."
        : "Loading the scrub for this frame.",
    );
  }

  function reset() {
    setLive(false);
    setStatus("Static four-mark sequence restored.");
  }

  return (
    <CraftStation
      station={station}
      poster={<PosterScrub />}
      live={live}
      status={status}
      controls={
        <>
          <button type="button" className="inst-btn" onClick={run}>
            {reduced ? "Show finished sequence" : live ? "Rebuild scrub" : "Run station"}
          </button>
          <button
            type="button"
            className="inst-btn inst-btn-ghost"
            onClick={reset}
            disabled={!live}
          >
            Reset
          </button>
        </>
      }
    >
      <div className="craft-timeline" ref={rootRef} data-motion={mode}>
        <div className="craft-timeline-stage">
          <span className="craft-timeline-fill" ref={fillRef} aria-hidden="true" />
          <ol className="craft-timeline-marks">
            {MARKS.map((mark) => (
              <li key={mark.index} className="craft-timeline-mark">
                <span className="craft-timeline-dot" aria-hidden="true" />
                <span className="craft-timeline-index" aria-hidden="true">
                  {mark.index}
                </span>
                <span className="craft-timeline-label">{mark.label}</span>
                <span className="craft-timeline-note">{mark.note}</span>
              </li>
            ))}
          </ol>
          <span className="craft-timeline-readout" ref={readoutRef}>
            0%
          </span>
        </div>
      </div>
    </CraftStation>
  );
}
