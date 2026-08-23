import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOTS = ["src/components", "src/app"];
const EXT = new Set([".tsx", ".ts"]);
const allowRaw = JSON.parse(
  readFileSync("scripts/token-lint-allowlist.json", "utf8")
);

const HEX = /#[0-9a-fA-F]{3,8}\b/g;
const FUNC = /\b(rgb|rgba|hsl|hsla|oklch|oklab)\(/g;
const PX = /(?<!ring-)(?<!tracking-)\[(\d+(?:\.\d+)?)px\]/g;
const ON_SCALE_PX = new Set([
  1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 40, 48, 56, 64,
  72, 80, 96, 112, 128, 144,
]);

function* walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    const st = statSync(p);
    if (st.isDirectory()) yield* walk(p);
    else if (EXT.has(e.slice(e.lastIndexOf(".")))) yield p;
  }
}

const violations = [];

for (const root of ROOTS) {
  for (const file of walk(root)) {
    const rel = file.replace(/\\/g, "/");
    const src = readFileSync(file, "utf8");

    const hexKey = rel + ":hex";
        for (const m of src.matchAll(HEX)) {
      if (!allowRaw.includes(hexKey))
        violations.push({ file: rel, rule: "hex", match: m[0] });
    }

    for (const m of src.matchAll(FUNC)) {
      const key = rel + ":" + m[1];
      if (!allowRaw.includes(key) && !allowRaw.includes(rel + ":*"))
        violations.push({ file: rel, rule: m[1], match: m[0] });
    }

    if (!rel.endsWith("layout.tsx")) {
      const pxKey = rel + ":px";
      for (const m of src.matchAll(PX)) {
        const v = Number(m[1]);
        if (ON_SCALE_PX.has(v)) continue;
        if (allowRaw.includes(pxKey) || allowRaw.includes(rel + ":*")) continue;
        violations.push({ file: rel, rule: "px", match: m[0] });
      }
    }
  }
}

if (violations.length) {
  console.error("token-lint violations (" + violations.length + "):");
  for (const v of violations)
    console.error("  [" + v.rule + "] " + v.file + " -> " + v.match);
  process.exit(1);
}
console.log("token-lint: clean");
