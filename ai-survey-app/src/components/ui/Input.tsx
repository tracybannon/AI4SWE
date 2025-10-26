/**
 * Input Component
 *
 * A reusable input field component with label, error, and help text support
 */

import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

/**
 * Input field component with validation states
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helpText, className = '', ...props }, ref) => {
    return (
      <div className="mb-4">
        {label && (
          <label htmlFor={props.id} className="form-label">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`input-field ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
          {...props}
        />
        {helpText && !error && (
          <p className="text-gray-500 text-sm mt-1">{helpText}</p>
        )}
        {error && <p className="form-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
