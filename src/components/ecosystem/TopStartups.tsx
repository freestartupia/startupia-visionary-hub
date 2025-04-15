
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Startup } from '@/types/startup';
import StartupCard from '@/components/StartupCard';
import { mockStartups } from '@/data/mockStartups';

// Helper function to map database row to Startup type
const mapDbStartupToModel = (dbStartup: any): Startup => {
  return {
    id: dbStartup.id,
    name: dbStartup.name,
    logoUrl: dbStartup.logo_url || '',
    shortDescription: dbStartup.short_description,
    longTermVision: dbStartup.long_term_vision || '',
    founders: typeof dbStartup.founders === 'string' ? 
             JSON.parse(dbStartup.founders) : 
             (dbStartup.founders || []),
    aiUseCases: dbStartup.ai_use_cases || '',
    aiTools: dbStartup.ai_tools || [],
    sector: dbStartup.sector,
    businessModel: dbStartup.business_model,
    maturityLevel: dbStartup.maturity_level,
    aiImpactScore: dbStartup.ai_impact_score,
    tags: dbStartup.tags || [],
    websiteUrl: dbStartup.website_url || '',
    pitchDeckUrl: dbStartup.pitch_deck_url,
    crunchbaseUrl: dbStartup.crunchbase_url,
    notionUrl: dbStartup.notion_url,
    dateAdded: dbStartup.date_added,
    viewCount: dbStartup.view_count || 0,
    isFeatured: dbStartup.is_featured || false,
    upvotes: dbStartup.upvotes || 0
  };
};

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
        const mappedStartups = dbStartups.map(mapDbStartupToModel);
        setStartups(mappedStartups);
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
    
    // Configurer l'abonnement Supabase pour les mises à jour en temps réel
    const channel = supabase
      .channel('public:startups')
      .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'startups' }, 
          (payload) => {
            console.log('Changement détecté dans les startups:', payload);
            fetchTopStartups();
          })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
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
