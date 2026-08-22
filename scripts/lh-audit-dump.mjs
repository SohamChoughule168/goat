import { readFileSync } from "node:fs";

const r = JSON.parse(readFileSync("./docs/lighthouse-home.json", "utf8"));
const a = r.audits["label-content-name-mismatch"];
console.log(JSON.stringify(a, null, 2).slice(0, 3000));
