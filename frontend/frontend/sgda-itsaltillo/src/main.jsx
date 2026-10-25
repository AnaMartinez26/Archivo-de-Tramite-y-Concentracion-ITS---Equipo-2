import React from 'react';import {createRoot} from 'react-dom/client';import {HashRouter} from './core/router.jsx';import App from './App.jsx';import {ToastProvider} from './core/ui.jsx';import './styles/styles.css';
createRoot(document.getElementById('root')).render(<HashRouter><ToastProvider><App/></ToastProvider></HashRouter>);
