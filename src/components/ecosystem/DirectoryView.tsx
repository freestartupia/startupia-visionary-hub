
import React, { useState, useEffect } from 'react';
import { Startup } from '@/types/startup';
import StartupCard from '@/components/StartupCard';
import { mockStartups } from '@/data/mockStartups';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DirectoryViewProps {
  searchQuery: string;
  showFilters: boolean;
  sortOrder: string;
}

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

const DirectoryView = ({ searchQuery, showFilters, sortOrder }: DirectoryViewProps) => {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStartups = async () => {
    setLoading(true);
    try {
      console.log('Tentative de récupération des startups depuis la base de données...');
      
      // Tenter de récupérer les startups depuis Supabase
      const { data: dbStartups, error } = await supabase
        .from('startups')
        .select('*');
      
      if (error) {
        console.error('Erreur Supabase:', error);
        throw error;
      }
      
      // Si nous avons des données de la base, les utiliser
      // Sinon, utiliser les données mockées
      let fetchedStartups = [];
      if (dbStartups && dbStartups.length > 0) {
        fetchedStartups = dbStartups.map(mapDbStartupToModel);
      } else {
        fetchedStartups = [...mockStartups];
      }
        
      console.log(`Startups récupérées: ${fetchedStartups.length}`, fetchedStartups);
      
      // Appliquer le filtre de recherche
      if (searchQuery) {
        const lowerCaseQuery = searchQuery.toLowerCase();
        fetchedStartups = fetchedStartups.filter(startup => 
          startup.name.toLowerCase().includes(lowerCaseQuery) || 
          startup.shortDescription.toLowerCase().includes(lowerCaseQuery) ||
          startup.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery)) ||
          (startup.sector && startup.sector.toLowerCase().includes(lowerCaseQuery))
        );
      }
      
      // Appliquer le tri
      switch (sortOrder) {
        case 'votes':
          fetchedStartups.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
          break;
        case 'trending':
          // Pour la démo, on mélange juste aléatoirement
          fetchedStartups.sort(() => Math.random() - 0.5);
          break;
        case 'newest':
          // Utiliser la date de création si disponible
          fetchedStartups.sort((a, b) => {
            const dateA = a.dateAdded ? new Date(a.dateAdded) : new Date(0);
            const dateB = b.dateAdded ? new Date(b.dateAdded) : new Date(0);
            return dateB.getTime() - dateA.getTime();
          });
          break;
        case 'alphabetical':
          fetchedStartups.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          break;
      }
      
      setStartups(fetchedStartups);
    } catch (error) {
      console.error('Error fetching startups:', error);
      toast.error("Erreur lors de la récupération des startups");
      
      // Utiliser les données mockées en cas d'erreur
      let fallbackStartups = [...mockStartups];
      
      // Appliquer les mêmes filtres et tris aux données de secours
      if (searchQuery) {
        const lowerCaseQuery = searchQuery.toLowerCase();
        fallbackStartups = fallbackStartups.filter(startup => 
          startup.name.toLowerCase().includes(lowerCaseQuery) || 
          startup.shortDescription.toLowerCase().includes(lowerCaseQuery) ||
          startup.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery)) ||
          startup.sector.toLowerCase().includes(lowerCaseQuery)
        );
      }
      
      // Appliquer le tri
      switch (sortOrder) {
        case 'votes':
          fallbackStartups.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
          break;
        case 'trending':
          fallbackStartups.sort(() => Math.random() - 0.5);
          break;
        case 'newest':
          fallbackStartups.sort((a, b) => {
            const dateA = a.dateAdded ? new Date(a.dateAdded) : new Date(0);
            const dateB = b.dateAdded ? new Date(b.dateAdded) : new Date(0);
            return dateB.getTime() - dateA.getTime();
          });
          break;
        case 'alphabetical':
          fallbackStartups.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          break;
      }
      
      setStartups(fallbackStartups);
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
