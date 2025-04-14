
import React, { useState, useEffect } from "react";
import { Startup, Sector, BusinessModel, MaturityLevel, AITool } from "@/types/startup";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { ThumbsUp, MessageSquare, Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

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
              aiImpactScore: item.ai_impact_score as number,
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Date inconnue';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
  };

  return (
    <div className="mb-16">
      {showFilters && (
        <div className="mt-4 mb-8">
          {/* Retirer l'appel à StartupFilters qui n'existe pas dans ce fichier */}
        </div>
      )}
      
      <Tabs 
        value={activeCategory} 
        onValueChange={setActiveCategory}
        className="mb-8"
      >
        <TabsList className="inline-flex h-10 items-center justify-start space-x-1 overflow-x-auto w-full">
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
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <Card key={i} className="w-full p-4 border border-startupia-turquoise/20 bg-black/30">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-lg flex-shrink-0" />
                  <div className="flex-grow">
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-full max-w-md mb-2" />
                    <div className="flex flex-wrap gap-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </div>
                  <div className="flex-shrink-0 space-y-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <TabsContent value="all" className="mt-0">
              {renderStartupList(filteredStartups)}
            </TabsContent>
            
            {sectors.map(sector => (
              <TabsContent key={sector} value={sector} className="mt-0">
                {renderStartupList(filteredStartups)}
              </TabsContent>
            ))}
          </>
        )}
      </Tabs>
    </div>
  );

  function renderStartupList(startups: Startup[]) {
    if (startups.length === 0) {
      return (
        <div className="text-center py-20">
          <p className="text-white/60 text-lg">Aucune startup ne correspond à votre recherche</p>
        </div>
      );
    }
  
    return (
      <div className="space-y-6">
        {startups.map((startup, index) => (
          <Link to={`/startup/${startup.id}`} key={startup.id} className="block hover:no-underline">
            <Card className="hover:border-startupia-turquoise/50 transition-all duration-300 border border-startupia-turquoise/20 bg-black/30 w-full">
              <div className="flex items-start gap-4 p-5">
                <div className="flex-shrink-0 relative">
                  <div className="w-16 h-16 rounded-md bg-startupia-turquoise/10 flex items-center justify-center overflow-hidden">
                    {startup.logoUrl ? (
                      <img src={startup.logoUrl} alt={`${startup.name} logo`} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-bold text-startupia-turquoise">{startup.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="absolute -top-3 -left-3 flex items-center justify-center h-7 w-7 bg-startupia-turquoise/90 text-black font-bold rounded-full">
                    {index + 1}
                  </div>
                </div>
                
                <div className="flex-grow">
                  <div className="mb-2">
                    <h3 className="text-xl font-bold text-white">{startup.name}</h3>
                    <p className="text-white/80 font-medium mb-2">{startup.shortDescription}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {startup.sector && (
                        <Badge className="bg-startupia-turquoise/10 hover:bg-startupia-turquoise/20 text-white border-none">
                          {startup.sector}
                        </Badge>
                      )}
                      {startup.tags && startup.tags.slice(0, 3).map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="bg-black/40 text-white/70 hover:bg-black/60">
                          {tag}
                        </Badge>
                      ))}
                      {startup.tags && startup.tags.length > 3 && (
                        <Badge variant="outline" className="bg-black/40 text-white/70">
                          +{startup.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 text-sm text-white/60">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(startup.dateAdded)}</span>
                    </div>
                    
                    {startup.websiteUrl && (
                      <a 
                        href={startup.websiteUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-white/70 hover:text-startupia-turquoise"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        <span>Site web</span>
                      </a>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-3 items-center flex-shrink-0">
                  <div className="flex flex-col items-center p-2">
                    <MessageSquare className="mb-1 h-5 w-5 text-white/50" />
                    <span className="text-sm font-semibold">{startup.viewCount || 0}</span>
                  </div>
                  
                  <div className="flex flex-col items-center p-2">
                    <ThumbsUp className="mb-1 h-5 w-5 text-white/50" />
                    <span className="text-sm font-semibold">{startup.upvoteCount || 0}</span>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    );
  }
};

export default DirectoryView;
