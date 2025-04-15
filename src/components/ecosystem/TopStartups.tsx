
import React, { useState, useEffect } from 'react';
import { Startup } from '@/types/startup';
import StartupCard from '@/components/StartupCard';
import { Badge } from '@/components/ui/badge';
import { Trophy, TrendingUp, Zap } from 'lucide-react';
import { getStartups, isStartupUpvotedByUser } from '@/services/startupService';

interface TopStartupsProps {
  searchQuery: string;
  showFilters: boolean;
  sortOrder: string;
  limit?: number;
}

const TopStartups = ({ searchQuery, showFilters, sortOrder, limit = 4 }: TopStartupsProps) => {
  const [topStartups, setTopStartups] = useState<Startup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchStartups = async () => {
      setIsLoading(true);
      try {
        // Get startups from our service
        const fetchedStartups = await getStartups();
        
        // Check if each startup has been upvoted by the current user
        const startupsWithUpvoteStatus = await Promise.all(
          fetchedStartups.map(async (startup) => {
            const isUpvoted = await isStartupUpvotedByUser(startup.id);
            return { ...startup, isUpvoted };
          })
        );
        
        // Apply filters and sorting
        let filtered = [...startupsWithUpvoteStatus];
        
        // Apply search filter if any
        if (searchQuery.trim()) {
          filtered = filtered.filter((startup) =>
            startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            startup.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
            startup.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
          );
        }
        
        // Always sort by upvotes first (Product Hunt style)
        filtered.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
        
        // If specific sorting is requested, apply it after the upvote sort
        if (sortOrder !== 'votes') {
          switch (sortOrder) {
            case 'impact':
              filtered.sort((a, b) => b.aiImpactScore - a.aiImpactScore);
              break;
            case 'alphabetical':
              filtered.sort((a, b) => a.name.localeCompare(b.name));
              break;
            case 'newest':
              filtered.sort((a, b) => {
                const dateA = a.dateAdded ? new Date(a.dateAdded).getTime() : 0;
                const dateB = b.dateAdded ? new Date(b.dateAdded).getTime() : 0;
                return dateB - dateA;
              });
              break;
          }
        }
        
        // Take only the top N
        setTopStartups(filtered.slice(0, limit));
      } catch (error) {
        console.error('Error fetching startups:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStartups();
  }, [searchQuery, showFilters, sortOrder, limit]);

  // Handle upvote updates
  const handleUpvote = (startupId: string, newCount: number) => {
    setTopStartups(prev => 
      prev.map(startup => 
        startup.id === startupId 
          ? { ...startup, upvotes: newCount, isUpvoted: !startup.isUpvoted } 
          : startup
      ).sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0)) // Re-sort after upvoting
    );
  };
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {Array(limit).fill(0).map((_, i) => (
          <div key={i} className="bg-gray-800/50 rounded-lg h-64"></div>
        ))}
      </div>
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
                <span>N°1</span>
              </Badge>
            </div>
          )}
          {index === 1 && (
            <div className="absolute -top-4 -left-4 z-10">
              <Badge variant="outline" className="bg-gray-300 text-gray-800 border-none px-3 py-1 flex items-center gap-1">
                <TrendingUp size={14} />
                <span>N°2</span>
              </Badge>
            </div>
          )}
          {index === 2 && (
            <div className="absolute -top-4 -left-4 z-10">
              <Badge variant="outline" className="bg-amber-600 text-white border-none px-3 py-1 flex items-center gap-1">
                <Trophy size={14} />
                <span>N°3</span>
              </Badge>
            </div>
          )}
          <StartupCard 
            startup={startup} 
            onUpvote={handleUpvote}
          />
        </div>
      ))}
    </div>
  );
};

export default TopStartups;
