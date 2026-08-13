const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias['@'] = path.join(__dirname);
    return config;
  },

  // Standalone output for Docker deployment (STEG 4.3)
  output: 'standalone',

  // Server Actions — restricted origins (STEG 4.5)
  // Replaced wildcard '*' with actual production/staging domains
  experimental: {
    serverActions: {
      allowedOrigins: [
        'app.tosom.no',
        'tosom.no',
        'www.tosom.no',
        'localhost:3000',
        ...(process.env.NEXT_PUBLIC_APP_URL ? [new URL(process.env.NEXT_PUBLIC_APP_URL).hostname] : []),
      ].filter(Boolean),
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
          // Content-Security-Policy (STEG 4.4)
          // Allows: self, Stripe checkout, Vipps auth, Pusher WS, uploadthing images, S3/Railway storage
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' *.stripe.com stripe.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: *.uploadthing.com uploadthing.com *.s3.amazonaws.com tosom-storage.up.railway.app picsum.photos placehold.co",
              "media-src 'self'",
              "font-src 'self' fonts.gstatic.com",
              "connect-src 'self' api.stripe.com auth.vipps.no vipps.no *.pusher.com *.pubnub.com wss://*.pusher.com",
              "frame-src *.stripe.com stripe.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self' api.stripe.com",
              "object-src 'none'",
            ].join('; '),
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
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.uploadthing.com',
      },
      {
        protocol: 'https',
        hostname: '*.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'tosom-storage.up.railway.app',
      },
    ],
  },

  // Compress responses
  compress: true,

  // Disable Next.js telemetry
  poweredByHeader: false,
};

module.exports = nextConfig;