/** ToSom ErrorBoundary (lib)
 *  RM1 / RM2 — Fanger runtime-feil i UI */

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/** Dummy-feillogger */
function logError(error: Error): void {
  if (process.env.NODE_ENV === 'development') {
    console.error('[ErrorBoundary]', error.message, error.stack);
  }
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false, error: null };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, info: ErrorInfo): void {
    logError(error);
  }

  public retry(): void {
    this.setState({ hasError: false, error: null });
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-background text-dark">
          <div className="text-center space-y-4 p-8">
            <span className="text-6xl block" role="img" aria-label="nope">🫥</span>
            <h2 className="text-xl font-semibold">Noe gikk galt</h2>
            <button
              onClick={() => this.retry()}
              className="px-6 py-2 bg-gold text-white rounded-lg hover:opacity-90 transition"
              aria-label="Prøv igjen"
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
