export const INSTRUMENT_PALETTE_FALLBACK = {
  ink: "#11120f",
  ink2: "#2a2b26",
  ink3: "#5c5c53",
  bone: "#f2eee5",
  bone2: "#e7e1d4",
  bone3: "#d8d0bf",
  cobalt: "#1f3ad8",
  cobaltDeep: "#152aa6",
  darkInk: "#f1eee5",
} as const;

export type InstrumentPalette = {
  -readonly [Key in keyof typeof INSTRUMENT_PALETTE_FALLBACK]: string;
};

const CSS_VARIABLE: Record<keyof InstrumentPalette, string> = {
  ink: "--ink",
  ink2: "--ink-2",
  ink3: "--ink-3",
  bone: "--bone",
  bone2: "--bone-2",
  bone3: "--bone-3",
  cobalt: "--cobalt",
  cobaltDeep: "--cobalt-deep",
  darkInk: "--dark-ink",
};

export function readInstrumentPalette(
  root: HTMLElement | undefined = typeof document === "undefined"
    ? undefined
    : document.documentElement,
): InstrumentPalette {
  if (!root) return { ...INSTRUMENT_PALETTE_FALLBACK };

  const styles = getComputedStyle(root);
  const palette: InstrumentPalette = { ...INSTRUMENT_PALETTE_FALLBACK };

  for (const key of Object.keys(CSS_VARIABLE) as (keyof InstrumentPalette)[]) {
    const value = styles.getPropertyValue(CSS_VARIABLE[key]).trim();
    if (value) palette[key] = value;
  }

  return palette;
}

export interface InstrumentFonts {
  sans: string;
  mono: string;
}

const FONT_FALLBACK: InstrumentFonts = {
  sans: "ui-sans-serif, system-ui, sans-serif",
  mono: "ui-monospace, SFMono-Regular, Menlo, monospace",
};

/** Resolves the next/font families for canvas drawing (canvas cannot use CSS vars). */
export function readInstrumentFonts(
  root: HTMLElement | undefined = typeof document === "undefined"
    ? undefined
    : document.documentElement,
): InstrumentFonts {
  if (!root) return { ...FONT_FALLBACK };
  const styles = getComputedStyle(root);
  return {
    sans: styles.getPropertyValue("--font-geist-sans").trim() || FONT_FALLBACK.sans,
    mono: styles.getPropertyValue("--font-geist-mono").trim() || FONT_FALLBACK.mono,
  };
}
