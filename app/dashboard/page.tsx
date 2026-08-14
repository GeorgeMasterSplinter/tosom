/**
 * ToSom — Unified Premium Dashboard ("Din oversikt")
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ChatIcon from '@/components/icons/ChatIcon';
import ProfileIcon from '@/components/icons/ProfileIcon';
import SettingsIcon from '@/components/icons/SettingsIcon';
import { color, radius, typography, glassVariant } from '@/config/design-tokens';
import PremiumButton from '@/components/ui/PremiumButton';
import { AmbientGlow, AmbientGlowStyles } from '@/components/atmosphere/AmbientGlow';
import { PulseGlowStyles } from '@/components/ui/PulseGlow';
import { GlassPanelStyles } from '@/components/ui/system/ToSomGlassPanel';
import { PremiumJourneyDayView, getDayContent } from '@/components/journey/PremiumJourneyDayView';
import { PremiumJourneyProgressTracker } from '@/components/journey/PremiumJourneyProgressTracker';
import { JourneyTimeline } from '@/components/journey/JourneyTimeline';
import { ImageShareLockBanner } from '@/components/journey/ImageShareLockBanner';
import { GradientOverlay } from '@/components/atmosphere/GradientOverlay';
import { WaitingForMatch } from '@/components/dashboard/WaitingForMatch';
import { ProfileLockBanner } from '@/components/profile/ProfileLockBanner';
import { TodayCard } from '@/components/journey/TodayCard';
import { FadeIn, StaggerContainer } from '@/components/animations/FadeIn';

interface DashboardData {
  userName: string;
  matched: boolean;
  partnerName: string | null;
  daysTogether: number;
  daysCompleted: number;
  currentDay: number;
}

const actionItems = [
  { label: 'Gå til samtalen', href: '/chat', icon: <ChatIcon className="w-6 h-6 flex-shrink-0" /> },
  { label: 'Oppdater profil', href: '/onboarding', icon: <ProfileIcon className="w-6 h-6 flex-shrink-0" /> },
  { label: 'Innstillinger', href: '/settings', icon: <SettingsIcon className="w-6 h-6 flex-shrink-0" /> },
];

function ConfirmExitModal({ isOpen, onClose, onConfirm, currentDay }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; currentDay?: number }) {
  const [exiting, setExiting] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  if (!isOpen) return null;

  const handleExit = async () => {
    setErrMsg(null);
    setExiting(true);
    try {
      const res = await fetch('/api/journey/exit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reason: 'User-initiated exit' }) });
      if (res.ok) { onConfirm(); } else { const err = await res.json(); setErrMsg(err.error || 'Kunne ikke avslutte reisen'); }
    } catch { setErrMsg('Nettverksfeil. Vær så snill og prøv på nytt.'); }
    finally { setExiting(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="w-full max-w-md rounded-3xl p-8 relative mx-auto" style={{ background: 'rgba(11, 21, 32, 0.95)', backdropFilter: 'blur(24px)', border: '1px solid rgba(212, 175, 55, 0.25)', boxShadow: '0 12px 60px rgba(0,0,0,0.5)' }}>
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:brightness-125 text-xl" style={{ color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.05)' }}>✕</button>
        {/* D2: Inline feilmelding */}
        {errMsg && <div className="mb-4 px-4 py-3 rounded-xl text-sm text-center" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444' }}>{errMsg}</div>}
        <div className="text-center">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(255, 77, 77, 0.1)', border: '2px solid rgba(255, 77, 77, 0.3)' }}><span className="text-2xl">🚪</span></div>
          <h3 className="text-xl font-bold mb-2" style={{ color: 'rgba(255,255,255,0.95)' }}>Avslutt reisen?</h3>
          <p className="text-sm mb-6 leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>Du er nå på dag {currentDay ?? 0} av 30. Reisen din vil bli avsluttet.</p>
          <div className="flex gap-3">
            <button onClick={onClose} disabled={exiting} className="flex-1 py-4 rounded-2xl font-bold transition-all hover:brightness-110 text-base" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)' }}>Fortsett</button>
            <button onClick={handleExit} disabled={exiting} className="flex-1 py-4 rounded-2xl font-bold transition-all hover:brightness-110 active:scale-[0.98] text-base disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #FF4D4D, #FF6B6B)', color: '#fff', boxShadow: '0 6px 24px rgba(255, 77, 77, 0.3)' }}>{exiting ? 'Avslutter...' : 'Avslutt reise'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [greeting, setGreeting] = useState('');
  const [selectedDay, setSelectedDay] = useState<number>(7);
  const [showExitModal, setShowExitModal] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 6) setGreeting('God natt');
    else if (hour < 12) setGreeting('God morgen');
    else if (hour < 18) setGreeting('God ettermiddag');
    else setGreeting('God kveld');
    fetchDashboardData();
  }, []);

  const fetchUserName = async (): Promise<string> => {
    try {
      const res = await fetch('/api/auth/session');
      if (res.ok) {
        const json = await res.json();
        if (json?.user?.name) return json.user.name;
        if (json?.user?.email) return json.user.email.split('@')[0];
      }
    } catch {}
    const storedUser = localStorage.getItem('testUserId') || 'Bruker';
    if (storedUser === 'test-user-1') return 'Astrid';
    if (storedUser === 'test-user-2') return 'Magnus';
    return 'Ane';
  };

  const fetchDashboardData = async () => {
    try {
      const userName = await fetchUserName();
      const matchRes = await fetch('/api/match/check', { method: 'POST', headers: { 'Content-Type': 'application/json' } });
      if (matchRes.ok) {
        const matchJson = await matchRes.json();
        if (matchJson.success && matchJson.data) {
          let partnerName = null;
          let daysTogether = 0;
          let daysCompleted = 0;
          let currentDay = 0;

          if (matchJson.data.hasActiveMatch) {
            const matchesRes = await fetch('/api/match');
            if (matchesRes.ok) {
              const matchesJson = await matchesRes.json();
              if (matchesJson?.activeMatches?.[0]) partnerName = matchesJson.activeMatches[0].partnerName || null;
            }
            const journeyRes = await fetch('/api/journey/status');
            if (journeyRes.ok) {
              const journeyJson = await journeyRes.json();
              if (journeyJson.success && journeyJson.data) {
                currentDay = journeyJson.data.day || 1;
                daysCompleted = journeyJson.data.completedDays || currentDay - 1;
                daysTogether = currentDay;
              } else { currentDay = 1; daysTogether = 1; }
            } else { currentDay = 1; daysTogether = 1; }
          }

          setData({ userName, matched: matchJson.data.hasActiveMatch, partnerName, daysTogether, daysCompleted, currentDay });
        }
      } else {
        setData({ userName, matched: false, partnerName: null, daysTogether: 0, daysCompleted: 0, currentDay: 0 });
      }
    } catch {
      const userName = await fetchUserName();
      setData({ userName, matched: false, partnerName: null, daysTogether: 0, daysCompleted: 0, currentDay: 0 });
    }
  };

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: color.bg.primary }}>
        <div className="text-white/40 text-lg animate-pulse">Laster rommet ditt...</div>
      </div>
    );
  }

  return (
    <>
      <AmbientGlow color="blue" position="top-right" intensity={0.08} speed={7} />
      <AmbientGlowStyles />
      <PulseGlowStyles />
      <GlassPanelStyles />
      <GradientOverlay color="hero" position="bottom" intensity={0.4} />

      <div className="min-h-screen w-full py-8 md:py-12 relative overflow-hidden" style={{ background: color.bg.primary }}>
        <div className="mx-auto max-w-[720px] space-y-6 px-4 md:px-0 relative z-10">

          {/* Header */}
          <FadeIn variant="fadeInUp" delay={0}>
            <div className="w-full rounded-2xl p-6 md:p-8" style={{ background: 'rgba(255, 255, 255, 0.04)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: `${radius.xl}px` }}>
              <h1 className="mb-2" style={{ fontSize: `${typography.fontSize['3xl']}px`, fontWeight: typography.fontWeight.semibold, color: color.text.primary }}>{greeting}, {data.userName.split(' ')[0]}</h1>
              <p style={{ fontSize: `${typography.fontSize.lg}px`, lineHeight: typography.lineHeight.normal, color: color.text.secondary }}>Ta deg tid. Her møter du partneren din, steg for steg.</p>
            </div>
          </FadeIn>

          {/* Handlinger */}
          {data.matched && (
            <FadeIn variant="fadeInUp" delay={0.1}>
              <div className="w-full rounded-xl p-6" style={{ background: 'rgba(255, 255, 255, 0.04)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: `${radius.xl}px` }}>
                <p className="mb-4" style={{ fontSize: `${typography.fontSize.lg}px`, fontWeight: typography.fontWeight.semibold, color: 'rgba(212, 175, 55, 0.6)' }}>Handlinger</p>
                <StaggerContainer stagger={0.1} delayFirst={0.2}>
                  <div className="flex gap-4">
                    {actionItems.map((item) => (
                      <Link key={item.href} href={item.href} className="flex-1 block">
                        <PremiumButton variant="tertiary" size="md" className="w-full justify-center text-sm py-3.5 px-4 rounded-xl min-h-[52px]"><span className="flex items-center justify-center gap-2">{item.icon}<span>{item.label}</span></span></PremiumButton>
                      </Link>
                    ))}
                  </div>
                </StaggerContainer>
              </div>
            </FadeIn>
          )}

          {/* Ventefase */}
          {!data.matched && <FadeIn variant="fadeInUp" delay={0.1}><WaitingForMatch userName={data.userName} /></FadeIn>}

          {/* Profil + Partner */}
          {data.matched && (
            <FadeIn variant="fadeInUp" delay={0.2}>
              <div className="flex justify-between items-center gap-6">
                <div className="flex-1 rounded-xl p-6" style={{ background: 'rgba(255, 255, 255, 0.04)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: `${radius.xl}px` }}>
                  <p className="mb-2" style={{ fontSize: `${typography.fontSize.sm}px`, fontWeight: typography.fontWeight.medium, color: 'rgba(212, 175, 55, 0.6)' }}>Din profil</p>
                  <h3 style={{ fontSize: `${typography.fontSize.xl}px`, fontWeight: typography.fontWeight.bold, color: color.text.primary }}>{data.userName}</h3>
                  <p style={{ fontSize: `${typography.fontSize.base}px`, color: color.text.secondary }}>Profil fullført ✓</p>
                </div>
                <div className="flex-1 rounded-xl p-6" style={{ background: 'rgba(212, 175, 55, 0.06)', backdropFilter: 'blur(12px)', border: '1px solid rgba(212, 175, 55, 0.15)', borderRadius: `${radius.xl}px` }}>
                  <p className="mb-2" style={{ fontSize: `${typography.fontSize.sm}px`, fontWeight: typography.fontWeight.medium, color: 'rgba(212, 175, 55, 0.6)' }}>Partner</p>
                  <h3 style={{ fontSize: `${typography.fontSize.xl}px`, fontWeight: typography.fontWeight.bold, color: color.text.primary }}>{data.partnerName || '—'}</h3>
                  <p style={{ fontSize: `${typography.fontSize.base}px`, color: color.text.secondary }}>Dag {data.daysTogether} av 30</p>
                </div>
              </div>
            </FadeIn>
          )}

          {/* Profil-lås-banner */}
          {data.matched && data.currentDay > 0 && data.currentDay < 30 && (
            <FadeIn variant="fadeInUp" delay={0.15}><ProfileLockBanner partnerName={data.partnerName || 'partneren din'} currentDay={data.currentDay} totalDays={30} /></FadeIn>
          )}

          {/* Avslutt reise-knapp */}
          {data.matched && data.currentDay > 0 && data.currentDay < 30 && (
            <FadeIn variant="fadeInUp" delay={0.2}>
              <div className="text-center mt-4">
                <button onClick={() => setShowExitModal(true)} className="px-6 py-3 rounded-xl text-sm font-medium transition-all hover:brightness-110 active:scale-[0.98]" style={{ background: 'rgba(255, 77, 77, 0.08)', color: 'rgba(255, 77, 77, 0.8)', border: '1px solid rgba(255, 77, 77, 0.2)' }}>Avslutt reisen</button>
              </div>
            </FadeIn>
          )}

          {/* Journey */}
          {data.matched && (
            <FadeIn variant="slideUp" scrollTrigger delay={0.3}>
              <div className="w-full rounded-2xl p-6 md:p-8 relative overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.04)', backdropFilter: 'blur(12px)', border: '1px solid rgba(212, 175, 55, 0.12)', borderRadius: `${radius.xl}px` }}>
                <div className="text-center mb-8">
                  <h2 className="mb-2" style={{ fontSize: `${typography.fontSize['2xl']}px`, fontWeight: typography.fontWeight.semibold, background: 'linear-gradient(90deg, #D4AF37, #E8C766)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Velkommen til din reise</h2>
                  <p style={{ fontSize: `${typography.fontSize.base}px`, color: 'rgba(255, 255, 255, 0.6)', maxWidth: '500px', margin: '0 auto' }}>Hver dag gir en ny mulighet — for å kjenne, forstå og nærme deg partneren din.</p>
                </div>

                <div className="mb-8"><TodayCard journeyDay={data.currentDay || data.daysCompleted} /></div>
                <div className="mb-8"><JourneyTimeline currentDay={data.currentDay} completedDays={Array.from({ length: data.daysCompleted }, (_, i) => i + 1)} /></div>

                <div className="text-center mb-8">
                  <PremiumJourneyProgressTracker completedDays={Array.from({ length: data.daysCompleted }, (_, i) => i + 1)} currentDay={data.currentDay} onDaySelect={(day) => setSelectedDay(day)} />
                </div>

                {(() => {
                  const dayContent = getDayContent(selectedDay);
                  return (
                    <div className="rounded-[18px] p-6 mb-6" style={{ background: 'rgba(255, 255, 255, 0.04)', backdropFilter: 'blur(12px)', border: '1px solid rgba(212, 175, 55, 0.15)' }}>
                      <PremiumJourneyDayView content={{ day: selectedDay, phase: selectedDay <= 14 ? 'Etablering' : 'Dybde', theme: dayContent.theme, title: dayContent.title, reflection: dayContent.reflection }} />

                      {data.currentDay < 30 && (selectedDay === data.currentDay || selectedDay < data.currentDay) && (
                        <button className="w-full min-h-[48px] py-3 px-6 rounded-xl text-base font-medium flex items-center justify-center transition-all duration-300 mt-6" style={{ background: 'linear-gradient(90deg, #D4AF37, #E8C766)', color: '#0B1520', boxShadow: '0 0 24px rgba(212, 175, 55, 0.3)' }}>Neste dag — utforsk sammen → Dag {data.currentDay + 1}</button>
                      )}

                      {selectedDay !== data.currentDay && (
                        <button onClick={() => setSelectedDay(data.currentDay)} className="w-full min-h-[48px] py-3 px-6 rounded-xl text-sm font-medium flex items-center justify-center transition-all duration-300 mt-6" style={{ background: 'rgba(212, 175, 55, 0.12)', color: '#D4AF37', border: '1px solid rgba(212, 175, 55, 0.35)' }}>← Tilbake til dag {data.currentDay}</button>
                      )}

                      {data.currentDay >= 30 && (
                        <p className="text-center text-base" style={{ color: 'rgba(255, 255, 255, 0.6)', fontStyle: 'italic' }}>Reisen din er fullført. Ta deg tid til å reflektere over veien dere har gått sammen.</p>
                      )}
                    </div>
                  );
                })()}

                <div className="mt-4"><ImageShareLockBanner imageShareAllowedAt={selectedDay >= 14 ? new Date() : null} /></div>
              </div>
            </FadeIn>
          )}
        </div>
      </div>

      <ConfirmExitModal isOpen={showExitModal} onClose={() => setShowExitModal(false)} currentDay={data?.currentDay} onConfirm={() => { setShowExitModal(false); setData(prev => prev ? { ...prev, matched: false, currentDay: 0 } : null); }} />
    </>
  );
}