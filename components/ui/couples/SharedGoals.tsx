/**
 * SharedGoals — Couple's shared goals management
 *
 * Usage:
 *   <SharedGoals
 *     goals={[
 *       { title: "Reise til Italia", progress: 65, deadline: "2026-12-01" },
 *     ]}
 *     onAddGoal={handleAdd}
 *   />
 */

import React from 'react';

export interface SharedGoal {
  id: string;
  title: string;
  progress: number; // 0-100
  deadline?: string;
  color?: 'gold' | 'pink' | 'teal' | 'purple';
  icon?: React.ReactNode;
}

export interface SharedGoalsProps {
  goals: SharedGoal[];
  /** On add goal */
  onAddGoal?: () => void;
  /** On update progress */
  onUpdateProgress?: (goalId: string, progress: number) => void;
  /** Custom class */
  className?: string;
}

const progressColorMap: Record<string, string> = {
  gold: 'bg-ts-gold',
  pink: 'bg-ts-pink',
  teal: 'bg-ts-teal',
  purple: 'bg-ts-purple',
};

const SharedGoals: React.FC<SharedGoalsProps> = ({
  goals,
  onAddGoal,
  onUpdateProgress,
  className = '',
}) => {
  if (goals.length === 0) {
    return (
      <div className={`rounded-2xl border border-white/8 bg-ts-glass/50 backdrop-blur-xl p-8 text-center ${className}`}>
        <p className="text-ts-text-subtle">Inga felles mål ennå</p>
        {onAddGoal && (
          <button onClick={onAddGoal} className="mt-4 px-4 py-2 rounded-xl bg-ts-gold text-ts-bg text-sm font-medium hover:bg-ts-gold/90 transition-all">
            Legg til mål
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {goals.map((goal) => {
        const colorClass = progressColorMap[goal.color || 'gold'];
        return (
          <div
            key={goal.id}
            className="rounded-2xl border border-white/8 bg-ts-glass/50 backdrop-blur-xl p-5 transition-all hover:bg-ts-glass"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {goal.icon && <span className="text-lg">{goal.icon}</span>}
                <h4 className="text-sm font-semibold text-ts-primary">{goal.title}</h4>
              </div>
              <span className="text-sm font-bold text-ts-gold">{goal.progress}%</span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden mb-2">
              <div
                className={`h-full rounded-full ${colorClass} transition-all duration-300`}
                style={{ width: `${goal.progress}%` }}
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              {goal.deadline && (
                <span className="text-xs text-ts-text-subtle">Frist: {new Date(goal.deadline).toLocaleDateString('no-NO')}</span>
              )}
              {onUpdateProgress && (
                <div className="flex gap-1">
                  {[0, 25, 50, 75, 100].map((p) => (
                    <button
                      key={p}
                      onClick={() => onUpdateProgress(goal.id, p)}
                      className={`w-6 h-6 rounded-full text-[10px] flex items-center justify-center transition-all ${
                        p <= goal.progress
                          ? 'bg-ts-gold/20 text-ts-gold'
                          : 'bg-ts-glass text-ts-text-subtle hover:bg-ts-gold/10'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Add goal button */}
      {onAddGoal && (
        <button
          onClick={onAddGoal}
          className="w-full rounded-2xl border border-dashed border-white/10 bg-ts-glass/30 p-4 text-center text-sm text-ts-text-subtle hover:border-ts-gold/30 hover:text-ts-gold transition-all"
        >
          + Legg til felles mål
        </button>
      )}
    </div>
  );
};

SharedGoals.displayName = 'SharedGoals';
export default SharedGoals;