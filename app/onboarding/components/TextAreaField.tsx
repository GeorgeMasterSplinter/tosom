/**
 * ToSom – TextAreaField
 * Premium textarea med label, placeholder, eksempeltekst.
 */

'use client';

import { FC, useRef, useEffect } from 'react';

interface TextAreaFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  exampleText?: string;
  required?: boolean;
  rows?: number;
}

export const TextAreaField: FC<TextAreaFieldProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  exampleText,
  required = false,
  rows = 4,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-sm font-medium"
        style={{ color: 'rgba(255, 255, 255, 0.7)' }}
      >
        {label}
        {required && (
          <span style={{ color: '#D4AF37' }}> *</span>
        )}
      </label>
      <textarea
        id={name}
        ref={textareaRef}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="
          w-full px-4 py-3 rounded-xl text-sm
          transition-all duration-200 ease-out
          resize-none
          focus:outline-none
        "
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#FFFFFF',
          backdropFilter: 'blur(12px)',
          borderRadius: '20px',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'rgba(212, 175, 55, 0.5)';
          e.target.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.15)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          e.target.style.boxShadow = 'none';
        }}
      />
      {exampleText && (
        <p
          className="text-xs italic"
          style={{ color: 'rgba(212, 175, 55, 0.45)' }}
        >
          Eksempel: "{exampleText}"
        </p>
      )}
    </div>
  );
};