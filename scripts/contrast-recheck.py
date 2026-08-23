#!/usr/bin/env python3
"""Independent re-check: read hexes back out of tokens.css, recompute contrast,
compare against the numbers written into design-spec-v3.md."""
import re

def lum(h):
    h = h.lstrip('#')
    def lin(c):
        c = int(c, 16) / 255
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = (lin(h[i:i + 2]) for i in (0, 2, 4))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

def cr(a, b):
    la, lb = lum(a), lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)

css = open('src/styles/tokens.css').read()
light_block = re.search(r':root, \[data-theme="light"\] \{(.*?)\n\}', css, re.S).group(1)
dark_block = re.search(r'\[data-theme="dark"\] \{(.*?)\n\}', css, re.S).group(1)

def parse(block):
    return dict(re.findall(r'--color-([a-z-]+):\s*(#[0-9A-Fa-f]{6})', block))

L, D = parse(light_block), parse(dark_block)
print(f"parsed {len(L)} light tokens, {len(D)} dark tokens")
assert set(L) == set(D), f"token sets differ: {set(L) ^ set(D)}"

rows = [
    ("text", "bg", 4.5), ("text", "surface", 4.5), ("text-muted", "surface", 4.5),
    ("text-subtle", "surface", 4.5), ("accent", "bg", 4.5), ("accent-fg", "accent", 4.5),
    ("accent", "accent-subtle", 4.5), ("border-interactive", "surface", 3.0),
    ("focus-ring", "bg", 3.0), ("success", "surface", 4.5), ("warning", "surface", 4.5),
    ("danger", "surface", 4.5),
]
print(f"\n{'pairing':<34}{'LIGHT':>9}{'DARK':>9}   target  verdict")
bad = 0
for fg, bg, t in rows:
    l, d = cr(L[fg], L[bg]), cr(D[fg], D[bg])
    ok = l >= t and d >= t
    bad += not ok
    print(f"{fg + ' on ' + bg:<34}{l:8.2f}:1{d:8.2f}:1{t:>8}  {'ok' if ok else 'FAIL'}")

spec_path = 'docs/design-spec-v3.md'
try:
    spec = open(spec_path).read()
except FileNotFoundError:
    print("\n(spec file not found; skipping spec cross-check)")
    raise SystemExit(0 if bad == 0 else 1)

print("\n--- numbers quoted in the spec, re-checked ---")
claims = [
    ("text on bg", "text", "bg"),
    ("text-muted on surface", "text-muted", "surface"),
    ("text-subtle on surface", "text-subtle", "surface"),
    ("accent on bg", "accent", "bg"),
    ("accent-fg on accent", "accent-fg", "accent"),
    ("accent on accent-subtle", "accent", "accent-subtle"),
    ("border-interactive on surface", "border-interactive", "surface"),
    ("focus-ring on bg", "focus-ring", "bg"),
]
mismatch = 0
for label, fg, bg in claims:
    m = re.search(r'\| ' + re.escape(label) + r' \| ([\d.]+):1 \| ([\d.]+):1 \|', spec)
    if not m:
        print(f"  ?? no spec row for '{label}'")
        mismatch += 1
        continue
    cl, cd = float(m.group(1)), float(m.group(2))
    al, ad = round(cr(L[fg], L[bg]), 2), round(cr(D[fg], D[bg]), 2)
    ok = abs(cl - al) < 0.02 and abs(cd - ad) < 0.02
    mismatch += not ok
    print(f"  {label:<30} spec {cl:6.2f}/{cd:6.2f}   actual {al:6.2f}/{ad:6.2f}  {'ok' if ok else 'MISMATCH'}")

print(f"\ncontrast failures: {bad}   spec mismatches: {mismatch}")
raise SystemExit(0 if (bad == 0 and mismatch == 0) else 1)
