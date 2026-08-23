export function luminance(hex: string): number {
  const h = hex.replace("#", "");
  const lin = (c: number): number =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const r = lin(parseInt(h.slice(0, 2), 16));
  const g = lin(parseInt(h.slice(2, 4), 16));
  const b = lin(parseInt(h.slice(4, 6), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(aHex: string, bHex: string): number {
  const a = luminance(aHex);
  const b = luminance(bHex);
  const hi = Math.max(a, b);
  const lo = Math.min(a, b);
  return Number(((hi + 0.05) / (lo + 0.05)).toFixed(2));
}
