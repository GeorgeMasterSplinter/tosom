"use client";

import { useState, useEffect } from "react";
import { getProfile } from "./actions";
import ProfileEditForm from "./ProfileEditForm";

export default function ProfileEditPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any | null>(null);
  const [locked, setLocked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getProfile().then((result: any) => {
      if (cancelled) return;
      if (result.error) {
        setError(result.error);
        setProfile(null);
      } else {
        setProfile(result.profile);
        setLocked(!!result.locked);
      }
      setIsLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-700 border-t-white rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-sm text-gray-500">Laster profil…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-xl mx-auto py-10 space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-light text-white">Rediger profil</h1>
          <p className="text-gray-400 mt-1">
            Oppdater opplysningene dine — de påvirker hvordan du blir matchet.
          </p>
        </div>

        {/* Profil-låst banner (dag 1-29) */}
        {locked && !error && (
          <div className="text-amber-200 text-sm bg-amber-950/30 border border-amber-700/30 rounded-xl px-5 py-4">
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">🔒</span>
              <div>
                <p className="font-medium mb-1">Profilen er låst</p>
                <p className="text-amber-300/70 text-xs leading-relaxed">
                  Du har ein aktiv reise pågåande. Profilen kan ikkje redigerast medan du er i dag 1–29.
                  Etter at reisen er fullført (dag 30) opnar låsen seg automatisk.
                </p>
              </div>
            </div>
            <a href="/profile" className="mt-3 inline-block text-xs font-medium text-amber-300 hover:text-amber-200 transition-colors">
              ← Tilbake til profil
            </a>
          </div>
        )}

        {/* Feilmelding */}
        {error && (
          <div className="text-red-400 text-sm bg-red-950/50 border border-red-900/30 rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* Lagringsmelding */}
        {showSaved && (
          <div className="text-green-400 text-sm bg-green-950/50 border border-green-900/30 rounded-xl px-4 py-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Profil lagret
          </div>
        )}

        {/* Skjema — skjult når låst */}
        {!locked && (
          <ProfileEditForm
            initialProfile={profile}
            onSaved={() => setShowSaved(true)}
          />
        )}
      </div>
    </div>
  );
}
