/**
 * ToSom ToSomChatInput — System component
 * 
 * Chat input with send button and typing indicator.
 */

'use client';

import { FC, useRef } from 'react';
import { colors, spacing, motion } from '@/design/tokens';
import { ToSomIconButton } from './ToSomIconButton';

interface ToSomChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  typing?: boolean;
  placeholder?: string;
}

export const ToSomChatInput: FC<ToSomChatInputProps> = ({
  value,
  onChange,
  onSend,
  typing = false,
  placeholder = 'Skriv en melding...',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div
      className="flex items-center gap-3 p-4"
      style={{
        borderTop: `1px solid rgba(255,255,255,0.08)`,
        background: 'rgba(255,255,255,0.02)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
        style={{
          color: colors.textPrimary,
        }}
        onFocus={(e) => {
          (e.target as HTMLElement).style.borderColor = colors.gold;
          (e.target as HTMLElement).style.boxShadow = '0 0 20px rgba(212,175,55,0.2)';
        }}
        onBlur={(e) => {
          (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.10)';
          (e.target as HTMLElement).style.boxShadow = 'none';
        }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />

      {/* Typing indicator or Send button */}
      {typing ? (
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                background: colors.gold,
                animation: `dotPulse 1.5s ease-in-out infinite ${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      ) : (
        <ToSomIconButton
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13" stroke={colors.gold} strokeWidth="2" strokeLinecap="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke={colors.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
          variant="gold"
          size="md"
          onClick={onSend}
        />
      )}
    </div>
  );
};

export default ToSomChatInput;