
import React, { useState } from 'react';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DirectoryView from '@/components/ecosystem/DirectoryView';
import RadarView from '@/components/ecosystem/RadarView';
import MapView from '@/components/ecosystem/MapView';
import TopStartups from '@/components/ecosystem/TopStartups';
import NewLaunches from '@/components/ecosystem/NewLaunches';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, ArrowUpDown, ArrowDown, Rss } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

const AIEcosystem = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState('newest');

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
            Hub <span className="gradient-text">IA Français</span>
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            La référence des startups IA françaises, leurs innovations, leurs levées de fonds et leur impact sur l'écosystème
          </p>
        </div>

        {/* Search and filters toolbar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-5xl mx-auto">
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
          
          <div className="flex gap-2">
            <Select defaultValue={sortOrder} onValueChange={value => setSortOrder(value)}>
              <SelectTrigger className="bg-black/20 border-startupia-turquoise/30 w-[180px]">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="newest">Plus récent</SelectItem>
                  <SelectItem value="impact">Impact IA</SelectItem>
                  <SelectItem value="funding">Levées de fonds</SelectItem>
                  <SelectItem value="alphabetical">Alphabétique</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              className="border-startupia-turquoise text-white flex items-center"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-2" size={16} />
              Filtres
            </Button>

            <Button
              variant="ghost"
              className="text-white/70 hover:text-white hover:bg-startupia-turquoise/10"
            >
              <Rss size={18} className="mr-2" />
              Suivre
            </Button>
          </div>
        </div>

        {/* Top Startups Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Top Startups IA</h2>
            <Button variant="link" className="text-startupia-turquoise">
              Voir tout
            </Button>
          </div>
          <TopStartups searchQuery={searchQuery} showFilters={showFilters} sortOrder={sortOrder} />
        </section>

        {/* New Launches Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Nouveaux Lancements</h2>
            <Button variant="link" className="text-startupia-turquoise">
              Tous les lancements
            </Button>
          </div>
          <NewLaunches searchQuery={searchQuery} showFilters={showFilters} sortOrder={sortOrder} />
        </section>
        
        {/* Tabs for more detailed views */}
        <Tabs 
          defaultValue="directory"
          className="max-w-7xl mx-auto mt-12 pt-6 border-t border-startupia-turquoise/20"
        >
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-black/30 border border-startupia-turquoise/20">
            <TabsTrigger 
              value="directory" 
              className="data-[state=active]:bg-startupia-turquoise/20"
            >
              Annuaire Complet
            </TabsTrigger>
            <TabsTrigger 
              value="radar" 
              className="data-[state=active]:bg-startupia-turquoise/20"
            >
              Radar & Tendances
            </TabsTrigger>
            <TabsTrigger 
              value="map" 
              className="data-[state=active]:bg-startupia-turquoise/20"
            >
              Carte
            </TabsTrigger>
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
