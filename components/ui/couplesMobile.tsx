/**
 * ToSom UI 3.0 — Couples Mode Mobile Components
 *
 * Mobile-optimized shared experience components for couples.
 * All use touch-friendly sizing and scrollable layouts.
 *
 * Usage:
 *   import { SharedHomeMobile, SharedCalendarMobile, SharedJournalMobile, MemoryLaneMobile } from '@/components/ui/couplesMobile'
 */

import React from 'react';
import { platform } from '@/components/ui/tokens';

/* ── Shared Home (mobile layout) ── */
export const SharedHomeMobile: React.FC<{
  partnerName: string;
  journeyDay: number;
  resonance: number;
  unreadMessages?: number;
}> = ({ partnerName, journeyDay, resonance, unreadMessages = 0 }) => (
  <div className="min-h-screen bg-[#0B0E11] px-4 pt-4 pb-24">
    {/* Partner header */}
    <div className="bg-white/[0.04] border border-white/8 rounded-2xl p-5 mb-4 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center justify-center">
          <span className="text-[#D4AF37] text-xl">♾</span>
        </div>
        <div className="flex-1">
          <h2 className="text-white font-semibold text-lg">{partnerName}</h2>
          <p className="text-white/50 text-sm">Dere er på dag {journeyDay} sammen</p>
        </div>
        {unreadMessages > 0 && (
          <div className="bg-[#FF4D4D] text-white text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center">
            {unreadMessages}
          </div>
        )}
      </div>
    </div>

    {/* Resonance meter */}
    <div className="bg-white/[0.04] border border-white/8 rounded-2xl p-5 mb-4 backdrop-blur-xl">
      <h3 className="text-white/70 text-sm font-medium mb-3">Resonans</h3>
      <div className="bg-white/[0.04] rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#D4AF37] to-[#E8C766] rounded-full transition-all duration-500"
          style={{ width: `${resonance}%` }}
        />
      </div>
      <p className="text-white/50 text-xs mt-2">{resonance}% harmoni</p>
    </div>

    {/* Quick actions */}
    <div className="grid grid-cols-2 gap-3">
      {[
        { icon: '💬', label: 'Samtale', route: '/chat' },
        { icon: '🗺', label: 'Reise', route: '/journey' },
        { icon: '📅', label: 'Kalender', route: '/calendar' },
        { icon: '📓', label: 'Dagbok', route: '/journal' },
      ].map(action => (
        <button
          key={action.label}
          className="bg-white/[0.04] border border-white/8 rounded-2xl p-5 backdrop-blur-xl active:scale-[0.97] transition-transform text-center"
        >
          <span className="text-2xl block mb-2">{action.icon}</span>
          <span className="text-white/70 text-sm font-medium">{action.label}</span>
        </button>
      ))}
    </div>
  </div>
);

/* ── Shared Calendar (mobile) ── */
export const SharedCalendarMobile: React.FC<{ events: Array<{ date: string; title: string; type: string }> }> = ({ events }) => (
  <div className="min-h-screen bg-[#0B0E11] px-4 pt-4 pb-24">
    <h2 className="text-white font-semibold text-xl mb-4">Kalender</h2>
    <div className="space-y-3">
      {events.map((event, i) => (
        <div
          key={i}
          className="bg-white/[0.04] border border-white/8 rounded-2xl p-4 backdrop-blur-xl"
        >
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${
              event.type === 'milestone' ? 'bg-[#D4AF37]' :
              event.type === 'date' ? 'bg-[#60A5FA]' :
              'bg-white/40'
            }`} />
            <div className="flex-1">
              <p className="text-white text-sm font-medium">{event.title}</p>
              <p className="text-white/45 text-xs">{event.date}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ── Shared Journal (mobile editor) ── */
export const SharedJournalMobile: React.FC<{
  entries?: Array<{ date: string; text: string }>;
  onNew?: () => void;
}> = ({ entries = [], onNew }) => (
  <div className="min-h-screen bg-[#0B0E11] px-4 pt-4 pb-24">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-white font-semibold text-xl">Dagbok</h2>
      {onNew && (
        <button
          onClick={onNew}
          className="bg-[#D4AF37] text-[#0B0E11] px-4 py-2 rounded-xl text-sm font-semibold"
        >
          + Ny
        </button>
      )}
    </div>
    <div className="space-y-3">
      {entries.map((entry, i) => (
        <div
          key={i}
          className="bg-white/[0.04] border border-white/8 rounded-2xl p-4 backdrop-blur-xl"
        >
          <p className="text-white/45 text-xs mb-2">{entry.date}</p>
          <p className="text-white/70 text-sm leading-relaxed">{entry.text}</p>
        </div>
      ))}
      {entries.length === 0 && (
        <div className="text-center py-12">
          <span className="text-4xl block mb-3">📓</span>
          <p className="text-white/45 text-sm">Ingen poster ennå</p>
          <p className="text-white/30 text-xs mt-1">Begynn å skrive sammen</p>
        </div>
      )}
    </div>
  </div>
);

/* ── Memory Lane (swipeable carousel) ── */
export const MemoryLaneMobile: React.FC<{
  memories: Array<{ date: string; description: string; image?: string }>;
}> = ({ memories }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  return (
    <div className="min-h-screen bg-[#0B0E11] px-4 pt-4 pb-24 flex flex-col">
      <h2 className="text-white font-semibold text-xl mb-6">Minnesvei</h2>

      {/* Card stack */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {memories[currentIndex] && (
          <div className="w-full max-w-sm">
            {memories[currentIndex].image && (
              <div className="bg-white/[0.04] border border-white/8 rounded-2xl overflow-hidden mb-4">
                <div className="h-48 bg-[#D4AF37]/10 flex items-center justify-center">
                  <span className="text-4xl">📷</span>
                </div>
              </div>
            )}
            <div className="bg-white/[0.04] border border-white/8 rounded-2xl p-5 backdrop-blur-xl text-center">
              <p className="text-[#D4AF37] text-xs font-medium mb-2">{memories[currentIndex].date}</p>
              <p className="text-white/70 text-base leading-relaxed">{memories[currentIndex].description}</p>
            </div>
          </div>
        )}

        {/* Dots */}
        <div className="flex gap-2 mt-6">
          {memories.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentIndex ? 'w-6 bg-[#D4AF37]' : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const CouplesMobileComponents = { SharedHomeMobile, SharedCalendarMobile, SharedJournalMobile, MemoryLaneMobile };

export default CouplesMobileComponents;
