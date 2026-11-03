/**
 * The Institutional Instrument motion grammar: Index → Assemble → Verify.
 *
 * These values are the single source of truth for JavaScript-driven motion.
 * The CSS counterparts live in `src/styles/institutional.css`.
 */

export const EASE = {
  /** Entrances and reveals. */
  entrance: "cubic-bezier(.16, 1, .3, 1)",
  /** State changes and control feedback. */
  state: "cubic-bezier(.65, 0, .35, 1)",
  /** Scrubbed timelines only. */
  linear: "none",
} as const;

/** GSAP durations are expressed in seconds. */
export const DURATION = {
  micro: 0.18,
  ui: 0.32,
  reveal: 0.6,
  cinematic: 0.9,
} as const;

/** CSS and non-GSAP durations are expressed in milliseconds. */
export const DURATION_MS = {
  micro: 180,
  ui: 320,
  reveal: 600,
  cinematic: 900,
} as const;

/** Seconds between staggered items. Use sparingly. */
export const MIN_STAGGER = 0.03;
export const MAX_STAGGER = 0.08;

/** Hover movement in pixels. No scale-pop. */
export const LIFT = {
  hover: 2,
} as const;

export const MOTION_QUERY = "(prefers-reduced-motion: reduce)";
export const FINE_POINTER_QUERY = "(pointer: fine)";
