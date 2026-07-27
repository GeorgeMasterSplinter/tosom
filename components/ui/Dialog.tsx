"use client";

/* ═══════════════════════════════════════════
   ToSom Premium — Dialog Component
   Bekreftelsesdialog basert på Modal
   ═══════════════════════════════════════════ */

import Button from "./Button";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "danger";
}

export const Dialog = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Bekreft",
  cancelLabel = "Avbryt",
  variant = "default",
}: DialogProps) => {
  if (!open) return null;

  const isDanger = variant === "danger";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(4px)" }}
      />

      {/* Panel */}
      <div
        className="relative w-full max-w-sm"
        style={{
          background: "var(--ts-bg-secondary)",
          border: "1px solid var(--ts-border)",
          borderRadius: "var(--ts-radius-2xl)",
          boxShadow: "var(--ts-shadow-xl)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-0">
          <h3
            className="mb-2 text-lg font-semibold"
            style={{ color: "var(--ts-text-primary)" }}
          >
            {title}
          </h3>
          {description && (
            <p
              className="text-sm"
              style={{ color: "var(--ts-text-muted)", lineHeight: "1.6" }}
            >
              {description}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-3 p-6">
          <Button variant="ghost" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button
            variant={isDanger ? "red" : "primary"}
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={isDanger ? "" : "!bg-[var(--ts-gold)] !border-none"}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dialog;