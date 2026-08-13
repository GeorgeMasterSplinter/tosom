// STEG A2 — Serverside Sentry instrumentation for Next.js App Router
// Captures server-side errors (API routes, Server Components, Route Handlers)
// STEG A6 — Fail-fast env validation on startup
import * as Sentry from "@sentry/nextjs";
import { validateEnv } from "./config/env";

// Run env validation at startup (before anything else initializes)
try {
  validateEnv();
} catch (err) {
  console.error('[startup] Environment validation failed:', (err as Error).message);
  process.exit(1);
}

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    Sentry.init({
      dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN || "",
      enabled: process.env.NODE_ENV === "production",
      tracesSampleRate: 0.1,
      debug: false,

      beforeSend(event) {
        if (!process.env.SENTRY_DSN && !process.env.NEXT_PUBLIC_SENTRY_DSN) {
          return null;
        }

        // PII-scrubbing — same logic as client/server configs
        const piiPatterns = [
          /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
          /\+?[0-9]{7,15}/g,
        ];

        const redact = (val: string): string => {
          let r = val;
          for (const p of piiPatterns) {
            r = r.replace(p, '[redacted]');
          }
          return r;
        };

        if (event.exception?.values) {
          for (const exc of event.exception.values) {
            if (exc.value) exc.value = redact(exc.value);
          }
        }
        if (event.message) event.message = redact(event.message);
        if (event.breadcrumbs) {
          for (const crumb of event.breadcrumbs) {
            if (crumb.message) crumb.message = redact(crumb.message);
          }
        }

        return event;
      },
    });
  }
}