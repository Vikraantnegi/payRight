'use client';

import React, { useState } from 'react';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import {
  LoadingSpinner,
  LoadingOverlay,
  LoadingSkeleton,
  LoadingProgress,
  LoadingDots,
} from '@/components/ui/LoadingSpinner';
import {
  ExclamationTriangleIcon,
  PlayIcon,
  StopIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

// Component that can throw an error for testing ErrorBoundary
function ErrorThrower({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('This is a test error to demonstrate ErrorBoundary!');
  }
  return (
    <div className='p-4 bg-green-100 border border-green-300 rounded-lg'>
      ✅ No errors here! This component is working normally.
    </div>
  );
}

export default function TestPhase4Page() {
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSkeleton, setShowSkeleton] = useState(false);

  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  };

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const simulateSkeleton = () => {
    setShowSkeleton(true);
    setTimeout(() => setShowSkeleton(false), 2000);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8'>
      <div className='max-w-4xl mx-auto space-y-8'>
        {/* Header */}
        <div className='text-center space-y-4'>
          <h1 className='text-4xl font-bold text-gray-900'>
            Phase 4 Testing Page
          </h1>
          <p className='text-xl text-gray-600'>
            Test the new Error Boundary and Loading State components
          </p>
        </div>

        {/* Error Boundary Testing */}
        <div className='bg-white rounded-2xl shadow-xl p-8 border border-gray-200'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3'>
            <ExclamationTriangleIcon className='h-8 w-8 text-red-500' />
            Error Boundary Testing
          </h2>

          <div className='space-y-4'>
            <div className='flex gap-4'>
              <button
                onClick={() => setShowError(true)}
                className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2'
              >
                <PlayIcon className='h-4 w-4' />
                Trigger Error
              </button>
              <button
                onClick={() => setShowError(false)}
                className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2'
              >
                <StopIcon className='h-4 w-4' />
                Reset Error
              </button>
            </div>

            <div className='border border-gray-200 rounded-lg p-4 min-h-[200px]'>
              <ErrorBoundary>
                <ErrorThrower shouldThrow={showError} />
              </ErrorBoundary>
            </div>
          </div>
        </div>

        {/* Loading States Testing */}
        <div className='bg-white rounded-2xl shadow-xl p-8 border border-gray-200'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3'>
            <ArrowPathIcon className='h-8 w-8 text-blue-500' />
            Loading States Testing
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            {/* Basic Loading Spinner */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-gray-700'>
                Loading Spinner
              </h3>
              <div className='space-y-4'>
                <LoadingSpinner size='sm' variant='default' />
                <LoadingSpinner size='md' variant='primary' />
                <LoadingSpinner size='lg' variant='success' />
                <LoadingSpinner
                  size='xl'
                  variant='warning'
                  text='Loading...'
                  showText
                />
              </div>
            </div>

            {/* Loading Overlay */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-gray-700'>
                Loading Overlay
              </h3>
              <LoadingOverlay isLoading={isLoading} text='Processing...'>
                <div className='p-6 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 min-h-[120px] flex items-center justify-center'>
                  <p className='text-gray-600'>
                    Content that gets covered by loading overlay
                  </p>
                </div>
              </LoadingOverlay>
              <button
                onClick={simulateLoading}
                className='w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
              >
                Simulate Loading (3s)
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className='mt-8 space-y-4'>
            <h3 className='text-lg font-medium text-gray-700'>Progress Bar</h3>
            <LoadingProgress progress={progress} total={100} />
            <button
              onClick={simulateProgress}
              className='px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors'
            >
              Simulate Progress
            </button>
          </div>

          {/* Skeleton Loading */}
          <div className='mt-8 space-y-4'>
            <h3 className='text-lg font-medium text-gray-700'>
              Skeleton Loading
            </h3>
            <div className='border border-gray-200 rounded-lg p-4'>
              {showSkeleton ? (
                <LoadingSkeleton lines={5} height='h-4' />
              ) : (
                <div className='space-y-3'>
                  <div className='h-4 bg-gray-200 rounded w-full' />
                  <div className='h-4 bg-gray-200 rounded w-3/4' />
                  <div className='h-4 bg-gray-200 rounded w-full' />
                  <div className='h-4 bg-gray-200 rounded w-1/2' />
                  <div className='h-4 bg-gray-200 rounded w-full' />
                </div>
              )}
            </div>
            <button
              onClick={simulateSkeleton}
              className='px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors'
            >
              Toggle Skeleton
            </button>
          </div>

          {/* Loading Dots */}
          <div className='mt-8 space-y-4'>
            <h3 className='text-lg font-medium text-gray-700'>Loading Dots</h3>
            <div className='flex gap-8'>
              <LoadingDots size='sm' />
              <LoadingDots size='md' />
              <LoadingDots size='lg' />
            </div>
          </div>
        </div>

        {/* Component Integration Test */}
        <div className='bg-white rounded-2xl shadow-xl p-8 border border-gray-200'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-6'>
            Integration Test
          </h2>
          <p className='text-gray-600 mb-4'>
            This section demonstrates how the components work together in a real
            scenario.
          </p>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='p-4 bg-blue-50 rounded-lg border border-blue-200'>
              <h4 className='font-medium text-blue-800 mb-2'>Error Handling</h4>
              <p className='text-sm text-blue-600'>
                ErrorBoundary catches JavaScript errors and displays a
                user-friendly fallback UI.
              </p>
            </div>

            <div className='p-4 bg-green-50 rounded-lg border border-green-200'>
              <h4 className='font-medium text-green-800 mb-2'>
                Loading States
              </h4>
              <p className='text-sm text-green-600'>
                Various loading indicators provide feedback during async
                operations.
              </p>
            </div>

            <div className='p-4 bg-purple-50 rounded-lg border border-purple-200'>
              <h4 className='font-medium text-purple-800 mb-2'>
                User Experience
              </h4>
              <p className='text-sm text-purple-600'>
                Improved UX with graceful error handling and informative loading
                states.
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className='bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6'>
          <h3 className='text-lg font-semibold text-amber-800 mb-3'>
            Testing Instructions
          </h3>
          <div className='text-sm text-amber-700 space-y-2'>
            <p>
              1. <strong>Error Boundary:</strong> Click &quot;Trigger
              Error&quot; to see the error boundary in action
            </p>
            <p>
              2. <strong>Loading Spinner:</strong> Observe different sizes and
              variants
            </p>
            <p>
              3. <strong>Loading Overlay:</strong> Click &quot;Simulate
              Loading&quot; to see the overlay effect
            </p>
            <p>
              4. <strong>Progress Bar:</strong> Click &quot;Simulate
              Progress&quot; to see the progress animation
            </p>
            <p>
              5. <strong>Skeleton:</strong> Click &quot;Toggle Skeleton&quot; to
              see skeleton loading
            </p>
            <p>
              6. <strong>Loading Dots:</strong> Observe the animated dots
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
