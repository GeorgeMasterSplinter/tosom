import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "",
  enabled: process.env.NODE_ENV === "production",
  // STEG 2.7: Lav tracesSampleRate i produksjon for å redusere kostnad/støy
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  debug: false,

  beforeSend(event) {
    // Don't send errors if DSN is not configured
    if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
      return null;
    }

    // STEG 2.7: PII-scrubbing — ToSom lover at ingen ser samtalene, løftet gjelder også feilsporing.
    const piiPatterns = [
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,  // email
      /\+?[0-9]{7,15}/g,                                      // phone numbers
    ];

    const redact = (val: string): string => {
      let redacted = val;
      for (const pattern of piiPatterns) {
        redacted = redacted.replace(pattern, '[redacted]');
      }
      return redacted;
    };


    // Scrub exception values
    if (event.exception?.values) {
      for (const exc of event.exception.values) {
        if (exc.value) exc.value = redact(exc.value);
      }
    }

    // Scrub message
    if (event.message) {
      event.message = redact(event.message);
    }

    // Scrub breadcrumbs
    if (event.breadcrumbs) {
      for (const crumb of event.breadcrumbs) {
        if (crumb.message) crumb.message = redact(crumb.message);
      }
    }

    return event;
  },
});