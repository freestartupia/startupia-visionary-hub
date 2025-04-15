
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { cleanupLoginAttempts } from '@/services/securityService';
import { toast } from 'sonner';

interface SecurityContextType {
  reportSecurityEvent: (eventType: string, details: any) => void;
  lastActivity: number;
  resetActivityTimer: () => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

// Durée d'inactivité avant déconnexion (en ms) - 30 minutes
const INACTIVITY_TIMEOUT = 30 * 60 * 1000;

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, signOut } = useAuth();
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [securityEvents, setSecurityEvents] = useState<Array<{ type: string, timestamp: number, details: any }>>([]);

  // Fonction pour réinitialiser le timer d'activité
  const resetActivityTimer = () => {
    setLastActivity(Date.now());
  };

  // Fonction pour rapporter des événements de sécurité
  const reportSecurityEvent = (eventType: string, details: any) => {
    console.warn(`Événement de sécurité: ${eventType}`, details);
    setSecurityEvents(prev => [...prev, { type: eventType, timestamp: Date.now(), details }]);
    
    // Alerte pour certains types d'événements critiques
    if (eventType === 'csrf-attempt' || eventType === 'xss-attempt' || eventType === 'injection-attempt') {
      toast.error("Tentative d'attaque détectée et bloquée", {
        description: "Une action potentiellement malveillante a été détectée et bloquée."
      });
    }
  };

  // Surveiller l'inactivité pour déconnecter l'utilisateur
  useEffect(() => {
    if (!user) return;

    const activityCheck = setInterval(() => {
      const now = Date.now();
      if (now - lastActivity > INACTIVITY_TIMEOUT) {
        toast.warning("Session expirée", {
          description: "Vous avez été déconnecté pour inactivité"
        });
        signOut();
      }
    }, 60000); // Vérifier toutes les minutes

    return () => clearInterval(activityCheck);
  }, [user, lastActivity, signOut]);

  // Surveiller les événements utilisateur pour réinitialiser le timer d'inactivité
  useEffect(() => {
    const handleActivity = () => resetActivityTimer();
    
    // Ajouter des écouteurs d'événements pour suivre l'activité
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    window.addEventListener('scroll', handleActivity);
    
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, []);

  // Nettoyer périodiquement les tentatives de connexion obsolètes
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      cleanupLoginAttempts();
    }, 15 * 60 * 1000); // Toutes les 15 minutes
    
    return () => clearInterval(cleanupInterval);
  }, []);

  // Détection des outils de développement (potentiellement utilisés par des attaquants)
  useEffect(() => {
    const detectDevTools = () => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if (widthThreshold || heightThreshold) {
        reportSecurityEvent('devtools-open', { width: window.outerWidth, height: window.outerHeight });
      }
    };

    window.addEventListener('resize', detectDevTools);
    return () => window.removeEventListener('resize', detectDevTools);
  }, []);

  return (
    <SecurityContext.Provider value={{ reportSecurityEvent, lastActivity, resetActivityTimer }}>
      {children}
    </SecurityContext.Provider>
  );
};
