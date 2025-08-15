'use client';

import React from 'react';

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
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        {type === 'currency' && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-gray-500 font-medium">₹</span>
          </div>
        )}
        
        <input
          type="text"
          value={formatDisplayValue(value)}
          onChange={handleChange}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          disabled={disabled}
          className={`
            block w-full rounded-lg border-2 transition-all duration-200
            px-4 py-3 text-gray-900 placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${type === 'currency' ? 'pl-12' : 'pl-4'}
            ${error 
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-200 hover:border-gray-300'
            }
            ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200' : 'bg-white'}
            text-sm leading-6
          `}
        />
      </div>
      
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-gray-500 mt-1 leading-relaxed">{helperText}</p>
      )}
    </div>
  );
}
