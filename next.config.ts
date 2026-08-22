import type { NextConfig } from "next";

export const legacyServiceMap: Record<string, string> = {
  "web-dev": "web-development",
  mobile: "mobile-app-development",
  ai: "ai-driven-websites",
  refurbish: "website-refurbishment",
  marketing: "digital-marketing",
  "social-media": "social-media-marketing",
  geo: "generative-engine-optimization",
  aeo: "answer-engine-optimization",
  "meta-ads": "meta-advertising",
  "google-business": "google-business-profile",
  brand: "brand-management",
  video: "video-editing",
  thumbnails: "thumbnail-design",
  events: "online-events",
  "google-ai": "google-ai-integration",
  talent: "talent-acquisition",
};

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  async redirects() {
    return [
      { source: "/portfolio", destination: "/work", permanent: true },
      { source: "/blog", destination: "/insights", permanent: true },
      { source: "/blog/:slug", destination: "/insights", permanent: true },
      ...Object.entries(legacyServiceMap).map(([from, to]) => ({
        source: `/services/${from}`,
        destination: `/services/${to}`,
        permanent: true,
      })),
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
