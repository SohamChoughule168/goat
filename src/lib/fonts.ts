import { Geist, Geist_Mono } from "next/font/google";

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
