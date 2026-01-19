import React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'

const container = document.getElementById('app')
console.log('App starting...', container)

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 text-red-800">
          <h1 className="text-xl font-bold">Something went wrong.</h1>
          <pre className="mt-2 text-sm">{this.state.error?.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

if (container) {
  const root = createRoot(container)
  console.log('Root created, rendering...')
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  )
} else {
  console.error('Failed to find the root element')
}
