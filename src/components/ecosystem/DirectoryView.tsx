
import React, { useState, useEffect } from "react";
import { Startup, Sector } from "@/types/startup";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ThumbsUp } from "lucide-react";
import StartupCard from "@/components/StartupCard";
import { getStartups, isStartupUpvotedByUser } from "@/services/startupService";

interface DirectoryViewProps {
  searchQuery: string;
  showFilters: boolean;
  sortOrder?: string;
}

const DirectoryView = ({ searchQuery, showFilters, sortOrder = "trending" }: DirectoryViewProps) => {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [filteredStartups, setFilteredStartups] = useState<Startup[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [sectors, setSectors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch startups from Supabase or mock data
  useEffect(() => {
    const fetchStartups = async () => {
      setIsLoading(true);
      try {
        const fetchedStartups = await getStartups();
        
        // Check if each startup has been upvoted by the current user
        const startupsWithUpvoteStatus = await Promise.all(
          fetchedStartups.map(async (startup) => {
            const isUpvoted = await isStartupUpvotedByUser(startup.id);
            return { ...startup, isUpvoted };
          })
        );
        
        setStartups(startupsWithUpvoteStatus);
        setFilteredStartups(startupsWithUpvoteStatus);
        
        const uniqueSectors = Array.from(new Set(startupsWithUpvoteStatus.map(startup => startup.sector)));
        setSectors(uniqueSectors);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Une erreur est survenue');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStartups();
  }, []);
  
  // Apply search filter
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
  
  // Apply category filter
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
  
  // Apply sort
  useEffect(() => {
    let sorted = [...filteredStartups];
    
    switch (sortOrder) {
      case 'votes':
        sorted.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
        break;
      case 'newest':
        sorted.sort((a, b) => {
          const dateA = a.dateAdded ? new Date(a.dateAdded).getTime() : 0;
          const dateB = b.dateAdded ? new Date(b.dateAdded).getTime() : 0;
          return dateB - dateA;
        });
        break;
      case 'alphabetical':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'impact':
        sorted.sort((a, b) => b.aiImpactScore - a.aiImpactScore);
        break;
      default: // trending - a mix of recency and upvotes
        sorted.sort((a, b) => {
          const scoreA = (a.upvotes || 0) * 2 + (a.dateAdded ? 1 : 0);
          const scoreB = (b.upvotes || 0) * 2 + (b.dateAdded ? 1 : 0);
          return scoreB - scoreA;
        });
    }
    
    setFilteredStartups(sorted);
  }, [sortOrder, activeCategory, searchQuery, startups]);

  // Handle upvote updates
  const handleUpvote = (startupId: string, newCount: number) => {
    setStartups(prev => 
      prev.map(startup => 
        startup.id === startupId 
          ? { ...startup, upvotes: newCount, isUpvoted: !startup.isUpvoted } 
          : startup
      )
    );
  };

  if (isLoading) {
    return (
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
    );
  }

  if (filteredStartups.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white/60 text-lg">Aucune startup ne correspond à votre recherche</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Tabs 
        value={activeCategory} 
        onValueChange={setActiveCategory}
        className="mb-8 w-full"
      >
        <TabsList className="inline-flex h-10 items-center justify-start space-x-1 overflow-x-auto w-full bg-transparent mb-6">
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
        
        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredStartups.map((startup) => (
              <StartupCard 
                key={startup.id} 
                startup={startup} 
                onUpvote={handleUpvote}
              />
            ))}
          </div>
        </TabsContent>
        
        {sectors.map(sector => (
          <TabsContent key={sector} value={sector} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredStartups.map((startup) => (
                <StartupCard 
                  key={startup.id} 
                  startup={startup} 
                  onUpvote={handleUpvote}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default DirectoryView;
