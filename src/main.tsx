
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import initializeSupabase from './services/initSupabase';
import SecurityMiddleware from './middleware/SecurityMiddleware';

// Initialiser Supabase
initializeSupabase().catch(console.error);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SecurityMiddleware>
      <App />
    </SecurityMiddleware>
  </React.StrictMode>
);
