"use client";

import { useState, useEffect } from "react";
import { updateProfile, ProfileFormData } from "./actions";

export default function ProfileEditForm({ initialProfile, onSaved }: { initialProfile: ProfileFormData | null; onSaved?: () => void }) {
  const [form, setForm] = useState<ProfileFormData | null>(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialProfile) {
      setForm({
        gender: initialProfile.gender,
        age: initialProfile.age,
        location: initialProfile.location,
        bio: initialProfile.bio,
        interests: initialProfile.interests,
        jobStatus: initialProfile.jobStatus,
        livingSituation: initialProfile.livingSituation,
        children: initialProfile.children,
        lifeRhythm: initialProfile.lifeRhythm,
        activityLevel: initialProfile.activityLevel,
        socialLevel: initialProfile.socialLevel,
        financialStyle: initialProfile.financialStyle,
        weekendStyle: initialProfile.weekendStyle,
        travelStyle: initialProfile.travelStyle,
        structureStyle: initialProfile.structureStyle,
        energyStyle: initialProfile.energyStyle,
        communicationStyle: initialProfile.communicationStyle,
        planningStyle: initialProfile.planningStyle,
        loveLanguage: initialProfile.loveLanguage,
        giveStyle: initialProfile.giveStyle,
        needStyle: initialProfile.needStyle,
        relationshipExpectation: initialProfile.relationshipExpectation,
        dealbreaker: initialProfile.dealbreaker,
        physicalComfort: initialProfile.physicalComfort,
        emotionalPace: initialProfile.emotionalPace,
        physicalImportance: initialProfile.physicalImportance,
        boundaryStyle: initialProfile.boundaryStyle,
        intimacyStyle: initialProfile.intimacyStyle,
        futureWish: initialProfile.futureWish,
        ambitionLevel: initialProfile.ambitionLevel,
        lifePace: initialProfile.lifePace,
        longTermExpectation: initialProfile.longTermExpectation,
        lifeDirection: initialProfile.lifeDirection,
        needs: initialProfile.needs,
        boundaries: initialProfile.boundaries,
        intentions: initialProfile.intentions,
      });
    }
  }, [initialProfile]);

  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {};
    if (form?.age && (isNaN(Number(form.age)) || Number(form.age) < 18 || Number(form.age) > 99)) {
      e.age = "Alder må vere mellom 18 og 99.";
    }
    if (form?.bio && form.bio.length > 500) {
      e.bio = "Bio kan maks vere 500 tegn.";
    }
    return e;
  };

  const handleField = (field: string, value: string | number | null) => {
    setForm((p) => (p ? { ...p, [field]: value } : p));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSaving(true);
    try {
      const result = await updateProfile(form);
      if (result.success) onSaved?.();
      else setErrors({ submit: result.error || "Lagring feila." });
    } catch {
      setErrors({ submit: "Kunne ikkje koble til tenaren." });
    } finally {
      setSaving(false);
    }
  };

  const F = ({ label, field, type = "text", rows, nullable }: { label: string; field: keyof ProfileFormData; type?: string; rows?: number; nullable?: boolean }) => (
    <div className="space-y-1">
      <label className="block text-xs uppercase tracking-wider text-stone-500">{label}</label>
      {type === "textarea" ? (
        <textarea
          rows={rows ?? 3}
          value={form?.[field] ?? ""}
          onChange={(e) => handleField(field, e.target.value)}
          className="w-full border-b border-stone-300 bg-transparent py-2 text-sm text-stone-800 placeholder-stone-400 outline-none transition focus:border-stone-600 resize-none"
          placeholder="—"
        />
      ) : (
        <input
          type={type}
          value={form?.[field] ?? ""}
          onChange={(e) => handleField(field, type === "number" ? (e.target.value === "" ? (nullable ? null : 0) : Number(e.target.value)) : e.target.value)}
          className="w-full border-b border-stone-300 bg-transparent py-2 text-sm text-stone-800 placeholder-stone-400 outline-none transition focus:border-stone-600"
          placeholder="—"
        />
      )}
    </div>
  );

  if (!form) return <div className="min-h-screen bg-stone-50 flex items-center justify-center"><div className="w-8 h-8 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" /></div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {errors.submit && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{errors.submit}</div>}
      <section className="space-y-6">
        <h2 className="text-lg font-light text-stone-700 border-b border-stone-200 pb-2">Personleg</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <F label="Kjønn" field="gender" nullable />
          <F label="Alder" field="age" type="number" nullable />
          <F label="By" field="location" nullable />
        </div>
        {errors.age && <p className="text-sm text-red-600">{errors.age}</p>}
      </section>
      <section className="space-y-6">
        <h2 className="text-lg font-light text-stone-700 border-b border-stone-200 pb-2">Om meg</h2>
        <F label="Bio" field="bio" type="textarea" rows={5} nullable />
        <F label="Yrke" field="jobStatus" nullable />
        <F label="Bustadform" field="livingSituation" nullable />
        <F label="Barn" field="children" nullable />
        {errors.bio && <p className="text-sm text-red-600">{errors.bio}</p>}
      </section>
      <section className="space-y-6">
        <h2 className="text-lg font-light text-stone-700 border-b border-stone-200 pb-2">Livsstil</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <F label="Interessar" field="interests" />
          <F label="Livsrytme" field="lifeRhythm" nullable />
          <F label="Aktivitetsnivå" field="activityLevel" nullable />
          <F label="Sosialt nivå" field="socialLevel" nullable />
        </div>
      </section>
      <section className="space-y-6">
        <h2 className="text-lg font-light text-stone-700 border-b border-stone-200 pb-2">Verdiar</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <F label="Finansstil" field="financialStyle" nullable />
          <F label="Helg-stil" field="weekendStyle" nullable />
          <F label="Reise-stil" field="travelStyle" nullable />
          <F label="Struktur-stil" field="structureStyle" nullable />
          <F label="Energi-stil" field="energyStyle" nullable />
          <F label="Kommunikasjon-stil" field="communicationStyle" nullable />
          <F label="Planleggings-stil" field="planningStyle" nullable />
          <F label="Kjærleiksspråk" field="loveLanguage" nullable />
          <F label="Gi-stil" field="giveStyle" nullable />
          <F label="Treng-stil" field="needStyle" nullable />
          <F label="Forventing i relasjon" field="relationshipExpectation" nullable />
          <F label="Dealbreaker" field="dealbreaker" nullable />
          <F label="Fysisk komfort" field="physicalComfort" nullable />
          <F label="Emosjonelt tempo" field="emotionalPace" nullable />
          <F label="Fysisk importance" field="physicalImportance" nullable />
          <F label="Grense-stil" field="boundaryStyle" nullable />
          <F label="Intimitets-stil" field="intimacyStyle" nullable />
          <F label="Framtidsønske" field="futureWish" nullable />
        </div>
      </section>
      <section className="space-y-6">
        <h2 className="text-lg font-light text-stone-700 border-b border-stone-200 pb-2">Framtid</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <F label="Ambisjonsnivå" field="ambitionLevel" nullable />
          <F label="Levetakt" field="lifePace" nullable />
          <F label="Langtidsforventing" field="longTermExpectation" nullable />
          <F label="Livsretning" field="lifeDirection" nullable />
          <F label="Treng (komma-separert)" field="needs" />
          <F label="Grenser (komma-separert)" field="boundaries" />
          <F label="Intensjonar (komma-separert)" field="intentions" />
        </div>
      </section>
      <button type="submit" disabled={saving} className="w-full py-3 text-sm uppercase tracking-wider bg-stone-800 text-white rounded-sm hover:bg-stone-700 disabled:opacity-50 transition">{saving ? "Lagrar …" : "Lagre profil"}</button>
    </form>
  );
}