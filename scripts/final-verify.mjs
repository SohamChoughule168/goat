const base = "https://goat-ok6rfjy2t-sohamchoughule168s-projects.vercel.app";
const routes = [
  "/", "/about", "/services", "/services/build", "/services/grow",
  "/services/web-development", "/work", "/work/prv-financial-services",
  "/insights", "/contact", "/pricing", "/trust", "/process",
  "/faq", "/careers", "/legal/privacy", "/legal/terms",
];
let pass = 0, fail = 0;
for (const r of routes) {
  try {
    const res = await fetch(base + r);
    if (res.status === 200) pass++;
    else { console.log("FAIL " + res.status + " " + r); fail++; }
  } catch { fail++; }
}
console.log("ROUTES: " + pass + "/" + routes.length);

const home = await (await fetch(base + "/")).text();
console.log("has console panel:", home.includes("console-panel"));
console.log("has imagination engine:", home.includes("absolute inset-0 overflow-hidden"));
console.log("has micro eyebrow:", home.includes("ImaginarsClub Services"));

const staging = await fetch("https://goat-wheat.vercel.app/");
const sh = await staging.text();
console.log("staging goat-wheat:", staging.status, "| dark build:", sh.includes("--font-satoshi") || sh.includes("display-2") ? "yes" : "unknown");

const prod = await fetch("https://www.imaginarsclubservices.com/");
const ph = await prod.text();
console.log(".com:", prod.status, "unchanged:", !ph.includes("--color-accent-subtle") && !ph.includes("data-theme"));
