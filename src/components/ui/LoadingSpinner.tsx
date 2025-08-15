'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  className?: string;
  text?: string;
  showText?: boolean;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

const variantClasses = {
  default: 'text-gray-400',
  primary: 'text-blue-600',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  error: 'text-red-600',
};

export function LoadingSpinner({
  size = 'md',
  variant = 'default',
  className,
  text,
  showText = false,
}: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className='relative'>
        <div
          className={`animate-spin rounded-full border-2 border-current border-t-transparent ${sizeClasses[size]} ${variantClasses[variant]}`}
        />
        <div
          className={`absolute inset-0 rounded-full border-2 border-transparent border-t-current opacity-20 ${sizeClasses[size]} ${variantClasses[variant]}`}
          style={{ animation: 'spin 1s linear infinite reverse' }}
        />
      </div>
      {showText && text && (
        <p className={`mt-2 text-sm text-gray-600 ${variantClasses[variant]}`}>
          {text}
        </p>
      )}
    </div>
  );
}

interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
  children: React.ReactNode;
  className?: string;
}

export function LoadingOverlay({
  isLoading,
  text,
  children,
  className,
}: LoadingOverlayProps) {
  if (!isLoading) return <>{children}</>;

  return (
    <div className={`relative ${className}`}>
      {children}
      <div className='absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-lg'>
        <LoadingSpinner
          size='lg'
          variant='primary'
          text={text}
          showText={!!text}
        />
      </div>
    </div>
  );
}

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
  height?: string;
}

export function LoadingSkeleton({
  className,
  lines = 3,
  height = 'h-4',
}: LoadingSkeletonProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`bg-gray-200 rounded animate-pulse ${height} ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
}

interface LoadingProgressProps {
  progress: number;
  total: number;
  className?: string;
  showPercentage?: boolean;
}

export function LoadingProgress({
  progress,
  total,
  className,
  showPercentage = true,
}: LoadingProgressProps) {
  const percentage = Math.round((progress / total) * 100);

  return (
    <div className={`w-full ${className}`}>
      <div className='flex items-center justify-between mb-2'>
        <span className='text-sm font-medium text-gray-700'>Progress</span>
        {showPercentage && (
          <span className='text-sm text-gray-500'>{percentage}%</span>
        )}
      </div>
      <div className='w-full bg-gray-200 rounded-full h-2'>
        <div
          className='bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out'
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className='flex justify-between text-xs text-gray-500 mt-1'>
        <span>
          {progress} of {total}
        </span>
      </div>
    </div>
  );
}

interface LoadingDotsProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingDots({ className, size = 'md' }: LoadingDotsProps) {
  const dotSize =
    size === 'sm' ? 'h-2 w-2' : size === 'md' ? 'h-3 w-3' : 'h-4 w-4';

  return (
    <div className={`flex space-x-1 ${className}`}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className={`bg-gray-400 rounded-full animate-bounce ${dotSize}`}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
}
