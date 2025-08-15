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
    <div className={`space-y-3 ${className}`}>
      <label className='block text-sm font-medium text-gray-700 mb-2'>
        {label}
        {required && <span className='text-red-500 ml-1'>*</span>}
      </label>

      <div className='relative group'>
        {type === 'currency' && (
          <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
            <span className='text-gray-400 font-medium text-sm'>₹</span>
          </div>
        )}

        <input
          type='text'
          value={formatDisplayValue(value)}
          onChange={handleChange}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          disabled={disabled}
          className={`
            block w-full rounded-lg border transition-all duration-200 ease-out
            px-4 py-3 text-gray-900 placeholder-gray-400 text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
            group-hover:border-gray-300
            ${type === 'currency' ? 'pl-10' : 'pl-4'}
            ${
              error
                ? 'border-red-200 focus:ring-red-500/20 focus:border-red-500 bg-red-50'
                : 'border-gray-200 bg-white hover:bg-gray-50/50'
            }
            ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200' : ''}
            leading-5
          `}
        />

        {/* Subtle focus ring effect */}
        <div
          className={`
          absolute inset-0 rounded-lg transition-all duration-200 pointer-events-none
          ${error ? 'ring-2 ring-red-500/10' : 'ring-2 ring-blue-500/10'}
          opacity-0 group-focus-within:opacity-100
        `}
        />
      </div>

      {error && (
        <p className='text-sm text-red-600 mt-2 flex items-center space-x-2'>
          <span className='w-1.5 h-1.5 bg-red-500 rounded-full' />
          <span>{error}</span>
        </p>
      )}

      {helperText && !error && (
        <p className='text-sm text-gray-500 mt-2 leading-relaxed opacity-75'>
          {helperText}
        </p>
      )}
    </div>
  );
}
