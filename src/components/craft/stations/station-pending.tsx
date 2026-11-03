import type { ReactNode } from "react";
import type { CraftStation as CraftStationData } from "@/content/craft";
import CraftStation from "@/components/craft/craft-station";

/**
 * A station whose asset has not been authored.
 *
 * It ships the poster, the explanation and a disabled run control. There is no
 * hidden demo behind the button: the gap is the exhibit.
 */
export default function StationPending({
  station,
  poster,
}: {
  station: CraftStationData;
  poster: ReactNode;
}) {
  return (
    <CraftStation
      station={station}
      poster={poster}
      live={false}
      status="Asset pending. No runtime is loaded."
      controls={
        <button
          type="button"
          className="inst-btn"
          disabled
          aria-describedby={`station-${station.index}-pending`}
        >
          Run station
        </button>
      }
    />
  );
}
