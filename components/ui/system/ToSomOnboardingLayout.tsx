/**
 * Tosom ToSomOnboardingLayout — System component
 * 
 * Standard onboarding layout with stepper + glass panel.
 */

'use client';

import { FC } from 'react';
import { spacing } from '@/config/design-tokens';
import { ToSomPage } from './ToSomPage';
import { ToSomGlassPanel } from './ToSomGlassPanel';
import { ToSomStepper } from './ToSomStepper';

interface StepItem {
  label: string;
  icon?: React.ReactNode;
}

interface ToSomOnboardingLayoutProps {
  steps: StepItem[];
  activeStep: number;
  children: React.ReactNode;
  stepOrientation?: 'horizontal' | 'vertical';
}

export const ToSomOnboardingLayout: FC<ToSomOnboardingLayoutProps> = ({
  steps,
  activeStep,
  children,
  stepOrientation = 'horizontal',
}) => {
  return (
    <ToSomPage spotlight="hero">
      <div className="mx-auto max-w-xl" style={{ paddingTop: `${spacing['xl']}` }}>
        <ToSomStepper steps={steps} active={activeStep} orientation={stepOrientation} />
        <div style={{ marginTop: `${spacing['xl']}` }}>
          <ToSomGlassPanel padding="xl">
            {children}
          </ToSomGlassPanel>
        </div>
      </div>
    </ToSomPage>
  );
};

export default ToSomOnboardingLayout;