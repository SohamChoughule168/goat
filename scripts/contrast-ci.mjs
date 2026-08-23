/* Contrast CI - independent JS port of palette.py's WCAG verification.
   Reads src/styles/tokens.css, recomputes every semantic pairing in both
   modes, and exits non-zero on any failure below target. */

import { readFileSync } from "node:fs";

const css = readFileSync("src/styles/tokens.css", "utf8");

function block(fromMarker) {
  const start = css.indexOf(fromMarker);
  if (start === -1) throw new Error("contrast-ci: marker not found: " + fromMarker);
  const open = css.indexOf("{", start);
  const close = css.indexOf("}", open);
  const body = css.slice(open + 1, close);
  const out = {};
  for (const m of body.matchAll(/--color-([a-z-]+):\s*(#[0-9A-Fa-f]{6})/g)) {
    out[m[1]] = m[2];
  }
  return out;
}

const LIGHT = block(':root, [data-theme="light"]');
const DARK = block('[data-theme="dark"]');

function luminance(hex) {
  const h = hex.replace("#", "");
  const lin = (c) => {
    c = parseInt(c, 16) / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const r = lin(h.slice(0, 2));
  const g = lin(h.slice(2, 4));
  const b = lin(h.slice(4, 6));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(fgHex, bgHex) {
  const a = luminance(fgHex);
  const b = luminance(bgHex);
  const hi = Math.max(a, b);
  const lo = Math.min(a, b);
  return (hi + 0.05) / (lo + 0.05);
}

const PAIRS = [
  ["text", "bg", 4.5],
  ["text", "surface", 4.5],
  ["text", "surface-raised", 4.5],
  ["text-muted", "bg", 4.5],
  ["text-muted", "surface", 4.5],
  ["text-subtle", "bg", 4.5],
  ["text-subtle", "surface", 4.5],
  ["accent", "bg", 4.5],
  ["accent", "surface", 4.5],
  ["accent-hover", "bg", 4.5],
  ["accent-fg", "accent", 4.5],
  ["accent-fg", "accent-hover", 4.5],
  ["border-hairline", "bg", 1.0],
  ["border", "bg", 1.0],
  ["border-interactive", "bg", 3.0],
  ["border-interactive", "surface", 3.0],
  ["focus-ring", "bg", 3.0],
  ["focus-ring", "surface", 3.0],
  ["success", "bg", 4.5],
  ["warning", "bg", 4.5],
  ["danger", "bg", 4.5],
  ["success", "surface", 4.5],
  ["warning", "surface", 4.5],
  ["danger", "surface", 4.5],
  ["accent", "accent-subtle", 4.5],
  ["text", "accent-subtle", 4.5],
];

let failures = 0;
let passCount = 0;

for (const [mode, tokens] of [
  ["LIGHT", LIGHT],
  ["DARK", DARK],
]) {
  console.log("=== " + mode + " MODE (" + Object.keys(tokens).length + " tokens) ===");
  for (const [fg, bg, target] of PAIRS) {
    if (!tokens[fg] || !tokens[bg]) {
      console.log("FAIL missing token: " + fg + " on " + bg);
      failures++;
      continue;
    }
    const ratio = contrast(tokens[fg], tokens[bg]);
    const ok = ratio >= target;
    if (!ok) failures++;
    else passCount++;
    console.log(
      (ok ? "PASS" : "FAIL") +
        "  " +
        fg.padEnd(20) +
        " on " +
        bg.padEnd(18) +
        " " +
        ratio.toFixed(2) +
        ":1  need " +
        target
    );
  }
}

// Cross-check five numbers quoted in design-spec-v3.md section 3.
const SPEC_CHECKS = [
  ["LIGHT", "text", "bg", 19.07],
  ["LIGHT", "accent", "bg", 4.89],
  ["DARK", "accent", "bg", 7.65],
  ["DARK", "text-subtle", "surface", 4.69],
  ["LIGHT", "accent", "accent-subtle", 4.63],
];
for (const [mode, fg, bg, expected] of SPEC_CHECKS) {
  const tokens = mode === "LIGHT" ? LIGHT : DARK;
  const actual = Number(contrast(tokens[fg], tokens[bg]).toFixed(2));
  if (Math.abs(actual - expected) > 0.02) {
    console.log(
      "FAIL spec mismatch " + mode + " " + fg + " on " + bg + ": expected " + expected + " got " + actual
    );
    failures++;
  } else {
    console.log(
      "PASS spec " + mode + " " + fg + " on " + bg + " = " + actual + ":1 (spec " + expected + ")"
    );
  }
}

console.log("---");
console.log("pairings passed: " + passCount + "/" + PAIRS.length + " per mode");
if (failures > 0) {
  console.error("contrast-ci: " + failures + " failure(s)");
  process.exit(1);
}
