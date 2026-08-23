import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const run = (cmd) => { void writeFileSync;
  try {
    return execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim().split("\n")[0];
  } catch {
    return "MISSING";
  }
};

console.log("playwright:", run("npx playwright --version"));
console.log("lighthouse:", run("npx lighthouse --version"));
let axe = "MISSING";
try {
  axe = JSON.parse(readFileSync("node_modules/@axe-core/playwright/package.json", "utf8")).version;
} catch {}
console.log("axe-core (@axe-core/playwright):", axe);
console.log("python:", run("python --version") !== "MISSING" ? run("python --version") : run("py --version"));
