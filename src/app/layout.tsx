import type { Metadata, Viewport } from "next";
import "./globals.css";
import { fontMono, fontSans } from "@/lib/fonts";
import { buildGraph } from "@/lib/seo";
import { JsonLd } from "@/components/seo/jsonld";
import MotionProvider from "@/components/motion/motion-provider";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { site } from "@/content/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.shortName}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "digital agency Mumbai",
    "web development Mumbai",
    "AI website development",
    "mobile app development India",
    "SEO GEO AEO services",
    "Meta ads management",
    "video editing services",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: site.name,
  },
};

export const viewport: Viewport = {
  themeColor: "#08090A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontMono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <MotionProvider>
          <Header />
          <main id="main" className="flex-1 pt-[4.25rem]">
            {children}
          </main>
          <Footer />
        </MotionProvider>
        <JsonLd data={buildGraph()} />
      </body>
    </html>
  );
}

