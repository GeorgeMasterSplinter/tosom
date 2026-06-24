/**
 * ToSom – ProgressSteps
 * Viser progresjon i match-reisen.
 * Aktivt steg: gull-gradient + underline.
 * Fullførte steg: 40% opacity.
 * Kommende steg: 20% opacity.
 */

'use client';

import { FC } from 'react';

interface Step {
  id: number;
  label: string;
  status: 'complete' | 'active' | 'upcoming';
}

interface ProgressStepsProps {
  steps: Step[];
}

export const ProgressSteps: FC<ProgressStepsProps> = ({ steps }) => {
  return (
    <div className="w-full mb-8 fade-in">
      <div className="flex items-center justify-center gap-0">
        {steps.map((step, index) => {
          // Farge per status
          let dotBg = 'rgba(255,255,255,0.08)';
          let dotBorder = 'rgba(255,255,255,0.12)';
          let dotColor = 'rgba(255,255,255,0.25)';
          let labelColor = 'rgba(255,255,255,0.2)';
          let lineWidth = 'rgba(255,255,255,0.08)';

          if (step.status === 'active') {
            dotBg = '#D4AF37';
            dotBorder = '#E8C766';
            dotColor = '#FFFFFF';
            labelColor = '#FFFFFF';
            lineWidth = 'rgba(212,175,55,0.4)';
          } else if (step.status === 'complete') {
            dotBg = 'rgba(212,175,55,0.3)';
            dotBorder = 'rgba(212,175,55,0.5)';
            dotColor = 'rgba(212,175,55,0.8)';
            labelColor = 'rgba(255,255,255,0.4)';
            lineWidth = 'rgba(212,175,55,0.25)';
          }

          return (
            <div key={step.id} className="flex items-center">
              {/* Stig-bokstav */}
              <div className="flex flex-col items-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-250 ease-out"
                  style={{
                    background: dotBg,
                    border: step.status === 'active' ? '2px solid #E8C766' : `1px solid ${dotBorder}`,
                    boxShadow: step.status === 'active'
                      ? '0 0 12px rgba(212,175,55,0.35), 0 0 24px rgba(212,175,55,0.15)'
                      : 'none',
                  }}
                >
                  {step.status === 'complete' ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M5 13l4 4L19 7" stroke={dotColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : step.status === 'active' ? (
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: dotColor }} />
                  ) : (
                    <span style={{ color: dotColor, fontSize: '12px', fontWeight: 500 }}>
                      {step.id}
                    </span>
                  )}
                </div>
                <span
                  className="text-xs mt-1.5 font-medium transition-all duration-250"
                  style={{ color: labelColor }}
                >
                  {step.label}
                </span>
              </div>

              {/* Linje til neste steg */}
              {index < steps.length - 1 && (
                <div className="w-12 md:w-20 h-px mx-2" style={{ background: lineWidth }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};