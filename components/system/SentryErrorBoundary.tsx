/* ═══════════════════════════════════════════
   ToSom — Sentry Error Boundary Wrapper
   Fanger React errors og viser fallback UI
   Merk: Krever @sentry/nextjs og react-error-boundary for full funksjon
   ═══════════════════════════════════════════ */

"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class SentryErrorBoundaryState extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[SentryErrorBoundary]", error, errorInfo);
    // If Sentry is installed, log to Sentry:
    // if (typeof window !== "undefined" && (window as any).__SENTRY__) {
    //   (window as any).__SENTRY__.captureException(error);
    // }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex items-center justify-center bg-[#0A0F1F] text-white p-6"
          role="alert"
          aria-live="assertive"
        >
          <div className="max-w-md w-full text-center">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255, 77, 77, 0.1)" }}
            >
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Noe gikk galt</h2>
            <p className="text-white/60 mb-6">
              Vi har registrert feilen og jobber med å fikse den.
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-6 py-3 rounded-xl font-medium transition-all duration-200"
              style={{
                background: "rgba(212, 175, 55, 0.15)",
                color: "#D4AF37",
                border: "1px solid rgba(212, 175, 55, 0.25)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(212, 175, 55, 0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(212, 175, 55, 0.15)";
              }}
            >
              Prøv igjen
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export const SentryErrorBoundary = SentryErrorBoundaryState;
export default SentryErrorBoundary;
