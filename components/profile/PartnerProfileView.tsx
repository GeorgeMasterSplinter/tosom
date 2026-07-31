"use client";

/** PartnerProfileView — visning av partnerprofil med låste/åpne bilder
 *  PP4–PP10 — props, layout, header, bio, verdier, interesser, bilder
 *  PP18 — rolige farger, samme stil som ChatPanel/MatchResultView
 *  PP20 — ingen interaktiv logikk
 *  PP22 — TODO-kommentar for backend-kobling
 *  PP26 — responsiv modal
 *  PP27 — placeholder-bilder med "Låst" */

import type { PartnerProfile } from "../../lib/profile/partnerProfile";
import Image from 'next/image';

/* PP4 — Props */
interface PartnerProfileViewProps {
  /** PP22 — TODO: Koble til ekte partnerdata frå backend seinare */
  profile: PartnerProfile;
  /** PP23 — Koble til journeyState.photosAllowed */
  photosAllowed: boolean;
  onClose?: () => void;
}

export default function PartnerProfileView({
  profile,
  photosAllowed,
  onClose,
}: PartnerProfileViewProps) {
  /* PP6 — Avatar: første bilde eller initial */
  const avatarUrl =
    profile.photos?.[0] && photosAllowed
      ? profile.photos[0]
      : null;

  const avatarFallback = profile.name.charAt(0);

  /* PP17 — Scroll-støtte via overflow-y-auto */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm p-4">
      <div className="max-w-lg w-full max-h-[90vh] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
        {/* PP6 — Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/5">
          <div className="flex items-center gap-3">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={profile.name}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-200/60 to-emerald-200/60 flex items-center justify-center text-lg font-medium text-[#4A4A4A]/80">
                {avatarFallback}
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-[#4A4A4A]">
                {profile.name}, {profile.age}
              </p>
              {profile.compatibilityScore != null && (
                <p className="text-xs text-[#4A4A4A]/50">
                  Matchkvalitet: {profile.compatibilityScore}%
                </p>
              )}
            </div>
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

        {/* PP17 — Scroll-innhold */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* PP7 — Bio-seksjon */}
          <section>
            <h3 className="text-sm font-medium text-[#4A4A4A]/70 mb-2">
              Om personen
            </h3>
            <p className="text-sm text-[#4A4A4A]/80 leading-relaxed">
              {profile.bio}
            </p>
          </section>

          {/* PP8 — Verdier-seksjon */}
          <section>
            <h3 className="text-sm font-medium text-[#4A4A4A]/70 mb-2">
              Verdier
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.values.map((v) => (
                <span
                  key={v}
                  className="text-xs px-3 py-1.5 rounded-full bg-amber-50 text-amber-800/80 border border-amber-100/50"
                >
                  {v}
                </span>
              ))}
            </div>
          </section>

          {/* PP9 — Interesser-seksjon */}
          <section>
            <h3 className="text-sm font-medium text-[#4A4A4A]/70 mb-2">
              Interesser
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((i) => (
                <span
                  key={i}
                  className="text-xs px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800/80 border border-emerald-100/50"
                >
                  {i}
                </span>
              ))}
            </div>
          </section>

          {/* PP10 — Bilder-seksjon */}
          <section>
            <h3 className="text-sm font-medium text-[#4A4A4A]/70 mb-2">
              Bilder
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {photosAllowed && profile.photos.length > 0 ? (
                profile.photos.map((url, idx) => (
                  <div key={idx} className="relative w-full aspect-square">
                    <Image
                      src={url}
                      alt={`Bilde ${idx + 1}`}
                      fill
                      className="rounded-lg object-cover shadow-sm"
                    />
                  </div>
                ))
              ) : (
                <>
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="w-full aspect-square rounded-lg bg-[#f1f5f9] flex items-center justify-center border border-[#e2e8f0]"
                    >
                      <span className="text-xs text-[#94a3b8]">Låst</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
