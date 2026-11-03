import { FINE_POINTER_QUERY, MOTION_QUERY } from "@/lib/motion/tokens";

export interface MotionEnvironment {
  reduced: boolean;
  finePointer: boolean;
}

export interface MotionSignals extends MotionEnvironment {
  /** Viewport width in CSS pixels. */
  width: number;
  /** Whether a WebGL context can be created at runtime. */
  webgl: boolean;
}

export interface MotionPolicy {
  /** Canvas only when the device, motion preference and WebGL all allow it. */
  instrument: "canvas" | "static";
  smoothScroll: boolean;
  pin: boolean;
  scrub: boolean;
  parallax: boolean;
}

interface MatchMediaLike {
  matchMedia(query: string): { matches: boolean };
}

/**
 * Safe to call during SSR and in tests: a missing browser environment is
 * reported as reduced-motion and coarse-pointer, the most conservative state.
 */
export function readMotionEnvironment(
  win: MatchMediaLike | undefined = typeof window === "undefined" ? undefined : window,
): MotionEnvironment {
  if (!win) return { reduced: true, finePointer: false };

  return {
    reduced: win.matchMedia(MOTION_QUERY).matches,
    finePointer: win.matchMedia(FINE_POINTER_QUERY).matches,
  };
}

export function getMotionEnvironment(): MotionEnvironment {
  return readMotionEnvironment();
}

/**
 * Resolve the single motion policy every component reads from. Mobile,
 * reduced motion and WebGL failure all receive the static experience.
 */
export function resolveMotionPolicy({
  width,
  finePointer,
  reduced,
  webgl,
}: MotionSignals): MotionPolicy {
  if (reduced) {
    return {
      instrument: "static",
      smoothScroll: false,
      pin: false,
      scrub: false,
      parallax: false,
    };
  }

  const desktop = width >= 1024;
  const staticInstrument = !desktop || !finePointer || !webgl;

  return {
    instrument: staticInstrument ? "static" : "canvas",
    smoothScroll: finePointer,
    pin: desktop,
    scrub: desktop,
    parallax: desktop && finePointer,
  };
}

/** Lenis is only allowed on fine-pointer devices without reduced motion. */
export function shouldUseSmoothScroll({ reduced, finePointer }: MotionEnvironment): boolean {
  return !reduced && finePointer;
}
