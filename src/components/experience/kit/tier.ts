export type Tier = "high" | "balanced" | "lite";

export interface TierSettings {
  tier: Tier;
  /** Maximum device pixel ratio the canvas may use. */
  dprMax: number;
  /** Particle budget for dust fields. */
  dust: number;
  /** Real glass (transmission) is only enabled on capable devices. */
  glass: boolean;
  /** Soft shadows, only on capable devices. */
  shadows: boolean;
}

export interface DeviceSignals {
  reduced: boolean;
  coarse: boolean;
  cores: number;
}

export function deriveTier({ reduced, coarse, cores }: DeviceSignals): Tier {
  if (reduced) return "lite";
  if (coarse && cores <= 6) return "lite";
  if (!coarse && cores >= 8) return "high";
  return "balanced";
}

export function tierSettings(tier: Tier): TierSettings {
  switch (tier) {
    case "high":
      return { tier, dprMax: 1.75, dust: 1600, glass: true, shadows: true };
    case "balanced":
      return { tier, dprMax: 1.5, dust: 700, glass: false, shadows: false };
    case "lite":
      return { tier, dprMax: 1.25, dust: 260, glass: false, shadows: false };
  }
}
