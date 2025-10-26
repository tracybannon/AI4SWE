/**
 * CheckboxGroup Component
 *
 * A reusable checkbox group component for multi-select inputs
 */

import React from 'react';

interface CheckboxGroupProps {
  label?: string;
  options: Array<{ value: string; label: string }>;
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
  helpText?: string;
  required?: boolean;
}

/**
 * CheckboxGroup component for multi-select functionality
 */
export default function CheckboxGroup({
  label,
  options,
  value = [],
  onChange,
  error,
  helpText,
  required,
}: CheckboxGroupProps) {
  const handleCheckboxChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      onChange([...value, optionValue]);
    } else {
      onChange(value.filter((v) => v !== optionValue));
    }
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="space-y-2 mt-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              type="checkbox"
              id={`checkbox-${option.value}`}
              checked={value.includes(option.value)}
              onChange={(e) => handleCheckboxChange(option.value, e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label
              htmlFor={`checkbox-${option.value}`}
              className="ml-2 text-sm text-gray-700 cursor-pointer"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {helpText && !error && (
        <p className="text-gray-500 text-sm mt-1">{helpText}</p>
      )}
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
