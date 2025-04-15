
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Startup, AITool, Sector, BusinessModel, MaturityLevel } from '@/types/startup';
import StartupCard from '@/components/StartupCard';
import { mockStartups } from '@/data/mockStartups';

const TopStartups = () => {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTopStartups = async () => {
    setLoading(true);
    
    try {
      console.log('Fetching top startups...');
      // Utiliser les données mockées triées par upvotes
      const topMockStartups = [...mockStartups]
        .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
        .slice(0, 4);
      
      console.log('Top startups:', topMockStartups.map(s => `${s.name}: ${s.upvotes} upvotes`));
      console.log('IDs des startups récupérées:', topMockStartups.map(s => s.id));
      setStartups(topMockStartups);
    } catch (error) {
      console.error('Exception fetching top startups:', error);
      // Fallback to mock data
      const topMockStartups = [...mockStartups]
        .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
        .slice(0, 4);
      setStartups(topMockStartups);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTopStartups();
  }, []);
  
  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto py-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="w-64 h-48 glass-card animate-pulse shrink-0"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto py-4">
      {startups.map(startup => (
        <StartupCard key={startup.id} startup={startup} refetchStartups={fetchTopStartups} />
      ))}
    </div>
  );
};

export default TopStartups;
