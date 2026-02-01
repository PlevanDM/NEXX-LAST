import './global.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import LandingApp from './landing/LandingApp';

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <LandingApp />
    </React.StrictMode>
  );
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.classList.add('react-loaded');
      container.classList.add('react-ready');
    });
  });
}
