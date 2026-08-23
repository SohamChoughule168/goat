const base = "https://goat-rgjgi4tbl-sohamchoughule168s-projects.vercel.app";
const routes = [
  "/", "/about", "/services", "/services/build", "/services/web-development",
  "/work", "/work/prv-financial-services", "/insights",
  "/insights/generative-engine-optimization-guide", "/contact",
  "/pricing", "/process", "/trust", "/faq", "/careers",
  "/legal/privacy", "/legal/terms", "/sitemap.xml", "/robots.txt",
];
let pass = 0, fail = 0;
for (const r of routes) {
  try {
    const res = await fetch(base + r);
    if (res.status === 200) pass++;
    else { console.log("FAIL " + res.status + " " + r); fail++; }
  } catch (e) { console.log("ERR " + r); fail++; }
}
console.log("ROUTES: " + pass + "/" + routes.length);

const home = await (await fetch(base + "/")).text();
for (const m of ["--blue:", "micro", "btn-primary"]) {
  console.log((home.includes(m) ? "PASS" : "FAIL") + " " + m);
}

const staging = await fetch("https://goat-wheat.vercel.app/");
console.log("staging goat-wheat:", staging.status);

const prod = await fetch("https://www.imaginarsclubservices.com/");
const prodHtml = await prod.text();
console.log(".com:", prod.status, "unchanged:", !prodHtml.includes("--color-accent-subtle"));
