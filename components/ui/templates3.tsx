/**
 * ToSom UI 3.0 — Templates 3.0
 *
 * Multi-platform page templates with responsive layouts.
 * - DashboardTemplate (mobile + desktop)
 * - ChatTemplate (mobile-first)
 * - ProfileTemplate (responsive)
 * - CoupleTemplate (multi-platform)
 * - JourneyTemplate (responsive)
 * - MatchTemplate (responsive)
 *
 * Usage:
 *   import { DashboardTemplate3, ChatTemplate3, ProfileTemplate3, CoupleTemplate3 } from '@/components/ui/templates3'
 */

import React from 'react';

/* ── Shared Types ── */
export interface PageHeader {
  title: string;
  subtitle?: string;
  actions?: Array<{ label: string; onClick: () => void; variant?: 'primary' | 'secondary' | 'ghost' }>;
}

/* ── Dashboard Template 3.0 ── */
export const DashboardTemplate3: React.FC<{
  header: PageHeader;
  children: React.ReactNode;
  quickStats?: Array<{ label: string; value: string | number; icon: string }>;
}> = ({ header, children, quickStats }) => (
  <div className="min-h-screen bg-[#0B0E11]">
    {/* Header */}
    <div className="sticky top-0 z-40 bg-white/[0.04] border-b border-white/8 backdrop-blur-xl px-4 py-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-white font-semibold text-xl">{header.title}</h1>
        {header.subtitle && <p className="text-white/50 text-sm mt-1">{header.subtitle}</p>}
        {header.actions && (
          <div className="flex gap-2 mt-3">
            {header.actions.map((a, i) => (
              <button
                key={i}
                onClick={a.onClick}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  a.variant === 'primary' ? 'bg-[#D4AF37] text-[#0B0E11]' :
                  a.variant === 'secondary' ? 'bg-white/[0.04] border border-white/8 text-white' :
                  'text-white/65 hover:text-white'
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>

    {/* Quick Stats */}
    {quickStats && (
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="grid grid-cols-3 gap-3">
          {quickStats.map((stat, i) => (
            <div key={i} className="bg-white/[0.04] border border-white/8 rounded-2xl p-4 backdrop-blur-xl text-center">
              <span className="text-xl block mb-1">{stat.icon}</span>
              <span className="text-[#D4AF37] font-semibold text-lg">{stat.value}</span>
              <span className="text-white/45 text-xs block">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Main Content */}
    <div className="max-w-4xl mx-auto px-4 py-4">{children}</div>
  </div>
);

/* ── Chat Template 3.0 (mobile-first) ── */
export const ChatTemplate3: React.FC<{
  header: PageHeader;
  messages: Array<{ id: string; text: string; sent: boolean; timestamp?: string }>;
  onSend?: (text: string) => void;
  suggestions?: string[];
}> = ({ header, messages, onSend, suggestions }) => {
  const [input, setInput] = React.useState('');
  return (
    <div className="flex flex-col h-screen bg-[#0B0E11]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/[0.04] border-b border-white/8 backdrop-blur-xl px-4 py-3">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-white font-semibold text-base">{header.title}</h1>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-2xl mx-auto space-y-3">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                msg.sent
                  ? 'bg-[#D4AF37]/15 border border-[#D4AF37]/25 rounded-2xl rounded-tr-sm text-white'
                  : 'bg-white/[0.06] border border-white/8 rounded-2xl rounded-se-sm text-white'
              }`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
                {msg.timestamp && (
                  <p className={`text-[10px] mt-1 ${msg.sent ? 'text-[#D4AF37]/60' : 'text-white/35'}`}>{msg.timestamp}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <div className="px-4 py-2 flex gap-2 overflow-x-auto border-t border-white/6">
          {suggestions.map((s, i) => (
            <button key={i} onClick={() => onSend?.(s)} className="flex-shrink-0 bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] px-3 py-1.5 rounded-full text-xs font-medium">
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="sticky bottom-0 bg-white/[0.04] border-t border-white/8 backdrop-blur-xl px-4 py-3">
        <div className="max-w-2xl mx-auto flex gap-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Skriv en melding..."
            className="flex-1 bg-white/[0.04] border border-white/8 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#D4AF37] transition-all placeholder:text-white/40"
          />
          <button
            onClick={() => { onSend?.(input); setInput(''); }}
            disabled={!input.trim()}
            className="bg-[#D4AF37] text-[#0B0E11] px-5 py-3 rounded-xl font-semibold text-sm disabled:opacity-40 active:scale-[0.97] transition-transform"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Profile Template 3.0 (responsive) ── */
export const ProfileTemplate3: React.FC<{
  name: string;
  bio: string;
  journeyDay: number;
  resonance: number;
  children?: React.ReactNode;
}> = ({ name, bio, journeyDay, resonance, children }) => (
  <div className="min-h-screen bg-[#0B0E11]">
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Avatar + Info */}
      <div className="text-center mb-8">
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#D4AF37]/30 to-[#D4AF37]/10 border-2 border-[#D4AF37]/30 flex items-center justify-center mb-4">
          <span className="text-[#D4AF37] text-3xl">◆</span>
        </div>
        <h1 className="text-white font-semibold text-2xl">{name}</h1>
        <p className="text-white/50 text-sm mt-1">Dag {journeyDay} på reisen</p>
        <p className="text-white/60 text-sm mt-3 leading-relaxed max-w-sm mx-auto">{bio}</p>
      </div>

      {/* Resonance */}
      <div className="bg-white/[0.04] border border-white/8 rounded-2xl p-5 mb-6 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/70 text-sm font-medium">Resonans</span>
          <span className="text-[#D4AF37] text-sm font-semibold">{resonance}%</span>
        </div>
        <div className="bg-white/[0.04] rounded-full h-2.5 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#D4AF37] to-[#E8C766] rounded-full transition-all duration-500" style={{ width: `${resonance}%` }} />
        </div>
      </div>

      {children}
    </div>
  </div>
);

/* ── Couple Template 3.0 (multi-platform) ── */
export const CoupleTemplate3: React.FC<{
  partnerA: string;
  partnerB: string;
  journeyDay: number;
  tabs: Array<{ id: string; label: string; icon: string }>;
  activeTab: string;
  onTabChange: (id: string) => void;
  children: React.ReactNode;
}> = ({ partnerA, partnerB, journeyDay, tabs, activeTab, onTabChange, children }) => (
  <div className="min-h-screen bg-[#0B0E11]">
    {/* Header */}
    <div className="sticky top-0 z-40 bg-white/[0.04] border-b border-white/8 backdrop-blur-xl px-4 py-3">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center gap-3 mb-1">
          <span className="text-white font-medium text-sm">{partnerA}</span>
          <span className="text-[#D4AF37] text-lg">♡</span>
          <span className="text-white font-medium text-sm">{partnerB}</span>
        </div>
        <p className="text-white/45 text-xs">Dag {journeyDay} sammen</p>
      </div>
    </div>

    {/* Tabs */}
    <div className="border-b border-white/6">
      <div className="max-w-4xl mx-auto flex overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${
              activeTab === tab.id
                ? 'text-[#D4AF37] border-[#D4AF37]'
                : 'text-white/50 border-transparent hover:text-white/70'
            }`}
          >
            <span className="mr-1.5">{tab.icon}</span>{tab.label}
          </button>
        ))}
      </div>
    </div>

    {/* Content */}
    <div className="max-w-4xl mx-auto px-4 py-4">{children}</div>
  </div>
);

/* ── Journey Template 3.0 (responsive) ── */
export const JourneyTemplate3: React.FC<{
  title: string;
  day: number;
  chapters: Array<{ id: string; title: string; completed: boolean }>;
  activeChapter: string;
  onChapterChange: (id: string) => void;
  children: React.ReactNode;
}> = ({ title, day, chapters, activeChapter, onChapterChange, children }) => (
  <div className="min-h-screen bg-[#0B0E11]">
    <div className="sticky top-0 z-40 bg-white/[0.04] border-b border-white/8 backdrop-blur-xl px-4 py-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-[#D4AF37] font-semibold text-xl">{title}</h1>
        <p className="text-white/50 text-sm mt-1">Dag {day} · Kapittel: {chapters.find(c => c.id === activeChapter)?.title || '1'}</p>
      </div>
    </div>

    {/* Chapter selector */}
    <div className="max-w-3xl mx-auto px-4 py-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {chapters.map(ch => (
          <button
            key={ch.id}
            onClick={() => onChapterChange(ch.id)}
            className={`bg-white/[0.04] border rounded-xl p-3 text-left text-sm font-medium transition-all ${
              activeChapter === ch.id
                ? 'border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37]'
                : ch.completed
                  ? 'border-white/8 text-white/50'
                  : 'border-white/8 text-white/70 hover:bg-white/[0.04]'
            }`}
          >
            {ch.completed && <span className="mr-1">✓</span>}
            {ch.title}
          </button>
        ))}
      </div>
    </div>

    {/* Content */}
    <div className="max-w-3xl mx-auto px-4 pb-8">{children}</div>
  </div>
);

/* ── Match Template 3.0 (responsive) ── */
export const MatchTemplate3: React.FC<{
  name: string;
  age: number;
  bio: string;
  resonance: number;
  commonInterests: string[];
  onConnect?: () => void;
  onPass?: () => void;
}> = ({ name, age, bio, resonance, commonInterests, onConnect, onPass }) => (
  <div className="min-h-screen bg-[#0B0E11] flex items-center justify-center px-4 py-8">
    <div className="max-w-sm w-full">
      <div className="bg-white/[0.04] border border-white/8 rounded-3xl p-6 backdrop-blur-xl shadow-xl">
        {/* Avatar */}
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#D4AF37]/30 to-[#D4AF37]/10 border-2 border-[#D4AF37]/30 flex items-center justify-center mb-4">
          <span className="text-[#D4AF37] text-2xl">◆</span>
        </div>

        {/* Info */}
        <h2 className="text-white font-semibold text-xl text-center">{name}, {age}</h2>
        <p className="text-white/60 text-sm mt-3 leading-relaxed text-center">{bio}</p>

        {/* Resonance */}
        <div className="mt-4 bg-white/[0.04] rounded-xl p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-white/50 text-xs">Resonans</span>
            <span className="text-[#D4AF37] text-xs font-semibold">{resonance}%</span>
          </div>
          <div className="bg-white/[0.04] rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#D4AF37] to-[#E8C766] rounded-full" style={{ width: `${resonance}%` }} />
          </div>
        </div>

        {/* Interests */}
        {commonInterests.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4 justify-center">
            {commonInterests.slice(0, 5).map((interest, i) => (
              <span key={i} className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] px-2.5 py-1 rounded-full text-xs font-medium">
                {interest}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          {onPass && (
            <button onClick={onPass} className="flex-1 bg-white/[0.04] border border-white/8 text-white py-3.5 rounded-xl font-medium text-sm active:scale-[0.97] transition-transform">
              Neste
            </button>
          )}
          {onConnect && (
            <button onClick={onConnect} className="flex-1 bg-[#D4AF37] text-[#0B0E11] py-3.5 rounded-xl font-semibold text-sm active:scale-[0.97] transition-transform">
              Koble
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default { DashboardTemplate3, ChatTemplate3, ProfileTemplate3, CoupleTemplate3, JourneyTemplate3, MatchTemplate3 };