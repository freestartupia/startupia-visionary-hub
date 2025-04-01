
import React, { useState } from 'react';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DirectoryView from '@/components/ecosystem/DirectoryView';
import RadarView from '@/components/ecosystem/RadarView';
import MapView from '@/components/ecosystem/MapView';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';

const AIEcosystem = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('directory');

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="min-h-screen bg-hero-pattern text-white">
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-startupia-turquoise/30 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-startupia-turquoise/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      <Navbar />
      
      <main className="container mx-auto pt-28 pb-16 px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Explorer l'écosystème <span className="gradient-text">IA</span>
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Découvrez les startups, suivez les tendances et explorez l'écosystème de l'intelligence artificielle
          </p>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
            <Input
              type="text"
              placeholder="Rechercher par nom, secteur ou technologie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-black/20 border-startupia-turquoise/30 focus-visible:ring-startupia-turquoise/50"
            />
          </div>
          <Button
            variant="outline"
            className="border-startupia-turquoise text-white flex items-center"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2" size={16} />
            Filtres
          </Button>
        </div>

        {/* Tabs */}
        <Tabs 
          value={activeTab} 
          onValueChange={handleTabChange}
          className="max-w-7xl mx-auto"
        >
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="directory">Annuaire</TabsTrigger>
            <TabsTrigger value="radar">Radar & Tendances</TabsTrigger>
            <TabsTrigger value="map">Carte</TabsTrigger>
          </TabsList>
          
          <TabsContent value="directory" className="mt-0">
            <DirectoryView searchQuery={searchQuery} showFilters={showFilters} />
          </TabsContent>
          
          <TabsContent value="radar" className="mt-0">
            <RadarView searchQuery={searchQuery} showFilters={showFilters} />
          </TabsContent>
          
          <TabsContent value="map" className="mt-0">
            <MapView searchQuery={searchQuery} />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default AIEcosystem;
