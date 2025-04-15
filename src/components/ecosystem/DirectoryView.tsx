
import React, { useState, useEffect } from 'react';
import { Startup } from '@/types/startup';
import StartupCard from '@/components/StartupCard';
import { mockStartups } from '@/data/mockStartups';
import { Skeleton } from '@/components/ui/skeleton';

interface DirectoryViewProps {
  searchQuery: string;
  showFilters: boolean;
  sortOrder: string;
}

const DirectoryView = ({ searchQuery, showFilters, sortOrder }: DirectoryViewProps) => {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStartups = async () => {
    setLoading(true);
    try {
      // Utiliser les mockStartups
      let filteredStartups = [...mockStartups];
      
      // Appliquer le filtre de recherche
      if (searchQuery) {
        const lowerCaseQuery = searchQuery.toLowerCase();
        filteredStartups = filteredStartups.filter(startup => 
          startup.name.toLowerCase().includes(lowerCaseQuery) || 
          startup.shortDescription.toLowerCase().includes(lowerCaseQuery) ||
          startup.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery)) ||
          startup.sector.toLowerCase().includes(lowerCaseQuery)
        );
      }
      
      // Appliquer le tri
      switch (sortOrder) {
        case 'votes':
          filteredStartups.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
          break;
        case 'trending':
          // Pour la démo, on mélange juste aléatoirement
          filteredStartups.sort(() => Math.random() - 0.5);
          break;
        case 'newest':
          // Utiliser la date de création si disponible
          filteredStartups.sort((a, b) => {
            const dateA = a.dateAdded ? new Date(a.dateAdded) : new Date(0);
            const dateB = b.dateAdded ? new Date(b.dateAdded) : new Date(0);
            return dateB.getTime() - dateA.getTime();
          });
          break;
        case 'alphabetical':
          filteredStartups.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          break;
      }
      
      setStartups(filteredStartups);
    } catch (error) {
      console.error('Error fetching startups:', error);
      setStartups([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStartups();
  }, [searchQuery, sortOrder]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(12)].map((_, index) => (
          <Skeleton key={index} className="h-64 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (startups.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold mb-2">Aucune startup trouvée</h3>
        <p className="text-white/60">Essayez de modifier vos critères de recherche</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {startups.map(startup => (
        <StartupCard key={startup.id} startup={startup} refetchStartups={fetchStartups} />
      ))}
    </div>
  );
};

export default DirectoryView;
