'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

export function Card({ 
  children, 
  title, 
  subtitle, 
  className = '', 
  padding = 'md' 
}: CardProps) {
  const paddingClasses = {
    sm: 'p-6',
    md: 'p-8',
    lg: 'p-10'
  };

  return (
    <div className={`
      bg-white/90 backdrop-blur-sm rounded-xl 
      shadow-[0_4px_20px_rgb(0,0,0,0.08)] border border-white/30
      hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300
      ${paddingClasses[padding]} ${className}
    `}>
      {(title || subtitle) && (
        <div className="mb-8">
          {title && (
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600 leading-relaxed opacity-80">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
