
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useVoting } from '@/hooks/useVoting';

interface VoteButtonsProps {
  startupId: string;
}

const VoteButtons = ({ startupId }: VoteButtonsProps) => {
  const { user } = useAuth();
  const { handleVote, startupVotes } = useVoting();

  return (
    <div 
      className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center z-10" 
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center bg-black/40 border border-startupia-turquoise/30 rounded-full overflow-hidden p-0.5">
        <Button
          variant="ghost" 
          size="icon"
          className={`rounded-full p-1 hover:bg-startupia-turquoise/20 ${startupVotes[startupId]?.upvoted ? 'text-startupia-turquoise' : 'text-white/70'}`}
          onClick={(e) => handleVote(e, startupId, true)}
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
        
        <span className="px-2 font-medium text-white">
          {startupVotes[startupId]?.count || 0}
        </span>
        
        <Button
          variant="ghost" 
          size="icon"
          className={`rounded-full p-1 hover:bg-startupia-turquoise/20 ${startupVotes[startupId]?.downvoted ? 'text-startupia-turquoise' : 'text-white/70'}`}
          onClick={(e) => handleVote(e, startupId, false)}
        >
          <ArrowDown className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default VoteButtons;
