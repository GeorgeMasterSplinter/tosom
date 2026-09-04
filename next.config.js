const path = require('path');
const { withSentryConfig } = require('@sentry/nextjs');

/**
 * Env-sanering for URL-variabler.
 * Fjerner leading/trailing whitespace og kontrolltegn (inkl. linjeskift) som kan
 * følge med ved innliming i miljøvariabler. next-auth/react kjører
 * `new URL(process.env.NEXTAUTH_URL)` ved modulinit; en skitten verdi gir
 * "TypeError: Invalid URL" og feiler statisk generering under `next build`.
 */
function sanitizeUrlEnv(value) {
  if (typeof value !== 'string') return value;
  return value.trim().replace(/[\u0000-\u001f\u007f]/g, '');
}

const NEXTAUTH_URL = sanitizeUrlEnv(process.env.NEXTAUTH_URL);
const NEXTAUTH_URL_INTERNAL = sanitizeUrlEnv(process.env.NEXTAUTH_URL_INTERNAL);

// CSP script-src (systemaudit 03.09, funn 9): 'unsafe-eval' kun i DEV.
// Next.js dev-runtime (webpack eval-devtool / HMR / React-dev) krever unsafe-eval;
// prod (Vercel) kjører uten. E2E kjører `npm run dev` (dev-modus) og trenger
// unsafe-eval for at klient-JS (f.eks. /dev-login) skal kjøre — uten det får
// e2e 0 cookies og alle auth-baserte tester feiler. Prod-behardningen (fjerning
// av unsafe-eval) beholdes uendret for produksjon.
const CSP_SCRIPT_SRC =
  process.env.NODE_ENV === 'development'
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.stripe.com stripe.com"
    : "script-src 'self' 'unsafe-inline' *.stripe.com stripe.com";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Hardening: inline rensede verdier slik at også klient/modulinit-kode får ren URL
  ...(NEXTAUTH_URL ? { env: { NEXTAUTH_URL } } : {}),
  ...(NEXTAUTH_URL_INTERNAL ? { env: { NEXTAUTH_URL_INTERNAL } } : {}),
  webpack: (config) => {
    config.resolve.alias['@'] = path.join(__dirname);
    return config;
  },

  // Vercel deployment — standalone ikke nødvendig (F1)

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
          // systemaudit 03.09 (funn 9): fjernet dev-domener (picsum.photos,
          // placehold.co) fra img-src. script-src kjører UTEN 'unsafe-eval' i
          // PROD, men med den i DEV (CSP_SCRIPT_SRC) — Next.js dev-runtime og
          // e2e (npm run dev) krever den. script-src beholder 'unsafe-inline'
          // (Next.js App Router injecter inline flight-data-skript; fjerning
          // krever nonce-system + browserverifisering — post-beta).
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              CSP_SCRIPT_SRC,
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: *.uploadthing.com uploadthing.com *.s3.amazonaws.com tosom-storage.up.railway.app",
              "media-src 'self'",
              "font-src 'self' fonts.gstatic.com",
              "connect-src 'self' api.stripe.com auth.vipps.no vipps.no *.pusher.com *.pubnub.com wss://*.pusher.io wss://*.pusher.com *.ingest.sentry.io *.sentry.io",
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

  // D9: Redirect /slik → /slik-fungerer-det (SEO)
  async redirects() {
    return [
      {
        source: '/slik',
        destination: '/slik-fungerer-det',
        permanent: true, // 308
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

module.exports = withSentryConfig(nextConfig, {
  silent: true,
  disableLogger: true,
  widenClientFileUpload: false,
  telemetry: false,
});
