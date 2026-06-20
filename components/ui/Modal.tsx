/* ═══════════════════════════════════════════
   ToSom Premium — Modal Component
   Overlay · Centered · Draggable-ready
   ═══════════════════════════════════════════ */

import { ReactNode, useEffect } from "react";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses: Record<"sm" | "md" | "lg" | "xl", string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

export const Modal = ({ open, onClose, title, children, size = "md" }: ModalProps) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className={`relative w-full ${sizeClasses[size]} rounded-[var(--ts-radius-2xl)] border border-[var(--ts-border)] bg-[var(--ts-bg-secondary)] p-8 shadow-[var(--ts-shadow-xl)]`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2 className="mb-4 text-xl font-semibold" style={{ color: "var(--ts-text-primary)" }}>
            {title}
          </h2>
        )}

        <div style={{ color: "var(--ts-text-secondary)", lineHeight: "1.65" }}>
          {children}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-[var(--ts-text-muted)] transition-colors hover:bg-[var(--ts-glass-bg)] hover:text-[var(--ts-text-primary)]"
          aria-label="Lukk"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Modal;
