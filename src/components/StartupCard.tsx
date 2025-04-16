
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
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
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
    <div 
      className="group relative rounded-2xl border-2 border-startupia-turquoise/30 
                 shadow-lg shadow-startupia-turquoise/10
                 hover:border-startupia-turquoise/50 
                 hover:shadow-xl hover:shadow-startupia-turquoise/20 
                 transition-all duration-300 
                 bg-gradient-to-br from-black/70 to-black/40 
                 overflow-hidden 
                 transform hover:-translate-y-2 
                 hover:scale-[1.02]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-startupia-turquoise/10 to-startupia-turquoise/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
      
      <div className="relative z-10 p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex flex-col items-center">
            {index !== undefined && (
              <div className="text-xl font-bold text-startupia-turquoise mb-2">{index}.</div>
            )}
            <div className="h-16 w-16 rounded-xl bg-white/5 overflow-hidden flex items-center justify-center border-2 border-white/20 shadow-md">
              {startup.logoUrl ? (
                <img 
                  src={startup.logoUrl} 
                  alt={`${startup.name} logo`} 
                  className="w-full h-full object-cover" 
                  loading="lazy" 
                />
              ) : (
                <span className="text-2xl font-bold text-startupia-turquoise">{startup.name[0]}</span>
              )}
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div>
                <Link 
                  to={`/startup/${startup.id}`} 
                  className="text-xl font-bold hover:text-startupia-turquoise transition-colors"
                >
                  {startup.name}
                </Link>
                <p className="text-base text-white/70">{startup.shortDescription}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-white/10 hover:bg-white/15 transition-colors rounded-full px-3 py-1">
                  <MessageSquare size={14} className="text-startupia-turquoise" />
                  <span className="text-sm">{startup.commentCount || 0}</span>
                </div>
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
                  <ArrowBigUp size={14} />
                  <span className="text-sm font-bold">{startup.upvotes}</span>
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge 
                variant="outline" 
                className="text-xs border-startupia-turquoise/40 bg-startupia-turquoise/5 group-hover:border-startupia-turquoise/70"
              >
                {startup.category}
              </Badge>
              {startup.aiTechnology && (
                <Badge 
                  variant="outline" 
                  className="text-xs border-white/20 bg-white/5 group-hover:border-white/40"
                >
                  {startup.aiTechnology}
                </Badge>
              )}
              {startup.businessModel && (
                <Badge 
                  variant="outline" 
                  className="text-xs border-white/20 bg-white/5 group-hover:border-white/40"
                >
                  {startup.businessModel}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default StartupCard;
