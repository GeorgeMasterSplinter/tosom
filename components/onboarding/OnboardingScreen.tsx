"use client";

/** OnboardingScreen — visning av kvart onboarding-steg
 *  OB11–OB19 — welcome, name_age, values, interests, bio, photos, ready, completed
 *  OB19–OB20 — rolige blå/grønne toner, varm og rolig typografi */

import { useState } from "react";
import type { OnboardingStep } from "../../lib/onboarding/onboardingState";
import {
  availableValues,
  availableInterests,
} from "../../lib/onboarding/onboardingState";

/* Props til OnboardingScreen */
interface OnboardingScreenProps {
  step: OnboardingStep;
  name: string;
  age: number;
  bio: string;
  values: string[];
  interests: string[];
  photos: string[];
  readyForMatch: boolean;
  onNameChange: (name: string) => void;
  onAgeChange: (age: number) => void;
  onBioChange: (bio: string) => void;
  onValuesChange: (values: string[]) => void;
  onInterestsChange: (interests: string[]) => void;
  onPhotosChange: (photos: string[]) => void;
  onReadyChange: (ready: boolean) => void;
  onNext: () => void;
  onPrev: () => void;
  onComplete: () => void;
  onPhotoUpload: (idx: number) => void; // dummy-upload
  onPhotoRemove: (idx: number) => void; // dummy-fjern
}

/* Validering av kvart steg */
interface ValidationErrors {
  name?: string;
  age?: string;
  values?: string;
  interests?: string;
  bio?: string;
  photos?: string;
  ready?: string;
}

function validateStep(
  step: OnboardingStep,
  name: string,
  age: number,
  values: string[],
  interests: string[],
  bio: string,
  photos: string[],
  readyForMatch: boolean,
  completed: boolean
): ValidationErrors {
  if (completed) return {};
  const errors: ValidationErrors = {};
  if (step === "name_age") {
    if (name.length <= 1) errors.name = "Skriv inn et navn.";
    if (age < 18 || age > 99) errors.age = "Alder må være mellom 18 og 99.";
  }
  if (step === "values" && values.length < 3)
    errors.values = "Velg minst 3 verdier.";
  if (step === "interests" && interests.length < 3)
    errors.interests = "Velg minst 3 interesser.";
  if (step === "bio" && bio.length < 20)
    errors.bio = "Skriv inn minst 20 tegn.";
  if (step === "photos" && photos.length < 1)
    errors.photos = "Legg til minst ett bilde.";
  if (step === "ready" && !readyForMatch)
    errors.ready = "Slå på 'Klar for match'.";
  return errors;
}

/* Navn på steg for skjermen */
const stepTitles: Record<OnboardingStep, string> = {
  welcome: "Velkommen til ToSom",
  name_age: "Kven er du?",
  values: "Hva er viktig for deg?",
  interests: "Hva liker du å gjøre?",
  bio: "Fortell litt om deg selv",
  photos: "Legg til bilder",
  ready: "Klar for match?",
  completed: "Profilen din er klar",
};

/* Hjelp: toggle verdi/interesse */
function toggleItem<T>(list: T[], item: T): T[] {
  return list.includes(item)
    ? list.filter((x) => x !== item)
    : [...list, item];
}

/* Hjelp: chip-knapp-stil */
function chipBase(active: boolean): string {
  return `text-xs px-3 py-1.5 rounded-full border transition-colors ${
    active
      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
      : "bg-white text-[#4A4A4A]/50 border-[#e2e8f0] hover:bg-emerald-50"
  }`;
}

