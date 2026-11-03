import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";

export const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

export const fontMono = Geist_Mono({
  weight: "500",
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const fontDisplay = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});
