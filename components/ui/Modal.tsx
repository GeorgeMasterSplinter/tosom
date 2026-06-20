/* ═══════════════════════════════════════════
   ToSom Premium — Modal Component
   Overlay · Centered · GPU-composited (opacity + scale)
   Respects prefers-reduced-motion
   ═══════════════════════════════════════════ */

"use client";

import { ReactNode, useEffect, useState } from "react";

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
  const [reducedMotion, setReducedMotion] = useState(false);

  // SSR-safe reduced motion detection
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent | any) => setReducedMotion(e.matches);
    mq.addEventListener?.("change", handler);
    if (!mq.addEventListener) mq.addListener?.(handler);
    return () => {
      mq.removeEventListener?.("change", handler);
      mq.removeListener?.(handler);
    };
  }, []);

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

  // GPU-composited: opacity + scale (no layout thrashing)
  const animationStyle = reducedMotion
    ? { opacity: 1 }
    : {
        opacity: 1,
        animation: "scaleIn 200ms ease-out",
      };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel — GPU-composited modal entrance */}
      <div
        className={`relative ts-modal-panel ${sizeClasses[size]}`}
        onClick={(e) => e.stopPropagation()}
        style={animationStyle}
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
