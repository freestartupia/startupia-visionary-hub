
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
import { fetchStartupsPaginated } from '@/services/startupService';
import { useAuth } from '@/contexts/AuthContext';
import SEO from '@/components/SEO';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationNext, 
  PaginationPrevious,
  PaginationLink
} from "@/components/ui/pagination";

const STARTUPS_PER_PAGE = 10;

const StartupPage = () => {
  const { user } = useAuth();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('all');
  const [sortBy, setSortBy] = useState<'upvotes' | 'recent'>('upvotes');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalStartups, setTotalStartups] = useState(0);

  useEffect(() => {
    loadStartups();
  }, [currentPage, sortBy]); // Re-load when page or sort changes

  const loadStartups = async () => {
    setIsLoading(true);
    try {
      const result = await fetchStartupsPaginated(currentPage, STARTUPS_PER_PAGE, sortBy);
      setStartups(result.data);
      setTotalStartups(result.total);
    } catch (error) {
      console.error('Erreur lors du chargement des startups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitSuccess = () => {
    setIsDialogOpen(false);
    setCurrentPage(1); // Reset to first page
    loadStartups();
  };

  const handleRefresh = () => {
    loadStartups();
  };

  const handleVoteChange = () => {
    loadStartups();
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const displayedStartups = getFilteredStartups();
  const totalPages = Math.ceil(totalStartups / STARTUPS_PER_PAGE);

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
              onClick={() => {
                setSortBy(sortBy === 'upvotes' ? 'recent' : 'upvotes');
                setCurrentPage(1); // Reset to first page when changing sort
              }}
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
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {displayedStartups.map((startup) => (
                <StartupCard 
                  key={startup.id} 
                  startup={startup}
                  onVoteChange={handleVoteChange}
                />
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="mt-10">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} 
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => {
                      // Show pages around current page
                      let pageToShow = currentPage;
                      if (totalPages <= 5) {
                        pageToShow = index + 1;
                      } else if (currentPage <= 3) {
                        pageToShow = index + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageToShow = totalPages - 4 + index;
                      } else {
                        pageToShow = currentPage - 2 + index;
                      }
                      
                      return (
                        <PaginationItem key={index}>
                          <PaginationLink
                            onClick={() => handlePageChange(pageToShow)}
                            isActive={currentPage === pageToShow}
                            className="cursor-pointer"
                          >
                            {pageToShow}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} 
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
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
