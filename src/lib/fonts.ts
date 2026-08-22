import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";

export const fontDisplay = localFont({
  src: [{ path: "../fonts/ClashDisplay-600.woff2", weight: "600", style: "normal" }],
  variable: "--font-clash",
  display: "swap",
  fallback: ["Archivo", "system-ui", "arial"],
});

export const fontSans = localFont({
  src: [
    { path: "../fonts/Satoshi-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Satoshi-500.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-satoshi",
  display: "swap",
  fallback: ["Instrument Sans", "system-ui", "arial"],
});

export const fontMono = Geist_Mono({
  weight: "500",
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});
