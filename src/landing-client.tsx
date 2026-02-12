import './global.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import LandingApp from './landing/LandingApp';
import Cabinet from './landing/components/Cabinet';

const isCabinet = typeof window !== 'undefined' && window.location.pathname === '/cabinet';

function showApp() {
  try {
    const app = document.getElementById('app');
    if (app) {
      app.classList.add('react-ready');
      app.setAttribute('aria-busy', 'false');
    }
  } catch (_) {}
}

/** Error boundary — catches rendering crashes so page stays usable */
class LandingErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Landing ErrorBoundary:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return React.createElement('div', {
        className: 'min-h-screen bg-slate-900 flex items-center justify-center p-8 text-center'
      },
        React.createElement('div', { className: 'max-w-md' },
          React.createElement('h1', { className: 'text-3xl font-bold text-white mb-4' }, 'Ceva nu a mers bine'),
          React.createElement('p', { className: 'text-gray-400 mb-6' }, 'Reîncărcați pagina sau contactați-ne direct.'),
          React.createElement('button', {
            onClick: () => window.location.reload(),
            className: 'px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all'
          }, 'Reîncarcă pagina')
        )
      );
    }
    return this.props.children;
  }
}

function mount() {
  const container = document.getElementById('app');
  if (!container) {
    showApp();
    return;
  }
  try {
    const root = createRoot(container);
    root.render(
      React.createElement(LandingErrorBoundary, null,
        isCabinet ? React.createElement(Cabinet) : React.createElement(LandingApp)
      )
    );
    requestAnimationFrame(() => {
      requestAnimationFrame(showApp);
    });
  } catch (err) {
    showApp();
    console.error('Landing render error:', err);
  } finally {
    showApp();
  }
  setTimeout(showApp, 1200);
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
}
