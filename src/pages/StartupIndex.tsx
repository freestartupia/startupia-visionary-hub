
import React, { useState, useEffect } from "react";
import { Search, Filter, Star, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import StartupCard from "@/components/StartupCard";
import StartupFilters from "@/components/StartupFilters";
import { mockStartups } from "@/data/mockStartups";
import { Startup } from "@/types/startup";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";

const StartupIndex = () => {
  const [startups, setStartups] = useState<Startup[]>(mockStartups);
  const [filteredStartups, setFilteredStartups] = useState<Startup[]>(mockStartups);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredStartups(startups);
      return;
    }

    const filtered = startups.filter((startup) =>
      startup.name.toLowerCase().includes(query.toLowerCase()) ||
      startup.shortDescription.toLowerCase().includes(query.toLowerCase()) ||
      startup.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    
    setFilteredStartups(filtered);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      {/* Hero section */}
      <section className="py-12 md:py-20 pt-28 relative">
        <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
        <div className="absolute top-1/4 -left-40 w-96 h-96 bg-startupia-turquoise/30 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-startupia-turquoise/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              Startup Index IA Français
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Explorez l'écosystème des startups IA françaises avec des fiches enrichies, 
              des filtres avancés et découvrez l'innovation IA à la française.
            </p>
          </div>
          
          {/* Search and filter section */}
          <div className="max-w-4xl mx-auto mb-10">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                <Input
                  placeholder="Rechercher une startup..."
                  className="pl-10 bg-black/30 border border-startupia-turquoise/30 text-white"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                className="border-startupia-turquoise hover:bg-startupia-turquoise/20"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2" />
                Filtres
              </Button>
              <Button className="bg-startupia-turquoise hover:bg-startupia-turquoise/90">
                <Plus className="mr-2" />
                Proposer une startup
              </Button>
            </div>
            
            {/* Filters panel */}
            {showFilters && (
              <div className="mt-4">
                <StartupFilters startups={startups} setFilteredStartups={setFilteredStartups} />
              </div>
            )}
          </div>
          
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
      </section>
      
      <Footer />
    </div>
  );
};

export default StartupIndex;
