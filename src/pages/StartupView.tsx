import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowBigUp, Share2, ArrowLeft, ExternalLink, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import CommentsSection from '@/components/startup/CommentsSection';
import { Startup } from '@/types/startup';
import { fetchStartupById, hasUserVotedForStartup, voteForStartup, unvoteStartup } from '@/services/startupService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import SEO from '@/components/SEO';
import NotFound from './NotFound';

const StartupView = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [startup, setStartup] = useState<Startup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoteLoading, setIsVoteLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadStartup(id);
    }
  }, [id]);

  useEffect(() => {
    if (user && startup) {
      checkUserVote();
    }
  }, [user, startup]);

  const loadStartup = async (startupId: string) => {
    setIsLoading(true);
    try {
      const data = await fetchStartupById(startupId);
      setStartup(data);
    } catch (error) {
      console.error(`Erreur lors du chargement de la startup ${startupId}:`, error);
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="container mx-auto pt-32 pb-16 px-4 flex justify-center items-center">
          <div className="w-10 h-10 border-4 border-white/20 border-t-startupia-turquoise rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!startup) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO 
        title={`${startup.name} - Startup IA Française`}
        description={startup.shortDescription}
      />
      
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-startupia-turquoise/30 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-startupia-turquoise/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <div className="mb-8">
          <Link to="/startup" className="inline-flex items-center text-white/60 hover:text-startupia-turquoise">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la liste
          </Link>
        </div>
        
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
                onClick={handleVote}
                disabled={isVoteLoading}
                variant={hasVoted ? "default" : "outline"}
                className={`w-full mb-2 ${hasVoted ? 'bg-startupia-turquoise text-white' : 'border-startupia-turquoise text-white hover:bg-startupia-turquoise/10'}`}
              >
                <ArrowBigUp className="h-5 w-5 mr-2" />
                {hasVoted ? 'Voté' : 'Voter'} ({startup.upvotes})
              </Button>
              
              <Button
                variant="outline"
                className="w-full border-white/20"
                onClick={handleShare}
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
        
        <CommentsSection startupId={startup.id} />
        
        <div className="text-center py-6">
          <h2 className="text-2xl font-bold mb-4">Vous aimez cette startup ?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleVote}
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
              <a href={startup.websiteUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-5 w-5 mr-2" />
                Visiter le site
              </a>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StartupView;
