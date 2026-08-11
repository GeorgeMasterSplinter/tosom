/**
 * ToSom — Error State
 * 
 * Universal feil-handtering med glassmorphism-panel og gull-knapp.
 * Bruk ved API-feil, runtime-feil og data-innlasting-feil.
 */

import { useState } from "react";

interface ErrorStateProps {
  title?: string;
  description?: string;
  retryLabel?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = "Noe gikk galt",
  description = "Vi klarte ikke å hente data. Kontroller tilkoplinga di og prøv igjen.",
  retryLabel = "Prøv igjen",
  onRetry,
}: ErrorStateProps) {
  const [retrying, setRetrying] = useState(false);

  async function handleRetry() {
    if (!onRetry || retrying) return;
    setRetrying(true);
    try {
      await onRetry();
    } catch {
      // Feil handterast av parent
    } finally {
      setRetrying(false);
    }
  }

  return (
    <div className="min-h-[40vh] flex items-center justify-center px-4">
      <div
        className="max-w-md w-full p-8 rounded-[20px] text-center"
        style={{
          background: "rgba(255,77,77,0.06)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,77,77,0.15)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
        }}
      >
        {/* Icon */}
        <div className="text-4xl mb-5">⚠️</div>

        {/* Title */}
        <h2
          className="text-2xl font-semibold tracking-tight mb-3"
          style={{ color: "#FF6B6B" }}
        >
          {title}
        </h2>

        {/* Description */}
        <p
          className="text-sm leading-relaxed mb-8"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          {description}
        </p>

        {/* Retry Button */}
        {onRetry && (
          <button
            onClick={handleRetry}
            disabled={retrying}
            className="inline-flex items-center justify-center px-6 py-3 font-medium rounded-xl transition-all duration-300"
            style={{
              background: retrying ? "rgba(212,175,55,0.3)" : "linear-gradient(135deg, #D4AF37, #E8C766)",
              color: retrying ? "rgba(255,255,255,0.4)" : "#0B1520",
              cursor: retrying ? "not-allowed" : "pointer",
              opacity: retrying ? 0.6 : 1,
            }}
          >
            {retrying ? "Lastar..." : retryLabel}
          </button>
        )}
      </div>
    </div>
  );
}