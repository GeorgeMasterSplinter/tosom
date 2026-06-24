/**
 * CoupleTemplate — Full couple/shared page layout
 *
 * Usage:
 *   <CoupleTemplate partner={partner}>
 *     <SharedGoals goals={goals} />
 *   </CoupleTemplate>
 */

import React from 'react';

export interface CoupleTemplateProps {
  /** Page children */
  children: React.ReactNode;
  /** Partner data */
  partner?: {
    name: string;
    avatar?: string;
    daysTogether?: number;
    status?: 'active' | 'away' | 'offline';
  };
  /** Tabs */
  tabs?: Array<{ key: string; label: string; icon?: string }>;
  /** Active tab */
  activeTab?: string;
  /** On tab change */
  onTabChange?: (key: string) => void;
  /** Custom class */
  className?: string;
}

const CoupleTemplate: React.FC<CoupleTemplateProps> = ({
  children,
  partner,
  tabs = [
    { key: 'home', label: 'Heim', icon: '🏠' },
    { key: 'goals', label: 'Mål', icon: '🎯' },
    { key: 'calendar', label: 'Kalender', icon: '📅' },
    { key: 'journal', label: 'Journal', icon: '📝' },
    { key: 'memories', label: 'Minne', icon: '📸' },
  ],
  activeTab = 'home',
  onTabChange,
  className = '',
}) => {
  return (
    <div className={`min-h-screen bg-ts-bg-primary ${className}`}>
      {/* Header */}
      <div className="relative h-40 bg-gradient-to-br from-ts-gold/15 via-ts-pink/10 to-transparent">
        <div className="absolute inset-0 bg-gradient-to-t from-ts-bg-primary to-transparent" />
      </div>

      {/* Content */}
      <div className="relative -mt-16 px-6 pb-6 max-w-4xl mx-auto">
        {/* Partner card */}
        <div className="rounded-2xl border border-white/8 bg-ts-glass/80 backdrop-blur-xl p-5 mb-6">
          <div className="flex items-center gap-4">
            {partner?.avatar ? (
              <img src={partner.avatar} alt={partner.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-ts-gold/20" />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-ts-gold/20 border-2 border-ts-gold/20 flex items-center justify-center">
                <span className="text-lg font-bold text-ts-gold">{partner?.name?.charAt(0).toUpperCase()}</span>
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-lg font-bold text-ts-primary">{partner?.name}</h2>
              <p className="text-xs text-ts-text-subtle">
                {partner?.daysTogether !== undefined ? `${partner.daysTogether} dagar saman` : 'Din partner'}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${
                  partner?.status === 'active' ? 'bg-ts-success' :
                  partner?.status === 'away' ? 'bg-ts-warning' :
                  'bg-ts-text-subtle'
                }`} />
                <span className="text-[10px] text-ts-text-subtle">{
                  partner?.status === 'active' ? 'Aktiv' :
                  partner?.status === 'away' ? 'Borte' : 'Offline'
                }</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onTabChange?.(tab.key)}
              className={`
                flex items-center gap-1.5
                px-4 py-2 rounded-xl
                text-sm font-medium
                whitespace-nowrap
                transition-all
                ${activeTab === tab.key
                  ? 'bg-ts-gold/15 border border-ts-gold/20 text-ts-gold'
                  : 'bg-ts-glass/50 border border-white/8 text-ts-text-secondary hover:text-ts-primary hover:border-ts-gold/15'
                }
              `}
            >
              <span className="text-sm">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Children */}
        {children}
      </div>
    </div>
  );
};

CoupleTemplate.displayName = 'CoupleTemplate';
export default CoupleTemplate;