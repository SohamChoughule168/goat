import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { buildGraph } from "@/lib/seo";
import { JsonLd } from "@/components/seo/jsonld";
import MotionProvider from "@/components/motion/motion-provider";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { site } from "@/content/site";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans", display: "swap" });
const geistMono = Geist_Mono({ weight: "500", subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.name + " - " + site.tagline,
    template: "%s / " + site.shortName,
  },
  description: site.description,
  applicationName: site.name,
  robots: { index: true, follow: true },
  openGraph: { type: "website", locale: "en_IN", siteName: site.name },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAFB" },
    { media: "(prefers-color-scheme: dark)", color: "#09090B" },
  ],
  width: "device-width",
  initialScale: 1,
};

const themeScript = "(function(){try{var s=localStorage.getItem('imaginars-theme');var d=s==='dark'||((!s||s==='system')&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.dataset.theme=d?'dark':'light';}catch(e){}})()";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={geistSans.variable + " " + geistMono.variable} suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-accent focus:px-4 focus:py-2 focus:text-sm">Skip to content</a>
        <MotionProvider>
          <Header />
          <main id="main" className="flex-1 pt-[72px]">{children}</main>
          <Footer />
        </MotionProvider>
        <JsonLd data={buildGraph()} />
      </body>
    </html>
  );
}
