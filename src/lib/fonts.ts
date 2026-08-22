import localFont from "next/font/local";

export const fontSans = localFont({
  src: [
    { path: "../fonts/Satoshi-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Satoshi-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/Satoshi-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
  fallback: ["system-ui", "arial"],
});

export const fontDisplay = localFont({
  src: [
    { path: "../fonts/ClashDisplay-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/ClashDisplay-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
  fallback: ["system-ui", "arial"],
});

export const fontSerif = localFont({
  src: [
    { path: "../fonts/Zodiak-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Zodiak-400i.woff2", weight: "400", style: "italic" },
    { path: "../fonts/Zodiak-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-serif",
  display: "swap",
  fallback: ["georgia", "serif"],
});

export const fontMono = localFont({
  src: [{ path: "../fonts/JetBrainsMono-400.woff2", weight: "400", style: "normal" }],
  variable: "--font-mono",
  display: "swap",
  fallback: ["ui-monospace", "monospace"],
});
