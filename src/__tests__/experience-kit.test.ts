import { describe, expect, it, vi } from "vitest";
import { hashString, mulberry32 } from "@/components/experience/kit/random";
import { deriveTier, tierSettings } from "@/components/experience/kit/tier";
import { emitSignal, onSignal } from "@/components/experience/kit/bus";

describe("deterministic random", () => {
  it("mulberry32 is reproducible for a given seed", () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    for (let i = 0; i < 20; i += 1) {
      expect(a()).toBe(b());
    }
  });

  it("mulberry32 differs across seeds and stays in [0, 1)", () => {
    const a = mulberry32(1);
    const b = mulberry32(2);
    expect(a()).not.toBe(b());
    const rand = mulberry32(99);
    for (let i = 0; i < 50; i += 1) {
      const value = rand();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it("hashString is stable and distinguishes inputs", () => {
    expect(hashString("mobile-apps")).toBe(hashString("mobile-apps"));
    expect(hashString("mobile-apps")).not.toBe(hashString("web-platforms"));
  });
});

describe("device tier", () => {
  it("reduced motion forces the lite tier", () => {
    expect(deriveTier({ reduced: true, coarse: false, cores: 16 })).toBe("lite");
  });

  it("classifies budgets", () => {
    expect(deriveTier({ reduced: false, coarse: true, cores: 4 })).toBe("lite");
    expect(deriveTier({ reduced: false, coarse: false, cores: 4 })).toBe("balanced");
    expect(deriveTier({ reduced: false, coarse: false, cores: 8 })).toBe("high");
    expect(deriveTier({ reduced: false, coarse: true, cores: 8 })).toBe("balanced");
  });

  it("lite tier disables heavy features", () => {
    const lite = tierSettings("lite");
    expect(lite.glass).toBe(false);
    expect(lite.shadows).toBe(false);
    expect(lite.dprMax).toBeLessThan(tierSettings("high").dprMax);
  });
});

describe("signal bus", () => {
  it("delivers events and honors unsubscribe", () => {
    const handler = vi.fn();
    const off = onSignal(handler);
    emitSignal("signal:focus");
    expect(handler).toHaveBeenCalledWith("signal:focus", undefined);
    off();
    emitSignal("signal:error", "boom");
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
