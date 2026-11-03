"use client";

import { useEffect, useRef, useState } from "react";
import { PROCESS_STAGES } from "@/content/evidence";
import { getScrollMotion } from "@/lib/motion/scroll";

/**
 * The engagement timeline.
 *
 * Desktop readers get a sticky phase index whose fill tracks scroll progress
 * through the four stages. Touch, narrow and reduced-motion readers get the
 * same four stages as a plain numbered sequence: no pin, no scrub, no state
 * that depends on JavaScript.
 */
export default function ProcessTimeline() {
  const rootRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);
  const [scrub, setScrub] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (reduced || !fine || window.innerWidth < 1024) return;

    let cancelled = false;
    let revert: (() => void) | null = null;

    getScrollMotion()
      .then(({ gsap, ScrollTrigger }) => {
        if (cancelled) return;

        const ctx = gsap.context(() => {
          const stages = gsap.utils.toArray<HTMLElement>("[data-process-stage]", root);

          if (fillRef.current) {
            gsap.fromTo(
              fillRef.current,
              { scaleY: 0 },
              {
                scaleY: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: root,
                  start: "top 62%",
                  end: "bottom 62%",
                  scrub: 0.35,
                },
              },
            );
          }

          stages.forEach((stage, index) => {
            ScrollTrigger.create({
              trigger: stage,
              start: "top 55%",
              end: "bottom 55%",
              onToggle: (self) => {
                if (self.isActive) setActive(index);
              },
            });
          });
        }, root);

        revert = () => ctx.revert();
        setScrub(true);
        ScrollTrigger.refresh();
      })
      .catch(() => {
        // The static index remains usable without scroll-driven state.
      });

    return () => {
      cancelled = true;
      revert?.();
    };
  }, []);

  return (
    <div className="ev-timeline" ref={rootRef} data-motion={scrub ? "scrub" : "static"}>
      <div className="ev-timeline-rail">
        <p className="inst-label">Phase index</p>

        <div className="ev-timeline-index-wrap">
          <span className="ev-timeline-track" aria-hidden="true" />
          <span className="ev-timeline-track-fill" ref={fillRef} aria-hidden="true" />

          <ol className="ev-timeline-index">
            {PROCESS_STAGES.map((stage, index) => {
              const current = scrub && active === index;
              return (
                <li key={stage.n}>
                  <a
                    href={`#phase-${stage.n}`}
                    className="ev-timeline-link"
                    data-active={current}
                    aria-current={current ? "location" : undefined}
                  >
                    <span className="ev-timeline-link-num">{stage.n}</span>
                    <span>
                      <span className="ev-timeline-link-title">{stage.title}</span>
                      <span className="ev-timeline-link-time">{stage.duration}</span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ol>
        </div>

        <p className="ev-timeline-readout" aria-hidden="true">
          {scrub ? `Phase ${PROCESS_STAGES[active].n} / 04` : "Four phases"}
        </p>
      </div>

      <div className="ev-timeline-stages">
        {PROCESS_STAGES.map((stage, index) => (
          <article
            key={stage.n}
            id={`phase-${stage.n}`}
            className="ev-stage"
            data-process-stage
            data-active={scrub && active === index}
          >
            <header className="ev-stage-head">
              <span className="ev-stage-num" aria-hidden="true">
                {stage.n}
              </span>
              <div>
                <p className="ev-stage-time">{stage.duration}</p>
                <h3 className="ev-stage-title">{stage.title}</h3>
                <p className="ev-stage-summary">{stage.summary}</p>
              </div>
            </header>

            <dl className="ev-stage-facts">
              <div>
                <dt>What happens</dt>
                <dd>{stage.whatHappens}</dd>
              </div>
              <div>
                <dt>What you do</dt>
                <dd>{stage.clientDoes}</dd>
              </div>
              <div>
                <dt>What you receive</dt>
                <dd>{stage.youReceive}</dd>
              </div>
              <div className="ev-stage-pitfall">
                <dt>Common pitfall</dt>
                <dd>{stage.pitfalls}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </div>
  );
}
