"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CraftStation as CraftStationData } from "@/content/craft";
import CraftStation from "@/components/craft/craft-station";
import { PosterExploded } from "@/components/craft/station-posters";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

const PLATES = [
  { index: "01", label: "Surface", y: 176, width: 160, travel: 0 },
  { index: "02", label: "Structure", y: 158, width: 140, travel: 26 },
  { index: "03", label: "System", y: 140, width: 120, travel: 52 },
  { index: "04", label: "Evidence", y: 122, width: 100, travel: 78 },
];

export default function StationExploded({
  station,
}: {
  station: CraftStationData;
}) {
  const reduced = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const readoutRef = useRef<HTMLOutputElement>(null);
  const groupsRef = useRef<SVGGElement[]>([]);
  const rafRef = useRef<number | null>(null);
  const [live, setLive] = useState(false);
  const [runId, setRunId] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [status, setStatus] = useState("Static study. Four plates, one axis.");

  const apply = useCallback((value: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(value)));
    const stage = stageRef.current;
    if (stage) stage.style.setProperty("--explode", String(clamped));

    for (const group of groupsRef.current) {
      const travel = Number(group.dataset.travel ?? 0);
      group.style.transform = `translateY(${(-travel * clamped) / 100}px)`;
    }

    if (readoutRef.current) readoutRef.current.value = `${clamped}% exploded`;
    if (inputRef.current) {
      inputRef.current.setAttribute("aria-valuetext", `${clamped}% exploded`);
    }
  }, []);

  const cancelFrame = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  function stop() {
    cancelFrame();
    setPlaying(false);
  }

  useEffect(() => {
    if (!live) return;
    groupsRef.current = Array.from(
      stageRef.current?.querySelectorAll<SVGGElement>("[data-plate-group]") ?? [],
    );
    apply(100);
    return cancelFrame;
  }, [live, runId, apply, cancelFrame]);

  function run() {
    stop();
    setLive(true);
    setRunId((value) => value + 1);
    setStatus(
      reduced
        ? "Reduced motion: scrub by hand; auto-play is off."
        : "Exploded study. Scrub by hand or play once.",
    );
  }

  function reset() {
    stop();
    setLive(false);
    setStatus("Static study restored.");
  }

  function play() {
    if (reduced) return;
    stop();
    apply(0);
    setPlaying(true);
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / 900);
      const eased = 1 - (1 - progress) ** 3;
      apply(eased * 100);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
        setPlaying(false);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }

  return (
    <CraftStation
      station={station}
      poster={<PosterExploded />}
      live={live}
      status={status}
      tone="dark"
      controls={
        <>
          <button type="button" className="inst-btn inst-btn-light" onClick={run}>
            {live ? "Run again" : "Run station"}
          </button>
          {!reduced ? (
            <button
              type="button"
              className="inst-btn inst-btn-ghost"
              onClick={play}
              disabled={!live || playing}
            >
              {playing ? "Playing" : "Play once"}
            </button>
          ) : null}
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
      <div className="craft-exploded">
        <div className="craft-exploded-stage" ref={stageRef}>
          <svg
            viewBox="0 0 400 240"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
            focusable="false"
          >
            <line x1="84" y1="36" x2="84" y2="200" className="cp-rule" />
            <line x1="80" y1="36" x2="88" y2="36" className="cp-rule" />
            <line x1="80" y1="200" x2="88" y2="200" className="cp-rule" />
            <text
              x="70"
              y="118"
              textAnchor="middle"
              transform="rotate(-90 70 118)"
              className="cp-mono"
            >
              TRAVEL
            </text>

            {PLATES.map((plate) => (
              <g
                key={plate.index}
                data-plate-group
                data-travel={plate.travel}
                className="craft-ex-plate"
              >
                <rect
                  x={200 - plate.width / 2}
                  y={plate.y}
                  width={plate.width}
                  height="18"
                  className={plate.index === "03" ? "cp-plate cp-plate-accent" : "cp-plate"}
                />
                <text x={200 - plate.width / 2 + 8} y={plate.y + 12} className="cp-mono">
                  {plate.index}
                </text>
                <line
                  x1={200 + plate.width / 2}
                  y1={plate.y + 9}
                  x2={200 + plate.width / 2 + 14}
                  y2={plate.y + 9}
                  className="cp-rule"
                />
                <text x={200 + plate.width / 2 + 18} y={plate.y + 12} className="cp-mono">
                  {plate.label}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div className="craft-exploded-controls">
          <label htmlFor="craft-explode">Explosion</label>
          <input
            id="craft-explode"
            ref={inputRef}
            type="range"
            min="0"
            max="100"
            defaultValue="100"
            aria-valuetext="100% exploded"
            onChange={(event) => apply(Number(event.currentTarget.value))}
          />
          <output ref={readoutRef} htmlFor="craft-explode">
            100% exploded
          </output>
        </div>
      </div>
    </CraftStation>
  );
}
