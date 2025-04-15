
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowBigUp, ExternalLink } from 'lucide-react';

interface StartupCallToActionProps {
  name: string;
  websiteUrl: string;
  hasVoted: boolean;
  isVoteLoading: boolean;
  onVote: () => void;
}

const StartupCallToAction = ({
  name,
  websiteUrl,
  hasVoted,
  isVoteLoading,
  onVote
}: StartupCallToActionProps) => {
  return (
    <div className="text-center py-6">
      <h2 className="text-2xl font-bold mb-4">Vous aimez cette startup ?</h2>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          onClick={onVote}
          disabled={isVoteLoading}
          className="bg-startupia-turquoise hover:bg-startupia-turquoise/90"
          size="lg"
        >
          <ArrowBigUp className="h-5 w-5 mr-2" />
          {hasVoted ? 'Vous avez voté' : 'Voter pour cette startup'}
        </Button>
        
        <Button 
          variant="outline" 
          className="border-white/20"
          asChild
          size="lg"
        >
          <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-5 w-5 mr-2" />
            Visiter le site
          </a>
        </Button>
      </div>
    </div>
  );
};

export default StartupCallToAction;
