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
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#FFFFFF',
          backdropFilter: 'blur(12px)',
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
          className="text-xs"
          style={{ color: 'rgba(212, 175, 55, 0.45)' }}
        >
          Eksempel: {exampleText}
        </p>
      )}
    </div>
  );
};