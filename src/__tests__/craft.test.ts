import { describe, expect, it } from "vitest";
import { CRAFT_STATIONS, CRAFT_STATS } from "@/content/craft";

const SKILLS = [
  "premium-creative-web-engineering",
  "3d-website-architect",
  "ai-ui-ux-motion-engine",
  "ai-ui-ux-motion-engine",
  "gsap-scrolltrigger",
  "web3d-integration-patterns",
  "lightweight-3d-effects",
  "lottie-animations",
  "rive-interactive",
  "spline-interactive",
  "animated-component-libraries",
];

describe("craft stations", () => {
  it("keeps eleven stations in the approved skill order", () => {
    expect(CRAFT_STATIONS).toHaveLength(11);
    expect(CRAFT_STATIONS.map((station) => station.skill)).toEqual(SKILLS);
    expect(CRAFT_STATIONS.map((station) => station.index)).toEqual([
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
    ]);
  });

  it("ships nine runnable stations and two labelled gaps", () => {
    const live = CRAFT_STATIONS.filter((station) => station.status === "live");
    const pending = CRAFT_STATIONS.filter((station) => station.status === "pending");

    expect(live).toHaveLength(CRAFT_STATS.live);
    expect(pending.map((station) => station.skill)).toEqual([
      "rive-interactive",
      "spline-interactive",
    ]);
    expect(CRAFT_STATS).toEqual({ stations: 11, live: 9, pending: 2 });
  });

  it("gives every station a unique id and a poster description", () => {
    const ids = CRAFT_STATIONS.map((station) => station.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const station of CRAFT_STATIONS) {
      expect(station.poster.trim().length).toBeGreaterThan(0);
    }
  });

  it("writes every field the station frame renders", () => {
    for (const station of CRAFT_STATIONS) {
      for (const value of [
        station.title,
        station.summary,
        station.detail,
        station.runtime,
        station.payload,
        station.fallback,
      ]) {
        expect(value.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("only marks a station pending when it explains the missing asset", () => {
    for (const station of CRAFT_STATIONS.filter((item) => item.status === "pending")) {
      expect(station.payload.toLowerCase()).toContain("not supplied");
      expect(station.pendingReason?.trim().length).toBeGreaterThan(0);
    }

    for (const station of CRAFT_STATIONS.filter((item) => item.status === "live")) {
      expect(station.pendingReason).toBeUndefined();
    }
  });

  it("keeps the bench grid balanced", () => {
    const spans = CRAFT_STATIONS.map((station) => station.span);
    expect(spans.filter((span) => span === "wide")).toHaveLength(2);
    expect(spans.filter((span) => span === "two-thirds")).toHaveLength(1);
    expect(spans.filter((span) => span === "half")).toHaveLength(4);
    expect(spans.filter((span) => span === "third")).toHaveLength(4);
  });

  it("replaces the R3F material bench with the film bench", () => {
    const film = CRAFT_STATIONS.find((station) => station.index === "04");
    expect(film?.id).toBe("film-bench");
    expect(film?.skill).toBe("ai-ui-ux-motion-engine");
    expect(film?.title).toBe("Film bench.");
    expect(film?.payload).toBe("≈2 MB, on run");
  });

  it("retires every R3F and homepage-Instrument reference", () => {
    expect(CRAFT_STATIONS.some((station) => station.skill === "react-three-fiber")).toBe(false);
    const serialized = JSON.stringify(CRAFT_STATIONS);
    expect(serialized).not.toContain("homepage Instrument");
    expect(serialized).not.toContain("R3F material bench");
  });
});
