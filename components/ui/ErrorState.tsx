/* ═══════════════════════════════════════════
   ToSom Premium — Error State Components
   Glassmorphism error/warning/empty states
   ═══════════════════════════════════════════ */

"use client";

import Button from "./Button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  actionHref?: string;
  variant?: "error" | "warning" | "empty";
  className?: string;
}

const icons = {
  error: (
    <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
  ),
  warning: (
    <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
  empty: (
    <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.936 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.25 9 13.5 9 13.5s9-6.25 9-13.5z" />
    </svg>
  ),
};

const variantStyles = {
  error: {
    iconColor: "text-[var(--ts-error)]",
    borderColor: "border-[var(--ts-error)]/30",
    bgColor: "bg-[var(--ts-error)]/5",
  },
  warning: {
    iconColor: "text-[var(--ts-gold)]",
    borderColor: "border-[var(--ts-gold)]/30",
    bgColor: "bg-[var(--ts-gold)]/[0.06]",
  },
  empty: {
    iconColor: "text-[var(--ts-text-muted)]",
    borderColor: "border-[var(--ts-border)]",
    bgColor: "bg-[var(--ts-glass-bg)]",
  },
};

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Hmm… dette gikk ikke helt som planlagt.",
  message = "Kan du prøve igjen?",
  actionLabel = "Prøv igjen",
  actionHref,
  variant = "error",
  className = "",
}) => {
  const style = variantStyles[variant];
  const icon = icons[variant];

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border p-8 text-center ${style.borderColor} ${style.bgColor} ${className}`}
      role="alert"
      aria-live="polite"
    >
      <div className={`mb-4 ${style.iconColor}`}>{icon}</div>
      <h3 className="mb-2 text-base font-semibold text-[var(--ts-text-primary)]">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-[var(--ts-text-muted)]">{message}</p>
      {actionLabel && actionHref && (
        <Button variant="primary" size="sm" href={actionHref}>
          {actionLabel}
        </Button>
      )}
      {actionLabel && !actionHref && (
        <button
          className="btn-primary animate-goldGlow"
          onClick={() => window.location.reload()}
          aria-label={actionLabel}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════
   Empty state — for tomme lister
   ═══════════════════════════════════════════ */

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "Det er tomt her — men det blir ikkje det.",
  subtitle = "Når du får innhold her, vil det dukke opp automatisk.",
  actionLabel,
  actionHref,
  className = "",
}) => (
  <ErrorState
    title={title}
    message={subtitle}
    actionLabel={actionLabel}
    actionHref={actionHref}
    variant="empty"
    className={className}
  />
);

/* ═══════════════════════════════════════════
   Warning state — for advarsler
   ═══════════════════════════════════════════ */

interface WarningStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
}

export const WarningState: React.FC<WarningStateProps> = ({
  title = "Merk denne",
  message = "Dette trenger litt oppmerksomhet før du kan fortsette.",
  actionLabel = "Se over",
  actionHref,
  className = "",
}) => (
  <ErrorState
    title={title}
    message={message}
    actionLabel={actionLabel}
    actionHref={actionHref}
    variant="warning"
    className={className}
  />
);

/* ═══════════════════════════════════════════
   Default export
   ═══════════════════════════════════════════ */

export default ErrorState;