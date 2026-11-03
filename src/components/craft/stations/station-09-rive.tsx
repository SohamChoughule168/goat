import type { CraftStation as CraftStationData } from "@/content/craft";
import { PosterRive } from "@/components/craft/station-posters";
import StationPending from "./station-pending";

export default function StationRive({ station }: { station: CraftStationData }) {
  return <StationPending station={station} poster={<PosterRive />} />;
}
