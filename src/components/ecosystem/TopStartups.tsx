
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
        
        // Sort based on selected order
        switch (sortOrder) {
          case 'impact':
            filtered.sort((a, b) => b.aiImpactScore - a.aiImpactScore);
            break;
          case 'alphabetical':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'votes':
            filtered.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
            break;
          case 'newest':
            filtered.sort((a, b) => {
              const dateA = a.dateAdded ? new Date(a.dateAdded).getTime() : 0;
              const dateB = b.dateAdded ? new Date(b.dateAdded).getTime() : 0;
              return dateB - dateA;
            });
            break;
          default: 
            // 'trending' - mix of recent and upvotes
            filtered.sort((a, b) => {
              const scoreA = (a.upvotes || 0) * 2 + (a.dateAdded ? 1 : 0);
              const scoreB = (b.upvotes || 0) * 2 + (b.dateAdded ? 1 : 0);
              return scoreB - scoreA;
            });
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
      )
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
