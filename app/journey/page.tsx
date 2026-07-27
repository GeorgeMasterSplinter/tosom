/**
 * ToSom — Journey Overview Page
 * 
 * Viser aktiv reise-status for paret.
 * Redirectar til /journey/[conversationId] dersom det finst ein aktiv reise.
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AmbientGlow, AmbientGlowStyles } from '@/components/atmosphere/AmbientGlow';
import { PulseGlowStyles } from '@/components/ui/PulseGlow';
import { GlassPanelStyles } from '@/components/ui/system/ToSomGlassPanel';
import { PremiumJourneyDayView } from '@/components/journey/PremiumJourneyDayView';
import { PremiumJourneyProgressTracker } from '@/components/journey/PremiumJourneyProgressTracker';
import { JourneyTimeline } from '@/components/journey/JourneyTimeline';
import { ImageShareLockBanner } from '@/components/journey/ImageShareLockBanner';
import { GradientOverlay } from '@/components/atmosphere/GradientOverlay';

export default function JourneyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [journeyData, setJourneyData] = useState<{
    conversationId: string;
    day: number;
    totalDays: number;
    phase: string;
    taskTitle: string;
  } | null>(null);

  useEffect(() => {
    async function fetchJourney() {
      try {
        const response = await fetch('/api/journey/progress');
        if (!response.ok) throw new Error('Kunne ikkje hente reise-data');
        
        const data = await response.json();
        setJourneyData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ukjent feil');
      } finally {
        setLoading(false);
      }
    }

    fetchJourney();
  }, []);

  useEffect(() => {
    if (journeyData?.conversationId) {
      router.replace(`/journey/${journeyData.conversationId}`);
    }
  }, [journeyData, router]);

  return (
    <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', background: '#0A1A2A' }}>
      {/* Ambient bakgrunn */}
      <AmbientGlow color="blue" position="top-right" intensity={0.08} speed={7} />
      <AmbientGlowStyles />
      <PulseGlowStyles />
      <GlassPanelStyles />

      {/* Hero-gradient overlay */}
      <GradientOverlay color="hero" position="bottom" intensity={0.4} />

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px', position: 'relative', zIndex: 1 }}>
        {/* Bildelås-banner */}
        <ImageShareLockBanner imageShareAllowedAt={null} />

        {/* Hovud-inhald — Modul 2: Tone alignment */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 className="text-xl md:text-2xl font-light mb-4" style={{ background: 'linear-gradient(90deg, #D4AF37, #E8C766)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Velkommen til di reisestart
          </h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '500px', margin: '0 auto' }}>
            Kvar dag bringjer ei ny mulighet — for å kjenne, forstå og nærme deg partneren din.
          </p>
        </div>

        {/* Journey Timeline — integrert frå Design System 1.1 */}
        <JourneyTimeline currentDay={1} completedDays={[]} />

        {/* Journey progress-mappe */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <PremiumJourneyProgressTracker completedDays={[]} currentDay={1} />
        </div>

        {/* Daily content card — padding: p-6, radius: rounded-[18px] (Modul 3) */}
        <div className="rounded-[18px] p-6" style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(212,175,55,0.15)',
          maxWidth: '600px',
          margin: '0 auto 24px',
        }}>
          <PremiumJourneyDayView content={{
            day: 1,
            phase: 'Etablering',
            theme: 'Trygghet og Nysgjerrigheit',
            title: 'Kven er du når ingen ser?',
            reflection: 'Den første dagen handlar om å bygge eit grunnlag av trygghet. Tenk på kva som gjer at du kjner deg trygg i starten av ein ny relasjon.',
            task: 'Del med partneren din: Kva er det eine spørsmålet du alltid har vildd vite svaret på?',
          }} />
          
          {/* Neste-knapp — Modul 2: Tone alignment */}
          <button className="w-full min-h-[48px] py-3 px-6 rounded-xl text-base font-medium bg-gradient-to-r from-[#D4AF37] to-[#E8C766] border border-[rgba(212,175,55,0.45)] text-[#0B1520] hover:shadow-[0_0_24px_rgba(212,175,55,0.3)] active:scale-95 transition-all duration-300 ease-out flex items-center justify-center">
            Neste dag — utforsk sammen →
          </button>
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              margin: '0 auto',
              borderRadius: '50%',
              border: '3px solid rgba(212,175,55,0.2)',
              borderTopColor: '#D4AF37',
              animation: 'spin 1s linear infinite',
            }} />
          </div>
        )}

        {/* Error state */}
        {error && (
          <div style={{
            textAlign: 'center',
            background: 'rgba(255,77,77,0.08)',
            border: '1px solid rgba(255,77,77,0.2)',
            borderRadius: '16px',
            padding: '24px',
            marginTop: '32px',
          }}>
            <p style={{ color: '#FF4D4D', marginBottom: '16px' }}>{error}</p>
            <button
              onClick={() => router.refresh()}
              style={{
                background: 'linear-gradient(90deg, #D4AF37, #E8C766)',
                color: '#0B1520',
                padding: '12px 24px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Prøv igjen
            </button>
          </div>
        )}

        {/* No journey state */}
        {!loading && !error && !journeyData && (
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '24px' }}>Du har ingen aktiv reise ennå.</p>
            <button
              onClick={() => router.push('/matching')}
              style={{
                background: 'linear-gradient(90deg, #D4AF37, #E8C766)',
                color: '#0B1520',
                padding: '12px 24px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Gå til matching
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
