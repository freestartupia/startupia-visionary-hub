import React, { useState, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowBigUp, ExternalLink, MessageSquare } from 'lucide-react';
import { Startup } from '@/types/startup';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { hasUserVotedForStartup, voteForStartup, unvoteStartup } from '@/services/startupService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface StartupCardProps {
  startup: Startup;
  onVoteChange?: () => void;
  index?: number;
}

const StartupCard: React.FC<StartupCardProps> = memo(({
  startup,
  onVoteChange,
  index
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [hasVoted, setHasVoted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    let mounted = true;
    
    if (user) {
      const timeout = setTimeout(() => {
        checkUserVote(mounted);
      }, 100);
      
      return () => {
        mounted = false;
        clearTimeout(timeout);
      };
    }
    
    return () => {
      mounted = false;
    };
  }, [user, startup.id]);
  
  const checkUserVote = async (mounted = true) => {
    try {
      const voted = await hasUserVotedForStartup(startup.id);
      if (mounted) {
        setHasVoted(voted);
      }
    } catch (err) {
      console.error("Erreur lors de la vérification du vote:", err);
    }
  };

  const handleVote = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour voter.",
        variant: "destructive"
      });
      return;
    }
    
    const previousVoteState = hasVoted;
    setHasVoted(!hasVoted);
    setIsLoading(true);
    
    try {
      if (previousVoteState) {
        await unvoteStartup(startup.id);
        toast({
          title: "Vote retiré",
          description: `Vous avez retiré votre vote pour ${startup.name}`
        });
      } else {
        await voteForStartup(startup.id);
        toast({
          title: "Vote enregistré",
          description: `Vous avez voté pour ${startup.name}`
        });
      }
      if (onVoteChange) onVoteChange();
    } catch (error: any) {
      setHasVoted(previousVoteState);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors du vote",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = React.useCallback((dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, []);

  return (
    <div className="group relative bg-black/70 hover:bg-black/80 rounded-lg border border-startupia-turquoise/20 hover:border-startupia-turquoise/40 transition-all duration-300 p-4 mb-4">
      <div className="flex items-start gap-5">
        <div className="flex flex-col items-center">
          {index !== undefined && (
            <div className="text-lg font-bold text-startupia-turquoise mb-2">{index}.</div>
          )}
          <div className="h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
            {startup.logoUrl ? (
              <img 
                src={startup.logoUrl} 
                alt={`${startup.name} logo`} 
                className="w-full h-full object-contain" 
                loading="lazy" 
              />
            ) : (
              <span className="text-2xl font-bold text-startupia-turquoise">{startup.name[0]}</span>
            )}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-1">
            <div className="flex items-start justify-between">
              <div>
                <Link 
                  to={`/startup/${startup.id}`} 
                  className="text-xl font-bold text-white hover:text-startupia-turquoise transition-colors truncate block"
                >
                  {startup.name}
                </Link>
                <p className="text-white/70 text-sm line-clamp-2">{startup.shortDescription}</p>
              </div>
              
              {startup.websiteUrl && (
                <a 
                  href={startup.websiteUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/50 hover:text-startupia-turquoise flex items-center gap-1 text-sm ml-2"
                >
                  <ExternalLink size={14} />
                  <span className="hidden sm:inline">Visiter</span>
                </a>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mt-1">
              <Badge 
                variant="outline" 
                className="text-xs border-startupia-turquoise/40 bg-startupia-turquoise/5"
              >
                {startup.category}
              </Badge>
              {startup.aiTechnology && (
                <Badge 
                  variant="outline" 
                  className="text-xs border-white/20 bg-white/5"
                >
                  {startup.aiTechnology}
                </Badge>
              )}
              {startup.businessModel && (
                <Badge 
                  variant="outline" 
                  className="text-xs border-white/20 bg-white/5"
                >
                  {startup.businessModel}
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-2 items-end">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`rounded-full flex items-center gap-1 px-3 py-1 
              ${hasVoted 
                ? 'bg-startupia-turquoise/20 text-startupia-turquoise border border-startupia-turquoise/30' 
                : 'bg-white/10 hover:bg-startupia-turquoise/10 border border-transparent hover:border-startupia-turquoise/30'}`}
            onClick={handleVote}
            disabled={isLoading}
          >
            <ArrowBigUp size={16} />
            <span className="font-medium">{startup.upvotes}</span>
          </Button>
          
          <Link 
            to={`/startup/${startup.id}`}
            className="flex items-center gap-1 text-white/60 hover:text-white transition-colors text-sm"
          >
            <MessageSquare size={14} />
            <span>{startup.commentCount || 0}</span>
          </Link>
        </div>
      </div>
    </div>
  );
});

export default StartupCard;
