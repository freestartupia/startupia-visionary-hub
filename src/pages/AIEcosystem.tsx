
import React, { useState } from 'react';
import { Layout, LayoutHeader, LayoutBody } from '@/components/ui/layout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Search, Filter, MapPin, List, BarChart3 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DirectoryView from '@/components/ecosystem/DirectoryView';
import RadarView from '@/components/ecosystem/RadarView';
import MapView from '@/components/ecosystem/MapView';

const AIEcosystem = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
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
              Explorer l'écosystème IA
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Découvrez toutes les facettes de l'écosystème IA français à travers différentes perspectives : 
              annuaire détaillé, tendances du marché, et cartographie.
            </p>
          </div>
          
          {/* Search and filter section */}
          <div className="max-w-4xl mx-auto mb-10">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                <Input
                  placeholder="Rechercher une startup IA..."
                  className="pl-10 bg-black/30 border border-startupia-turquoise/30 text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                <Search className="mr-2" />
                Rechercher
              </Button>
            </div>
          </div>
          
          {/* View selector tabs */}
          <Tabs defaultValue="directory" className="w-full">
            <TabsList className="w-full flex justify-center mb-8 bg-black/30 border border-startupia-turquoise/20">
              <TabsTrigger value="directory" className="flex items-center data-[state=active]:bg-startupia-turquoise/20 flex-1 md:flex-none">
                <List className="mr-2 h-4 w-4" />
                Annuaire
              </TabsTrigger>
              <TabsTrigger value="radar" className="flex items-center data-[state=active]:bg-startupia-turquoise/20 flex-1 md:flex-none">
                <BarChart3 className="mr-2 h-4 w-4" />
                Radar & Tendances
              </TabsTrigger>
              <TabsTrigger value="map" className="flex items-center data-[state=active]:bg-startupia-turquoise/20 flex-1 md:flex-none">
                <MapPin className="mr-2 h-4 w-4" />
                Carte
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="directory">
              <DirectoryView searchQuery={searchQuery} showFilters={showFilters} />
            </TabsContent>
            
            <TabsContent value="radar">
              <RadarView searchQuery={searchQuery} showFilters={showFilters} />
            </TabsContent>
            
            <TabsContent value="map">
              <MapView searchQuery={searchQuery} />
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default AIEcosystem;
