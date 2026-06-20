/**
 * ChatSuggestions — Suggestion chips for chat prompts
 *
 * Usage:
 *   <ChatSuggestions
 *     items={[
 *       { label: "Icebreaker", value: "Tell me about your day" },
 *       { label: "Question", value: "What's your favorite memory?" }
 *     ]}
 *     onSelect={handleSelect}
 *   />
 */

import React from 'react';

export interface ChatSuggestionsProps {
  /** Suggestion items */
  items: Array<{ label: string; value: string; icon?: React.ReactNode }>;
  /** Select callback */
  onSelect: (item: { label: string; value: string }) => void;
  /** Section label */
  label?: string;
  /** Horizontal layout */
  horizontal?: boolean;
  /** Custom class */
  className?: string;
}

const ChatSuggestions: React.FC<ChatSuggestionsProps> = ({
  items,
  onSelect,
  label = 'Forslag',
  horizontal = true,
  className = '',
}) => {
  if (items.length === 0) return null;

  return (
    <div className={`${className}`}>
      {label && (
        <p className="text-xs font-medium text-ts-text-subtle mb-2 px-1">{label}</p>
      )}
      {horizontal ? (
        <div className="flex flex-wrap gap-2">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => onSelect(item)}
              className="
                inline-flex items-center gap-1.5
                px-3.5 py-2
                text-xs font-medium
                rounded-full
                bg-ts-glass
                border border-white/8
                text-ts-text-secondary
                hover:bg-ts-gold/10 hover:text-ts-gold hover:border-ts-gold/20
                transition-all
              "
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => onSelect(item)}
              className="
                flex items-center gap-2
                px-4 py-3
                text-sm font-medium
                rounded-xl
                bg-ts-glass
                border border-white/8
                text-ts-text-secondary
                hover:bg-ts-gold/10 hover:text-ts-gold hover:border-ts-gold/20
                transition-all
              "
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

ChatSuggestions.displayName = 'ChatSuggestions';
export default ChatSuggestions;