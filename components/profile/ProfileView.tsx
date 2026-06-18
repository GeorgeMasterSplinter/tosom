'use client';

import GlassPanel from '@/components/ui/GlassPanel';
import PremiumButton from '@/components/ui/PremiumButton';
import FadeIn from '@/components/ui/FadeIn';
import type { UserProfile } from '@/lib/profile/userProfile';

interface ProfileViewProps {
  profile: UserProfile;
  onEdit?: () => void;
  onSave?: () => void;
  isEditing?: boolean;
}

export default function ProfileView({
  profile,
  onEdit,
  onSave,
  isEditing = false,
}: ProfileViewProps) {
  return (
    <FadeIn>
      <div className="flex flex-col gap-[var(--space-xl)] max-w-2xl mx-auto">

        {/* Header */}
        <GlassPanel className="flex flex-col gap-[var(--space-md)] items-center text-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[var(--color-gold)]/30 to-[var(--color-gold)]/10 border-2 border-[var(--color-gold)]/30 flex items-center justify-center overflow-hidden">
              {profile.photos[0] ? (
                <img
                  src={profile.photos[0]}
                  alt={profile.name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-4xl font-semibold text-[var(--color-gold)]">
                  {profile.name.charAt(0)}
                </span>
              )}
            </div>
            {profile.readyForMatch && (
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-green-500 border-2 border-[var(--color-bg)] flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-semibold text-[var(--color-text)] tracking-tight">
              {profile.name}, {profile.age}
            </h1>
            <p className="text-[var(--color-gold)] text-sm font-medium mt-1">
              {profile.readyForMatch ? 'klar for match' : 'fullfør profil for å starte'}
            </p>
          </div>

          {onEdit && !isEditing && (
            <PremiumButton variant="secondary" onClick={onEdit}>
              Rediger profil →
            </PremiumButton>
          )}
        </GlassPanel>

        {/* Bio */}
        <GlassPanel className="flex flex-col gap-[var(--space-sm)]">
          <h2 className="text-xl font-semibold text-[var(--color-text)]">Om meg</h2>
          <p className="text-[var(--color-muted)] leading-[var(--line-relaxed)]">
            {profile.bio}
          </p>
        </GlassPanel>

        {/* Values */}
        <GlassPanel className="flex flex-col gap-[var(--space-sm)]">
          <h2 className="text-xl font-semibold text-[var(--color-text)]">Verdiar</h2>
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

        {/* Interests */}
        <GlassPanel className="flex flex-col gap-[var(--space-sm)]">
          <h2 className="text-xl font-semibold text-[var(--color-text)]">Interesser</h2>
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

        {/* Photos */}
        {profile.photos.length > 0 && (
          <GlassPanel className="flex flex-col gap-[var(--space-sm)]">
            <h2 className="text-xl font-semibold text-[var(--color-text)]">Bilete</h2>
            <div className="flex gap-[var(--space-sm)] overflow-x-auto">
              {profile.photos.map((photo, idx) => (
                <div
                  key={idx}
                  className="w-24 h-32 flex-shrink-0 rounded-lg overflow-hidden border border-white/10 bg-white/[0.03]"
                >
                  <img
                    src={photo}
                    alt={`Bilde ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </GlassPanel>
        )}

        {/* Save action */}
        {isEditing && onSave && (
          <PremiumButton variant="primary" className="w-full" onClick={onSave}>
            Lagre profil →
          </PremiumButton>
        )}
      </div>
    </FadeIn>
  );
}