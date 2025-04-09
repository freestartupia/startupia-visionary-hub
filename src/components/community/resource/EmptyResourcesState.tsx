
import React from 'react';
import { Button } from '@/components/ui/button';

interface EmptyResourcesStateProps {
  handleShareResource: () => void;
}

const EmptyResourcesState: React.FC<EmptyResourcesStateProps> = ({ handleShareResource }) => {
  return (
    <div className="text-center py-12">
      <h3 className="text-xl font-medium mb-4">Aucune formation disponible</h3>
      <p className="text-white/60 mb-6">Soyez le premier à partager une ressource avec la communauté !</p>
      <Button onClick={handleShareResource}>
        Partager une ressource
      </Button>
    </div>
  );
};

export default EmptyResourcesState;
