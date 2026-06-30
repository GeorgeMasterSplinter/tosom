/**
 * ToSom – SelectField
 * Premium dropdown med label, options.
 */

'use client';

import { FC } from 'react';

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: string[] | Array<{ value: string; label: string }>;
  placeholder?: string;
  required?: boolean;
}

export const SelectField: FC<SelectFieldProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  required = false,
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
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="
          w-full px-4 py-3 rounded-xl text-sm
          transition-all duration-200 ease-out
          focus:outline-none
          appearance-none
          cursor-pointer
        "
        style={{
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: value ? '#FFFFFF' : 'rgba(255, 255, 255, 0.3)',
          backdropFilter: 'blur(12px)',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23D4AF37' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'rgba(212, 175, 55, 0.5)';
          e.target.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.15)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          e.target.style.boxShadow = 'none';
        }}
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((opt, i) => {
          const val = typeof opt === 'string' ? opt : opt.value;
          const lbl = typeof opt === 'string' ? opt : opt.label;
          return <option key={i} value={val}>{lbl}</option>;
        })}
      </select>
    </div>
  );
};