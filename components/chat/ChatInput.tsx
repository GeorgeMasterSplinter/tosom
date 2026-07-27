'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { color, radius, motion, shadow } from '@/config/design-tokens';

interface ChatInputProps {
  onSend: (content: string) => Promise<void>;
  onTypingStart?: () => void;
  onTypingEnd?: () => void;
  placeholder?: string;
  disabled?: boolean;
  sending?: boolean;
}

export default function ChatInput({
  onSend,
  onTypingStart,
  onTypingEnd,
  placeholder = 'Skriv ei melding…',
  disabled = false,
  sending = false,
}: ChatInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState('');
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasSentRef = useRef(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-focus input når chat lastar
  useEffect(() => {
    if (!hasSentRef.current && !disabled) {
      inputRef.current?.focus();
      hasSentRef.current = true;
    }
  }, [disabled]);

  // Typing-indikator
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    if (!newValue.trim() || !onTypingStart) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    typingTimeoutRef.current = setTimeout(() => {
      onTypingStart?.();
    }, 300);
  }, [onTypingStart]);

  const handleInputBlur = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    onTypingEnd?.();
  }, [onTypingEnd]);

  const handleSend = useCallback(async () => {
    if (!value.trim() || disabled || sending) return;
    await onSend(value.trim());
    setValue('');
    onTypingEnd?.();
    inputRef.current?.focus();
  }, [value, onSend, disabled, sending, onTypingEnd]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  return (
    <footer
      className="sticky bottom-0 px-4 py-4 md:py-5"
      style={{
        background: `${color.bg.primary}F2`,
        backdropFilter: 'blur(20px)',
        borderTop: `1px solid ${color.border['gold-soft']}`,
        paddingBottom: 'calc(env(safe-area-inset-bottom, 8px) + 16px)',
      }}
    >
      <div className="max-w-[720px] mx-auto flex gap-3 items-end">
        {/* Input-felt */}
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || sending}
            className="w-full px-5 py-3.5 outline-none transition-all duration-300 text-sm"
            style={{
              background: color.glass['bg'],
              border: `1px solid ${isFocused ? color.border.gold : color.glass.border}`,
              borderRadius: `${radius.xl}px`,
              color: color.text.primary,
              cursor: disabled || sending ? 'not-allowed' : 'text',
              transition: `all ${motion.durations.normal} ${motion.easings.easeOut}`,
              backdropFilter: 'blur(8px)',
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              handleInputBlur();
              setIsFocused(false);
            }}
          />
        </div>

        {/* Send-knapp */}
        <button
          onClick={handleSend}
          disabled={!value.trim() || disabled || sending}
          className="flex-shrink-0 flex items-center justify-center relative transition-all duration-300"
          style={{
            width: '48px',
            height: '48px',
            borderRadius: `${radius.full}px`,
            background: value.trim() ? color.gradient.gold : color.glass.bg,
            color: value.trim() ? color.bg.primary : color.text.subtle,
            cursor: value.trim() && !disabled && !sending ? 'pointer' : 'not-allowed',
            opacity: value.trim() ? 1 : 0.5,
            transform: value.trim() ? 'scale(1)' : 'scale(0.95)',
            transition: `all ${motion.durations.normal} ${motion.easings.easeOut}`,
            border: value.trim() ? 'none' : `1px solid ${color.glass.border}`,
            boxShadow: value.trim() && isHovered ? shadow['gold-lg'] : shadow.none,
          }}
          onMouseEnter={() => {
            if (!value.trim() || disabled || sending) return;
            setIsHovered(true);
          }}
          onMouseLeave={() => setIsHovered(false)}
        >
          {sending ? (
            <div
              className="w-4 h-4"
              style={{
                border: '2px solid rgba(11, 14, 17, 0.2)',
                borderTopColor: '#0B0E11',
                animation: 'spin 0.8s linear infinite',
                borderRadius: '50%',
              }}
            />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </footer>
  );
}