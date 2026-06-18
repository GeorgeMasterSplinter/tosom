'use client';

interface ProfileInputProps {
  label: string;
  value: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  type?: 'text' | 'textarea' | 'number' | 'url';
  max?: number;
  required?: boolean;
  hint?: string;
  multiLine?: boolean;
}

export default function ProfileInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  max,
  required,
  hint,
  multiLine = false,
}: ProfileInputProps) {
  const tag = type === 'textarea' || multiLine ? 'textarea' : 'input';

  const baseInputClass =
    'w-full rounded-lg border border-[var(--color-card-border)] ' +
    'bg-white/[0.03] text-[var(--color-text)] placeholder:text-[var(--color-muted)]/50 ' +
    'focus:border-[var(--color-gold)]/40 focus:bg-[var(--color-gold)]/[0.03] focus:outline-none ' +
    'transition-all duration-200 ease-out ' +
    'px-4 py-3 text-sm';

  return (
    <div className="flex flex-col gap-[var(--space-xs)]">
      <label className="text-sm font-medium text-[var(--color-text)]">{label}</label>

      {tag === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          required={required}
          rows={5}
          className={`${baseInputClass} resize-y leading-relaxed`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={baseInputClass}
        />
      )}

      <div className="flex items-center justify-between text-xs text-[var(--color-muted)]">
        {hint && <span>{hint}</span>}
        {max && (
          <span className={value.length > max ? 'text-red-400' : ''}>
            {value.length} / {max} tegn
          </span>
        )}
      </div>
    </div>
  );
}