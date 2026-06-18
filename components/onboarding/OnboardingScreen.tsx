import React from "react";
import clsx from "clsx";

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
  return (
    <section className={clsx("section", className)}>
      <div className="fade-in max-w-2xl mx-auto flex flex-col gap-[var(--space-xl)] text-center">
        {title && (
          <h1 className="font-semibold text-[var(--color-text)] tracking-tight text-3xl">
            {title}
          </h1>
        )}

        {text && (
          <p className="text-[var(--color-muted)] leading-[var(--line-relaxed)] text-lg">
            {text}
          </p>
        )}

        <div className="card fade-in flex flex-col gap-[var(--space-sm)] text-left">
          {children}
        </div>

        <div className="flex justify-center gap-[var(--space-md)] mt-[var(--space-md)]">
          {onPrev && (
            <button onClick={onPrev} className="btn-secondary">
              Tilbake
            </button>
          )}

          {onNext && (
            <button onClick={onNext} className="btn-primary">
              {buttonLabel || "Neste"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
