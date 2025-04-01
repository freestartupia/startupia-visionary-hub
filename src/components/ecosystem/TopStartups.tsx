
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { mockStartups } from '@/data/mockStartups';
import { Startup } from '@/types/startup';
import { Badge } from '@/components/ui/badge';
import { Trophy, TrendingUp, Zap } from 'lucide-react';
import LoadingSpinner from '@/components/ui/loading-spinner';
import ErrorMessage from '@/components/ui/error-message';

// Lazy load the StartupCard component
const StartupCard = lazy(() => import('@/components/StartupCard'));

interface TopStartupsProps {
  searchQuery: string;
  showFilters: boolean;
  sortOrder: string;
  limit?: number;
}

const TopStartups = ({ searchQuery, showFilters, sortOrder, limit = 4 }: TopStartupsProps) => {
  const [topStartups, setTopStartups] = useState<Startup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    // Simulate async loading with timeout
    const timer = setTimeout(() => {
      try {
        // Filter and sort startups based on params
        let filtered = [...mockStartups];
        
        // Apply search filter if any
        if (searchQuery.trim()) {
          filtered = filtered.filter((startup) =>
            startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            startup.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
            startup.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
          );
        }
        
        // Sort based on selected order
        switch (sortOrder) {
          case 'impact':
            filtered.sort((a, b) => b.aiImpactScore - a.aiImpactScore);
            break;
          case 'alphabetical':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'funding':
            // In a real app this would sort by funding amount
            filtered = filtered.filter(s => s.maturityLevel === 'Série A' || s.maturityLevel === 'Série B' || s.maturityLevel === 'Série C+');
            break;
          default: 
            // 'newest' - default
            filtered = filtered.reverse();
        }
        
        // Take only the top N
        setTopStartups(filtered.slice(0, limit));
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading startups:', err);
        setError('Une erreur est survenue lors du chargement des startups.');
        setIsLoading(false);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery, showFilters, sortOrder, limit]);
  
  if (isLoading) {
    return (
      <div className="w-full py-12">
        <LoadingSpinner />
        <p className="text-center text-white/70 mt-4">Chargement des startups...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <ErrorMessage 
        message={error} 
        onRetry={() => {
          setIsLoading(true);
          setError(null);
          // Retry fetching data
          setTimeout(() => {
            setTopStartups(mockStartups.slice(0, limit));
            setIsLoading(false);
          }, 500);
        }}
      />
    );
  }
  
  if (topStartups.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-white/70">Aucune startup ne correspond à votre recherche</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {topStartups.map((startup, index) => (
        <div key={startup.id} className="relative">
          {index === 0 && (
            <div className="absolute -top-4 -left-4 z-10">
              <Badge variant="outline" className="bg-startupia-gold text-black border-none px-3 py-1 flex items-center gap-1">
                <Trophy size={14} />
                <span>Top IA</span>
              </Badge>
            </div>
          )}
          {index === 1 && (
            <div className="absolute -top-4 -left-4 z-10">
              <Badge variant="outline" className="bg-gray-300 text-gray-800 border-none px-3 py-1 flex items-center gap-1">
                <TrendingUp size={14} />
                <span>Tendance</span>
              </Badge>
            </div>
          )}
          {startup.aiImpactScore === 5 && (
            <div className="absolute -top-4 -right-4 z-10">
              <Badge variant="outline" className="bg-startupia-turquoise/80 border-none px-3 py-1 flex items-center gap-1">
                <Zap size={14} />
                <span>Impact 5/5</span>
              </Badge>
            </div>
          )}
          <Suspense fallback={<div className="aspect-square bg-black/20 animate-pulse rounded-lg"></div>}>
            <StartupCard startup={startup} />
          </Suspense>
        </div>
      ))}
    </div>
  );
};

export default TopStartups;
