import { readFileSync } from "node:fs";

const sv = readFileSync("src/content/services.ts", "utf8");
const services = [...sv.matchAll(/slug: "([a-z-]+)"([\s\S]*?)(?=\n  \{\n    slug:|\n\];)/g)].map(
  (m) => ({ slug: m[1], block: m[2] })
);

console.log("SERVICES:", services.length);
for (const { slug, block } of services) {
  const has = (re) => re.test(block);
  const fields = {
    description: has(/description: "/),
    deliverables: (block.match(/deliverables/) ? (block.split("deliverables")[1]?.match(/"/g) || []).length / 2 : 0),
    faqs: (block.split("faqs:")[1]?.match(/\{ q:/g) || []).length,
    legacySlugs: has(/legacySlugs: \[[^\]]+\]/),
  };
  console.log(
    `${slug.padEnd(34)} desc=${fields.description ? "Y" : "N"} deliverables=${fields.deliverables} faqs=${fields.faqs}`
  );
}

console.log("\nSERVICE DESCRIPTION WORD COUNTS:");
let totalDescWords = 0;
for (const m of sv.matchAll(/description: "([^"]+)"/g)) {
  const w = m[1].split(/\s+/).length;
  totalDescWords += w;
}
console.log("avg desc words:", Math.round(totalDescWords / services.length));

const ins = readFileSync("src/content/insights.ts", "utf8");
console.log("\nINSIGHTS:", [...ins.matchAll(/slug: "([a-z-]+)"/g)].length, "articles");
for (const a of ins.matchAll(/slug: "([a-z-]+)"([\s\S]*?)(?=\n  \{\n    slug:|\n\];)/g)) {
  const bodyWords = (a[2].match(/\b[A-Za-z']+\b/g) || []).length;
  console.log(`  ${a[1]}: ~${bodyWords} words`);
}

const wk = readFileSync("src/content/work.ts", "utf8");
console.log("\nCASE STUDIES:", [...wk.matchAll(/slug: "/g)].length);
