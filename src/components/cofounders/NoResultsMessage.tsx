
import React from 'react';
import { Button } from '@/components/ui/button';

interface NoResultsMessageProps {
  clearFilters: () => void;
}

const NoResultsMessage: React.FC<NoResultsMessageProps> = ({ clearFilters }) => {
  return (
    <div className="text-center py-20 glass-card">
      <p className="text-white/70 text-lg">Aucun profil ne correspond à vos critères.</p>
      <Button 
        className="mt-4 bg-startupia-turquoise hover:bg-startupia-turquoise/90"
        onClick={clearFilters}
      >
        Réinitialiser les filtres
      </Button>
    </div>
  );
};

export default NoResultsMessage;
