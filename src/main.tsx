
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import initializeSupabase from './services/initSupabase';

// Initialiser Supabase de manière synchrone avant le rendu initial
(async function() {
  try {
    // Attendre l'initialisation de Supabase
    await initializeSupabase();
    
    // Une fois Supabase initialisé, rendre l'application
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Failed to initialize application:', error);
    
    // Afficher un message d'erreur dans le DOM en cas d'échec
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background-color: black; color: white; text-align: center; padding: 20px;">
          <h1 style="margin-bottom: 20px;">Une erreur est survenue lors du chargement de l'application</h1>
          <p>Veuillez rafraîchir la page ou réessayer ultérieurement.</p>
        </div>
      `;
    }
  }
})();
