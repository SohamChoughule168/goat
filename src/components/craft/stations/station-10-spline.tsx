import type { CraftStation as CraftStationData } from "@/content/craft";
import { PosterSpline } from "@/components/craft/station-posters";
import StationPending from "./station-pending";

export default function StationSpline({ station }: { station: CraftStationData }) {
  return <StationPending station={station} poster={<PosterSpline />} />;
}
