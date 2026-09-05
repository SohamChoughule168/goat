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
  reactStrictMode: true,

  // Turbopack configuration for GLSL shader support
  // This enables vite-plugin-glsl to import .glsl, .vert, .frag files
  // and inject them as strings with #include support
  turbopack: {
    rules: {
      "*.{glsl,vert,frag}": {
        loaders: ["glsl-loader"],
        as: "*.ts",
      },
    },
  },

  // Production optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Experimental performance features
  experimental: {
    optimizePackageImports: ["@react-three/fiber", "@react-three/drei", "three", "framer-motion", "zustand"],
  },

  // Webpack optimizations for production
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Optimize Three.js imports
      config.resolve.alias = {
        ...config.resolve.alias,
        "three/examples/jsm": false, // Force tree-shaking of three examples
      };

      // Split Three.js into separate chunk
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            three: {
              test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
              name: "three",
              priority: 20,
              chunks: "all",
            },
            framer: {
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              name: "framer",
              priority: 15,
              chunks: "all",
            },
            zustand: {
              test: /[\\/]node_modules[\\/]zustand[\\/]/,
              name: "zustand",
              priority: 10,
              chunks: "all",
            },
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendors",
              priority: 5,
              chunks: "all",
            },
          },
        },
      };
    }
    return config;
  },

  // Source maps in production for debugging
  productionBrowserSourceMaps: process.env.NODE_ENV === "production" && process.env.SOURCE_MAPS === "true",

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
          // Performance hints
          { key: "X-DNS-Prefetch-Control", value: "on" },
          // CORS for 3D assets
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
        ],
      },
      // Cache static assets aggressively
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // Cache fonts
      {
        source: "/fonts/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // Cache images
      {
        source: "/images/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // Cache 3D assets
      {
        source: "/models/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
