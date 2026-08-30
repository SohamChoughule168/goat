import { Newsreader } from "next/font/google";
import type { ReactNode } from "react";

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400"],
  variable: "--font-newsreader",
  display: "swap",
});

export default function InsightsLayout({ children }: { children: ReactNode }) {
  return <div className={newsreader.variable}>{children}</div>;
}
