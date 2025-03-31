
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface AuthRequiredProps {
  children: React.ReactNode;
  message?: string;
  forActiveParticipation?: boolean;
}

const AuthRequired: React.FC<AuthRequiredProps> = ({ 
  children, 
  message = "Vous devez être connecté pour accéder à cette fonctionnalité",
  forActiveParticipation = false
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user && forActiveParticipation) {
    return (
      <div className="rounded-lg border border-white/10 p-6 bg-black/20 backdrop-blur-sm">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Connexion requise</h3>
          <p className="text-white/70 mb-4">{message}</p>
          <Button 
            onClick={() => navigate('/auth')}
            className="bg-startupia-turquoise hover:bg-startupia-turquoise/90"
          >
            Se connecter / S'inscrire
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthRequired;
