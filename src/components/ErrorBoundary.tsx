import React, { Component, ErrorInfo, ReactNode, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { tone } from '@/copy/tone';

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
 * Focus management and friendly writer's-room vibe
 */
const RootErrorFallback = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Focus management for accessibility
    headingRef.current?.focus();
  }, []);

  const supportiveQuips = [
    "Take a sip of coffee, babe; we'll reload the scene.",
    "Even the best stories have plot holes. Let's fix this one.",
    "Writer's block, meet error block. We'll get past this together.",
    "Time for a quick edit—let's refresh and get back to your story.",
  ];
  const quip = supportiveQuips[Math.floor(Math.random() * supportiveQuips.length)];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f2e8] p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-4">
          <div className="text-6xl mb-4" aria-hidden="true">📝</div>
          <h1 
            ref={headingRef}
            className="text-2xl font-bold text-[#0C0C0C]"
            tabIndex={-1}
          >
            Plot twist! Something broke.
          </h1>
          <p className="text-muted-foreground text-lg">
            {quip}
          </p>
        </div>
        
        <div className="space-y-3 pt-4">
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => window.location.reload()}
              className="w-full min-h-[44px]"
              size="lg"
            >
              Reload the page
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full min-h-[44px]"
              size="lg"
            >
              <Link to="/">Go Home</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="w-full min-h-[44px]"
              size="lg"
            >
              <Link to="/contact">Report this</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

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
    // Always log to console for debugging, but never expose to users
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // In development, log full error details
    if (import.meta.env.DEV) {
      console.error('Error details:', {
        error,
        errorInfo,
        componentStack: errorInfo.componentStack,
      });
    }
    // In production, we still log but don't expose stack traces to UI
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
