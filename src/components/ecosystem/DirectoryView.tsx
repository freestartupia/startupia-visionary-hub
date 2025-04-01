
import React, { useState, useEffect } from "react";
import { mockStartups } from "@/data/mockStartups";
import { Startup } from "@/types/startup";
import StartupCard from "@/components/StartupCard";
import StartupFilters from "@/components/StartupFilters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DirectoryViewProps {
  searchQuery: string;
  showFilters: boolean;
}

const DirectoryView = ({ searchQuery, showFilters }: DirectoryViewProps) => {
  const [startups, setStartups] = useState<Startup[]>(mockStartups);
  const [filteredStartups, setFilteredStartups] = useState<Startup[]>(mockStartups);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Get unique sectors for category tabs
  const sectors = Array.from(new Set(mockStartups.map(startup => startup.sector)));
  
  // Filter startups based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredStartups(startups);
      return;
    }

    const filtered = startups.filter((startup) =>
      startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    setFilteredStartups(filtered);
  }, [searchQuery, startups]);
  
  // Filter by active category
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
      {/* Filters panel */}
      {showFilters && (
        <div className="mt-4 mb-8">
          <StartupFilters startups={startups} setFilteredStartups={setFilteredStartups} />
        </div>
      )}
      
      {/* Category tabs */}
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
        
        <TabsContent value="all" className="mt-0">
          {renderStartupGrid(filteredStartups)}
        </TabsContent>
        
        {sectors.map(sector => (
          <TabsContent key={sector} value={sector} className="mt-0">
            {renderStartupGrid(filteredStartups)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

// Helper function to render the startup grid
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
