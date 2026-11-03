import { describe, expect, it, vi } from "vitest";
import {
  DURATION,
  DURATION_MS,
  EASE,
  LIFT,
  MAX_STAGGER,
  MIN_STAGGER,
} from "@/lib/motion/tokens";
import {
  readMotionEnvironment,
  resolveMotionPolicy,
  shouldUseSmoothScroll,
} from "@/lib/motion/reduced-motion";

const desktop = {
  width: 1440,
  finePointer: true,
  reduced: false,
  webgl: true,
};

describe("motion tokens", () => {
  it("matches the approved easing grammar", () => {
    expect(EASE.entrance).toBe("cubic-bezier(.16, 1, .3, 1)");
    expect(EASE.state).toBe("cubic-bezier(.65, 0, .35, 1)");
  });

  it("matches the approved durations in seconds and milliseconds", () => {
    expect(DURATION.micro).toBe(0.18);
    expect(DURATION.ui).toBe(0.32);
    expect(DURATION.reveal).toBe(0.6);
    expect(DURATION.cinematic).toBe(0.9);
    expect(DURATION_MS).toEqual({ micro: 180, ui: 320, reveal: 600, cinematic: 900 });
  });

  it("keeps stagger and hover lift restrained", () => {
    expect(MIN_STAGGER).toBe(0.03);
    expect(MAX_STAGGER).toBe(0.08);
    expect(LIFT.hover).toBe(2);
  });
});

describe("motion policy", () => {
  it("enables the canvas, smooth scroll, pin, scrub and parallax on a capable desktop", () => {
    expect(resolveMotionPolicy(desktop)).toEqual({
      instrument: "canvas",
      smoothScroll: true,
      pin: true,
      scrub: true,
      parallax: true,
    });
  });

  it("returns the complete static experience for reduced motion", () => {
    expect(resolveMotionPolicy({ ...desktop, reduced: true })).toEqual({
      instrument: "static",
      smoothScroll: false,
      pin: false,
      scrub: false,
      parallax: false,
    });
  });

  it("keeps mobile on the static diagram even when WebGL is available", () => {
    const policy = resolveMotionPolicy({ ...desktop, width: 390, finePointer: false });
    expect(policy.instrument).toBe("static");
    expect(policy.smoothScroll).toBe(false);
    expect(policy.pin).toBe(false);
    expect(policy.scrub).toBe(false);
  });

  it("falls back to the static diagram when WebGL is unavailable", () => {
    const policy = resolveMotionPolicy({ ...desktop, webgl: false });
    expect(policy.instrument).toBe("static");
    expect(policy.smoothScroll).toBe(true);
    expect(policy.pin).toBe(true);
  });

  it("does not smooth-scroll coarse pointers", () => {
    expect(shouldUseSmoothScroll({ reduced: false, finePointer: false })).toBe(false);
    expect(shouldUseSmoothScroll({ reduced: true, finePointer: true })).toBe(false);
    expect(shouldUseSmoothScroll({ reduced: false, finePointer: true })).toBe(true);
  });
});

describe("motion environment", () => {
  it("reads reduced motion and pointer capability from matchMedia", () => {
    const matchMedia = vi.fn((query: string) => ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    expect(readMotionEnvironment({ matchMedia })).toEqual({
      reduced: true,
      finePointer: false,
    });
  });

  it("treats a missing browser environment as reduced and coarse", () => {
    expect(readMotionEnvironment(undefined)).toEqual({
      reduced: true,
      finePointer: false,
    });
  });
});
