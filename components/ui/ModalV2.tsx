"use client";

/* ═══════════════════════════════════════════
   ToSom Premium — Modal v2
   Posisjonar: center | top | bottom-sheet
   closeOnOutsideClick, closeOnEscape
   ═══════════════════════════════════════════ */

import { ReactNode, useEffect, useCallback, useRef } from "react";

export interface ModalV2Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  position?: "center" | "top" | "bottom-sheet";
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
}

const sizeClasses: Record<"sm" | "md" | "lg" | "xl", string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

const positionClasses: Record<string, string> = {
  center: "items-center justify-center",
  top: "items-start justify-start pt-24",
  "bottom-sheet": "items-end justify-end pb-0 sm:pb-8",
};

const positionPanel: Record<string, string> = {
  center: "animate-scaleIn",
  top: "animate-fadeInUp",
  "bottom-sheet": "sm:animate-fadeInUp animate-slideUp",
};

// SlideUp animation for bottom sheet
if (typeof window !== "undefined") {
  const styleId = "tosom-modal-v2-style";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      @keyframes slideUp {
        from { transform: translateY(100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
}

export const ModalV2 = ({
  open,
  onClose,
  title,
  children,
  size = "md",
  position = "center",
  closeOnOutsideClick = true,
  closeOnEscape = true,
}: ModalV2Props) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  const handleClose = useCallback(() => {
    onClose();
    document.body.style.overflow = "";
    // Restore focus to the element that opened the modal
    if (previousFocus.current) {
      previousFocus.current.focus();
    }
  }, [onClose]);

  // Save focus when modal opens
  useEffect(() => {
    if (open) {
      previousFocus.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";
      // Focus the modal panel
      if (panelRef.current) {
        panelRef.current.focus();
      }
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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

  useEffect(() => {
    if (!open || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, closeOnEscape, handleClose]);

  if (!open) return null;

  return (
      <div
        className={`fixed inset-0 z-[1000] ${positionClasses[position]} p-4 sm:p-6`}
        onClick={closeOnOutsideClick ? handleClose : undefined}
        role="dialog"
        aria-modal="true"
        aria-label={title || "Modal"}
        tabIndex={-1}
      >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        {/* Panel */}
        <div
          ref={panelRef}
          tabIndex={-1}
          className={`relative w-full ${sizeClasses[size]} ${positionPanel[position]} rounded-2xl border border-white/8 bg-[var(--ts-bg-secondary)] shadow-xl outline-none focus-visible:ring-2 focus-visible:ring-[var(--ts-gold)]/50`}
          style={{
            background: "rgba(17, 24, 39, 0.95)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 pt-6 pb-2">
            <h2
              className="text-xl font-semibold"
              style={{ color: "var(--ts-text-primary)" }}
            >
              {title}
            </h2>
            <button
              onClick={handleClose}
              className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/10"
              style={{ color: "var(--ts-text-muted)" }}
              aria-label="Lukk"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div
          className="px-6 pb-6 pt-2"
          style={{
            color: "var(--ts-text-secondary)",
            lineHeight: "1.65",
          }}
        >
          {children}
        </div>

        {/* Drag handle for bottom sheet */}
        {position === "bottom-sheet" && (
          <div className="flex justify-center pb-2 sm:hidden">
            <div className="h-1 w-8 rounded-full bg-white/20" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalV2;
