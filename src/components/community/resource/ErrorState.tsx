
import React from 'react';
import { Button } from '@/components/ui/button';

const ErrorState: React.FC = () => {
  return (
    <div className="text-center py-12">
      <p className="text-white/60">Une erreur est survenue lors du chargement des ressources.</p>
      <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
        Réessayer
      </Button>
    </div>
  );
};

export default ErrorState;
