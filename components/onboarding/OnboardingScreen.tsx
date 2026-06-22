import React from "react";
import clsx from "clsx";

/* ---------------------------------------------------------------- -- */
/* ToSom UI 5.0 — OnboardingScreen polish                               */
/* - Enhetleg topptekst (font, size, spacing)                           */
/* - Progress-indikator "Steg X av 8"                                   */
/* - Knapperekkefølge: "Tilbake" ← venstre, "Neste" → høgre             */
/* - Konsistent gul tekst (eksempel/plasshald)                          */
/* - "Fullfør profil" med TODO på siste steg                             */
/* ---------------------------------------------------------------- -- */

const STEPS = [
  "welcome",
  "name_age",
  "values",
  "interests",
  "bio",
  "photos",
  "ready",
  "completed",
];

const TOTAL_STEPS = STEPS.length;

type OnboardingScreenProps = {
  title?: string;
  text?: string | React.ReactElement;
  buttonLabel?: string;
  children?: React.ReactNode;
  className?: string;
  step?: string;
  name?: string;
  age?: number;
  bio?: string;
  values?: string[];
  interests?: string[];
  photos?: string[];
  readyForMatch?: boolean;
  onReadyChange?: (readyForMatch: boolean) => void;
  onComplete?: () => void;
  onNameChange?: (name: any) => void;
  onAgeChange?: (age: any) => void;
  onBioChange?: (bio: string) => void;
  onValuesChange?: (values: string[]) => void;
  onInterestsChange?: (interests: string[]) => void;
  onPhotosChange?: (photos: string[]) => void;
  onPhotoUpload?: (idx: number) => void;
  onPhotoRemove?: (idx: number) => void;
  onNext?: () => void;
  onPrev?: () => void;
};

export default function OnboardingScreen({
  title,
  text,
  buttonLabel,
  children,
  className,
  step,
  name,
  age,
  bio,
  values,
  interests,
  photos,
  readyForMatch,
  onReadyChange,
  onComplete,
  onNameChange,
  onAgeChange,
  onBioChange,
  onValuesChange,
  onInterestsChange,
  onPhotosChange,
  onPhotoUpload,
  onPhotoRemove,
  onNext,
  onPrev,
}: OnboardingScreenProps) {
  /* Steg-indeks for progress-indikator */
  const stepIndex = step ? STEPS.indexOf(step as any) : -1;
  const progressText = stepIndex >= 0 && stepIndex < TOTAL_STEPS - 1
    ? `Steg ${stepIndex + 1} av ${TOTAL_STEPS - 1}`
    : null;

  /* Siste aktiv steg */
  const isLastStep = step === "ready";
  const isWelcome = step === "welcome";
  const isCompleted = step === "completed";

  /* Knapp-variablar */
  const showNav = !isWelcome && !isCompleted;
  const nextLabel = isLastStep ? (buttonLabel || "Fullfør profil") : (buttonLabel || "Neste");

  return (
    <section className={clsx("section", className)}>
      <div className="fade-in max-w-2xl mx-auto flex flex-col gap-[var(--space-xl)] text-center">
        {/* Progress-indikator */}
        {progressText && (
          <span
            className="inline-block text-xs font-medium tracking-widest uppercase"
            style={{ color: 'rgba(212, 175, 55, 0.6)' }}
          >
            {progressText}
          </span>
        )}

        {/* Enhetleg topptekst — font 28px, 600, mb-4 */}
        {title && (
          <h1
            className="font-semibold tracking-tight"
            style={{ fontSize: '28px', fontWeight: 600, color: '#FFFFFF', marginBottom: '16px' }}
          >
            {title}
          </h1>
        )}

        {/* Undertekst */}
        {text && (
          <p
            className="leading-relaxed"
            style={{ color: 'rgba(255, 255, 255, 0.6)', lineHeight: '1.7', fontSize: '16px' }}
          >
            {text}
          </p>
        )}

        {/* Kort-innhald */}
        <div
          className="card fade-in flex flex-col gap-[var(--space-sm)] text-left"
          style={{ padding: '24px', borderRadius: '20px' }}
        >
          {children}
        </div>

        {/* Knapperekkefølge: "Tilbake" ← venstre, "Neste" → høgre */}
        {showNav && (
          <div className="flex justify-between mt-[var(--space-md)]" style={{ gap: '16px', paddingLeft: '0', paddingRight: '0' }}>
            {onPrev && (
              <button
                onClick={onPrev}
                className="btn-secondary text-sm"
                style={{
                  padding: '12px 20px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '14px',
                  fontWeight: 500,
                  transition: 'all 0.2s ease-out',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.06)';
                  (e.target as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.14)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.03)';
                  (e.target as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.08)';
                }}
              >
                ← Tilbake
              </button>
            )}

            <button
              onClick={onNext}
              className="btn-primary text-sm"
              style={{
                padding: '12px 20px',
                borderRadius: '12px',
                background: isLastStep ? 'rgba(212, 175, 55, 0.15)' : undefined,
                border: isLastStep ? '1px solid rgba(212, 175, 55, 0.25)' : undefined,
                color: isLastStep ? '#D4AF37' : undefined,
                fontSize: '14px',
                fontWeight: 500,
                transition: 'all 0.2s ease-out',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              {nextLabel}
            </button>
          </div>
        )}

        {/* "Fullfør profil" med TODO */}
        {isLastStep && (
          <p
            className="text-xs"
            style={{ color: 'rgba(255, 255, 255, 0.35)' }}
          >
            {/* TODO: Marker profilen som fullført i backend når knappen blir trykka. */}
            {/* Dette krev ein API-kall til POST /api/profile/complete */}
          </p>
        )}
      </div>
    </section>
  );
}
