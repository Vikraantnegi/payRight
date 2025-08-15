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
      bg-white/80 backdrop-blur-sm rounded-2xl 
      shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20
      hover:shadow-[0_8px_40px_rgb(0,0,0,0.15)] transition-all duration-300
      ${paddingClasses[padding]} ${className}
    `}>
      {(title || subtitle) && (
        <div className="mb-8">
          {title && (
            <h3 className="text-2xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-base text-gray-600 leading-relaxed opacity-90">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
