'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  ExclamationTriangleIcon,
  ArrowPathIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console for development
    if (process.env.NODE_ENV === 'development') {
      console.group('Error Details');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.groupEnd();
    }

    // In production, you would send this to an error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className='min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4'>
          <div className='max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center'>
            <div className='mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6'>
              <ExclamationTriangleIcon className='h-8 w-8 text-red-600' />
            </div>

            <h1 className='text-2xl font-bold text-gray-900 mb-4'>
              Oops! Something went wrong
            </h1>

            <p className='text-gray-600 mb-6 leading-relaxed'>
              We encountered an unexpected error while processing your request.
              Don&apos;t worry, your data is safe and we&apos;re working to fix
              this.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className='mb-6 text-left'>
                <summary className='cursor-pointer text-sm text-gray-500 hover:text-gray-700 mb-2'>
                  Error Details (Development)
                </summary>
                <div className='bg-gray-100 rounded-lg p-3 text-xs font-mono text-gray-700 overflow-auto'>
                  <div className='mb-2'>
                    <strong>Error:</strong> {this.state.error.message}
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Stack:</strong>
                      <pre className='whitespace-pre-wrap mt-1'>
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            <div className='flex flex-col sm:flex-row gap-3'>
              <button
                onClick={this.handleRetry}
                className='flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium'
              >
                <ArrowPathIcon className='h-4 w-4' />
                Try Again
              </button>

              <button
                onClick={this.handleGoHome}
                className='flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium'
              >
                <HomeIcon className='h-4 w-4' />
                Go Home
              </button>
            </div>

            <div className='mt-6 pt-6 border-t border-gray-200'>
              <p className='text-xs text-gray-500'>
                If this problem persists, please contact support or try
                refreshing the page.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for functional components to trigger error boundary
export const useErrorHandler = () => {
  return React.useCallback((error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo);

    // In a real app, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Send to error reporting service (e.g., Sentry, LogRocket)
      console.error('Error would be reported to monitoring service:', error);
    }
  }, []);
};
