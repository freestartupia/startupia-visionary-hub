
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
    <div className="group relative rounded-md border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-black transition-all duration-200 p-4">
      <div className="flex items-start space-x-4">
        {index !== undefined && (
          <div className="text-base font-medium text-slate-400 min-w-8 text-center pt-1">
            {index}.
          </div>
        )}
        
        <div className="flex-shrink-0 w-12 h-12 rounded-md bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center">
          {startup.logoUrl ? (
            <img 
              src={startup.logoUrl} 
              alt={`${startup.name} logo`} 
              className="w-full h-full object-cover" 
              loading="lazy" 
            />
          ) : (
            <span className="text-xl font-bold text-slate-500">{startup.name[0]}</span>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col">
            <Link 
              to={`/startup/${startup.id}`} 
              className="text-lg font-medium hover:text-startupia-turquoise transition-colors"
            >
              {startup.name}
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
              {startup.shortDescription}
            </p>
            
            <div className="flex flex-wrap gap-1 mt-2">
              <Badge 
                variant="outline" 
                className="text-xs font-normal bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {startup.category}
              </Badge>
              {startup.aiTechnology && (
                <Badge 
                  variant="outline" 
                  className="text-xs font-normal bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {startup.aiTechnology}
                </Badge>
              )}
              {startup.businessModel && (
                <Badge 
                  variant="outline" 
                  className="text-xs font-normal bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {startup.businessModel}
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-2 ml-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`rounded-md p-2 ${hasVoted 
              ? 'bg-startupia-turquoise/20 text-startupia-turquoise' 
              : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            onClick={handleVote}
            disabled={isLoading}
          >
            <ArrowBigUp size={20} />
          </Button>
          <span className="text-sm font-medium">{startup.upvotes}</span>
        </div>
        
        <div className="flex items-center">
          <div className="flex items-center mr-3">
            <MessageSquare size={16} className="text-slate-400 mr-1" />
            <span className="text-sm text-slate-500">{startup.commentCount || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default StartupCard;
