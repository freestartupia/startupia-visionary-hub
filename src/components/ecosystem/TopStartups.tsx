
import React, { useState, useEffect } from 'react';
import { Startup } from '@/types/startup';
import StartupCard from '@/components/StartupCard';
import { Badge } from '@/components/ui/badge';
import { Trophy, TrendingUp, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { checkStartupUpvote } from '@/services/startupUpvoteService';
import { mockStartups } from '@/data/mockStartups';

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
    fetchStartups();
  }, [sortOrder]);

  const fetchStartups = async () => {
    setIsLoading(true);
    try {
      // Try to fetch from Supabase first
      let query = supabase.from('startups').select('*');
      
      // Apply sorting based on selected order
      switch (sortOrder) {
        case 'impact':
          query = query.order('ai_impact_score', { ascending: false });
          break;
        case 'alphabetical':
          query = query.order('name');
          break;
        case 'votes':
          query = query.order('votes_count', { ascending: false });
          break;
        case 'funding':
          query = query.eq('maturity_level', 'Série A')
                       .or('maturity_level.eq.Série B,maturity_level.eq.Série C+');
          break;
        default: 
          // 'newest' - default
          query = query.order('created_at', { ascending: false });
      }
      
      const { data, error } = await query.limit(limit);

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

        setTopStartups(startupsWithUpvoteStatus);
      } else {
        // Fallback to mock data if no data in Supabase
        let filtered = [...mockStartups];
        
        switch (sortOrder) {
          case 'impact':
            filtered.sort((a, b) => b.aiImpactScore - a.aiImpactScore);
            break;
          case 'alphabetical':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'votes':
            filtered.sort((a, b) => (b.votesCount || 0) - (a.votesCount || 0));
            break;
          case 'funding':
            filtered = filtered.filter(s => s.maturityLevel === 'Série A' || 
                                         s.maturityLevel === 'Série B' || 
                                         s.maturityLevel === 'Série C+');
            break;
          default: 
            filtered = filtered.reverse();
        }
        
        setTopStartups(filtered.slice(0, limit));
      }
    } catch (error) {
      console.error('Error fetching top startups:', error);
      // Fallback to mock data
      const filtered = [...mockStartups].slice(0, limit);
      setTopStartups(filtered);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply search filter if any
  const filteredStartups = topStartups.filter(startup => {
    if (!searchQuery.trim()) return true;
    
    return (
      startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const handleUpvote = (startupId: string) => {
    setTopStartups(prevStartups => 
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
  
  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
      </div>
    );
  }
  
  if (filteredStartups.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-white/70">Aucune startup ne correspond à votre recherche</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {filteredStartups.map((startup, index) => (
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
          <StartupCard startup={startup} onUpvote={handleUpvote} />
        </div>
      ))}
    </div>
  );
};

export default TopStartups;
