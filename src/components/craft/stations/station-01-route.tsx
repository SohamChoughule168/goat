"use client";

import { useState } from "react";
import type { CraftStation as CraftStationData } from "@/content/craft";
import CraftStation from "@/components/craft/craft-station";
import { PosterRoute } from "@/components/craft/station-posters";

const GATES = [
  {
    index: "01",
    title: "Route",
    note: "Static export, one canonical, trailing slash resolved at the host.",
  },
  {
    index: "02",
    title: "Render",
    note: "Server HTML first. Canvas only after an idle callback and a probe.",
  },
  {
    index: "03",
    title: "Budget",
    note: "Chunk, LCP, CLS and TBT measured before a single effect is added.",
  },
  {
    index: "04",
    title: "Verify",
    note: "Axe, keyboard, reduced motion, console. A failed gate stops the build.",
  },
];

export default function StationRoute({ station }: { station: CraftStationData }) {
  const [live, setLive] = useState(false);
  const [runId, setRunId] = useState(0);
  const [status, setStatus] = useState("Static route. Four gates, no token.");

  function run() {
    setLive(true);
    setRunId((value) => value + 1);
    setStatus("Token running: four gates in sequence.");
  }

  function reset() {
    setLive(false);
    setStatus("Static route restored.");
  }

  return (
    <CraftStation
      station={station}
      poster={<PosterRoute />}
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
      <div className="craft-route" key={runId}>
        <div className="craft-route-bar" aria-hidden="true">
          <span />
        </div>
        <ol className="craft-gates">
          {GATES.map((gate) => (
            <li key={gate.index} className="craft-gate">
              <span className="craft-gate-index" aria-hidden="true">
                {gate.index}
              </span>
              <span className="craft-gate-title">{gate.title}</span>
              <span className="craft-gate-note">{gate.note}</span>
              <span className="craft-gate-state">Pass</span>
            </li>
          ))}
        </ol>
      </div>
    </CraftStation>
  );
}
