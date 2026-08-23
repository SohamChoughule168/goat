import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

// 1. Check which components exist and their sizes
console.log("=== COMPONENTS ===");
function ls(dir, prefix = "") {
  try {
    for (const e of readdirSync(dir)) {
      const p = join(dir, e);
      if (statSync(p).isDirectory()) { if (!e.includes("node_modules")) ls(p, prefix); }
      else console.log(prefix + e, statSync(p).size + "b");
    }
  } catch {}
}
ls("src/components/home");
ls("src/components/layout");

// 2. Route inventory from file system
console.log("\n=== ROUTES ===");
const appDir = "src/app";
const routes = new Set();
(function scan(dir, prefix) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) {
      const name = e.replace(/\[.*\]/, ":param");
      scan(p, prefix + "/" + name);
    } else if (e === "page.tsx") routes.add(prefix || "/");
  }
})(appDir, "");
[...routes].sort().forEach(r => console.log(r));

// 3. Hardcoded colors outside tokens
console.log("\n=== HARDCODED COLORS IN TSX ===");
for (const dir of ["src/components", "src/app"]) {
  try {
    for (const e of readdirSync(dir, { recursive: true })) {
      const p = join(dir, e.toString());
      if (!p.endsWith(".tsx")) continue;
      const src = readFileSync(p, "utf8");
      const hexes = src.match(/#[0-9a-fA-F]{6}\b/g);
      if (hexes && !p.includes("opengraph")) console.log(p.replace(/\\/g, "/"), "->", [...new Set(hexes)].join(","));
    }
  } catch {}
}

// 4. Current CSS custom properties used
console.log("\n=== CSS FILES ===");
for (const f of ["src/styles/tokens.css", "src/app/design-tokens.css", "src/styles/transitional.css", "src/styles/compat.css"]) {
  const s = readFileSync(f, "utf8");
  console.log(f, s.length + " bytes");
}
