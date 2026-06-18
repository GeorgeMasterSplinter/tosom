'use client';

import GlassPanel from '@/components/ui/GlassPanel';
import GlassCard from '@/components/ui/GlassCard';
import FadeIn from '@/components/ui/FadeIn';
import type { UserProfile } from '@/lib/profile/userProfile';

interface ProfileDetailsProps {
  profile: UserProfile;
}

export default function ProfileDetails({ profile }: ProfileDetailsProps) {
  const getReadyColor = (ready: boolean) => ready ? 'text-green-500' : 'text-yellow-400';
  const getReadyLabel = (ready: boolean) => ready ? 'Klar for match ✓' : 'Fullfør profil';

  return (
    <FadeIn>
      <div className="flex flex-col gap-[var(--space-xl)]">

        {/* Status strip */}
        <div className="flex items-center justify-between">
          <span className={`text-sm font-semibold ${getReadyColor(profile.readyForMatch)}`}>
            {getReadyLabel(profile.readyForMatch)}
          </span>
        </div>

        {/* Om meg */}
        <GlassPanel className="flex flex-col gap-[var(--space-sm)]">
          <h2 className="text-xl font-semibold text-[var(--color-text)] tracking-tight">
            Om meg
          </h2>
          <p className="text-[var(--color-muted)] leading-[var(--line-relaxed)]">
            {profile.bio}
          </p>
        </GlassPanel>

        {/* Verdiar */}
        <GlassPanel className="flex flex-col gap-[var(--space-sm)]">
          <h2 className="text-xl font-semibold text-[var(--color-text)] tracking-tight">
            Verdiar
          </h2>
          <div className="flex flex-wrap gap-[var(--space-xs)]">
            {profile.values.map((value) => (
              <span
                key={value}
                className="px-3 py-1.5 rounded-full text-sm font-medium text-[var(--color-gold)] bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/20"
              >
                {value}
              </span>
            ))}
          </div>
        </GlassPanel>

        {/* Interesser */}
        <GlassPanel className="flex flex-col gap-[var(--space-sm)]">
          <h2 className="text-xl font-semibold text-[var(--color-text)] tracking-tight">
            Interesser
          </h2>
          <div className="flex flex-wrap gap-[var(--space-xs)]">
            {profile.interests.map((interest) => (
              <span
                key={interest}
                className="px-3 py-1.5 rounded-full text-sm font-medium text-[var(--color-muted)] bg-white/5 border border-white/10"
              >
                {interest}
              </span>
            ))}
          </div>
        </GlassPanel>

        {/* Bilete-galleri */}
        {profile.photos.length > 0 && (
          <GlassPanel className="flex flex-col gap-[var(--space-sm)]">
            <h2 className="text-xl font-semibold text-[var(--color-text)] tracking-tight">
              Bilete
            </h2>
            <div className="flex gap-[var(--space-sm)] overflow-x-auto">
              {profile.photos.map((photo, idx) => (
                <div
                  key={idx}
                  className="w-32 h-40 flex-shrink-0 rounded-xl overflow-hidden border border-white/10 bg-[var(--color-card)]"
                >
                  <img
                    src={photo}
                    alt={`Bilde ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </GlassPanel>
        )}

        {/* Profil-samandrag */}
        <GlassCard className="flex flex-col gap-[var(--space-sm)]">
          <h3 className="text-lg font-semibold text-[var(--color-text)] tracking-tight">
            Profil-samandrag
          </h3>
          <div className="flex flex-col gap-[var(--space-xs)] text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--color-muted)]">Verdiar valde</span>
              <span className="text-[var(--color-text)] font-medium">{profile.values.length} / 5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-muted)]">Interesser valde</span>
              <span className="text-[var(--color-text)] font-medium">{profile.interests.length} / 10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-muted)]">Bilete lasta opp</span>
              <span className="text-[var(--color-text)] font-medium">{profile.photos.length} / 3</span>
            </div>
          </div>
        </GlassCard>

      </div>
    </FadeIn>
  );
}