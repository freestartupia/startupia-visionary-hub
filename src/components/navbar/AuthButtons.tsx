
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface AuthButtonsProps {
  isMobile?: boolean;
  onMobileItemClick?: () => void;
}

export const AuthButtons: React.FC<AuthButtonsProps> = ({ isMobile = false, onMobileItemClick }) => {
  if (isMobile) {
    return (
      <div className="pt-4 flex flex-col space-y-3">
        <Button variant="outline" className="border-startupia-turquoise text-white hover:bg-startupia-turquoise/20 w-full" asChild>
          <Link to="/auth" onClick={onMobileItemClick}>Se connecter</Link>
        </Button>
        <Button className="bg-startupia-turquoise hover:bg-startupia-turquoise/90 w-full button-glow" asChild>
          <Link to="/auth?tab=register" onClick={onMobileItemClick}>S'inscrire</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" className="border-startupia-turquoise text-white hover:bg-startupia-turquoise/20" asChild>
        <Link to="/auth">Se connecter</Link>
      </Button>
      <Button className="bg-startupia-turquoise hover:bg-startupia-turquoise/90 button-glow" asChild>
        <Link to="/auth?tab=register">S'inscrire</Link>
      </Button>
    </div>
  );
};
