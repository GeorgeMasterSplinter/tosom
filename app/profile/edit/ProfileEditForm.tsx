"use client";

import Image from 'next/image';
import { useState, useEffect } from "react";
import { updateProfile, ProfileFormData } from "./actions";

export default function ProfileEditForm({
  initialProfile,
  onSaved,
}: {
  initialProfile: ProfileFormData | null;
  onSaved?: () => void;
}) {
  const [form, setForm] = useState<ProfileFormData | null>(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialProfile) {
      setForm({
        firstName: initialProfile.firstName,
        lastName: initialProfile.lastName,
        age: initialProfile.age,
        bio: initialProfile.bio,
        interests: initialProfile.interests,
        photoUrl: initialProfile.photoUrl ?? "",
        identityName: initialProfile.identityName,
        lifeRhythm: initialProfile.lifeRhythm,
        maturityLevel: initialProfile.maturityLevel,
      });
    }
  }, [initialProfile]);

  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {};
    if (form?.age && (isNaN(Number(form.age)) || Number(form.age) < 23 || Number(form.age) > 99)) {
      e.age = "Alder må være mellom 23 og 99.";
    }
    if (form?.bio && form.bio.length > 500) {
      e.bio = "Bio kan maks være 500 tegn.";
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
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      const result = await updateProfile(form);
      if (result.success) {
        onSaved?.();
      } else {
        setErrors({ submit: "Hmm… dette gikk ikke helt som planlagt." });
      }
    } catch {
      setErrors({ submit: "Kan du prøve igjen?" });
    } finally {
      setSaving(false);
    }
  };

  const F = ({
    label,
    field,
    type = "text",
    rows,
    nullable,
  }: {
    label: string;
    field: keyof ProfileFormData;
    type?: string;
    rows?: number;
    nullable?: boolean;
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-300">{label}</label>
      {type === "textarea" ? (
        <textarea
          rows={rows ?? 3}
          value={form?.[field] ?? ""}
          onChange={(e) => handleField(field, e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 h-32 resize-none leading-relaxed"
          placeholder="Skriv litt om deg selv …"
        />
      ) : (
        <input
          type={type}
          value={form?.[field] ?? ""}
          onChange={(e) =>
            handleField(
              field,
              type === "number"
                ? e.target.value === ""
                  ? (nullable ? null : 0)
                  : Number(e.target.value)
                : e.target.value
            )
          }
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
        />
      )}
      {errors[field] && (
        <p className="text-red-400 text-sm mt-1">{errors[field]}</p>
      )}
    </div>
  );

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-700 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  const alleInteresser = form.interests
    ? form.interests.split(",").map((s: string) => s.trim()).filter(Boolean)
    : [];

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Feilmelding */}
      {errors.submit && (
        <div className="text-red-400 text-sm bg-red-950/50 border border-red-900/30 rounded-xl px-4 py-3">
          {errors.submit}
        </div>
      )}

      {/* Seksjon: Personlig */}
      <section>
        <h2 className="text-lg font-medium text-white">Personleg</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
          <F label="Fornamn" field="firstName" nullable />
          <F label="Etternamn" field="lastName" nullable />
          <F label="Alder" field="age" type="number" nullable />
          <F label="Identitetsnamn" field="identityName" nullable />
        </div>
      </section>

      {/* Seksjon: Om meg */}
      <section>
        <h2 className="text-lg font-medium text-white">Om meg</h2>
        <div className="mt-4">
          <F label="Bio" field="bio" type="textarea" rows={5} nullable />
        </div>
      </section>

      {/* Seksjon: Interesser */}
      <section>
        <h2 className="text-lg font-medium text-white">Interessar</h2>
        <div className="mt-4 space-y-4">
          {alleInteresser.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {alleInteresser.map((tag: string, i: number) => (
                <span
                  key={`${tag}-${i}`}
                  className="inline-block rounded-full px-3 py-1 bg-white/10 text-gray-200 border border-white/10 backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <F
            label="Nye interesser (skil med komma)"
            field="interests"
          />
        </div>
      </section>

      {/* Seksjon: Livsrytme */}
      <section>
        <h2 className="text-lg font-medium text-white">Livsrytme</h2>
        <div className="mt-4">
          <F label="Livsrytme" field="lifeRhythm" nullable />
        </div>
      </section>

      {/* Seksjon: Foto */}
      <section>
        <h2 className="text-lg font-medium text-white">Foto</h2>
        <div className="mt-4 space-y-4">
          {form.photoUrl && (
            <div className="rounded-xl shadow-md shadow-black/20 overflow-hidden aspect-square max-w-sm relative">
              <Image
                src={form.photoUrl}
                alt="Profilbilde"
                fill
                className="object-cover"
                onError={() => {}}
              />
            </div>
          )}
          <input
            type="text"
            value={form.photoUrl ?? ""}
            onChange={(e) => handleField("photoUrl", e.target.value)}
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
            placeholder="Bilde-URL (valfritt)"
          />
        </div>
      </section>

      {/* Knappar */}
      <div className="space-y-3 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-white text-gray-900 font-medium py-3 hover:bg-gray-200 transition disabled:opacity-50"
        >
          {saving ? "Lagrar …" : "Lagre profil"}
        </button>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="w-full rounded-xl bg-white/10 border border-white/10 text-gray-200 py-3 hover:bg-white/20 transition"
        >
          Avbryt
        </button>
      </div>
    </form>
  );
}