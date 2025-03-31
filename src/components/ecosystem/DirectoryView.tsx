
import React, { useState, useEffect } from "react";
import { mockStartups } from "@/data/mockStartups";
import { Startup } from "@/types/startup";
import StartupCard from "@/components/StartupCard";
import StartupFilters from "@/components/StartupFilters";

interface DirectoryViewProps {
  searchQuery: string;
  showFilters: boolean;
}

const DirectoryView = ({ searchQuery, showFilters }: DirectoryViewProps) => {
  const [startups, setStartups] = useState<Startup[]>(mockStartups);
  const [filteredStartups, setFilteredStartups] = useState<Startup[]>(mockStartups);

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

  return (
    <div className="mb-16">
      {/* Filters panel */}
      {showFilters && (
        <div className="mt-4 mb-8">
          <StartupFilters startups={startups} setFilteredStartups={setFilteredStartups} />
        </div>
      )}
      
      {/* Results count */}
      <div className="mb-6 text-white/70 text-sm">
        {filteredStartups.length} startup{filteredStartups.length !== 1 ? 's' : ''} trouvée{filteredStartups.length !== 1 ? 's' : ''}
      </div>
      
      {/* Startups grid */}
      {filteredStartups.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStartups.map((startup) => (
            <StartupCard key={startup.id} startup={startup} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-white/60 text-lg">Aucune startup ne correspond à votre recherche</p>
        </div>
      )}
    </div>
  );
};

export default DirectoryView;
