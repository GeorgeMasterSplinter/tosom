/* ═══════════════════════════════════════════
   ToSom Premium — JourneyMap Component
   Vertical timeline with nodes (locked/active/done)
   ═══════════════════════════════════════════ */

"use client";

import { useEffect, useRef, useState } from "react";

export type StepStatus = "locked" | "active" | "done";

export interface JourneyStep {
  id: string;
  title: string;
  description: string;
  status: StepStatus;
  icon?: string;
}

interface JourneyMapProps {
  steps: JourneyStep[];
  onSelectStep?: (step: JourneyStep) => void;
  className?: string;
}

const statusStyles: Record<StepStatus, { ring: string; bg: string; border: string; icon: string }> = {
  active: {
    ring: "bg-[var(--ts-gold)]",
    bg: "bg-[var(--ts-gold)]/10",
    border: "border-[var(--ts-gold)]/40",
    icon: "text-[var(--ts-gold)]",
  },
  done: {
    ring: "bg-emerald-400",
    bg: "bg-[var(--ts-success)]/15",
    border: "border-emerald-400/30",
    icon: "text-emerald-400",
  },
  locked: {
    ring: "bg-white/10",
    bg: "bg-white/[0.03]",
    border: "border-white/10",
    icon: "text-white/20",
  },
};

export const JourneyMap = ({ steps, onSelectStep, className = "" }: JourneyMapProps) => {
  const [visibleIndices, setVisibleIndices] = useState<Set<number>>(new Set());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const children = entry.target.querySelectorAll("[data-journey-step]");
          children.forEach((child, i) => {
            setTimeout(() => {
              setVisibleIndices((prev) => new Set([...prev, i]));
            }, i * 100);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`space-y-0 ${className}`}>
      {steps.map((step, i) => {
        const style = statusStyles[step.status];
        const isVisible = visibleIndices.has(i);
        const isActive = step.status === "active";
        const isDone = step.status === "done";

        return (
          <div
            key={step.id}
            data-journey-step
            className="relative flex items-start gap-4"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 400ms ease-out, transform 400ms ease-out",
            }}
          >
            {/* Timeline node */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => isActive && onSelectStep?.(step)}
                disabled={!isActive}
                className={`
                  relative flex items-center justify-center w-12 h-12 rounded-full border-2
                  ${style.bg} ${style.border}
                  ${isActive ? "cursor-pointer hover:scale-110 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]" : "cursor-default"}
                  transition-all duration-300
                `}
                style={isActive ? { boxShadow: "0 0 20px rgba(212,175,55,0.25)" } : {}}
              >
                {/* Ring animasjon for aktiv */}
                {isActive && (
                  <span
                    className="absolute inset-0 rounded-full animate-ping opacity-30"
                    style={{ background: "var(--ts-gold)" }}
                  />
                )}
                {/* Ikon */}
                {isDone ? (
                  <svg className={`w-5 h-5 ${style.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : step.icon ? (
                  <span className={`text-lg ${style.icon}`}>{step.icon}</span>
                ) : (
                  <div className={`w-3 h-3 rounded-full ${style.ring}`} />
                )}
              </button>
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="w-0.5 h-12 bg-white/[0.08]" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pt-1 pb-4">
              <h4 className={`text-sm font-medium ${isActive ? "text-white" : "text-white/40"}`}>
                {step.title}
              </h4>
              <p className="text-xs text-white/30 mt-0.5">{step.description}</p>
              {isActive && (
                <span className="inline-block mt-1.5 text-[11px] font-medium text-[var(--ts-gold)] bg-[var(--ts-gold)]/10 px-2 py-0.5 rounded-full">
                  Pågående
                </span>
              )}
              {isDone && (
                <span className="inline-block mt-1.5 text-[11px] font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                  Fullført
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default JourneyMap;