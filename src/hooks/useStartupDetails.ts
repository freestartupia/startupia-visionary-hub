
import { useState, useEffect } from 'react';
import { Startup } from '@/types/startup';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  fetchStartupById, 
  hasUserVotedForStartup, 
  voteForStartup, 
  unvoteStartup 
} from '@/services/startupService';

export function useStartupDetails(startupId: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [startup, setStartup] = useState<Startup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoteLoading, setIsVoteLoading] = useState(false);

  useEffect(() => {
    if (startupId) {
      loadStartup(startupId);
    }
  }, [startupId]);

  useEffect(() => {
    if (user && startup) {
      checkUserVote();
    }
  }, [user, startup]);

  const loadStartup = async (id: string) => {
    setIsLoading(true);
    try {
      const data = await fetchStartupById(id);
      setStartup(data);
    } catch (error) {
      console.error(`Erreur lors du chargement de la startup ${id}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkUserVote = async () => {
    if (!startup) return;
    const voted = await hasUserVotedForStartup(startup.id);
    setHasVoted(voted);
  };

  const handleVote = async () => {
    if (!startup) return;
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour voter.",
        variant: "destructive"
      });
      return;
    }

    setIsVoteLoading(true);
    try {
      if (hasVoted) {
        await unvoteStartup(startup.id);
        setHasVoted(false);
        setStartup(prev => prev ? {...prev, upvotes: prev.upvotes - 1} : null);
        toast({
          title: "Vote retiré",
          description: `Vous avez retiré votre vote pour ${startup.name}`,
        });
      } else {
        await voteForStartup(startup.id);
        setHasVoted(true);
        setStartup(prev => prev ? {...prev, upvotes: prev.upvotes + 1} : null);
        toast({
          title: "Vote enregistré",
          description: `Vous avez voté pour ${startup.name}`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors du vote",
        variant: "destructive"
      });
    } finally {
      setIsVoteLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = () => {
    if (navigator.share && startup) {
      navigator.share({
        title: `${startup.name} - Startupia`,
        text: `Découvrez ${startup.name} sur Startupia: ${startup.shortDescription}`,
        url: window.location.href,
      }).catch(err => console.error('Erreur lors du partage:', err));
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast({
          title: "Lien copié",
          description: "Le lien a été copié dans le presse-papier",
        });
      });
    }
  };

  return {
    startup,
    isLoading,
    hasVoted,
    isVoteLoading,
    handleVote,
    handleShare,
    formatDate
  };
}
