import React from 'react';
import { AlertCircle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-offWhite p-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-primary-dark mb-2">
                Something Went Wrong
              </h1>
              <p className="text-neutral-slate mb-6">
                An unexpected error occurred. Please try refreshing the page.
              </p>
              <p className="text-sm text-red-500 mb-6 text-left bg-red-50 p-4 rounded overflow-auto max-h-24">
                {this.state.error?.message || 'Unknown error'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-primary-dark text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
