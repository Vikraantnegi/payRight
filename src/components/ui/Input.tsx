'use client';

import React from 'react';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

interface InputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  type?: 'text' | 'number' | 'currency';
  required?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  disabled?: boolean;
}

export function Input({
  label,
  value,
  onChange,
  placeholder,
  type = 'number',
  required = false,
  error,
  helperText,
  className = '',
  disabled = false,
}: InputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (type === 'currency' || type === 'number') {
      const numValue = parseFloat(inputValue.replace(/[^\d.]/g, '')) || 0;
      onChange(numValue);
    } else {
      onChange(parseFloat(inputValue) || 0);
    }
  };

  const formatDisplayValue = (val: number) => {
    if (type === 'currency') {
      return val > 0 ? val.toLocaleString('en-IN') : '';
    }
    return val > 0 ? val.toString() : '';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        {type === 'currency' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        
        <input
          type="text"
          value={formatDisplayValue(value)}
          onChange={handleChange}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          disabled={disabled}
          className={`
            block w-full rounded-md border-gray-300 shadow-sm
            focus:border-blue-500 focus:ring-blue-500 sm:text-sm
            ${type === 'currency' ? 'pl-10' : 'pl-3'}
            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
            ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}
          `}
        />
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}
