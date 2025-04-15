
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Startup } from '@/types/startup';
import StartupCard from '@/components/StartupCard';
import { mockStartups } from '@/data/mockStartups';

const TopStartups = () => {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTopStartups = async () => {
    setLoading(true);
    
    try {
      console.log('Récupération des top startups...');
      
      // Tentative de récupération depuis Supabase
      const { data: dbStartups, error } = await supabase
        .from('startups')
        .select('*')
        .order('upvotes', { ascending: false })
        .limit(4);
      
      if (error) {
        console.error('Erreur Supabase:', error);
        throw error;
      }
      
      // Si nous avons des startups dans la base, les utiliser
      if (dbStartups && dbStartups.length > 0) {
        console.log('Top startups récupérées depuis la base:', dbStartups);
        setStartups(dbStartups as Startup[]);
      } else {
        // Sinon utiliser les données mockées
        console.log('Aucune startup en base, utilisation des données mockées');
        const topMockStartups = [...mockStartups]
          .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
          .slice(0, 4);
        
        console.log('Top startups:', topMockStartups.map(s => `${s.name}: ${s.upvotes} upvotes`));
        setStartups(topMockStartups);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des top startups:', error);
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
