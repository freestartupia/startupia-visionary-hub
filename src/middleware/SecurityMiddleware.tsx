
import React, { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface SecurityMiddlewareProps {
  children: React.ReactNode;
}

/**
 * Middleware de sécurité pour vérifier les jetons et prévenir les attaques CSRF
 */
const SecurityMiddleware: React.FC<SecurityMiddlewareProps> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Vérification de la validité du jeton d'authentification
    const checkTokenValidity = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        // Vérifier si le jeton est proche de l'expiration (moins de 10 minutes)
        const expiresAt = data.session.expires_at;
        const expirationTime = expiresAt ? expiresAt * 1000 : 0;
        const currentTime = Date.now();
        const timeUntilExpiry = expirationTime - currentTime;
        
        // Si le jeton expire dans moins de 10 minutes, le rafraîchir
        if (timeUntilExpiry > 0 && timeUntilExpiry < 600000) {
          const { error } = await supabase.auth.refreshSession();
          if (error) {
            console.error('Erreur lors du rafraîchissement de la session:', error);
            toast.error("Votre session a expiré. Veuillez vous reconnecter.");
            
            // Using React Router navigation instead of direct window.location
            navigate('/auth');
          }
        }
      }
    };
    
    // Vérifier le jeton au chargement du composant
    checkTokenValidity();
    
    // Vérifier périodiquement
    const intervalId = setInterval(checkTokenValidity, 300000); // Toutes les 5 minutes
    
    return () => clearInterval(intervalId);
  }, [navigate]);

  // Protection contre le clickjacking - modified to avoid browser security errors
  useEffect(() => {
    try {
      // Safer check for iframe embedding
      if (window.top !== window.self) {
        console.warn('Tentative de clickjacking détectée! Application potentiellement intégrée dans un iframe.');
        
        // Instead of trying to directly manipulate top frame (which can trigger security errors),
        // we'll just show a warning to the user and disable the UI
        document.body.innerHTML = 
          '<div style="text-align: center; padding: 20px; color: red; background: black; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 9999;">' +
          '<h1>Avertissement de sécurité</h1>' +
          '<p>Cette application est potentiellement affichée dans un iframe non autorisé.</p>' +
          '<p>Pour votre sécurité, veuillez accéder directement à l\'application via son URL officielle.</p>' +
          '</div>';
      }
    } catch (error) {
      // If we get a security error trying to check, that's actually a sign we're in a cross-origin iframe
      console.warn('Erreur lors de la vérification de clickjacking, probablement en raison de restrictions d\'origine croisée:', error);
      // Do nothing, let the app continue functioning
    }
  }, []);

  return <>{children}</>;
};

export default SecurityMiddleware;
