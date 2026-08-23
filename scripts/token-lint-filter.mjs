import { readFileSync } from "node:fs";

const allow = JSON.parse(readFileSync("scripts/token-lint-allowlist.json", "utf8"));
const violations = JSON.parse(process.argv[2] || "[]");

const remaining = violations.filter(
  (v) => !allow.includes(v.file + ":" + v.rule) && !allow.includes(v.file + ":*")
);
for (const v of remaining)
  console.error("  [" + v.rule + "] " + v.file + " -> " + v.match);
process.exit(remaining.length === 0 ? 0 : 1);
