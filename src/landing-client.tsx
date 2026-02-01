import './global.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import LandingApp from './landing/LandingApp';
import Cabinet from './landing/components/Cabinet';

const isCabinet = typeof window !== 'undefined' && window.location.pathname === '/cabinet';

function showApp() {
  document.body?.classList?.add('react-loaded');
  const app = document.getElementById('app');
  if (app) app.classList.add('react-ready');
}

const container = document.getElementById('app');
if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        {isCabinet ? <Cabinet /> : <LandingApp />}
      </React.StrictMode>
    );
    requestAnimationFrame(() => {
      requestAnimationFrame(showApp);
    });
  } catch (err) {
    showApp();
    console.error('Landing render error:', err);
  }
  // Страховка: показать приложение через 1.5 с, если классы не добавились (например при ошибке в дереве)
  setTimeout(showApp, 1500);
}
