import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import "../styles/editorial.css";
import "../styles/experience.css";
import "../styles/institutional.css";
import "../styles/evidence.css";
import "../styles/craft.css";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { buildGraph, OG_IMAGE_ALT, OG_IMAGE_PATH } from "@/lib/seo";
import { JsonLd } from "@/components/seo/jsonld";
import { site } from "@/content/site";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], weight: "500", variable: "--font-geist-mono", display: "swap" });
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name + " - " + site.tagline, template: "%s / " + site.shortName },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: "technology",
  alternates: {
    types: { "application/rss+xml": "/rss.xml" },
  },
  formatDetection: { email: false, address: false, telephone: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    title: site.name,
    description: site.description,
    locale: "en_IN",
    siteName: site.name,
    images: [
      {
        url: OG_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: OG_IMAGE_ALT,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
    images: [{ url: OG_IMAGE_PATH, alt: OG_IMAGE_ALT }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F2EEE5",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={[geistSans.variable, geistMono.variable, instrumentSerif.variable].join(" ")}
    >
      <body className="flex min-h-dvh flex-col">
        <noscript>
          <style>{`
            .inst-sequence{height:auto!important}
            .sequence-sticky{position:static!important;height:auto!important;display:block!important;overflow:visible!important}
            .sequence-intro{padding-block:3rem 1.5rem!important}
            .sequence-stage{display:grid!important;gap:1.25rem!important;border:0!important;background:transparent!important}
            .sequence-frame{position:static!important;opacity:1!important;transform:none!important}
            .sequence-frame img{transform:none!important;aspect-ratio:16/9}
            .sequence-rail{display:none!important}
            .handover{height:auto!important}
            .handover-sticky{position:static!important;height:auto!important;display:block!important}
            .handover-stack{position:static!important;display:grid!important;gap:1.25rem!important}
            .handover-plate{position:static!important;opacity:1!important;transform:none!important}
          `}</style>
        </noscript>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:text-[color:var(--accent-ink)]"
        >
          Skip to content
        </a>

        {children}

        <JsonLd data={buildGraph()} />
      </body>
    </html>
  );
}
