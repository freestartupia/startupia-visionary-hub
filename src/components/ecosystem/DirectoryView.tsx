
import React, { useState, useEffect } from 'react';
import { Startup } from '@/types/startup';
import { mockStartups } from '@/data/mockStartups';
import { Card } from '@/components/ui/card';
import StartupCard from '@/components/StartupCard';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { checkStartupUpvote } from '@/services/startupUpvoteService';

interface DirectoryViewProps {
  searchQuery: string;
  showFilters: boolean;
}

const DirectoryView: React.FC<DirectoryViewProps> = ({ searchQuery, showFilters }) => {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStartups();
  }, []);

  const fetchStartups = async () => {
    setIsLoading(true);
    try {
      // Try to fetch from Supabase first
      const { data, error } = await supabase
        .from('startups')
        .select('*')
        .order('votes_count', { ascending: false });

      if (error) {
        console.error('Error fetching startups:', error);
        throw error;
      }

      if (data && data.length > 0) {
        // Get current user to check if they upvoted any startups
        const { data: userData } = await supabase.auth.getUser();
        const userId = userData.user?.id;

        // If user is logged in, check which startups they've upvoted
        const startupsWithUpvoteStatus = await Promise.all(
          data.map(async (startup) => {
            let isUpvoted = false;
            if (userId) {
              isUpvoted = await checkStartupUpvote(startup.id);
            }
            return { ...startup, isUpvoted };
          })
        );

        setStartups(startupsWithUpvoteStatus);
      } else {
        // Fallback to mock data if no data in Supabase
        setStartups(mockStartups);
      }
    } catch (error) {
      console.error('Error fetching startups:', error);
      setStartups(mockStartups);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpvote = (startupId: string) => {
    setStartups(prevStartups => 
      prevStartups.map(startup => {
        if (startup.id === startupId) {
          const isCurrentlyUpvoted = startup.isUpvoted || false;
          return {
            ...startup,
            isUpvoted: !isCurrentlyUpvoted,
            votesCount: (startup.votesCount || 0) + (isCurrentlyUpvoted ? -1 : 1)
          };
        }
        return startup;
      })
    );
  };

  const filteredStartups = startups.filter(startup => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      startup.name.toLowerCase().includes(query) ||
      startup.shortDescription.toLowerCase().includes(query) ||
      startup.sector.toLowerCase().includes(query) ||
      startup.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, index) => (
          <Card key={index} className="p-4 space-y-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-3 w-[150px]" />
              </div>
            </div>
            <Skeleton className="h-20 w-full" />
            <div className="flex space-x-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (filteredStartups.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-medium">Aucune startup ne correspond à votre recherche</h3>
        <p className="text-white/70 mt-2">Essayez d'ajuster vos critères de recherche</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredStartups.map(startup => (
        <StartupCard key={startup.id} startup={startup} onUpvote={handleUpvote} />
      ))}
    </div>
  );
};

export default DirectoryView;
