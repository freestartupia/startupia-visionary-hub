
import React, { useState, useEffect } from 'react';
import { PlusCircle, ArrowUpDown, RefreshCw, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import StartupCard from '@/components/StartupCard';
import SubmitStartupForm from '@/components/SubmitStartupForm';
import { Startup } from '@/types/startup';
import { fetchStartups } from '@/services/startupService';
import { useAuth } from '@/contexts/AuthContext';
import SEO from '@/components/SEO';

const StartupPage = () => {
  const { user } = useAuth();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('all');
  const [sortBy, setSortBy] = useState<'upvotes' | 'recent'>('upvotes');

  useEffect(() => {
    loadStartups();
  }, []);

  const loadStartups = async () => {
    setIsLoading(true);
    try {
      const data = await fetchStartups();
      setStartups(data);
    } catch (error) {
      console.error('Erreur lors du chargement des startups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitSuccess = () => {
    setIsDialogOpen(false);
    loadStartups();
  };

  const handleRefresh = () => {
    loadStartups();
  };

  const handleVoteChange = () => {
    loadStartups();
  };

  const getFilteredStartups = () => {
    if (currentTab === 'all') {
      return startups;
    }
    
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    return startups.filter(startup => {
      const createdAt = new Date(startup.createdAt);
      return currentTab === 'week' 
        ? createdAt >= oneWeekAgo 
        : createdAt >= oneMonthAgo && createdAt < oneWeekAgo;
    });
  };

  const getSortedStartups = () => {
    const filtered = getFilteredStartups();
    if (sortBy === 'upvotes') {
      return [...filtered].sort((a, b) => {
        // D'abord par upvotes décroissant
        if (b.upvotes !== a.upvotes) {
          return b.upvotes - a.upvotes;
        }
        // En cas d'égalité, par date de création décroissante
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    } else {
      return [...filtered].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
  };

  const displayedStartups = getSortedStartups();

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO 
        title="Startups IA - Découvrez et votez pour les startups françaises les plus innovantes"
        description="Explorez les startups IA françaises les plus prometteuses. Votez pour vos préférées et soumettez votre propre projet dans l'écosystème IA français."
      />
      
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-startupia-turquoise/30 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-startupia-turquoise/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Startups IA Françaises
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Découvrez et votez pour les startups qui façonnent l'avenir de l'IA en France
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <Tabs 
            defaultValue="all" 
            className="w-full md:w-auto"
            onValueChange={(value) => setCurrentTab(value)}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="week">Cette semaine</TabsTrigger>
              <TabsTrigger value="month">Ce mois</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => setSortBy(sortBy === 'upvotes' ? 'recent' : 'upvotes')}
            >
              <ArrowUpDown className="h-4 w-4" />
              <span className="hidden sm:inline">Trier par</span>
              <span className="font-medium">
                {sortBy === 'upvotes' ? 'Votes' : 'Récents'}
              </span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Rafraîchir</span>
            </Button>
            
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-startupia-turquoise hover:bg-startupia-turquoise/90 ml-auto md:ml-0"
              size="sm"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Soumettre une startup
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-white/20 border-t-startupia-turquoise rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/60">Chargement des startups...</p>
          </div>
        ) : displayedStartups.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {displayedStartups.map((startup) => (
              <StartupCard 
                key={startup.id} 
                startup={startup}
                onVoteChange={handleVoteChange}
              />
            ))}
          </div>
        ) : (
          <div className="glass-card border border-white/10 rounded-lg p-10 text-center">
            <h3 className="text-xl font-bold mb-2">Aucune startup trouvée</h3>
            <p className="text-white/60 mb-6">
              {currentTab === 'all' 
                ? 'Soyez le premier à soumettre votre startup !' 
                : 'Aucune startup n\'a été soumise dans cette période.'}
            </p>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="bg-startupia-turquoise hover:bg-startupia-turquoise/90"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Soumettre une startup
            </Button>
          </div>
        )}
      </main>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Soumettre votre startup</DialogTitle>
          </DialogHeader>
          
          {!user ? (
            <div className="py-6 text-center">
              <p className="text-white/80 mb-4">Vous devez être connecté pour soumettre une startup.</p>
              <Button asChild className="bg-startupia-turquoise hover:bg-startupia-turquoise/90">
                <a href="/auth">Se connecter</a>
              </Button>
            </div>
          ) : (
            <SubmitStartupForm onSuccess={handleSubmitSuccess} />
          )}
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default StartupPage;
