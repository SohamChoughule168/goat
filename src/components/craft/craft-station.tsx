import type { ReactNode } from "react";
import type { CraftStation as CraftStationData } from "@/content/craft";

interface CraftStationProps {
  station: CraftStationData;
  poster: ReactNode;
  live: boolean;
  status: string;
  controls: ReactNode;
  children?: ReactNode;
  tone?: "light" | "dark";
}

/**
 * One bench in the workshop.
 *
 * The poster and the live panel occupy the same fixed-aspect stage, so
 * activating a station can never move the page. Every station owns its own
 * controls and status; the frame only lays them out.
 */
export default function CraftStation({
  station,
  poster,
  live,
  status,
  controls,
  children,
  tone = "light",
}: CraftStationProps) {
  const pending = station.status === "pending";

  return (
    <article
      className="craft-station"
      id={`station-${station.index}`}
      data-span={station.span}
      data-status={station.status}
      data-tone={tone}
    >
      <header className="craft-station-head">
        <span className="craft-station-index" aria-hidden="true">
          {station.index}
        </span>
        <div className="craft-station-heading">
          <p className="craft-station-skill">{station.skill}</p>
          <h2 className="craft-station-title">{station.title}</h2>
        </div>
        <span className="craft-station-badge" data-state={station.status}>
          {pending ? "Asset pending" : "Live"}
        </span>
      </header>

      <div className="craft-stage" data-live={live} data-pending={pending}>
        <div className="craft-poster">{poster}</div>
        {live ? <div className="craft-live">{children}</div> : null}
      </div>

      <p className="craft-figure">
        <span>Fig. {station.index}</span>
        {station.poster}
      </p>

      <div className="craft-copy">
        <p className="craft-summary">{station.summary}</p>
        <p className="craft-detail">{station.detail}</p>
        {pending && station.pendingReason ? (
          <p className="craft-pending" id={`station-${station.index}-pending`}>
            <span>Gap</span>
            {station.pendingReason}
          </p>
        ) : null}
      </div>

      <dl className="craft-meta">
        <div>
          <dt>Runtime</dt>
          <dd>{station.runtime}</dd>
        </div>
        <div>
          <dt>Cost</dt>
          <dd>{station.payload}</dd>
        </div>
        <div>
          <dt>Fallback</dt>
          <dd>{station.fallback}</dd>
        </div>
      </dl>

      <div className="craft-station-foot">
        <div className="craft-controls">{controls}</div>
        <p className="craft-status" aria-live="polite">
          {status}
        </p>
      </div>
    </article>
  );
}
