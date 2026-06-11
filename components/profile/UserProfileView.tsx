"use client";

/** UserProfileView — visning og redigering av brukerens egen profil
 *  UP4–UP10 — props, layout, header, redigerbar bio, verdier, interesser, bilder
 *  UP11–UP20 — matchklar-logikk, validering, lagre/lukk
 *  UP17 — rolige farger, same stil som PartnerProfileView
 *  UP19 — scroll-støtte
 *  UP20 — ingen backend, berre UI */

import { useState } from "react";
import type { UserProfile } from "../../lib/profile/userProfile";
import { validateProfile } from "../../lib/profile/userProfile";

/* UP4 — Props */
interface UserProfileViewProps {
  /** UP32 — TODO: Koble til ekte brukerdata frå backend seinare */
  profile: UserProfile;
  /** UP32 — TODO: Lagre profilendringar i database */
  onUpdate?: (updated: UserProfile) => void;
  onClose?: () => void;
}

export default function UserProfileView({
  profile,
  onUpdate,
  onClose,
}: UserProfileViewProps) {
  const [p, setP] = useState<UserProfile>({ ...profile });

  /* UP7 — Redigerbar bio */
  const handleBioChange = (bio: string) => setP((prev) => ({ ...prev, bio }));

  /* UP8/9 — Toggle verdi/interesse */
  const toggleValues = (value: string) => {
    setP((prev) => ({
      ...prev,
      values: prev.values.includes(value)
        ? prev.values.filter((v) => v !== value)
        : [...prev.values, value],
    }));
  };

  const toggleInterests = (interest: string) => {
    setP((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  /* UP11 — Toggle matchklar */
  const toggleReadyForMatch = () => setP((prev) => ({ ...prev, readyForMatch: !prev.readyForMatch }));

  /* UP12 — Kunne setje readyForMatch til true? */
  const canSetMatchReady =
    p.bio.length > 20 &&
    p.values.length >= 3 &&
    p.interests.length >= 3 &&
    p.photos.length >= 1;

  /* UP13/UP14 — Validering */
  const validationError = canSetMatchReady ? null : "Profilen din er ikke komplett ennå.";

  /* UP10 — Bilder: klikk for å bytte eller fjerne (dummy) */
  const handlePhotoToggle = (idx: number) => {
    setP((prev) => {
      const photos = [...prev.photos];
      // Dummy: fjern hvis eksisterende, legg til nytt placeholder hvis ikke
      if (photos[idx]) {
        // Dummy "fjerne" — vis ikke
        photos[idx] = "";
      } else {
        photos[idx] = `https://placehold.co/400x500/e2e8f0/94a3b8?text=Bilde+${idx + 1}`;
      }
      return { ...prev, photos };
    });
  };

  const handleAddPhoto = () => {
    setP((prev) => {
      const nextIdx = prev.photos.length + 1;
      return {
        ...prev,
        photos: [...prev.photos, `https://placehold.co/400x500/f1f5f9/94a3b8?text=Bilde+${nextIdx}`],
      };
    });
  };

  /* UP15 — Lagre endringar */
  const handleSave = () => onUpdate?.(p);

  /* UP6 — Avatar */
  const avatarUrl = p.photos?.[0] || null;
  const avatarFallback = p.name.charAt(0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm p-4">
      <div className="max-w-lg w-full max-h-[90vh] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
        {/* UP6 — Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/5">
          <div className="flex items-center gap-3">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={p.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-200/60 to-emerald-200/60 flex items-center justify-center text-lg font-medium text-[#4A4A4A]/80">
                {avatarFallback}
              </div>
            )}
            <p className="text-sm font-medium text-[#4A4A4A]">
              {p.name}, {p.age}
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#4A4A4A]/40 hover:bg-black/5 hover:text-[#4A4A4A]/70 transition-colors"
              aria-label="Lukk"
            >
              ✕
            </button>
          )}
        </div>

        {/* UP19 — Scroll-innhald */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* UP7 — Redigerbar bio */}
          <section>
            <h3 className="text-sm font-medium text-[#4A4A4A]/70 mb-2">
              Om deg
            </h3>
            <textarea
              value={p.bio}
              onChange={(e) => handleBioChange(e.target.value)}
              className="w-full text-sm text-[#4A4A4A]/80 leading-relaxed border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-200 resize-none bg-[#f8fafc]"
              rows={3}
            />
            <p className="text-xs text-[#4A4A4A]/40 mt-1">
              {p.bio.length} / 500 tegn
            </p>
          </section>

          {/* UP8 — Verdier */}
          <section>
            <h3 className="text-sm font-medium text-[#4A4A4A]/70 mb-2">
              Verdier
            </h3>
            <div className="flex flex-wrap gap-2">
              {["Ærlighet", "Trygghet", "Vekst", "Nyskapning", "Empati", "Respekt", "Uavhengighet"].map(
                (v) => {
                  const active = p.values.includes(v);
                  return (
                    <button
                      key={v}
                      onClick={() => toggleValues(v)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                        active
                          ? "bg-amber-100 text-amber-800 border-amber-200"
                          : "bg-white text-[#4A4A4A]/50 border-[#e2e8f0] hover:bg-amber-50"
                      }`}
                    >
                      {active ? "✓ " : ""}{v}
                    </button>
                  );
                }
              )}
            </div>
            <p className="text-xs text-[#4A4A4A]/40 mt-1">
              {p.values.length} valgt
            </p>
          </section>

          {/* UP9 — Interesser */}
          <section>
            <h3 className="text-sm font-medium text-[#4A4A4A]/70 mb-2">
              Interesser
            </h3>
            <div className="flex flex-wrap gap-2">
              {["Friluftsliv", "Musikk", "Lesing", "Fotografi", "Matlaging", "Reise", "Kunst", "Film"].map(
                (i) => {
                  const active = p.interests.includes(i);
                  return (
                    <button
                      key={i}
                      onClick={() => toggleInterests(i)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                        active
                          ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                          : "bg-white text-[#4A4A4A]/50 border-[#e2e8f0] hover:bg-emerald-50"
                      }`}
                    >
                      {active ? "✓ " : ""}{i}
                    </button>
                  );
                }
              )}
            </div>
            <p className="text-xs text-[#4A4A4A]/40 mt-1">
              {p.interests.length} valgt
            </p>
          </section>

          {/* UP10 — Bilder */}
          <section>
            <h3 className="text-sm font-medium text-[#4A4A4A]/70 mb-2">
              Bilder
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {p.photos.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePhotoToggle(idx)}
                  className="relative w-full aspect-square rounded-lg overflow-hidden border border-[#e2e8f0] hover:border-[#cbd5e1] transition-colors"
                >
                  {url ? (
                    <img src={url} alt={`Bilde ${idx + 1}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#f1f5f9] flex items-center justify-center">
                      <span className="text-xs text-[#94a3b8]">Tom</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
                    <span className="text-xs text-white opacity-0 hover:opacity-100 transition-opacity bg-black/40 px-2 py-0.5 rounded">
                      {url ? "Fjern" : "Legg til"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={handleAddPhoto}
              className="mt-3 text-xs text-emerald-700 hover:text-emerald-800 underline"
            >
              + Legg til bilder
            </button>
          </section>

          {/* UP11–UP16 — Matchklar */}
          <section className="pt-2 border-t border-black/5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-[#4A4A4A]">
                  Klar for match
                </h3>
                {/* UP12 — Tekst under toggle */}
                <p className="text-xs text-[#4A4A4A]/50 mt-0.5">
                  {p.readyForMatch ? "Du er klar for en ny match." : "Fullfør profilen din før du matcher."}
                </p>
              </div>
              {/* Toggle-switch */}
              <button
                onClick={toggleReadyForMatch}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  p.readyForMatch ? "bg-emerald-200" : "bg-[#e2e8f0]"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                    p.readyForMatch ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
            {/* UP14 — Advarsel */}
            {!canSetMatchReady && p.readyForMatch && (
              <p className="text-xs text-amber-700/80 mt-2 bg-amber-50 px-3 py-2 rounded-lg">
                {validationError}
              </p>
            )}
          </section>

          {/* UP15/UP16 — Knappar */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              className="flex-1 py-3 text-sm rounded-xl bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors font-medium"
            >
              Lagre endringer
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="py-3 px-6 text-sm rounded-xl bg-[#4A4A4A]/[0.05] text-[#4A4A4A]/60 hover:bg-[#4A4A4A]/[0.1] transition-colors"
              >
                Lukk
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
