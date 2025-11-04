'use client'

/**
 * Error Boundary Component
 *
 * Catches React errors in child components and displays a fallback UI
 * instead of crashing the entire application.
 */

import { Component, ReactNode, ErrorInfo } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error('Error Boundary caught an error:', error, errorInfo)

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      // Render custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <div className="rounded-lg border border-semantic-error/20 bg-semantic-error/5 p-6 my-8">
          <h2 className="text-lg font-semibold text-semantic-error mb-2">Something went wrong</h2>
          <p className="text-text-secondary text-sm mb-4">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="text-sm px-4 py-2 bg-accent-warm text-white rounded hover:bg-accent-warm/90 transition-colors"
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Feature Error Boundary
 *
 * Specialized error boundary for feature components with custom styling
 */
interface FeatureErrorBoundaryProps {
  children: ReactNode
  featureName: string
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

export function FeatureErrorBoundary({
  children,
  featureName,
  onError,
}: FeatureErrorBoundaryProps) {
  const fallback = (
    <div
      className="rounded-lg border border-semantic-error/20 bg-semantic-error/5 p-6 my-8"
      role="alert"
    >
      <h3 className="text-lg font-semibold text-semantic-error mb-2">
        {featureName} temporarily unavailable
      </h3>
      <p className="text-text-secondary text-sm">
        This feature encountered an error and could not load. Please try refreshing the page.
      </p>
    </div>
  )

  return (
    <ErrorBoundary fallback={fallback} onError={onError}>
      {children}
    </ErrorBoundary>
  )
}
