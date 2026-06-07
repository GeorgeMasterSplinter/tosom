"use client";

import { useState, useEffect } from "react";
import { getProfile } from "./actions";
import ProfileEditForm from "./ProfileEditForm";

export default function ProfileEditPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any | null>(null);
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
      }
      setIsLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-sm text-stone-500">Lastar profil …</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-light text-stone-800 tracking-tight">Profil</h1>
          <p className="mt-1 text-sm text-stone-500">
            Oppdater opplysingane dine — dei påverkar korleis du blir matcha.
          </p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {showSaved && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Profil lagra
          </div>
        )}

        <ProfileEditForm
          initialProfile={profile}
          onSaved={() => setShowSaved(true)}
        />
      </div>
    </div>
  );
}