import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  /** Whether this is the root-level error boundary */
  isRoot?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Root-level fallback UI for critical application errors
 */
const RootErrorFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#f5f2e8] p-4">
    <div className="max-w-md w-full text-center space-y-6">
      <div className="space-y-2">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-[#0C0C0C]">Something went wrong</h1>
        <p className="text-muted-foreground">
          We encountered an unexpected error. Don't worry, your work is safe.
        </p>
      </div>
      
      <div className="space-y-3 pt-4">
        <button
          onClick={() => window.location.reload()}
          className="w-full px-4 py-2 bg-[#1E7F5C] text-white rounded-md hover:bg-[#1a6b4d] transition-colors"
        >
          Reload Page
        </button>
        <p className="text-xs text-muted-foreground">
          If the problem persists, please try refreshing your browser or contact support.
        </p>
      </div>
    </div>
  </div>
);

/**
 * Default fallback UI for component-level errors (e.g., 3D scenes)
 */
const DefaultErrorFallback = () => (
  <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
    <div className="text-center p-6">
      <div className="text-gray-500 mb-2">⚠️</div>
      <p className="text-sm text-gray-600 mb-2">3D scene failed to load</p>
      <p className="text-xs text-gray-400">This might be due to browser compatibility or network issues</p>
    </div>
  </div>
);

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // In development, log full error details
    if (import.meta.env.DEV) {
      console.error('Error details:', {
        error,
        errorInfo,
        componentStack: errorInfo.componentStack,
      });
    }
  }

  public render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Use root fallback if this is the root boundary
      if (this.props.isRoot) {
        return <RootErrorFallback />;
      }
      
      // Use default fallback for component-level errors
      return <DefaultErrorFallback />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
