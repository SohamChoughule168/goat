export const FORGE = {
  ember: "#ff6a5c",
  current: "#4fc3ff",
  creation: "#e879c8",
  gold: "#e0b64f",
  indigo: "#6a5cff",
} as const;

export const PILLAR_HUES: Record<string, string> = {
  build: FORGE.current,
  grow: FORGE.ember,
  content: FORGE.creation,
  enable: FORGE.gold,
};

export const CHAPTER_HUE_SHIFT: Record<string, number> = {
  hero: 0,
  capabilities: 42,
  work: -38,
  process: 14,
  final: 0,
};
