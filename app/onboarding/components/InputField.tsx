/**
 * ToSom – InputField
 * Premium input med label, placeholder, validering.
 */

'use client';

import { FC } from 'react';

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  exampleText?: string;
  required?: boolean;
  min?: number;
  max?: number;
}

export const InputField: FC<InputFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  exampleText,
  required = false,
  min,
  max,
}) => {
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
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        className="
          w-full px-4 py-3 rounded-xl text-sm
          transition-all duration-200 ease-out
          focus:outline-none
        "
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#FFFFFF',
          backdropFilter: 'blur(12px)',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: '20px',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'rgba(212, 175, 55, 0.6)';
          e.target.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.15), 0 0 0 3px rgba(212, 175, 55, 0.2)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          e.target.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.1)';
        }}
      />
      {exampleText && (
        <p
          className="text-xs"
          style={{ color: 'rgba(212, 175, 55, 0.45)' }}
        >
          Eksempel: {exampleText}
        </p>
      )}
    </div>
  );
};