/* ═══════════════════════════════════════════
   ToSom Premium — StepIndicator Component
   Props: steps (number), currentStep (number), stepLabels? (string[])
   Aktivt: gold ring | Fullført: bg-gold | Kommende: border-muted
   ═══════════════════════════════════════════ */

import { useEffect, useState } from "react";

interface StepIndicatorProps {
  steps: number;
  currentStep: number;
  stepLabels?: string[];
  className?: string;
}

export const StepIndicator = ({
  steps,
  currentStep,
  stepLabels,
  className = "",
}: StepIndicatorProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {Array.from({ length: steps }, (_, i) => {
        const isCompleted = i < currentStep;
        const isActive = i === currentStep;

        return (
          <div key={i} className="flex items-center gap-2">
            <div
              className={`
                flex items-center justify-center rounded-full transition-all duration-300 ease-out
                h-10 w-10 text-sm font-medium
                ${visible ? "opacity-100 scale-100" : "opacity-0 scale-90"}
                ${
                  isCompleted
                    ? "bg-[var(--ts-gold)] text-[var(--ts-text-primary)] shadow-[0_0_12px_rgba(212,175,55,0.3)]"
                    : "border-2 border-[var(--ts-gold)] text-[var(--ts-gold)] shadow-[0_0_8px_rgba(212,175,55,0.2)]"
                }
              `}
            >
              {isCompleted ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <span>{i + 1}</span>
              )}
            </div>
            {stepLabels?.[i] && (
              <span
                className={`
                  text-xs font-medium transition-colors duration-300
                  ${isActive ? "text-[var(--ts-gold)]" : "text-[var(--ts-text-muted)]"}
                `}
              >
                {stepLabels[i]}
              </span>
            )}
            {i < steps - 1 && (
              <div
                className={`
                  w-8 h-0.5 rounded-full transition-all duration-300 ease-out
                  ${isCompleted ? "bg-[var(--ts-gold)]" : "bg-[var(--ts-border)]"}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;