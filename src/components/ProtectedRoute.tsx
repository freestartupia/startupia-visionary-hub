
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAdminChecking, setIsAdminChecking] = useState<boolean>(requireAdmin);

  // Vérifier si l'utilisateur est administrateur (si nécessaire)
  useEffect(() => {
    let mounted = true;
    
    const checkIfAdmin = async () => {
      if (requireAdmin && user) {
        try {
          const { data, error } = await supabase.rpc('is_admin_check');
          
          if (error) {
            console.error('Erreur lors de la vérification des droits admin:', error);
            toast.error("Erreur de vérification des permissions");
            if (mounted) setIsAdmin(false);
          } else if (mounted) {
            setIsAdmin(!!data);
          }
        } catch (error) {
          console.error('Erreur lors de la vérification admin:', error);
          if (mounted) setIsAdmin(false);
        } finally {
          if (mounted) setIsAdminChecking(false);
        }
      } else {
        if (mounted) setIsAdminChecking(false);
      }
    };
    
    checkIfAdmin();
    
    return () => {
      mounted = false;
    };
  }, [user, requireAdmin]);

  // Vérification de l'expiration du jeton
  useEffect(() => {
    let mounted = true;
    
    const checkTokenExpiration = async () => {
      if (user) {
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          const expiresAt = data.session.expires_at;
          if (expiresAt) {
            const expirationTime = expiresAt * 1000;
            const currentTime = Date.now();
            
            // Si le jeton est expiré, déconnecter l'utilisateur
            if (currentTime > expirationTime && mounted) {
              toast.error("Votre session a expiré. Veuillez vous reconnecter.");
              await supabase.auth.signOut();
            }
          }
        }
      }
    };
    
    checkTokenExpiration();
    
    return () => {
      mounted = false;
    };
  }, [user, location]);

  if (isLoading || isAdminChecking) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-startupia-turquoise"></div>
    </div>;
  }

  // Rediriger si l'utilisateur n'est pas connecté
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Rediriger si l'accès admin est requis mais l'utilisateur n'est pas admin
  if (requireAdmin && !isAdmin) {
    toast.error("Accès non autorisé. Permissions insuffisantes.");
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
