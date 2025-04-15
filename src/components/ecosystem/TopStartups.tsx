
import React, { useState, useEffect } from 'react';
import { Startup } from '@/types/startup';
import StartupCard from '@/components/StartupCard';
import { Badge } from '@/components/ui/badge';
import { Trophy, TrendingUp, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { mockStartups } from '@/data/mockStartups';

interface TopStartupsProps {
  searchQuery: string;
  showFilters: boolean;
  sortOrder: string;
  limit?: number;
}

const TopStartups = ({ searchQuery, showFilters, sortOrder, limit = 4 }: TopStartupsProps) => {
  const [topStartups, setTopStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchStartups = async () => {
    setLoading(true);
    
    try {
      let query = supabase
        .from('startups')
        .select('*');
      
      // Apply search filter if any
      if (searchQuery.trim()) {
        query = query.or(`name.ilike.%${searchQuery}%,short_description.ilike.%${searchQuery}%`);
      }
      
      // Sort based on selected order
      switch (sortOrder) {
        case 'impact':
          query = query.order('ai_impact_score', { ascending: false });
          break;
        case 'alphabetical':
          query = query.order('name', { ascending: true });
          break;
        case 'votes':
        case 'trending':
          query = query.order('upvotes', { ascending: false });
          break;
        case 'funding':
          query = query.in('maturity_level', ['Série A', 'Série B', 'Série C+']);
          break;
        default:
          // 'newest' - default
          query = query.order('created_at', { ascending: false });
      }
      
      // Take only the top N
      query = query.limit(limit);
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching startups:', error);
        // Fallback to mock data
        setTopStartups(processMockData());
      } else if (data && data.length > 0) {
        const processedStartups = data.map(item => ({
          id: item.id,
          name: item.name,
          logoUrl: item.logo_url || '',
          shortDescription: item.short_description,
          longTermVision: item.long_term_vision || '',
          founders: item.founders || [],
          aiUseCases: item.ai_use_cases || '',
          aiTools: item.ai_tools || [],
          sector: item.sector,
          businessModel: item.business_model,
          maturityLevel: item.maturity_level,
          aiImpactScore: item.ai_impact_score,
          tags: item.tags || [],
          websiteUrl: item.website_url || '',
          pitchDeckUrl: item.pitch_deck_url,
          crunchbaseUrl: item.crunchbase_url,
          upvotes: item.upvotes || 0
        }));
        
        setTopStartups(processedStartups);
      } else {
        // Fallback to mock data if no results
        setTopStartups(processMockData());
      }
    } catch (error) {
      console.error('Exception fetching startups:', error);
      setTopStartups(processMockData());
    } finally {
      setLoading(false);
    }
  };
  
  const processMockData = () => {
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
      case 'votes':
      case 'trending':
        filtered.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
        break;
      case 'funding':
        filtered = filtered.filter(s => s.maturityLevel === 'Série A' || s.maturityLevel === 'Série B' || s.maturityLevel === 'Série C+');
        break;
      default: 
        // 'newest' - default
        filtered = filtered.reverse();
    }
    
    // Take only the top N
    return filtered.slice(0, limit);
  };
  
  useEffect(() => {
    fetchStartups();
  }, [searchQuery, showFilters, sortOrder, limit]);
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(limit)].map((_, index) => (
          <div key={index} className="h-64 glass-card animate-pulse"></div>
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
          <StartupCard startup={startup} refetchStartups={fetchStartups} />
        </div>
      ))}
    </div>
  );
};

export default TopStartups;
