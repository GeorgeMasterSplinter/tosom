/**
 * TagInput — Gold-themed tag-based input with gold remove
 *
 * Usage:
 *   <TagInput label="Interests" tags={tags} onChange={setTags} placeholder="Add interest" />
 */

import React, { useState, forwardRef, KeyboardEvent } from 'react';

export interface TagInputProps {
  /** Label text */
  label?: string;
  /** Helper text */
  helper?: string;
  /** Error message */
  error?: string;
  /** Current tags */
  tags: string[];
  /** Change handler */
  onChange: (tags: string[]) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Maximum number of tags */
  max?: number;
  /** Whether disabled */
  disabled?: boolean;
  /** Custom class */
  className?: string;
}

const TagInput = forwardRef<HTMLInputElement, TagInputProps>(
  ({ label, helper, error, tags, onChange, placeholder = 'Press Enter to add', max, disabled = false, className = '' }, ref) => {
    const [input, setInput] = useState('');
    const hasError = !!error;

    const addTag = (value: string) => {
      const trimmed = value.trim();
      if (!trimmed || tags.includes(trimmed) || (max && tags.length >= max)) return;
      onChange([...tags, trimmed]);
      setInput('');
    };

    const removeTag = (tagToRemove: string) => {
      onChange(tags.filter((t) => t !== tagToRemove));
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addTag(input);
      }
      if (e.key === 'Backspace' && !input && tags.length > 0) {
        removeTag(tags[tags.length - 1]);
      }
    };

    return (
      <div className={`flex flex-col gap-1.5 ${className}`}>
        {label && (
          <label className="text-xs font-medium text-ts-text-secondary">
            {label}
          </label>
        )}
        <div
          className={`
            rounded-ts-md
            border
            bg-ts-glass/50
            ${hasError ? 'border-ts-error' : 'border-ts-glass'}
            focus-within:border-ts-gold
            focus-within:ring-2
            focus-within:ring-ts-gold/20
            transition-all
          `}
        >
          <div className="flex flex-wrap items-center gap-1.5 p-2">
            {/* Tags */}
            {tags.map((tag) => (
              <span
                key={tag}
                className="
                  inline-flex
                  items-center
                  gap-1
                  px-2 py-1
                  text-xs
                  font-medium
                  rounded-full
                  bg-ts-gold-soft
                  text-ts-gold
                  border border-ts-gold/20
                  animate-scaleIn
                "
              >
                {tag}
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="w-3 h-3 flex items-center justify-center hover:text-ts-error transition-colors"
                    aria-label={`Remove ${tag}`}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </span>
            ))}
            {/* Input */}
            <input
              ref={ref}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={tags.length === 0 ? placeholder : ''}
              disabled={disabled || !!((max && tags.length >= max))}
              className="
                flex-1
                min-w-[120px]
                bg-transparent
                border-none
                text-ts-text
                text-sm
                py-1
                px-2
                focus:outline-none focus:ring-0
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              "
            />
          </div>
        </div>
        {hasError && (
          <p className="text-xs text-ts-error font-medium">{error}</p>
        )}
        {helper && !hasError && (
          <p className="text-xs text-ts-text-subtle">{helper}</p>
        )}
      </div>
    );
  }
);

TagInput.displayName = 'TagInput';
export default TagInput;