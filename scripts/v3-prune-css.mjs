/**
 * V3 CSS pruner — removes top-level sections (`/* === ... === *\/` delimited)
 * whose title matches a retired-component pattern.
 *
 * Usage:
 *   node scripts/v3-prune-css.mjs           # dry run: list every section
 *   node scripts/v3-prune-css.mjs --write   # remove matched sections
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const WRITE = process.argv.includes("--write");

/** Section titles matching any of these are removed. */
const DROP = [
  /higgsfield/i,
  /mcp skills/i,
  /featured grid/i,
  /testimonial/i,
  /video scroll/i,
  /depth parallax/i,
  /scroll reveal grid/i,
  /premium features/i,
  /before\s*\/?\s*after/i,
  /image gallery/i,
  /image stack/i,
  /scroll synced/i,
  /infinite marquee/i,
  /split scroll/i,
  /pin section|pinned scroll/i,
  /gradient mesh/i,
  /text scramble/i,
  /glass\s?cards?/i,
  /apple showcase/i,
  /services bento|bento/i,
  /client portal/i,
  /portal dashboard/i,
  /premium footer/i,
];

const stylesDir = "src/styles";
const files = readdirSync(stylesDir).filter((f) => f.endsWith(".css"));

const HEADER = /\/\* ={10,}\r?\n[^\n]*?\n\s*=[^\n]*?\*\//g;
const TITLE_LINE = /\/\* ={10,}\r?\n([^\n]*)/;

let totalDropped = 0;
let totalBytes = 0;

for (const file of files) {
  const path = join(stylesDir, file);
  const text = readFileSync(path, "utf8");
  totalBytes += statSync(path).size;

  const headers = [...text.matchAll(HEADER)].map((m) => ({
    title: (m[0].match(TITLE_LINE)?.[1] ?? "").trim(),
    start: m.index,
  }));
  if (headers.length === 0) continue;

  const segments = [];
  // Preamble before the first header is always kept.
  segments.push({ title: "(preamble)", start: 0, end: headers[0].start, keep: true });
  headers.forEach((header, i) => {
    const end = i + 1 < headers.length ? headers[i + 1].start : text.length;
    const keep = !DROP.some((re) => re.test(header.title));
    segments.push({ title: header.title, start: header.start, end, keep });
  });

  const dropped = segments.filter((s) => !s.keep);
  if (dropped.length === 0) continue;

  console.log(`\n${file}`);
  for (const s of segments) {
    if (!s.keep) {
      const bytes = s.end - s.start;
      totalDropped += bytes;
      console.log(`  DROP  ${s.title}  (${(bytes / 1024).toFixed(1)} KB)`);
    } else if (process.argv.includes("--all")) {
      console.log(`  keep  ${s.title}`);
    }
  }

  if (WRITE) {
    const kept = segments
      .filter((s) => s.keep)
      .map((s) => text.slice(s.start, s.end))
      .join("");
    writeFileSync(path, kept, "utf8");
  }
}

console.log(
  `\n${WRITE ? "Removed" : "Would remove"} ${(totalDropped / 1024).toFixed(1)} KB of ${(
    totalBytes / 1024
  ).toFixed(1)} KB (${((totalDropped / totalBytes) * 100).toFixed(1)}%).`,
);
