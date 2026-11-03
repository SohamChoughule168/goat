import type { TierSettings } from "./tier";

export interface SceneProps {
  /** Route parameter for detail pages (case-study slug, service slug, insight slug). */
  param?: string;
  /** Rendering budget derived from the device. */
  settings: TierSettings;
  /** prefers-reduced-motion — scenes must render one calm, static frame. */
  reduced: boolean;
}
