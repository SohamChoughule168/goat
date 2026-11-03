"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { useStageProgress } from "@/lib/motion/stage-progress";
import type { HandoverPlate } from "@/content/trust";

interface HandoverCinemaProps {
  plates: readonly HandoverPlate[];
}

/**
 * Four document plates in a sticky stack.
 *
 * Scroll progress drives which plate is active. Transforms are visual only:
 * every article stays in the accessibility tree in order, and reduced motion
 * collapses the stack to normal flow with all four cards visible.
 */
export default function HandoverCinema({
  plates,
}: HandoverCinemaProps): ReactNode {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(0);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const headingId = `handover-${uid}`;

  useStageProgress(sectionRef, { count: plates.length, onIndex: setActive });

  return (
    <section
      className="handover"
      ref={sectionRef}
      aria-labelledby={headingId}
    >
      <div className="inst-shell handover-sticky">
        <div className="handover-copy">
          <p className="inst-label">The handover</p>
          <h2 id={headingId} className="inst-h2">
            What you actually receive.
          </h2>
          <p className="inst-lede mt-5">
            Trust is easier to check than to claim. These are the artefacts
            that leave with you.
          </p>
          <p className="handover-note mt-6">
            Illustrative documents. Client files are confidential.
          </p>
        </div>

        <div className="handover-rail" aria-hidden="true">
          <ol>
            {plates.map((plate, index) => (
              <li key={plate.index}>{String(index + 1).padStart(2, "0")}</li>
            ))}
          </ol>
        </div>

        <div className="handover-stack">
          {plates.map((plate, index) => (
            <article
              key={plate.index}
              className="handover-plate"
              data-state={
                index < active
                  ? "past"
                  : index === active
                    ? "active"
                    : "ahead"
              }
              style={{ "--plate-i": index } as React.CSSProperties}
            >
              <span className="handover-tab" aria-hidden="true" />
              <span className="inst-num sr-only">{plate.index}</span>
              <h3 className="inst-h3 mt-5">{plate.title}</h3>
              <p className="inst-body mt-3" style={{ fontSize: "1rem" }}>
                {plate.body}
              </p>
              <div className="handover-lines" aria-hidden="true">
                <span style={{ width: "82%" }} />
                <span style={{ width: "64%" }} />
                <span style={{ width: "50%" }} />
              </div>
              <div className="handover-foot">
                <span className="handover-seal" aria-hidden="true" />
                <span className="handover-sign" aria-hidden="true" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
