const base = "https://goat-gfkfse1cz-sohamchoughule168s-projects.vercel.app";
const routes = [
  "/",
  "/about",
  "/services",
  "/services/build",
  "/services/web-development",
  "/services/talent-acquisition",
  "/work",
  "/work/prv-financial-services",
  "/insights",
  "/insights/generative-engine-optimization-guide",
  "/contact",
  "/legal/privacy",
  "/legal/terms",
  "/pricing",
  "/trust",
  "/process",
  "/faq",
  "/careers",
  "/estimate",
  "/design-system",
  "/sitemap.xml",
  "/robots.txt",
];
let pass = 0;
let fail = 0;
for (const r of routes) {
  try {
    const res = await fetch(base + r, { redirect: "follow" });
    const ok = res.status === 200;
    if (!ok) { console.log("FAIL " + res.status + " " + r); fail++; }
    else pass++;
  } catch (e) {
    console.log("ERR " + r + " -> " + e.message);
    fail++;
  }
}
console.log("\nROUTES: " + pass + "/" + (pass + fail) + " OK");

const home = await (await fetch(base + "/")).text();
const checks = [
  ["theme tokens", h => h.includes("--color-accent")],
  ["field system", h => h.includes("data-field") || h.includes(".field")],
  ["mega type", h => h.includes("mega")],
  ["capability graph", h => h.includes("capability") || h.includes("data-lines")],
  ["Geist Sans", h => h.includes("geist-sans") || h.includes("Geist")],
];
console.log("\nHOME CONTENT:");
for (const [label, fn] of checks)
  console.log((fn(home) ? "PASS" : "WARN") + " " + label);

// Verify staging and .com are untouched
console.log("\nCROSS-CHECK:");
{
  const s = await fetch("https://goat-wheat.vercel.app/");
  console.log("staging goat-wheat:", s.status, "(should be 200)");
}
{
  const p = await fetch("https://www.imaginarsclubservices.com/");
  const ph = await p.text();
  console.log(".com:", p.status, "unchanged:", !ph.includes("--color-accent-subtle"));
}
