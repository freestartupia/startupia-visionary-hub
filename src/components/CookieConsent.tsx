
import React, { useEffect, useState } from 'react';
import { X, Cookie, Check } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';

const COOKIE_CONSENT_KEY = 'startupia-cookie-consent';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consentStatus = localStorage.getItem(COOKIE_CONSENT_KEY);
    
    // Only show banner if no decision has been made yet
    if (consentStatus === null) {
      // Small delay to avoid flashing on initial load
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setIsVisible(false);
    toast({
      title: "Cookies acceptés",
      description: "Merci ! Nous utilisons des cookies uniquement pour le bon fonctionnement du site.",
      duration: 3000,
    });
  };

  const handleRefuse = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'refused');
    setIsVisible(false);
    toast({
      title: "Cookies refusés",
      description: "Nous respectons votre choix. Certaines fonctionnalités pourraient être limitées.",
      duration: 3000,
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-black/95 backdrop-blur-sm border-t border-white/10 transform transition-transform duration-300 ease-in-out">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Cookie className="text-startupia-turquoise mt-1 flex-shrink-0" size={20} />
            <div>
              <h3 className="text-lg font-medium text-white">Politique de cookies</h3>
              <p className="text-white/70 text-sm max-w-2xl">
                Nous utilisons des cookies techniques uniquement pour assurer le bon fonctionnement de Startupia. 
                Nous ne vendons aucune donnée et n'utilisons pas de cookies publicitaires.
              </p>
            </div>
          </div>
          
          <div className="flex gap-3 ml-auto">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefuse}
              className="border-white/20 text-white/80 hover:bg-white/10"
            >
              <X size={16} className="mr-1" /> Refuser
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleAccept}
              className="bg-startupia-turquoise hover:bg-startupia-turquoise/80"
            >
              <Check size={16} className="mr-1" /> Accepter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
