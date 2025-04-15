
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DeleteButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onClick, disabled = false }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button 
            className="absolute top-2 right-2 text-red-500/50 hover:text-red-500 transition-colors z-10"
            onClick={onClick}
            disabled={disabled}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Supprimer le projet</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DeleteButton;
