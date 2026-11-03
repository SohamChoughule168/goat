import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { readdirSync } from "node:fs";

const src = "src";
const config = readFileSync("next.config.ts", "utf8");
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const allDeps = {
  ...(pkg.dependencies || {}),
  ...(pkg.devDependencies || {}),
};

describe("no 3D", () => {
  it("has no three/react-three dependencies", () => {
    const threeDeps = Object.keys(allDeps).filter((d) =>
      /three|@react-three|tunnel-rat|glslify|postprocessing|vite-plugin-glsl|zustand/.test(d),
    );
    expect(threeDeps).toEqual([]);
  });

  it("has no GLSL turbopack rules", () => {
    expect(config).not.toContain("glsl-loader");
    expect(config).not.toContain("*.{glsl,vert,frag}");
  });

  it("has no three webpack chunk", () => {
    expect(config).not.toContain("three|@react-three");
  });

  it("has no WebGL canvas in the component tree", () => {
    const glFiles = readdirSync(src, { recursive: true }).filter(
      (f): f is string => typeof f === "string" && (f.endsWith(".tsx") || f.endsWith(".ts")),
    );
    const threeImports = glFiles.filter((f) => {
      const content = readFileSync(`src/${f}`, "utf8");
      return /from ["']three["']|from ["']@react-three["']|from ["']tunnel-rat["']/.test(
        content,
      );
    });
    expect(threeImports).toEqual([]);
  });
});
