/**
 * ToSom — Steg 9: Oppsummering (Premium)
 * Menneskeleselig oppsummering av profilen din.
 */

'use client';

import { BackButton } from '@/components/onboarding/BackButton';
import { PremiumButton } from '@/components/onboarding/PremiumButton';

interface Props {
  step: number;
  goToStep: (s: number) => void;
  data: Record<string, unknown>;
  onNext: () => void;
  onBack: () => void;
}

/* ===================================================================
   Hjelpemethod for sikker data-henting og konvertering
   =================================================================== */

const val = (field: string, fallback = '') => (data: Record<string, unknown>) => {
  const v = data[field];
  return v !== undefined && v !== null ? String(v) : fallback;
};

const num = (field: string, fallback = 0) => (data: Record<string, unknown>) => {
  const v = data[field];
  return v !== undefined && v !== null ? Number(v) : fallback;
};

/* ===================================================================
   Komponent
   =================================================================== */

export default function Step9Oppsummering({ step, goToStep, data, onNext }: Props) {
  const getName = val('identityName', '—');
  const getAge = val('age', '—');
  const getGender = val('gender', '—');
  const getSeeking = val('seekingGender', '—');
  const getHeight = val('height', '—');
  const getBodyType = val('bodyType', '—');
  const getLifestyle = val('lifestyle', '—');
  const getSmoking = val('smoking', '—');
  const getReligion = val('religion', '—');
  const getChildren = val('children', '—');
  const getWantChildren = val('wantChildren', '—');
  const getCity = val('city', '—');

  const getDistance = num('distancePref', 50);
  const getMinAge = num('minAge', 23);
  const getMaxAge = num('maxAge', 40);

  const getSelfDesc = val('selfDesc', '');
  const getEnergy = val('energyGiver', '');
  const getQuirk = val('quirk', '');

  const getFutureVision = val('futureVision', '');
  const getDreamGoal = val('dreamGoal', '');
  const getBuildTogether = val('buildTogether', '');

  const getHighPriority = val('highPriority', '');
  const getGoodEveryday = val('goodEveryday', '');

  /* ===================================================================
     Premium-render
     =================================================================== */

  return (
    <div className="space-y-10 px-4 py-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold" style={{ color: '#D4AF37' }}>
          Oppsummering
        </h1>
        <p className="text-base" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          Se over det du har delt. Du kan endre alt senere.
        </p>
      </div>

      {/* ===================================================================
          Sek 1: Grunnprofil
          =================================================================== */}
      <section className="rounded-2xl p-6 border" style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(212, 175, 55, 0.2)',
      }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: '#D4AF37' }}>
          Grunnprofil
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Navn</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>{getName(data)}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Alder</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>{getAge(data) !== '—' ? `${getAge(data)} år` : '—'}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Kjønn</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>{getGender(data)}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Søker</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>{getSeeking(data)}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Bosted</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>{getCity(data)}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Høyde</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>{getHeight(data) !== '—' ? `${getHeight(data)} cm` : '—'}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Kroppstype</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>{getBodyType(data)}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Livsstil</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>{getLifestyle(data)}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Røyking / snus</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>{getSmoking(data)}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Barn</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>{getChildren(data)}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Ønsker barn</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>{getWantChildren(data)}</span>
          </div>
        </div>
      </section>

      {/* ===================================================================
          Sek 2: Livsstil & verdier
          =================================================================== */}
      <section className="rounded-2xl p-6 border" style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(212, 175, 55, 0.2)',
      }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: '#D4AF37' }}>
          Livsstil & verdier
        </h2>
        <div className="space-y-3">
          {getHighPriority(data) && (
            <div>
              <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Hva prioriterer du?</span>
              <p className="mt-1" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>{getHighPriority(data)}</p>
            </div>
          )}
          {getGoodEveryday(data) && (
            <div>
              <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>God hverdag</span>
              <p className="mt-1" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>{getGoodEveryday(data)}</p>
            </div>
          )}
        </div>
      </section>

      {/* ===================================================================
          Sek 3: Avstand & alder
          =================================================================== */}
      <section className="rounded-2xl p-6 border" style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(212, 175, 55, 0.2)',
      }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: '#D4AF37' }}>
          Avstand & alder
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Maks avstand</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>{getDistance(data)} km</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Alderspreferanse</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>{getMinAge(data)}–{getMaxAge(data)} år</span>
          </div>
        </div>
      </section>

      {/* ===================================================================
          Sek 4: Personlighet & humor
          =================================================================== */}
      <section className="rounded-2xl p-6 border" style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(212, 175, 55, 0.2)',
      }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: '#D4AF37' }}>
          Personlighet & humor
        </h2>
        <div className="space-y-3">
          {getSelfDesc(data) && (
            <div>
              <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Om deg</span>
              <p className="mt-1" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>{getSelfDesc(data)}</p>
            </div>
          )}
          {getEnergy(data) && (
            <div>
              <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Hva gir deg energi</span>
              <p className="mt-1" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>{getEnergy(data)}</p>
            </div>
          )}
          {getQuirk(data) && (
            <div>
              <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Din unike side</span>
              <p className="mt-1" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>{getQuirk(data)}</p>
            </div>
          )}
        </div>
      </section>

      {/* ===================================================================
          Sek 5: Framtid & visjon
          =================================================================== */}
      <section className="rounded-2xl p-6 border" style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(212, 175, 55, 0.2)',
      }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: '#D4AF37' }}>
          Framtid & visjon
        </h2>
        <div className="space-y-3">
          {getFutureVision(data) && (
            <div>
              <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Din framtid</span>
              <p className="mt-1" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>{getFutureVision(data)}</p>
            </div>
          )}
          {getDreamGoal(data) && (
            <div>
              <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Din drøm</span>
              <p className="mt-1" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>{getDreamGoal(data)}</p>
            </div>
          )}
          {getBuildTogether(data) && (
            <div>
              <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Sammen</span>
              <p className="mt-1" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>{getBuildTogether(data)}</p>
            </div>
          )}
        </div>
      </section>

      {/* ===================================================================
          Knappar
          =================================================================== */}
      <div className="space-y-4 mt-10">
        <BackButton onClick={() => goToStep(step - 1)} />
        <PremiumButton onClick={onNext}>
          Fortsett til neste steg
        </PremiumButton>
      </div>
    </div>
  );
}