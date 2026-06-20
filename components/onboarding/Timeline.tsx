import React from "react";

interface Props {
  current: number; // 1–8
}

export default function Timeline({ current }: Props) {
  const steps = [
    "Grunnleggende",
    "Hverdag",
    "Verdier",
    "Personlighet",
    "Relasjonsstil",
    "Oppsummering",
    "Profil",
    "Fullført",
  ];

  return (
    <div className="max-w-md mx-auto px-4 w-full mt-6 mb-4 bg-[var(--color-card)] rounded-2xl p-8 shadow-sm transition-opacity duration-200 opacity-100">
      <p className="text-sm leading-relaxed text-[var(--color-muted)] mb-2 animate-fadeIn">
        Du er på vei! Hver dag lærer du litt mer. Ta det rolig — vi er her for å hjelpe deg.
      </p>
        <div className="flex justify-between relative">
          {/* Linje bak */}
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[var(--color-card-border)] -translate-y-1/2" />

          {/* Linje foran (progress) */}
          <div
            className="absolute top-1/2 left-0 h-[2px] bg-[var(--color-gold)] -translate-y-1/2 transition-all duration-300 ease-out"
            style={{
              width: `${((current - 1) / 7) * 100}%`,
            }}
          />

          {/* Punkter */}
          <div className="space-y-4">
            {steps.map((label, i) => {
              const stepNumber = i + 1;
              const isActive = current === stepNumber;
              const isCompleted = current > stepNumber;

              return (
                <div key={i} className="flex flex-col items-center w-full">
                  <div
                    className={`
                      w-4 h-4 rounded-full border transition-all duration-300
                      ${isCompleted ? "bg-[var(--color-gold)] border-[var(--color-gold)]" : ""}
                      ${isActive ? "bg-[var(--color-bg)] border-[var(--color-gold)] scale-125 timeline-active" : ""}
                      ${!isActive && !isCompleted ? "bg-[var(--color-bg)] border-[var(--color-card-border)]" : ""}
                    `}
                  />

                  <span
                    className={`
                      text-xs mt-2 transition-opacity duration-300 leading-tight text-[var(--color-muted)] ${isActive ? "opacity-100 font-medium" : "opacity-40"}
                    `}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
}
