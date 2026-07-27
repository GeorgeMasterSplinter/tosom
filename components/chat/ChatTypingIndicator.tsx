'use client';

import { color, radius, spacing } from '@/config/design-tokens';

interface ChatTypingIndicatorProps {
  isActive: boolean;
  label?: string;
}

export default function ChatTypingIndicator({
  isActive = false,
  label = 'Skriver...',
}: ChatTypingIndicatorProps) {
  if (!isActive) return null;

  return (
    <div className="flex justify-start animate-[fadeInUp_0.3s_ease-out_both]">
      <style>{`
        @keyframes typingDot {
          0%, 60%, 100% { transform: scale(0.85); opacity: 0.4; }
          30% { transform: scale(1.05); opacity: 0.85; }
        }
      `}</style>
      <div
        className="px-4 py-3"
        style={{
          background: 'rgba(212, 175, 55, 0.06)',
          border: `1px solid rgba(212, 175, 55, 0.12)`,
          borderRadius: `${radius.xl}px ${radius.xl}px ${radius.sm}px ${radius.xl}px`,
          backdropFilter: 'blur(16px)',
        }}
      >
        <div className="flex gap-1.5 items-center">
          {['rgba(212, 175, 55, 0.7)', 'rgba(212, 175, 55, 0.5)', 'rgba(212, 175, 55, 0.7)'].map((bg, i) => (
            <div
              key={i}
              className="rounded-full"
              style={{
                width: `${spacing.sm}px`,
                height: `${spacing.sm}px`,
                background: bg,
                animation: `typingDot 1.2s infinite ease-in-out ${i * 0.15}s`,
              }}
            />
          ))}
          {label && (
            <span
              className="ml-2"
              style={{ color: 'rgba(212, 175, 55, 0.6)', fontSize: '12px' }}
            >
              {label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}