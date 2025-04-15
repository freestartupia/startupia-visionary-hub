
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Startup } from '@/types/startup';
import StartupCard from '@/components/StartupCard';
import { mockStartups } from '@/data/mockStartups';

interface DirectoryViewProps {
  searchQuery: string;
  showFilters: boolean;
  sortOrder?: string;
}

const DirectoryView = ({ searchQuery, showFilters, sortOrder = 'trending' }: DirectoryViewProps) => {
  const [startups, setStartups] = useState<Startup[]>([]);
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
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching startups:', error);
        // Fallback to mock data
        setStartups(processMockData());
      } else if (data && data.length > 0) {
        const processedStartups: Startup[] = data.map(item => {
          // Process founders to ensure it's the correct type
          let parsedFounders = [];
          try {
            if (item.founders) {
              if (typeof item.founders === 'string') {
                parsedFounders = JSON.parse(item.founders);
              } else if (Array.isArray(item.founders)) {
                parsedFounders = item.founders;
              } else if (typeof item.founders === 'object') {
                parsedFounders = [item.founders];
              }
            }
          } catch (e) {
            console.error('Error parsing founders:', e);
            parsedFounders = [];
          }
          
          return {
            id: item.id,
            name: item.name,
            logoUrl: item.logo_url || '',
            shortDescription: item.short_description,
            longTermVision: item.long_term_vision || '',
            founders: parsedFounders,
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
          };
        });
        
        setStartups(processedStartups);
      } else {
        // Fallback to mock data if no results
        setStartups(processMockData());
      }
    } catch (error) {
      console.error('Exception fetching startups:', error);
      setStartups(processMockData());
    } finally {
      setLoading(false);
    }
  };
  
  const processMockData = (): Startup[] => {
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
    
    return filtered;
  };
  
  useEffect(() => {
    fetchStartups();
  }, [searchQuery, showFilters, sortOrder]);
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="h-64 glass-card animate-pulse"></div>
        ))}
      </div>
    );
  }
  
  if (startups.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-white/70">Aucune startup ne correspond à votre recherche</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {startups.map(startup => (
        <StartupCard 
          key={startup.id} 
          startup={startup} 
          refetchStartups={fetchStartups}
        />
      ))}
    </div>
  );
};

export default DirectoryView;
