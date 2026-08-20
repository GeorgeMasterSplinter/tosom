import * as Sentry from "@sentry/nextjs";
import { sentryPiiConfig } from "@/lib/observability/pii";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "",
  enabled: process.env.NODE_ENV === "production",
  // STEG 2.7: Lav tracesSampleRate i produksjon
  tracesSampleRate: 0.1,

  debug: false,

  // S-16: ToSom lover at ingen ser samtalene — løftet gjelder også feilsporing.
  // Aldri send default-PII, og skrub profilmeldinger/e-post/telefon via én kilde.
  sendDefaultPii: sentryPiiConfig.sendDefaultPii,
  beforeSend(event) {
    // Don't send errors if DSN is not configured
    if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
      return null;
    }
    return sentryPiiConfig.beforeSend(event);
  },
});
