"use client";

import { useState } from "react";
import type { CraftStation as CraftStationData } from "@/content/craft";
import CraftStation from "@/components/craft/craft-station";
import { PosterBuildOrder } from "@/components/craft/station-posters";

const LAYERS = [
  { index: "01", title: "Intent", note: "What the scene must prove, and what it must never imply." },
  { index: "02", title: "Graph", note: "Named parts. One owner per transform." },
  { index: "03", title: "Camera", note: "Framing fixed in code. No orbit by default." },
  { index: "04", title: "Material", note: "Flat palette. Lighting is not a design system." },
  { index: "05", title: "Performance", note: "Demand frames, capped DPR, lazy chunk." },
  { index: "06", title: "Fallback", note: "Poster first. Canvas only after a probe." },
];

export default function StationBuildOrder({
  station,
}: {
  station: CraftStationData;
}) {
  const [live, setLive] = useState(false);
  const [runId, setRunId] = useState(0);
  const [status, setStatus] = useState("Static stack. Six layers, no scene.");

  function run() {
    setLive(true);
    setRunId((value) => value + 1);
    setStatus("Resolving the stack from the floor up.");
  }

  function reset() {
    setLive(false);
    setStatus("Static stack restored.");
  }

  return (
    <CraftStation
      station={station}
      poster={<PosterBuildOrder />}
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
      <div className="craft-build" key={runId}>
        <ol className="craft-build-list">
          {LAYERS.map((layer) => (
            <li key={layer.index} className="craft-build-row">
              <span className="craft-build-slab" aria-hidden="true" />
              <span className="craft-build-index" aria-hidden="true">
                {layer.index}
              </span>
              <span className="craft-build-title">{layer.title}</span>
              <span className="craft-build-note">{layer.note}</span>
            </li>
          ))}
        </ol>
        <p className="craft-build-log">06 / 06 resolved · fallback designed first</p>
      </div>
    </CraftStation>
  );
}
