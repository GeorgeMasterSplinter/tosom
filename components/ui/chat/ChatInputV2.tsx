/**
 * ChatInputV2 — Standalone chat input with send button
 *
 * Usage:
 *   <ChatInputV2
 *     onSend={handleSend}
 *     placeholder="Skriv en melding..."
 *     compact={false}
 *   />
 */

import React, { useRef } from 'react';

export interface ChatInputV2Props {
  /** Send callback */
  onSend: (text: string) => void;
  /** Input placeholder */
  placeholder?: string;
  /** Send button label */
  sendLabel?: string;
  /** Whether compact mode */
  compact?: boolean;
  /** Whether sending (disabled state) */
  sending?: boolean;
  /** Max rows for textarea */
  maxRows?: number;
  /** Custom class */
  className?: string;
}

const ChatInputV2: React.FC<ChatInputV2Props> = ({
  onSend,
  placeholder = 'Skriv en melding...',
  sendLabel = 'Send',
  compact = false,
  sending = false,
  maxRows = 4,
  className = '',
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputRef.current?.value?.trim();
    if (text && !sending) {
      onSend(text);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const paddingClass = compact ? 'px-3 py-2' : 'px-4 py-4';

  return (
    <div className={`${paddingClass} border-t border-white/5 bg-ts-glass/30 backdrop-blur-xl ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className={`flex gap-3 ${compact ? '' : 'items-end'}`}>
          <textarea
            ref={inputRef}
            placeholder={placeholder}
            rows={compact ? 1 : 1}
            maxLength={2000}
            className={`
              flex-1 resize-none
              rounded-xl
              border border-white/10
              bg-white/[0.04]
              px-4 py-3
              text-sm text-ts-primary
              placeholder:text-ts-text-muted
              focus:border-ts-gold/50
              focus:outline-none
              focus:ring-2 focus:ring-ts-gold/20
              backdrop-blur-sm
              transition-all
            `}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                inputRef.current?.form?.requestSubmit();
              }
            }}
          />
          <button
            type="submit"
            disabled={sending || !inputRef.current?.value?.trim()}
            className={`
              flex items-center gap-2
              px-6 py-3
              rounded-xl
              bg-ts-gold
              text-ts-bg
              font-medium
              text-sm
              hover:bg-ts-gold/90
              disabled:opacity-40
              disabled:cursor-not-allowed
              transition-all
            `}
          >
            {sending ? (
              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
            {!compact && sendLabel}
          </button>
        </div>
      </form>
    </div>
  );
};

ChatInputV2.displayName = 'ChatInputV2';
export default ChatInputV2;