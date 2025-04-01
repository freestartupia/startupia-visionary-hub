
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SearchBar from '@/components/ecosystem/SearchBar';
import TopStartups from '@/components/ecosystem/TopStartups';
import NewLaunches from '@/components/ecosystem/NewLaunches';
import DirectoryView from '@/components/ecosystem/DirectoryView';
import MapView from '@/components/ecosystem/MapView';
import RadarView from '@/components/ecosystem/RadarView';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const AIEcosystem = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState('directory');
  const [showFilters, setShowFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState('newest');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleAddStartup = () => {
    // For now, just show a toast
    toast({
      title: "Fonctionnalité à venir",
      description: "L'ajout de startups sera disponible prochainement."
    });
  };

  return (
    <div className="min-h-screen bg-hero-pattern text-white">
      <SEO 
        title="Écosystème IA France – Cartographie des Startups & Outils IA"
        description="Découvrez l'écosystème de l'intelligence artificielle en France : startups IA, outils d'IA génératives, investissements et innovations technologiques sur une carte interactive."
      />
      
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-startupia-turquoise/30 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-startupia-turquoise/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      
      <main className="container mx-auto pt-24 pb-16 px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Écosystème <span className="gradient-text">IA</span> en France
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Explorez les startups, outils et acteurs qui façonnent le paysage de l'intelligence artificielle en France
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <Button onClick={() => setShowFilters(!showFilters)} variant="outline" className="space-x-2 border-startupia-turquoise text-startupia-turquoise hover:bg-startupia-turquoise/10">
            <Filter size={16} />
            <span>Filtres</span>
          </Button>
        </div>

        <div className="flex justify-between items-center mb-8">
          <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
            <TabsList className="inline-flex h-10 items-center justify-start space-x-1 rounded-md bg-black/20 p-1 text-white/80">
              <TabsTrigger value="directory" className="data-[state=active]:bg-startupia-turquoise/20">
                Annuaire
              </TabsTrigger>
              <TabsTrigger value="map" className="data-[state=active]:bg-startupia-turquoise/20">
                Carte
              </TabsTrigger>
              <TabsTrigger value="radar" className="data-[state=active]:bg-startupia-turquoise/20">
                Radar IA
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-[180px] bg-black/20 text-white/80">
              <SelectValue placeholder="Trier par..." />
            </SelectTrigger>
            <SelectContent className="bg-black border-white/20 text-white">
              <SelectItem value="newest">Plus récentes</SelectItem>
              <SelectItem value="impact">Impact IA</SelectItem>
              <SelectItem value="alphabetical">Alphabétique</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs value={activeView} onValueChange={setActiveView}>
          <TabsContent value="directory" className="mt-0">
            <DirectoryView searchQuery={searchQuery} showFilters={showFilters} />
          </TabsContent>
          
          <TabsContent value="map" className="mt-0">
            <MapView searchQuery={searchQuery} showFilters={showFilters} />
          </TabsContent>
          
          <TabsContent value="radar" className="mt-0">
            <RadarView searchQuery={searchQuery} showFilters={showFilters} />
          </TabsContent>
        </Tabs>

        <section className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Top Startups IA</h2>
            <Button variant="link" onClick={() => navigate('/rankings')} className="text-startupia-turquoise hover:text-startupia-turquoise/80">
              Voir le classement complet
            </Button>
          </div>

          <TopStartups searchQuery={searchQuery} showFilters={showFilters} sortOrder={sortOrder} />
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Nouveaux Lancements</h2>
            <Button variant="link" onClick={() => navigate('/tools')} className="text-startupia-turquoise hover:text-startupia-turquoise/80">
              Explorer tous les outils
            </Button>
          </div>

          <NewLaunches searchQuery={searchQuery} showFilters={showFilters} sortOrder={sortOrder} />
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AIEcosystem;
