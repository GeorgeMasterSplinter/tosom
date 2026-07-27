'use client';

import PremiumButton from '@/components/ui/PremiumButton';

interface ProfileActionsProps {
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  onPublish?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  isEditing?: boolean;
  hasChanges?: boolean;
  isVisible?: boolean;
  canPublish?: boolean;
}

export default function ProfileActions({
  onEdit,
  onSave,
  onCancel,
  onPublish,
  onDelete,
  onShare,
  isEditing = false,
  hasChanges = false,
  isVisible = false,
  canPublish = false,
}: ProfileActionsProps) {
  return (
    <div className="flex flex-wrap gap-[var(--space-xs)]">
      {/* Edit */}
      {onEdit && !isEditing && (
        <PremiumButton variant="secondary" className="text-xs px-5 py-2.5" onClick={onEdit}>
          ✎ Rediger profil
        </PremiumButton>
      )}

      {/* Save */}
      {isEditing && hasChanges && onSave && (
        <PremiumButton variant="primary" className="text-xs px-5 py-2.5" onClick={onSave}>
          ✓ Lagre endringer
        </PremiumButton>
      )}

      {/* Cancel */}
      {isEditing && onCancel && (
        <PremiumButton variant="secondary" className="text-xs px-5 py-2.5" onClick={onCancel}>
          ✕ Avbryt
        </PremiumButton>
      )}

      {/* Publish */}
      {canPublish && onPublish && (
        <PremiumButton variant="primary" className="text-xs px-5 py-2.5" onClick={onPublish}>
          publiser profil →
        </PremiumButton>
      )}

      {/* Share */}
      {isVisible && onShare && (
        <PremiumButton variant="secondary" className="text-xs px-5 py-2.5" onClick={onShare}>
          del profil
        </PremiumButton>
      )}

      {/* Delete */}
      {onDelete && (
        <button
          onClick={onDelete}
          className="text-xs text-red-400 hover:text-red-300 transition-colors duration-200 px-5 py-2.5"
        >
          slett profil
        </button>
      )}
    </div>
  );
}