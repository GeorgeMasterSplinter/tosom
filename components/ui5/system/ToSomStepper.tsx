/**
 * ToSom ToSomStepper — System component
 * 
 * Step indicator for onboarding flows with gold active state.
 */

'use client';

import { FC } from 'react';
import { spacing, colors, motion } from '@/design/tokens';

/* ═══════════════════════════════════════════
   PROPS
   ═══════════════════════════════════════════ */
interface StepItem {
  label: string;
  icon?: React.ReactNode;
}

interface ToSomStepperProps {
  steps: StepItem[];
  active: number; // 0-indexed
  orientation?: 'horizontal' | 'vertical';
}

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */
export const ToSomStepper: FC<ToSomStepperProps> = ({ steps, active, orientation = 'horizontal' }) => {
  const isHorizontal = orientation === 'horizontal';

  return (
    <div className={`flex items-center ${isHorizontal ? 'flex-row gap-0' : 'flex-col gap-0'}`}>
      {steps.map((step, index) => {
        const isActive = index === active;
        const isComplete = index < active;

        return (
          <div
            key={index}
            className="flex items-center"
            style={isHorizontal ? { display: 'flex', flex: 1, alignItems: 'center' } : { display: 'flex', width: '100%', alignItems: 'center' }}
          >
            {/* Step indicator */}
            <div
              className="flex items-center justify-center"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: isActive ? 'rgba(212,175,55,0.15)' : isComplete ? `rgba(212,175,55,0.10)` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isActive ? colors.gold : isComplete ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.08)'}`,
                color: isActive ? colors.gold : isComplete ? 'rgba(212,175,55,0.7)' : 'rgba(255,255,255,0.3)',
                fontSize: '14px',
                fontWeight: isActive ? '600' : '400',
                flexShrink: 0,
                transition: `all ${motion.durations.fast} ${motion.easings.smooth}`,
              }}
            >
              {step.icon || (isComplete ? '✓' : index + 1)}
            </div>

            {/* Label */}
            <span
              className="ml-3 text-sm"
              style={{
                color: isActive ? colors.gold : 'rgba(255,255,255,0.65)',
                fontWeight: isActive ? '500' : '400',
                transition: `all ${motion.durations.fast} ${motion.easings.smooth}`,
              }}
            >
              {step.label}
            </span>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className="flex-1 h-[2px] mx-4"
                style={{
                  background: isComplete
                    ? `linear-gradient(90deg, rgba(212,175,55,0.4), rgba(212,175,55,0.1))`
                    : 'rgba(255,255,255,0.05)',
                  transition: `background ${motion.durations.fast} ${motion.easings.smooth}`,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ToSomStepper;