import './global.css'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'

const container = document.getElementById('app')
console.log('App starting...', container)

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

class ErrorBoundary extends React.Component<{children: React.ReactNode}, ErrorBoundaryState> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Щось пішло не так</h1>
              <p className="text-gray-600">Вибачте за незручності. Спробуйте перезавантажити сторінку.</p>
            </div>
            
            <details className="mb-6">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 mb-2">
                Технічна інформація
              </summary>
              <div className="bg-gray-50 rounded-lg p-4 overflow-auto max-h-64">
                <pre className="text-xs text-red-600 font-mono whitespace-pre-wrap">
                  {this.state.error?.toString()}
                  {'\n\n'}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </div>
            </details>

            <div className="flex gap-4">
              <button
                onClick={this.handleReset}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition shadow-lg hover:shadow-xl"
              >
                🔄 Перезавантажити
              </button>
              <a
                href="/"
                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition text-center"
              >
                🏠 На головну
              </a>
            </div>
          </div>
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
