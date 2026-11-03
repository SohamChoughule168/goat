"use client";

import { useState } from "react";
import type { CraftStation as CraftStationData } from "@/content/craft";
import { CRAFT_LEDGER } from "@/content/craft";
import CraftStation from "@/components/craft/craft-station";
import { PosterLedger } from "@/components/craft/station-posters";

export default function StationLedger({
  station,
}: {
  station: CraftStationData;
}) {
  const [live, setLive] = useState(false);
  const [runId, setRunId] = useState(0);
  const [status, setStatus] = useState("Static ledger. Five rows, no entrance.");

  function run() {
    setLive(true);
    setRunId((value) => value + 1);
    setStatus("Five rows entering on one stagger.");
  }

  function reset() {
    setLive(false);
    setStatus("Static ledger restored.");
  }

  return (
    <CraftStation
      station={station}
      poster={<PosterLedger />}
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
      <div className="craft-ledger" key={runId}>
        <p className="craft-ledger-head">Adapted list / enter once / 180 ms</p>
        <ol className="craft-ledger-list">
          {CRAFT_LEDGER.map((row, index) => (
            <li
              key={row.label}
              className="craft-ledger-row"
              style={{ animationDelay: `${index * 0.18}s` }}
            >
              <span className="craft-ledger-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="craft-ledger-label">{row.label}</span>
              <span className="craft-ledger-value">{row.value}</span>
              <span className="craft-ledger-note">{row.note}</span>
            </li>
          ))}
        </ol>
        <p className="craft-ledger-foot">
          Blur removed · spring removed · layout animation removed
        </p>
      </div>
    </CraftStation>
  );
}
