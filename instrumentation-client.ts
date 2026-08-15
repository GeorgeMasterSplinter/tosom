// Client-side Sentry initialization (Sentry 10+ recommended location)
// Moved from sentry.client.config.ts per Sentry 10 deprecation.
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "",
  enabled: process.env.NODE_ENV === "production",
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  debug: false,

  beforeSend(event) {
    if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
      return null;
    }

    const piiPatterns = [
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
      /\+?[0-9]{7,15}/g,
    ];

    const redact = (val: string): string => {
      let redacted = val;
      for (const pattern of piiPatterns) {
        redacted = redacted.replace(pattern, "[redacted]");
      }
      return redacted;
    };

    if (event.exception?.values) {
      for (const exc of event.exception.values) {
        if (exc.value) exc.value = redact(exc.value);
      }
    }

    if (event.message) {
      event.message = redact(event.message);
    }

    if (event.breadcrumbs) {
      for (const crumb of event.breadcrumbs) {
        if (crumb.message) crumb.message = redact(crumb.message);
      }
    }

    return event;
  },
});