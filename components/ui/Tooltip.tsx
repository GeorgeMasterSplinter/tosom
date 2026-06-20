"use client";

/* ═══════════════════════════════════════════
   ToSom Premium — Tooltip Component
   Props: content, side, delay
   Glassmorphism + gold border + fade-in
   ═══════════════════════════════════════════ */

import { useState, useCallback, useRef, useEffect } from "react";

interface TooltipProps {
  content: string;
  side?: "top" | "bottom" | "left" | "right";
  delay?: number;
  children: React.ReactNode;
}

const sideClasses: Record<string, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

export const Tooltip = ({
  content,
  side = "top",
  delay = 200,
  children,
}: TooltipProps) => {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(true), delay);
  }, [delay]);

  const hide = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {children}

      {visible && (
        <div
          className={`absolute z-[1001] whitespace-nowrap px-3 py-1.5 text-xs font-medium rounded-lg border
            animate-scaleIn
            bg-white/[0.04]
            border-white/[0.12]
            backdrop-blur-md
            shadow-[0_4px_20px_rgba(0,0,0,0.4)]
            ${sideClasses[side]}`}
          style={{
            color: "#D4AF37",
            transition: "opacity 200ms ease, transform 200ms ease",
          }}
        >
          {content}
          <style>{`
            @keyframes tooltipFade {
              from { opacity: 0; transform: scale(0.95); }
              to   { opacity: 1; transform: scale(1); }
            }
            .animate-scaleIn {
              animation: tooltipFade 200ms ease-out forwards;
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
