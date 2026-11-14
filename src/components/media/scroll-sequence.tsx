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
 * 
 * Premium enhancements:
 * - Liquid glass captions with specular highlights
 * - Morphing frame transitions
 * - Rail with magnetic hover
 * - Specular sweep on images
 * - Parallax depth on frames
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
      className="inst-sequence sequence-premium"
      id={sectionId}
      ref={sectionRef}
      aria-labelledby={headingId}
      data-active={active}
    >
      <div className="sequence-sticky">
        <div className="inst-shell sequence-intro">
          <p className="inst-label sequence-label-reveal">{label}</p>
          <h2 id={headingId} className="inst-display-l sequence-title sequence-title-reveal">
            {title}
          </h2>
          <p className="inst-lede sequence-lede sequence-lede-reveal">{lede}</p>
        </div>

        <div className="inst-shell sequence-body">
          <div className="sequence-stage sequence-stage-premium">
            {frames.map((frame, index) => (
              <figure
                key={frame.src}
                className="sequence-frame sequence-frame-premium"
                data-active={index === active}
                style={{ 
                  transform: index === active ? 'translateZ(0)' : 'translateZ(-40px) scale(0.96)',
                  opacity: index === active ? 1 : 0.6,
                  transition: 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1), opacity 400ms ease-out'
                }}
              >
                <div className="sequence-frame-inner">
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
                    className="sequence-frame-img sequence-frame-img-premium specular"
                  />
                  <div className="sequence-frame-glare" aria-hidden="true" />
                </div>
                <figcaption className="sequence-caption sequence-caption-premium glass-liquid specular">
                  <span className="sequence-caption-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="sequence-caption-stage">{frame.stage}</span>
                  <span className="sequence-caption-body">{frame.caption}</span>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="sequence-rail sequence-rail-premium" aria-hidden="true">
            <span className="sequence-rail-fill sequence-rail-fill-premium" style={{ 
              transform: `translateY(${active * (100 / (frames.length - 1))}%)`,
              transition: 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1)'
            }} />
            <ol>
              {frames.map((frame, index) => (
                <li 
                  key={frame.src} 
                  data-active={index === active}
                  className="sequence-rail-item magnetic"
                  style={{ 
                    transition: 'transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 200ms',
                    opacity: index === active ? 1 : 0.5,
                    transform: index === active ? 'scale(1.1)' : 'scale(1)'
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {(note || action) && (
          <div className="inst-shell sequence-foot sequence-foot-premium">
            {note && <p className="sequence-note sequence-note-reveal">{note}</p>}
            {action && <div className="sequence-action sequence-action-reveal">{action}</div>}
          </div>
        )}
      </div>
    </section>
  );
}