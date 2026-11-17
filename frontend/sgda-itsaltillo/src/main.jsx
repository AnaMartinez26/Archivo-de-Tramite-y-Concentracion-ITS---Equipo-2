import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from './router/router.jsx';
import App from './App.jsx';
import { ToastProvider } from './componentes/ui/index.js';
import './styles/styles.css';

createRoot(document.getElementById('root')).render(
  <HashRouter>
    <ToastProvider>
      <App />
    </ToastProvider>
  </HashRouter>
);
