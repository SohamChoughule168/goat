"use client";

import { useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useStageProgress } from "@/lib/motion/stage-progress";

export interface SequenceFrame {
  src: string;
  srcSet?: string;
  alt: string;
  stage: string;
  caption: string;
  width: number;
  height: number;
}

interface ScrollSequenceProps {
  label: string;
  title: ReactNode;
  lede: string;
  frames: readonly SequenceFrame[];
  note?: string;
  action?: ReactNode;
  /** Optional stable anchor id for in-page navigation. */
  sectionId?: string;
}

/**
 * A pinned editorial sequence. Scroll position drives which frame is visible;
 * every frame is server-rendered so the narrative survives without JavaScript.
 */
export default function ScrollSequence({
  label,
  title,
  lede,
  frames,
  note,
  action,
  sectionId,
}: ScrollSequenceProps): ReactNode {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(0);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const headingId = `sequence-${uid}`;

  useStageProgress(sectionRef, { count: frames.length, onIndex: setActive });

  return (
    <section
      className="inst-sequence"
      id={sectionId}
      ref={sectionRef}
      aria-labelledby={headingId}
      data-active={active}
    >
      <div className="sequence-sticky">
        <div className="inst-shell sequence-intro">
          <p className="inst-label">{label}</p>
          <h2 id={headingId} className="inst-display-l sequence-title">
            {title}
          </h2>
          <p className="inst-lede sequence-lede">{lede}</p>
        </div>

        <div className="inst-shell sequence-body">
          <div className="sequence-stage">
            {frames.map((frame, index) => (
              <figure
                key={frame.src}
                className="sequence-frame"
                data-active={index === active}
              >
                <img
                  src={frame.src}
                  srcSet={frame.srcSet}
                  sizes="(max-width: 767px) 100vw, 90vw"
                  alt={frame.alt}
                  width={frame.width}
                  height={frame.height}
                  decoding="async"
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "low" : undefined}
                />
                <figcaption className="sequence-caption">
                  <span className="sequence-caption-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="sequence-caption-stage">{frame.stage}</span>
                  <span className="sequence-caption-body">{frame.caption}</span>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="sequence-rail" aria-hidden="true">
            <span className="sequence-rail-fill" />
            <ol>
              {frames.map((frame, index) => (
                <li key={frame.src} data-active={index === active}>
                  {String(index + 1).padStart(2, "0")}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {(note || action) && (
          <div className="inst-shell sequence-foot">
            {note && <p className="sequence-note">{note}</p>}
            {action}
          </div>
        )}
      </div>
    </section>
  );
}
