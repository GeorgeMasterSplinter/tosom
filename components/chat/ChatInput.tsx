/**
 * ToSom — ChatInput (Produktnivå)
 * 
 * Input-felt for å sende meldingar med:
 * - auto-focus når chat lastar
 * - stor input med glassmorphism
 * - gull outline på fokus
 * - rein send-knapp med gradient
 */

'use client';

import React, { useRef, useEffect, useCallback } from 'react';

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
  const [value, setValue] = React.useState('');
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasSentRef = useRef(false);

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

  const [isHovered, setIsHovered] = React.useState(false);

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
    <div
      className="sticky bottom-0 px-4 py-4 md:py-5"
      style={{
        background: 'rgba(11, 14, 17, 0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(212, 175, 55, 0.06)',
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
            onBlur={handleInputBlur}
            placeholder={placeholder}
            disabled={disabled || sending}
            className="w-full px-5 py-3.5 rounded-2xl outline-none transition-all duration-300 text-sm"
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
              cursor: disabled || sending ? 'not-allowed' : 'text',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(212, 175, 55, 0.5)';
              e.target.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.15), 0 0 24px rgba(212, 175, 55, 0.12)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Send-knapp */}
        <button
          onClick={handleSend}
          disabled={!value.trim() || disabled || sending}
          className="px-5 py-3.5 rounded-2xl font-medium flex-shrink-0 flex items-center justify-center relative"
          style={{
            width: '48px',
            height: '48px',
            background: value.trim()
              ? 'linear-gradient(135deg, #D4AF37, #E8C766)'
              : 'rgba(255, 255, 255, 0.04)',
            color: value.trim() ? '#0B0E11' : 'rgba(255, 255, 255, 0.15)',
            cursor: value.trim() && !disabled && !sending ? 'pointer' : 'not-allowed',
            opacity: value.trim() ? 1 : 0.5,
            transform: value.trim() ? 'scale(1)' : 'scale(0.95)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            border: 'none',
            zIndex: 1,
          }}
          onMouseEnter={(e) => {
            if (!value.trim() || disabled || sending) return;
            setIsHovered(true);
            const el = e.currentTarget as HTMLElement;
            el.style.boxShadow = '0 4px 28px rgba(212, 175, 55, 0.5), 0 0 40px rgba(212, 175, 55, 0.3)';
            el.style.transform = 'scale(1.08)';
          }}
          onMouseLeave={(e) => {
            setIsHovered(false);
            const el = e.currentTarget as HTMLElement;
            el.style.boxShadow = value.trim()
              ? '0 2px 20px rgba(212, 175, 55, 0.3)'
              : 'none';
            el.style.transform = 'scale(1)';
          }}
        >
          {sending ? (
            <div className="w-4 h-4" style={{
              border: '2px solid rgba(11, 14, 17, 0.2)',
              borderTopColor: '#0B0E11',
              animation: 'spin 0.8s linear infinite',
              borderRadius: '50%',
            }} />
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
    </div>
  );
}