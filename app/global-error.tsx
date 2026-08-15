"use client";

// Global error boundary for Next.js App Router.
// Replaces the root layout when an uncaught error is thrown during
// rendering of the root layout itself.
//
// Requirement: this file MUST render its own root HTML and body elements,
// because it sits above app/layout.tsx.

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="no" dir="ltr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
          background: "#0A0F1F",
          color: "#E7ECF5",
          padding: "1.5rem",
        }}
      >
        <main
          style={{
            maxWidth: "32rem",
            width: "100%",
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 600,
              margin: "0 0 0.75rem",
            }}
          >
            Noe gikk galt
          </h1>
          <p style={{ margin: "0 0 1.5rem", color: "#9FB0C8" }}>
            Vi har fått beskjed. Prøv igjen om et øyeblikk.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              background: "transparent",
              border: "1px solid #3A4A6B",
              color: "#E7ECF5",
              padding: "0.6rem 1.25rem",
              borderRadius: "999px",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Prøv igjen
          </button>
        </main>
      </body>
    </html>
  );
}