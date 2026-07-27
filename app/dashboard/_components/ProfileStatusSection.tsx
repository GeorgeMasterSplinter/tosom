/**
 * ToSom — Dashboard ProfileStatusSection
 * 
 * Viser profilstatus, onboarding-steg, og 30-dagers reise.
 */

'use client';

import Link from 'next/link';

interface ProfileStatusSectionProps {
  profile: {
    onboardingComplete: boolean;
    deepProfileComplete: boolean;
    deepProfileStep: string;
    identityName: string | null;
    photoUrl: string | null;
    journeyPhase: string | null;
    journeyDay: number;
    journeyCompleted: boolean;
  };
}

const phaseLabels: Record<string, string> = {
  EARLY: 'Bygger trygghet',
  BUILDING_TRUST: 'Tillit bygges',
  DEEPER: 'Djupare samtalar',
  CHECKIN: 'Refleksjon og sjekk',
};

export function ProfileStatusSection({ profile }: ProfileStatusSectionProps) {
  const totalSteps = 10; // Deep profile har 10 steg
  const currentStepLabel = profile.deepProfileStep;
  const progressPercent = Math.min(Math.round((profile.deepProfileComplete ? totalSteps : 0) / totalSteps * 100), 95);

  // Map deepProfileStep til progresjonstal
  const stepOrder: Record<string, number> = {
    IDENTITY: 1,
    LIFE_SITUATION: 2,
    LIFESTYLE: 3,
    PERSONALITY: 4,
    RELATIONSHIP_STYLE: 5,
    COMMUNICATION: 6,
    INTIMACY: 7,
    FUTURE_VISION: 8,
    BOUNDARIES: 9,
    SUMMARY: 10,
  };

  const progress = profile.deepProfileComplete ? 100 : Math.round((stepOrder[currentStepLabel] ?? 1) / totalSteps * 80) + 10;

  return (
    <div className="space-y-4">
      {/* Profil-oversikt */}
      <div
        className="p-5 rounded-2xl"
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.04)',
        }}
      >
        <h4 className="text-sm font-medium mb-4" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          Profilstatus
        </h4>

        {/* Progress bar */}
        <div className="mb-3">
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ background: 'rgba(255, 255, 255, 0.06)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                background: progress >= 100
                  ? 'linear-gradient(90deg, #4DFF88, #D4AF37)'
                  : '#D4AF37',
                width: `${progress}%`,
              }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>
              {progress}% fullført
            </span>
            <span className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.2)' }}>
              {progress >= 100 ? 'Fullført ✓' : `${currentStepLabel.replace(/_/g, ' ').toLowerCase()}`}
            </span>
          </div>
        </div>

        {/* Status-indikatorar */}
        <div className="space-y-2.5">
          <StatusRow
            label="Onboarding"
            done={profile.onboardingComplete}
          />
          <StatusRow
            label="Djup profil"
            done={profile.deepProfileComplete}
          />
          {profile.journeyPhase && (
            <StatusRow
              label={`30-dagers reise — ${phaseLabels[profile.journeyPhase] ?? profile.journeyPhase}`}
              done={profile.journeyCompleted}
              day={`${profile.journeyDay}/30`}
            />
          )}
        </div>
      </div>

      {/* CTA */}
      <Link href="/onboarding">
        <div
          className="text-center py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer"
          style={{
            background: 'rgba(212, 175, 55, 0.08)',
            border: '1px solid rgba(212, 175, 55, 0.15)',
            color: '#D4AF37',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(212, 175, 55, 0.12)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(212, 175, 55, 0.08)';
          }}
        >
          {profile.onboardingComplete ? 'Oppdater profil' : 'Fullfør profilen din'}
        </div>
      </Link>
    </div>
  );
}

/* ====== StatusRow ====== */

function StatusRow({
  label,
  done,
  day,
}: {
  label: string;
  done: boolean;
  day?: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          background: done
            ? 'rgba(77, 255, 136, 0.15)'
            : 'rgba(255, 255, 255, 0.06)',
          border: done
            ? '1px solid rgba(77, 255, 136, 0.3)'
            : '1px solid rgba(255, 255, 255, 0.1)',
          color: done ? '#4DFF88' : 'rgba(255, 255, 255, 0.2)',
        }}
      >
        {done && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span
        className="text-sm flex-1"
        style={{ color: done ? 'rgba(77, 255, 136, 0.7)' : 'rgba(255, 255, 255, 0.35)' }}
      >
        {label}
      </span>
      {day && (
        <span
          className="text-xs"
          style={{ color: 'rgba(212, 175, 55, 0.6)' }}
        >
          {day}
        </span>
      )}
    </div>
  );
}