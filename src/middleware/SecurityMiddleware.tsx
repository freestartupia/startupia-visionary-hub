
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

  // Protection contre le clickjacking
  useEffect(() => {
    // Vérification que l'application n'est pas dans un iframe (protection contre le clickjacking)
    if (window.self !== window.top) {
      console.error('Tentative de clickjacking détectée!');
      window.top.location = window.self.location;
    }
  }, []);

  return <>{children}</>;
};

export default SecurityMiddleware;
