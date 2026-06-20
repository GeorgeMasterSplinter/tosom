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

      {/* Panel — using ts-modal-panel class from globals.css */}
      <div
        className={`relative ts-modal-panel ${sizeClasses[size]}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2 className="mb-4 text-xl font-semibold text-ts-primary">
            {title}
          </h2>
        )}

        <div className="text-ts-secondary" style={{ lineHeight: "1.65" }}>
          {children}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-ts-subtle transition-colors hover:bg-ts-glass hover:text-ts-primary"
          aria-label="Lukk"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Modal;
