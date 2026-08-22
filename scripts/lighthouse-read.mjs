import { readFileSync } from "node:fs";

const r = JSON.parse(readFileSync("./docs/lighthouse-home.json", "utf8"));

for (const k of [
  "first-contentful-paint",
  "largest-contentful-paint",
  "total-blocking-time",
  "cumulative-layout-shift",
  "speed-index",
]) {
  const a = r.audits[k];
  if (a) console.log(a.id + ": " + (a.displayValue || a.score));
}

console.log("\n-- performance opportunities (by wasted ms) --");
Object.values(r.audits)
  .filter((a) => a.details && a.details.type === "opportunity" && a.details.overallSavingsMs > 0)
  .sort((a, b) => b.details.overallSavingsMs - a.details.overallSavingsMs)
  .slice(0, 8)
  .forEach((a) => console.log(a.id + ": ~" + Math.round(a.details.overallSavingsMs) + "ms"));

console.log("\n-- accessibility items scoring <1 --");
for (const ref of r.categories.accessibility.auditRefs) {
  const a = r.audits[ref.id];
  if (a && a.score !== null && a.score < 1) {
    console.log(a.id + ": score=" + a.score + " — " + a.title);
    if (a.details && a.details.items)
      for (const it of a.details.items.slice(0, 3))
        console.log("   -> " + (it.node && it.node.selector ? it.node.selector : it.node?.snippet || ""));
  }
}
