import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const config = readFileSync("next.config.ts", "utf8");
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const allDeps = {
  ...(pkg.dependencies || {}),
  ...(pkg.devDependencies || {}),
};

describe("3D and motion stack hygiene", () => {
  it("includes three and type definitions in package.json", () => {
    expect(allDeps["three"]).toBeDefined();
    expect(allDeps["@types/three"]).toBeDefined();
  });

  it("has clean Turbopack configuration without legacy loaders", () => {
    expect(config).not.toContain("glsl-loader");
  });

  it("verifies ThreeProvider calls renderer.render and manages lifecycle", () => {
    const provider = readFileSync("src/components/premium/ThreeProvider.tsx", "utf8");
    expect(provider).toContain("registerCanvas");
    expect(provider).toContain("renderer.render(scene, camera)");
    expect(provider).toContain("webglcontextlost");
  });
});
