import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { buildGraph } from "@/lib/seo";
import { JsonLd } from "@/components/seo/jsonld";
import Cursor from "@/components/v6/cursor";
import { site } from "@/content/site";
import PersistentCanvas from "@/components/canvas/PersistentCanvas";
import TunnelProvider, { ScrollTracker } from "@/components/canvas/Tunnel";
import { PerformanceProvider } from "@/components/v6/performance-optimizer";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], weight: "500", variable: "--font-geist-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name + " - " + site.tagline, template: "%s / " + site.shortName },
  description: site.description,
  applicationName: site.name,
  robots: { index: true, follow: true },
  openGraph: { type: "website", locale: "en_IN", siteName: site.name },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0B0F" },
  ],
};

const themeScript = "(function(){try{var s=localStorage.getItem('imaginars-theme');var d=s==='dark'||((!s||s==='system')&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.dataset.theme=d?'dark':'light';}catch(e){}})()";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={geistSans.variable + " " + geistMono.variable} suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-accent focus:px-4 focus:py-2 focus:text-sm">Skip to content</a>
        
        {/* Performance monitoring provider - sets up FPS tracking, adaptive quality */}
        <PerformanceProvider>
          {/* Tunnel provider for DOM-to-3D scroll sync */}
          <TunnelProvider>
            {/* ScrollTracker - updates tunnel state on scroll */}
            <ScrollTracker />
            
            {/* PERSISTENT CANVAS - mounted ONCE in root, survives route changes */}
            {/* This is the key architectural change for $100M tier */}
            <PersistentCanvas>
              {/* Custom cursor - sits above canvas */}
              <Cursor />
              
              {/* Page content - rendered above the canvas */}
              {children}
            </PersistentCanvas>
            
            {/* Filmic grain overlay */}
            <div className="v6-grain" aria-hidden="true" />
            
            {/* JSON-LD structured data for SEO */}
            <JsonLd data={buildGraph()} />
          </TunnelProvider>
        </PerformanceProvider>
      </body>
    </html>
  );
}
