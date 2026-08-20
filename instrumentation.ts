// STEG A2 — Serverside Sentry instrumentation for Next.js App Router
// Captures server-side errors (API routes, Server Components, Route Handlers)
// STEG A6 — Fail-fast env validation on startup
import * as Sentry from "@sentry/nextjs";
import { validateEnv } from "./config/env";
import { sentryPiiConfig } from "./lib/observability/pii";

// Run env validation at startup (before anything else initializes).
//
// MERK: denne filen lastes i ALLE runtimes, også Edge der middleware kjører.
// Edge har ingen process.exit — kallet ga «TypeError: process.exit is not a
// function» og veltet middleware på hver forespørsel (MIDDLEWARE_INVOCATION_FAILED).
// Vi avslutter derfor kun i Node, og logger tydelig i Edge.
try {
  validateEnv();
} catch (err) {
  console.error('[startup] Environment validation failed:', (err as Error).message);
  if (process.env.NEXT_RUNTIME === 'nodejs' && typeof process.exit === 'function') {
    process.exit(1);
  }
}

export const onRequestError = Sentry.captureRequestError;

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    Sentry.init({
      dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN || "",
      enabled: process.env.NODE_ENV === "production",
      tracesSampleRate: 0.1,
      debug: false,

      // S-16: aldri send default-PII; PII-skrubbing via den felles modulen.
      sendDefaultPii: sentryPiiConfig.sendDefaultPii,
      beforeSend(event) {
        if (!process.env.SENTRY_DSN && !process.env.NEXT_PUBLIC_SENTRY_DSN) {
          return null;
        }
        return sentryPiiConfig.beforeSend(event);
      },
    });
  }
}