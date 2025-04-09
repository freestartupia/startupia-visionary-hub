
import React from 'react';
import { Button } from '@/components/ui/button';

interface EmptyServiceStateProps {
  handleProposeService: () => void;
}

const EmptyServiceState: React.FC<EmptyServiceStateProps> = ({ handleProposeService }) => {
  return (
    <div className="text-center py-12 col-span-full">
      <p className="text-white/60">Aucun service trouvé.</p>
      <Button variant="outline" className="mt-4" onClick={handleProposeService}>
        Proposer un service
      </Button>
    </div>
  );
};

export default EmptyServiceState;
