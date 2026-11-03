"use client";

import type { ComponentType } from "react";
import { CRAFT_STATIONS, type CraftStation as CraftStationData } from "@/content/craft";
import CraftBoundary from "./craft-boundary";
import StationRoute from "./stations/station-01-route";
import StationBuildOrder from "./stations/station-02-build-order";
import StationExploded from "./stations/station-03-exploded";
import StationFilm from "./stations/station-04-film";
import StationScrub from "./stations/station-05-scrub";
import StationStateBridge from "./stations/station-06-state-bridge";
import StationTilt from "./stations/station-07-tilt";
import StationDial from "./stations/station-08-dial";
import StationRive from "./stations/station-09-rive";
import StationSpline from "./stations/station-10-spline";
import StationLedger from "./stations/station-11-ledger";

const STATIONS: Record<string, ComponentType<{ station: CraftStationData }>> = {
  "route-gate-budget": StationRoute,
  "build-order": StationBuildOrder,
  "exploded-study": StationExploded,
  "film-bench": StationFilm,
  "honest-scrub": StationScrub,
  "state-bridge": StationStateBridge,
  "tilt-plate": StationTilt,
  "calibration-dial": StationDial,
  "rive-state-machine": StationRive,
  "spline-scene": StationSpline,
  "adapted-ledger": StationLedger,
};

/**
 * The bench grid.
 *
 * Each station is wrapped in its own boundary: a failed renderer removes one
 * bench, not the page. Order comes from the content layer, never from this map.
 */
export default function CraftLab() {
  return (
    <div className="craft-bench-grid">
      {CRAFT_STATIONS.map((station) => {
        const Station = STATIONS[station.id];
        if (!Station) return null;

        return (
          <CraftBoundary key={station.id} index={station.index} title={station.title}>
            <Station station={station} />
          </CraftBoundary>
        );
      })}
    </div>
  );
}
