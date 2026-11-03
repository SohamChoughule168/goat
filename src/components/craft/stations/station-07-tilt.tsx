"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import type { CraftStation as CraftStationData } from "@/content/craft";
import CraftStation from "@/components/craft/craft-station";
import { PosterTilt } from "@/components/craft/station-posters";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

const FINE_POINTER = "(pointer: fine)";

function subscribeToPointer(callback: () => void) {
  const query = window.matchMedia(FINE_POINTER);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function readPointer() {
  return window.matchMedia(FINE_POINTER).matches;
}

function readPointerOnServer() {
  return false;
}

export default function StationTilt({ station }: { station: CraftStationData }) {
  const reduced = useReducedMotion();
  const fine = useSyncExternalStore(subscribeToPointer, readPointer, readPointerOnServer);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const [status, setStatus] = useState("Static card. Pointer tilt is optional.");

  const enabled = fine && !reduced;

  function centre() {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
  }

  function reset() {
    centre();
    setLive(false);
    setStatus("Static card restored.");
  }

  function run() {
    centre();
    setLive(true);
    setStatus(
      reduced
        ? "Reduced motion: the card stays flat."
        : enabled
          ? "Pointer tilt active. Move across the card."
          : "Static card. Tilt needs a fine pointer.",
    );
  }

  function move(event: React.PointerEvent<HTMLDivElement>) {
    if (!enabled) return;
    const stage = stageRef.current;
    const card = cardRef.current;
    if (!stage || !card) return;
    const rect = stage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty("--tilt-y", `${(x * 16).toFixed(2)}deg`);
    card.style.setProperty("--tilt-x", `${(-y * 14).toFixed(2)}deg`);
  }

  return (
    <CraftStation
      station={station}
      poster={<PosterTilt />}
      live={live}
      status={status}
      controls={
        <>
          <button type="button" className="inst-btn" onClick={run}>
            {live ? "Run again" : "Run station"}
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
      <div
        className="craft-tilt"
        ref={stageRef}
        onPointerMove={move}
        onPointerLeave={centre}
        data-enabled={enabled}
      >
        <div className="craft-tilt-card" ref={cardRef} aria-hidden="true">
          <div className="craft-tilt-layer craft-tilt-back">
            <span>Layer 03 / shadow</span>
          </div>
          <div className="craft-tilt-layer craft-tilt-mid">
            <span>Layer 02 / accent</span>
          </div>
          <div className="craft-tilt-layer craft-tilt-front">
            <span className="craft-tilt-kicker">Institution / card 01</span>
            <strong>Depth is a decision.</strong>
            <span className="craft-tilt-copy">
              Three layers, two rotations, one pointer.
            </span>
            <span className="craft-tilt-rule" />
            <span className="craft-tilt-meta">Perspective 900 · Z 24 / 12 / 0</span>
          </div>
        </div>
        <p className="craft-tilt-note">
          {enabled
            ? "Move the pointer across the plate. Leave to recentre."
            : "Static card. A fine pointer is required for tilt."}
        </p>
      </div>
    </CraftStation>
  );
}