export default function OnboardingScreen({
  step,
  name,
  age,
  bio,
  values,
  interests,
  photos,
  readyForMatch,
  onNameChange,
  onAgeChange,
  onBioChange,
  onValuesChange,
  onInterestsChange,
  onPhotosChange,
  onReadyChange,
  onNext,
  onPrev,
  onComplete,
  onPhotoUpload,
  onPhotoRemove,
}: OnboardingScreenProps) {
  /* Validering */
  const errors = validateStep(step, name, age, values, interests, bio, photos, readyForMatch, step === "completed");
  const canProceed = Object.keys(errors).length === 0;

  /* Visning av steg */
  switch (step) {
    /* OB11 — Welcome-screen */
    case "welcome":
      return (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
          <div className="text-7xl">🌿</div>
          <div>
            <h2 className="text-2xl font-semibold text-[#4A4A4A] mb-3">
              {stepTitles.welcome}
            </h2>
            <p className="text-sm text-[#4A4A4A]/60 max-w-sm">
              Her handlar det om ro, trygghet og ekte møte.
            </p>
          </div>
          <button
            onClick={onNext}
            className="px-8 py-3 text-sm rounded-xl bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors font-medium"
          >
            Start
          </button>
        </div>
      );

    /* OB12 — Name/Age-screen */
    case "name_age":
      return (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-[#4A4A4A]">
            {stepTitles.name_age}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-[#4A4A4A]/60 mb-1 block">
                Navn
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                className={`w-full px-4 py-3 text-sm rounded-xl border ${
                  errors.name ? "border-red-300 bg-red-50" : "border-[#e2e8f0] bg-[#f8fafc]"
                } focus:outline-none focus:ring-1 focus:ring-emerald-200`}
                placeholder="Hva heter du?"
              />
              {errors.name && (
                <p className="text-xs text-red-600 mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="text-xs text-[#4A4A4A]/60 mb-1 block">
                Alder
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => onAgeChange(parseInt(e.target.value) || 0)}
                className={`w-full px-4 py-3 text-sm rounded-xl border ${
                  errors.age ? "border-red-300 bg-red-50" : "border-[#e2e8f0] bg-[#f8fafc]"
                } focus:outline-none focus:ring-1 focus:ring-emerald-200`}
                min={18}
                max={99}
              />
              {errors.age && (
                <p className="text-xs text-red-600 mt-1">{errors.age}</p>
              )}
            </div>
          </div>
        </div>
      );

    /* OB13 — Values-screen */
    case "values":
      return (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-[#4A4A4A]">
            {stepTitles.values}
          </h2>
          <div className="flex flex-wrap gap-2">
            {availableValues.map((v) => (
              <button
                key={v}
                onClick={() => onValuesChange(toggleItem(values, v))}
                className={chipBase(values.includes(v))}
              >
                {values.includes(v) ? "✓ " : ""}{v}
              </button>
            ))}
          </div>
          <p className="text-xs text-[#4A4A4A]/40">
            {values.length} valgte / minst 3 påkrevd
          </p>
          {errors.values && (
            <p className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">
              {errors.values}
            </p>
          )}
        </div>
      );

    /* OB14 — Interests-screen */
    case "interests":
      return (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-[#4A4A4A]">
            {stepTitles.interests}
          </h2>
          <div className="flex flex-wrap gap-2">
            {availableInterests.map((i) => (
              <button
                key={i}
                onClick={() => onInterestsChange(toggleItem(interests, i))}
                className={chipBase(interests.includes(i))}
              >
                {interests.includes(i) ? "✓ " : ""}{i}
              </button>
            ))}
          </div>
          <p className="text-xs text-[#4A4A4A]/40">
            {interests.length} valgte / minst 3 påkrevd
          </p>
          {errors.interests && (
            <p className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">
              {errors.interests}
            </p>
          )}
        </div>
      );

    /* OB15 — Bio-screen */
    case "bio":
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[#4A4A4A]">
            {stepTitles.bio}
          </h2>
          <textarea
            value={bio}
            onChange={(e) => onBioChange(e.target.value)}
            className={`w-full text-sm text-[#4A4A4A]/80 leading-relaxed border rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-emerald-200 resize-none bg-[#f8fafc] ${
              errors.bio ? "border-red-300 bg-red-50" : "border-[#e2e8f0]"
            }`}
            rows={4}
            placeholder="Fortell litt om deg selv..."
          />
          <div className="flex justify-between items-center">
            {errors.bio && (
              <p className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">
                {errors.bio}
              </p>
            )}
            <p className="text-xs text-[#4A4A4A]/40">
              {bio.length} / 500 tegn
            </p>
          </div>
        </div>
      );

    /* OB16 — Photos-screen */
    case "photos":
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[#4A4A4A]">
            {stepTitles.photos}
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, idx) => {
              const url = photos[idx] || "";
              return (
                <div
                  key={idx}
                  className="relative w-full aspect-square rounded-xl overflow-hidden border border-[#e2e8f0]"
                >
                  {url ? (
                    <img
                      src={url}
                      alt={`Bilde ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#f1f5f9] flex items-center justify-center">
                      <span className="text-xs text-[#94a3b8]">Tom</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center gap-1">
                    {url ? (
                      <button
                        onClick={() => onPhotoRemove(idx)}
                        className="text-[10px] text-white opacity-0 hover:opacity-100 bg-red-500/80 px-2 py-0.5 rounded transition-opacity"
                      >
                        Fjern
                      </button>
                    ) : (
                      <button
                        onClick={() => onPhotoUpload(idx)}
                        className="text-[10px] text-white opacity-0 hover:opacity-100 bg-blue-500/80 px-2 py-0.5 rounded transition-opacity"
                      >
                        Legg til
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-[#4A4A4A]/40">
            {photos.length} bilder / minst 1 påkrevd
          </p>
          {errors.photos && (
            <p className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">
              {errors.photos}
            </p>
          )}
        </div>
      );

    /* OB17 — Ready-screen */
    case "ready":
      return (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-[#4A4A4A]">
            {stepTitles.ready}
          </h2>
          <p className="text-sm text-[#4A4A4A]/60">
            Når du er klar, starter vi å lete etter noen som passer deg.
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#4A4A4A]">
              Klar for match
            </span>
            <button
              onClick={() => onReadyChange(!readyForMatch)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                readyForMatch ? "bg-emerald-200" : "bg-[#e2e8f0]"
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  readyForMatch ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
          {errors.ready && (
            <p className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">
              {errors.ready}
            </p>
          )}
        </div>
      );

    /* OB18 — Completed-screen */
    case "completed":
      return (
        <div className="flex flex-col items-center justify-center text-center space-y-8">
          <div className="text-7xl">✨</div>
          <div>
            <h2 className="text-2xl font-semibold text-[#4A4A4A] mb-3">
              {stepTitles.completed}
            </h2>
            <p className="text-sm text-[#4A4A4A]/60 max-w-sm">
              Vi gir beskjed når vi finner en match.
            </p>
          </div>
          <button
            onClick={onComplete}
            className="px-8 py-3 text-sm rounded-xl bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors font-medium"
          >
            Gå til dashboard
          </button>
        </div>
      );

    default:
      return null;
  }
}
