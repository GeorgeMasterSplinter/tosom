'use client';

import GlassPanel from '@/components/ui/GlassPanel';
import PremiumButton from '@/components/ui/PremiumButton';
import FadeIn from '@/components/ui/FadeIn';

interface ProfileHeaderProps {
  title?: string;
  subtitle?: string;
  status?: 'editing' | 'preview' | 'published' | 'draft';
  onEdit?: () => void;
  onBack?: () => void;
  onSave?: () => void;
  onPublish?: () => void;
  showBack?: boolean;
  showActions?: boolean;
}

export default function ProfileHeader({
  title = 'Profil',
  subtitle,
  status = 'preview',
  onEdit,
  onBack,
  onSave,
  onPublish,
  showBack = false,
  showActions = true,
}: ProfileHeaderProps) {
  const statusColors: Record<string, string> = {
    editing: 'text-yellow-400',
    preview: 'text-[var(--color-gold)]',
    published: 'text-green-500',
    draft: 'text-[var(--color-muted)]',
  };

  const statusLabels: Record<string, string> = {
    editing: 'Redigerer',
    preview: 'Forsørgje',
    published: 'Publisert',
    draft: 'Utkast',
  };

  return (
    <FadeIn>
      <GlassPanel className="flex flex-col gap-[var(--space-md)]">
        {/* Top row */}
        <div className="flex items-center justify-between">
          {showBack && onBack ? (
            <button
              onClick={onBack}
              className="text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors duration-200"
            >
              ← Tilbake
            </button>
          ) : (
            <div />
          )}

          <span className={`text-xs font-semibold uppercase tracking-widest ${statusColors[status]}`}>
            ● {statusLabels[status]}
          </span>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-[var(--space-xs)]">
          <h1 className="text-3xl font-semibold text-[var(--color-text)] tracking-tight leading-[var(--line-relaxed)]">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[var(--color-muted)] leading-[var(--line-relaxed)]">
              {subtitle}
            </p>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex flex-wrap gap-[var(--space-xs)]">
            {onEdit && (
              <PremiumButton variant="secondary" className="text-xs px-4 py-2" onClick={onEdit}>
                Rediger
              </PremiumButton>
            )}
            {onSave && (
              <PremiumButton variant="primary" className="text-xs px-4 py-2" onClick={onSave}>
                Lagre
              </PremiumButton>
            )}
            {onPublish && (
              <PremiumButton variant="primary" className="text-xs px-4 py-2" onClick={onPublish}>
                Publiser →
              </PremiumButton>
            )}
          </div>
        )}

        {/* Bottom accent line */}
        <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-gold)]/30 to-transparent" />
      </GlassPanel>
    </FadeIn>
  );
}