
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter } from 'lucide-react';
import SearchBar from '@/components/ecosystem/SearchBar';
import RadarView from '@/components/ecosystem/RadarView';
import SEO from '@/components/SEO';

const RadarIA = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState('newest');
  const { toast } = useToast();
  
  return (
    <div className="min-h-screen bg-hero-pattern text-white">
      <SEO 
        title="Radar IA – Tendances, Mouvements et Prévisions de l'Intelligence Artificielle"
        description="Suivez les tendances émergentes et l'évolution du marché de l'IA en France : mouvements clés, levées de fonds, acquisitions et prédictions sur l'avenir de l'intelligence artificielle."
      />
      
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-startupia-turquoise/30 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-startupia-turquoise/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      
      <main className="container mx-auto pt-24 pb-16 px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Radar <span className="gradient-text">IA</span> France
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Suivez les tendances, mouvements et prédictions du marché de l'intelligence artificielle
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <Button onClick={() => setShowFilters(!showFilters)} variant="outline" className="space-x-2 border-startupia-turquoise text-startupia-turquoise hover:bg-startupia-turquoise/10">
            <Filter size={16} />
            <span>Filtres</span>
          </Button>
        </div>

        <div className="mb-8">
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

        <RadarView searchQuery={searchQuery} showFilters={showFilters} />
      </main>
      
      <Footer />
    </div>
  );
};

export default RadarIA;
