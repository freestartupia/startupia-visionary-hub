
import React, { useState, useEffect } from "react";
import { Startup, Sector, BusinessModel, MaturityLevel, AITool } from "@/types/startup";
import StartupCard from "@/components/StartupCard";
import StartupFilters from "@/components/StartupFilters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

interface DirectoryViewProps {
  searchQuery: string;
  showFilters: boolean;
}

const DirectoryView = ({ searchQuery, showFilters }: DirectoryViewProps) => {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [filteredStartups, setFilteredStartups] = useState<Startup[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [sectors, setSectors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStartups = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('startups')
          .select('*');
          
        if (error) {
          console.error('Error fetching startups:', error);
          toast.error('Erreur lors du chargement des startups');
        } else if (data) {
          const transformedData: Startup[] = data.map(item => {
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
            
            const typedAiTools = item.ai_tools ? item.ai_tools.map(tool => tool as AITool) : [];
            
            return {
              id: item.id,
              name: item.name,
              logoUrl: item.logo_url || '',
              shortDescription: item.short_description,
              longTermVision: item.long_term_vision || '',
              founders: parsedFounders,
              aiUseCases: item.ai_use_cases || '',
              aiTools: typedAiTools,
              sector: item.sector as Sector,
              businessModel: item.business_model as BusinessModel,
              maturityLevel: item.maturity_level as MaturityLevel,
              aiImpactScore: item.ai_impact_score,
              tags: item.tags || [],
              websiteUrl: item.website_url,
              pitchDeckUrl: item.pitch_deck_url,
              crunchbaseUrl: item.crunchbase_url,
              notionUrl: item.notion_url,
              dateAdded: item.date_added,
              viewCount: item.view_count,
              isFeatured: item.is_featured,
              upvoteCount: item.upvotes_count || 0,
            };
          });
          
          setStartups(transformedData);
          setFilteredStartups(transformedData);
          
          const uniqueSectors = Array.from(new Set(data.map(startup => startup.sector)));
          setSectors(uniqueSectors);
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Une erreur est survenue');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStartups();
  }, []);
  
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredStartups(startups);
      return;
    }

    const filtered = startups.filter((startup) =>
      startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (startup.tags && startup.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    );
    
    setFilteredStartups(filtered);
  }, [searchQuery, startups]);
  
  useEffect(() => {
    if (activeCategory === "all") {
      setFilteredStartups(startups);
      return;
    }
    
    const filtered = startups.filter((startup) => 
      startup.sector === activeCategory
    );
    
    setFilteredStartups(filtered);
  }, [activeCategory, startups]);

  return (
    <div className="mb-16">
      {showFilters && (
        <div className="mt-4 mb-8">
          <StartupFilters startups={startups} setFilteredStartups={setFilteredStartups} />
        </div>
      )}
      
      <Tabs 
        value={activeCategory} 
        onValueChange={setActiveCategory}
        className="mb-8"
      >
        <TabsList className="inline-flex h-10 items-center justify-start space-x-1 overflow-x-auto w-full pb-1 mb-2">
          <TabsTrigger value="all" className="data-[state=active]:bg-startupia-turquoise/20">
            Tous
          </TabsTrigger>
          {sectors.map(sector => (
            <TabsTrigger 
              key={sector} 
              value={sector} 
              className="data-[state=active]:bg-startupia-turquoise/20 whitespace-nowrap"
            >
              {sector}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <div className="mb-6 text-white/70 text-sm">
          {filteredStartups.length} startup{filteredStartups.length !== 1 ? 's' : ''} trouvée{filteredStartups.length !== 1 ? 's' : ''}
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, i) => (
              <Card key={i} className="h-full border border-startupia-turquoise/20 bg-black/30">
                <div className="p-4 flex items-center justify-between border-b border-startupia-turquoise/10">
                  <div className="flex items-center">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="ml-3">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-4 w-16 mt-1" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <Skeleton className="h-4 w-full mb-3" />
                  <Skeleton className="h-4 w-4/5 mb-3" />
                  <div className="flex flex-wrap gap-1 mt-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <TabsContent value="all" className="mt-0">
              {renderStartupGrid(filteredStartups)}
            </TabsContent>
            
            {sectors.map(sector => (
              <TabsContent key={sector} value={sector} className="mt-0">
                {renderStartupGrid(filteredStartups)}
              </TabsContent>
            ))}
          </>
        )}
      </Tabs>
    </div>
  );
};

const renderStartupGrid = (startups: Startup[]) => {
  if (startups.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-white/60 text-lg">Aucune startup ne correspond à votre recherche</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {startups.map((startup) => (
        <StartupCard key={startup.id} startup={startup} />
      ))}
    </div>
  );
};

export default DirectoryView;
