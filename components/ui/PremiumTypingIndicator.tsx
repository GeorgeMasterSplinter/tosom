/* ═══════════════════════════════════════════
   Tosom PremiumTypingIndicator — Design System 1.1
   Viser når partner skriv i chat.
   Animert med tre punkt som "tappar".
   ═══════════════════════════════════════════ */

'use client';

interface PremiumTypingIndicatorProps {
  visible?: boolean;
  name?: string;
}

export const PremiumTypingIndicator = ({ visible = true, name = 'Partner' }: PremiumTypingIndicatorProps) => {
  if (!visible) return null;

  return (
    <div className="flex items-center gap-3 px-4 py-3 animate-fadeIn" style={{ animationDuration: '300ms' }}>
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))',
          border: '1px solid rgba(212, 175, 55, 0.2)',
        }}
      >
        <span className="text-sm" style={{ color: '#D4AF37' }}>👤</span>
      </div>

      {/* Typing-boble */}
      <div
        className="px-4 py-3 rounded-2xl rounded-tl-md"
        style={{
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div className="flex items-center gap-1">
          <span
            className="text-xs font-medium"
            style={{ color: 'rgba(255, 255, 255, 0.5)' }}
          >
            {name} skriv
          </span>
          <div className="flex gap-0.5 ml-1">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: 'rgba(212, 175, 55, 0.6)' }}
            />
            <div
              className="w-1.5 h-1.5 rounded-full animate-bounce"
              style={{
                background: 'rgba(212, 175, 55, 0.8)',
                animationDelay: '150ms',
                animationDuration: '1s',
              }}
            />
            <div
              className="w-1.5 h-1.5 rounded-full animate-bounce"
              style={{
                background: '#D4AF37',
                animationDelay: '300ms',
                animationDuration: '1s',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumTypingIndicator;