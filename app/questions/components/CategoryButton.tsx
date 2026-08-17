/**
 * Tosom – CategoryButton
 * Knapp for spørsmåls-kategorier med glassmorphism og hover-effekt.
 */

'use client';

export default function CategoryButton({
  label,
  onClick,
  count,
}: {
  label: string;
  onClick: () => void;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className="
        w-full text-left px-5 py-4 rounded-xl
        bg-[var(--ts-bg-soft)]
        border border-[var(--ts-border)]
        hover:bg-[var(--ts-bg-hover)]
        hover:border-[var(--ts-gold)]/30
        transition-all duration-200
        text-white font-medium
        focus:outline-none focus:border-[var(--ts-gold)] focus:ring-2 focus:ring-[var(--ts-gold)]/20
      "
    >
      <div className="flex items-center justify-between">
        <span>{label}</span>
        {count !== undefined && (
          <span className="text-[var(--ts-text-soft)] text-sm">
            {count} spørsmål
          </span>
        )}
      </div>
    </button>
  );
}