
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowBigUp, Share2, ExternalLink, Calendar } from 'lucide-react';
import { Startup } from '@/types/startup';

interface StartupDetailsProps {
  startup: Startup;
  hasVoted: boolean;
  isVoteLoading: boolean;
  onVote: () => void;
  onShare: () => void;
  formatDate: (dateString?: string) => string;
}

const StartupDetails = ({ 
  startup, 
  hasVoted, 
  isVoteLoading, 
  onVote, 
  onShare,
  formatDate 
}: StartupDetailsProps) => {
  return (
    <div className="glass-card border border-white/10 p-6 sm:p-8 rounded-lg mb-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/5 flex flex-col items-center">
          <div className="w-28 h-28 rounded-xl bg-startupia-turquoise/10 flex items-center justify-center overflow-hidden mb-4">
            {startup.logoUrl ? (
              <img 
                src={startup.logoUrl} 
                alt={`${startup.name} logo`} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <span className="text-5xl font-bold text-startupia-turquoise">
                {startup.name[0]}
              </span>
            )}
          </div>
          
          <Button 
            onClick={onVote}
            disabled={isVoteLoading}
            variant={hasVoted ? "default" : "outline"}
            className={`w-full mb-2 ${
              hasVoted 
                ? 'bg-startupia-turquoise text-black' 
                : 'border-startupia-turquoise text-white hover:bg-startupia-turquoise/10'
            }`}
          >
            <ArrowBigUp className="h-5 w-5 mr-2" />
            {hasVoted ? 'Voté' : 'Voter'} ({startup.upvotes})
          </Button>
          
          <Button
            variant="outline"
            className="w-full border-white/20"
            onClick={onShare}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Partager
          </Button>
        </div>
        
        <div className="md:w-4/5">
          <h1 className="text-3xl font-bold mb-2">{startup.name}</h1>
          
          <p className="text-lg text-white/80 mb-4">{startup.shortDescription}</p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="outline" className="border-startupia-turquoise/50 text-white">
              {startup.category}
            </Badge>
            {startup.aiTechnology && (
              <Badge variant="outline" className="border-white/20 text-white">
                {startup.aiTechnology}
              </Badge>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {startup.websiteUrl && (
              <div className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-startupia-turquoise" />
                <span className="text-white/60 mr-2">Site web:</span>
                <a 
                  href={startup.websiteUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white hover:text-startupia-turquoise truncate"
                >
                  {startup.websiteUrl.replace(/^https?:\/\/(www\.)?/, '')}
                </a>
              </div>
            )}
            
            {startup.launchDate && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-startupia-turquoise" />
                <span className="text-white/60 mr-2">Lancée le:</span>
                <span className="text-white">{formatDate(startup.launchDate)}</span>
              </div>
            )}
          </div>
          
          <div className="text-sm text-white/60">
            Startup ajoutée le {formatDate(startup.createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupDetails;
