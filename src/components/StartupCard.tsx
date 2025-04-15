
import React, { useState, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowBigUp, ExternalLink } from 'lucide-react';
import { Startup } from '@/types/startup';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { hasUserVotedForStartup, voteForStartup, unvoteStartup } from '@/services/startupService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface StartupCardProps {
  startup: Startup;
  onVoteChange?: () => void;
}

// Utilisation de memo pour éviter les rendus inutiles
const StartupCard: React.FC<StartupCardProps> = memo(({
  startup,
  onVoteChange
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
      // Ajouter un délai pour éviter de surcharger l'API
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
    
    // Optimistic UI update
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
      // Rollback UI state on error
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

  // Mise en cache du format de date pour éviter les calculs répétés
  const formatDate = React.useCallback((dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, []);

  // Optimisation du rendu conditionnel du logo
  const logoElement = startup.logoUrl 
    ? <img src={startup.logoUrl} alt={`${startup.name} logo`} className="w-full h-full object-cover" loading="lazy" /> 
    : <span className="text-lg font-bold text-startupia-turquoise">{startup.name[0]}</span>;

  return <div className="glass-card border border-white/10 p-5 rounded-lg hover:border-startupia-turquoise/30 transition-colors">
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center">
          <Button size="sm" variant={hasVoted ? "default" : "outline"} className={`w-14 h-14 rounded-lg flex flex-col gap-1 ${hasVoted ? 'bg-startupia-turquoise text-black' : 'border-startupia-turquoise/30 hover:bg-startupia-turquoise/10'}`} onClick={handleVote} disabled={isLoading}>
            <ArrowBigUp className="h-5 w-5" />
            <span className="text-xs font-bold">{startup.upvotes}</span>
          </Button>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center mb-2">
            <div className="h-10 w-10 rounded-md bg-startupia-turquoise/10 flex items-center justify-center overflow-hidden mr-3">
              {logoElement}
            </div>
            
            <div>
              <h3 className="font-bold text-lg line-clamp-1">{startup.name}</h3>
              <p className="text-xs text-white/60">
                {startup.launchDate ? `Lancée le ${formatDate(startup.launchDate)}` : 'Nouvelle startup'}
              </p>
            </div>
          </div>
          
          <p className="text-sm text-white/80 mb-3 line-clamp-2">{startup.shortDescription}</p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="outline" className="text-xs border-startupia-turquoise/40 bg-startupia-turquoise/5">
              {startup.category}
            </Badge>
            {startup.aiTechnology && <Badge variant="outline" className="text-xs border-white/20">
                {startup.aiTechnology}
              </Badge>}
          </div>
          
          <div className="flex items-center justify-between">
            <Link to={`/startup/${startup.id}`} className="text-xs text-startupia-turquoise hover:underline">
              Voir les détails
            </Link>
            
            <a href={startup.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-xs flex items-center gap-1 text-white/60 hover:text-white">
              <ExternalLink className="h-3 w-3" />
              Visiter
            </a>
          </div>
        </div>
      </div>
    </div>;
});

export default StartupCard;
