/**
 * ChatWindowV2 — Full chat interface with message list and input
 *
 * Usage:
 *   <ChatWindowV2
 *     messages={messages}
 *     onSend={handleSend}
 *     placeholder="Skriv en melding..."
 *   />
 */

import Image from 'next/image';
import React, { useRef, useEffect } from 'react';

export interface ChatWindowV2Props {
  /** Message list */
  messages: ChatMessage[];
  /** Send callback */
  onSend: (text: string) => void;
  /** Input placeholder */
  placeholder?: string;
  /** Chat participant name */
  participantName?: string;
  /** Participant avatar */
  participantAvatar?: string;
  /** Whether loading */
  loading?: boolean;
  /** Suggestions */
  suggestions?: string[];
  /** Custom class */
  className?: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'other';
  timestamp: Date | string;
  /** Whether it's a system message */
  system?: boolean;
}

const ChatWindowV2: React.FC<ChatWindowV2Props> = ({
  messages,
  onSend,
  placeholder = 'Skriv en melding...',
  participantName,
  participantAvatar,
  loading = false,
  suggestions = [],
  className = '',
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputRef.current?.value?.trim();
    if (text) {
      onSend(text);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleSuggestion = (suggestion: string) => {
    onSend(suggestion);
  };

  return (
    <div
      className={`
        flex flex-col
        h-full
        bg-ts-bg-primary
        ${className}
      `}
    >
      {/* Header */}
      {participantName && (
        <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5 bg-ts-glass/50 backdrop-blur-xl">
          {participantAvatar ? (
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <Image src={participantAvatar} alt={participantName} fill className="object-cover" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-ts-gold/20 flex items-center justify-center">
              <span className="text-sm font-semibold text-ts-gold">
                {participantName?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium text-ts-primary">{participantName}</h3>
            <p className="text-xs text-ts-text-subtle">Online</p>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {loading && messages.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-ts-gold/60 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-ts-gold/60 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-ts-gold/60 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <ChatBubbleV2 key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="px-4 py-2 flex gap-2 overflow-x-auto border-t border-white/5">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSuggestion(s)}
              className="flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-full bg-ts-glass border border-white/8 text-ts-text-secondary hover:bg-ts-gold/10 hover:text-ts-gold hover:border-ts-gold/20 transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-4 border-t border-white/5 bg-ts-glass/30 backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <textarea
            ref={inputRef}
            placeholder={placeholder}
            rows={1}
            className="flex-1 resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-ts-primary placeholder:text-ts-text-muted focus:border-ts-gold/50 focus:outline-none focus:ring-2 focus:ring-ts-gold/20 backdrop-blur-sm transition-all"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                inputRef.current?.form?.requestSubmit();
              }
            }}
          />
          <button
            type="submit"
            className="
              px-6 py-3
              rounded-xl
              bg-ts-gold
              text-ts-bg
              font-medium
              text-sm
              hover:bg-ts-gold/90
              transition-all
              flex items-center gap-2
            "
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

/** Individual message bubble */
function ChatBubbleV2({ message }: { message: ChatMessage }) {
  const isUser = message.sender === 'user';
  const isSystem = message.system;

  if (isSystem) {
    return (
      <div className="flex justify-center">
        <span className="text-xs text-ts-text-subtle bg-ts-glass/50 px-3 py-1.5 rounded-full border border-white/5">
          {message.text}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`
          max-w-[75%]
          px-4 py-3
          text-sm
          ${isUser
            ? 'bg-ts-gold/15 border-ts-gold/25 text-ts-gold rounded-[18px_18px_4px_18px]'
            : 'bg-white/6 border-white/8 text-ts-primary rounded-[18px_18px_18px_4px]'
          }
          ${isUser ? 'border' : 'border'}
          backdrop-blur-sm
        `}
      >
        {message.text}
      </div>
    </div>
  );
}

ChatWindowV2.displayName = 'ChatWindowV2';
export default ChatWindowV2;