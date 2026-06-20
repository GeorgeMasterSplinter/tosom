/**
 * FormField — Wrapper for form inputs with label, error, and helper
 *
 * Usage:
 *   <FormField label="Email" error={errors.email} helper="We'll never share your email">
 *     <Input type="email" />
 *   </FormField>
 */

import React, { forwardRef } from 'react';

export interface FormFieldProps {
  /** Child input element */
  children: React.ReactNode;
  /** Label text */
  label?: string;
  /** Error message */
  error?: string;
  /** Helper text */
  helper?: string;
  /** Required indicator */
  required?: boolean;
  /** Custom class */
  className?: string;
}

const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  ({ label, error, helper, required, children, className = '' }, ref) => {
    const hasError = !!error;

    return (
      <div ref={ref} className={`flex flex-col gap-1.5 ${className}`}>
        {label && (
          <label className="text-xs font-medium text-ts-text-secondary">
            {label}
            {required && <span className="text-ts-error ml-0.5">*</span>}
          </label>
        )}
        {children}
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

FormField.displayName = 'FormField';
export default FormField;