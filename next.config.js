/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prevent prerendering of API routes and dynamic pages
  experimental: {
    serverActions: {
      allowedOrigins: ['*'],
    },
  },

  // Global build ID (dynamic, no static cache)
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },

  // Security & CDN headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Security headers
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // HSTS (production only)
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          // Cache static assets for 1 year (immutable)
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/favicon.ico",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400",
          },
        ],
      },
    ];
  },

  // Image optimization
  images: {
    loader: "default",
    deviceSizes: [640, 768, 1024, 1280, 1536],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/webp", "image/avif"],
  },

  // Compress responses
  compress: true,

  // Disable Next.js telemetry
  poweredByHeader: false,
};

module.exports = nextConfig;