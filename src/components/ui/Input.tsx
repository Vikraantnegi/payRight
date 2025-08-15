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
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative group">
        {type === 'currency' && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-gray-500 font-semibold text-lg">₹</span>
          </div>
        )}
        
        <input
          type="text"
          value={formatDisplayValue(value)}
          onChange={handleChange}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          disabled={disabled}
          className={`
            block w-full rounded-xl border-2 transition-all duration-300 ease-out
            px-4 py-4 text-gray-900 placeholder-gray-400 text-base
            focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500
            group-hover:border-gray-300 group-hover:shadow-md
            ${type === 'currency' ? 'pl-12' : 'pl-4'}
            ${error 
              ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' 
              : 'border-gray-200'
            }
            ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200' : 'bg-white'}
            leading-6 shadow-sm
          `}
        />
        
        {/* Subtle glow effect on focus */}
        <div className={`
          absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none
          ${error ? 'shadow-red-500/20' : 'shadow-blue-500/20'}
          opacity-0 group-focus-within:opacity-100
        `} />
      </div>
      
      {error && (
        <p className="text-sm text-red-600 mt-2 flex items-center space-x-2">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
          <span>{error}</span>
        </p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-gray-500 mt-2 leading-relaxed opacity-80">{helperText}</p>
      )}
    </div>
  );
}
