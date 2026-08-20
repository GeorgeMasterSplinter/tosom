// STEG A3 — Sentry Edge runtime config (middleware, edge API routes)
import * as Sentry from "@sentry/nextjs";
import { sentryPiiConfig } from "./lib/observability/pii";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "",
  enabled: process.env.NODE_ENV === "production",
  tracesSampleRate: 0.1,
  debug: false,

  // S-16: aldri send default-PII; PII-skrubbing via den felles modulen.
  sendDefaultPii: sentryPiiConfig.sendDefaultPii,
  beforeSend(event) {
    if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
      return null;
    }
    return sentryPiiConfig.beforeSend(event);
  },
});
