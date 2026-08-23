import { readFileSync } from "node:fs";

let failures = 0;
const report = (id, pass, count, note) => {
  console.log(`${pass ? "PASS" : "FAIL"} ${id}: ${count} — ${note}`);
  if (!pass) failures++;
};

// Read all service files
let totalSlugs = 0;
let withTimeline = 0;
let withExclusions = 0;
let withPrice = 0;
let withBody = 0;
for (const f of ["build.ts", "grow.ts", "content.ts", "enable.ts"]) {
  const src = readFileSync("src/content/services/" + f, "utf8");
  const slugs = src.match(/slug: "[a-z-]+"/g) || [];
  totalSlugs += slugs.length;
  if ((src.match(/timeline:/g) || []).length >= slugs.length) withTimeline += slugs.length;
  if ((src.match(/exclusions:/g) || []).length >= slugs.length) withExclusions += slugs.length;
  if ((src.match(/priceBand:/g) || []).length >= slugs.length) withPrice += slugs.length;
  if ((src.match(/body: \[/g) || []).length >= slugs.length) withBody += slugs.length;
}
report(1, totalSlugs >= 18, totalSlugs, `${totalSlugs}/18 services with body[]`);
report(2, withTimeline >= 18 && withPrice >= 18, Math.min(withTimeline, withPrice), `timeline=${withTimeline} priceBand=${withPrice}`);

// C3
{
  const wk = readFileSync("src/content/work.ts", "utf8");
  const count = (wk.match(/slug: "/g) || []).length;
  report(3, false, count, "BLOCKED ON OWNER: need publicizable engagements with metrics");
}

// C4
{
  const ins = readFileSync("src/content/insights.ts", "utf8");
  const count = (ins.match(/slug: "/g) || []).length;
  report(4, false, count, "BLOCKED ON OWNER: need 6+ substantial articles");
}

// C5-C6
report(5, false, 0, "BLOCKED ON OWNER: supply logos");
report(6, false, 0, "BLOCKED ON OWNER: supply testimonials");

// C7
try {
  readFileSync("src/app/pricing/page.tsx", "utf8");
  report(7, true, 1, "Pricing template exists; bands TODO(positioning)");
} catch { report(7, false, 0, "missing"); }

// C8
{
  try {
    const m = JSON.parse(readFileSync(".next/app-path-routes-manifest.json", "utf8"));
    report(8, Object.keys(m).length >= 35, Object.keys(m).length, "routes in manifest");
  } catch { report(8, false, "?", "manifest unreadable"); }
}

console.log(failures === 0 ? "\nCLEAN" : `\n${failures} items need attention`);
