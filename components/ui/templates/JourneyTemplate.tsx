/**
 * JourneyTemplate — Full journey/progress page layout
 *
 * Usage:
 *   <JourneyTemplate currentPhase={3} totalPhases={5}>
 *     <TimelineV2 events={events} />
 *   </JourneyTemplate>
 */

import React from 'react';

export interface JourneyTemplateProps {
  /** Page children */
  children: React.ReactNode;
  /** Current phase */
  currentPhase?: number;
  /** Total phases */
  totalPhases?: number;
  /** Journey title */
  title?: string;
  /** Journey description */
  description?: string;
  /** Journey progress 0-100 */
  progress?: number;
  /** Custom class */
  className?: string;
}

const JourneyTemplate: React.FC<JourneyTemplateProps> = ({
  children,
  currentPhase = 1,
  totalPhases = 5,
  title = 'Reisa di',
  description = 'Følg reisa di sammen',
  progress = 0,
  className = '',
}) => {
  const phases = Array.from({ length: totalPhases }, (_, i) => ({
    index: i + 1,
    label: `Fase ${i + 1}`,
    completed: i < currentPhase - 1,
    current: i === currentPhase - 1,
  }));

  return (
    <div className={`min-h-screen bg-ts-bg-primary ${className}`}>
      {/* Header */}
      <div className="relative h-56 bg-gradient-to-br from-ts-gold/15 via-ts-purple/10 to-transparent">
        <div className="absolute inset-0 bg-gradient-to-t from-ts-bg-primary to-transparent" />
      </div>

      {/* Content */}
      <div className="relative -mt-20 px-6 pb-6 max-w-3xl mx-auto">
        {/* Title card */}
        <div className="rounded-2xl border border-white/8 bg-ts-glass/80 backdrop-blur-xl p-6 mb-6">
          <h1 className="text-2xl font-bold text-ts-primary">{title}</h1>
          <p className="text-sm text-ts-text-secondary mt-1">{description}</p>

          {/* Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-ts-gold">{currentPhase}/{totalPhases} fase</span>
              <span className="text-xs font-bold text-ts-gold">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-ts-gold to-ts-gold/60 transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        {/* Phase steps */}
        <div className="rounded-2xl border border-white/8 bg-ts-glass/50 backdrop-blur-xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-ts-primary mb-4">Fasar</h3>
          <div className="space-y-3">
            {phases.map((phase) => (
              <div key={phase.index} className="flex items-center gap-3">
                {/* Phase indicator */}
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2
                  ${phase.completed ? 'bg-ts-gold border-ts-gold text-ts-bg' :
                    phase.current ? 'bg-ts-gold/15 border-ts-gold text-ts-gold animate-pulse' :
                    'bg-ts-glass border-white/10 text-ts-text-subtle'}
                `}>
                  {phase.completed ? '✓' : phase.index}
                </div>
                {/* Line */}
                {phase.index < totalPhases && (
                  <div className={`flex-1 h-0.5 ${phase.completed ? 'bg-ts-gold/30' : 'bg-white/5'}`} />
                )}
                {/* Label */}
                <span className={`text-xs ${phase.current ? 'text-ts-gold font-medium' : 'text-ts-text-subtle'}`}>
                  {phase.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Children */}
        {children}
      </div>
    </div>
  );
};

JourneyTemplate.displayName = 'JourneyTemplate';
export default JourneyTemplate;