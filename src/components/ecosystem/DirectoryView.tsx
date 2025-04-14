
import React, { useState, useEffect } from "react";
import { Startup, Sector } from "@/types/startup";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import StartupList from "./startup/StartupList";
import { useStartups } from "@/hooks/useStartups";
import StartupLoadingSkeleton from "./startup/StartupLoadingSkeleton";
import NoStartupsFound from "./startup/NoStartupsFound";

interface DirectoryViewProps {
  searchQuery: string;
  showFilters: boolean;
}

const DirectoryView = ({ searchQuery, showFilters }: DirectoryViewProps) => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const { startups, filteredStartups, sectors, isLoading, setFilteredStartups } = useStartups(searchQuery, activeCategory);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {showFilters && (
        <div className="mt-4 mb-8">
          {/* Placeholder for filters */}
        </div>
      )}
      
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
        
        {isLoading ? (
          <StartupLoadingSkeleton />
        ) : (
          <>
            <TabsContent value="all" className="mt-0">
              {filteredStartups.length === 0 ? (
                <NoStartupsFound />
              ) : (
                <StartupList startups={filteredStartups} />
              )}
            </TabsContent>
            
            {sectors.map(sector => (
              <TabsContent key={sector} value={sector} className="mt-0">
                {filteredStartups.length === 0 ? (
                  <NoStartupsFound />
                ) : (
                  <StartupList startups={filteredStartups} />
                )}
              </TabsContent>
            ))}
          </>
        )}
      </Tabs>
    </div>
  );
};

export default DirectoryView;
