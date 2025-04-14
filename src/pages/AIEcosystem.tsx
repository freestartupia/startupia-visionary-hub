
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, TrendingUp, BadgePlus, ThumbsUp, Calendar, Clock, Rocket } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import DirectoryView from '@/components/ecosystem/DirectoryView';
import SubmitStartupModal from '@/components/ecosystem/SubmitStartupModal';
import SEO from '@/components/SEO';
import { Startup } from '@/types/startup';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

const AIEcosystem = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState('trending');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('directory');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const { user } = useAuth();

  const handleAddStartup = () => {
    setShowSubmitModal(true);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO 
        title="StartupIA.fr – Le Hub des Startups & Outils IA en France"
        description="Découvrez les meilleures startups IA françaises, les outils d'intelligence artificielle du moment, et connectez-vous à une communauté active d'innovateurs. Rejoignez le hub de l'IA en France !"
      />
      
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-startupia-turquoise/30 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-startupia-turquoise/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      <Navbar />
      
      <main className="container mx-auto pt-16 pb-16 px-4 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-startupia-turquoise">
            Hub IA Français
          </h1>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            Explorez les meilleures startups IA françaises, votez pour vos préférées et suivez les derniers lancements
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6 max-w-4xl mx-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
            <Input
              type="text"
              placeholder="Rechercher une startup ou un produit IA..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-black/20 border-startupia-turquoise/30 focus-visible:ring-startupia-turquoise/50"
            />
          </div>
          
          <div className="flex gap-2">
            <Select defaultValue={sortOrder} onValueChange={value => setSortOrder(value)}>
              <SelectTrigger className="bg-black/20 border-startupia-turquoise/30 w-36">
                <TrendingUp className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Tendance" />
              </SelectTrigger>
              <SelectContent className="bg-black border-startupia-turquoise/30">
                <SelectGroup>
                  <SelectItem value="trending">🔥 Tendance</SelectItem>
                  <SelectItem value="votes">👍 Plus votés</SelectItem>
                  <SelectItem value="newest">⏱️ Récent</SelectItem>
                  <SelectItem value="alphabetical">🔤 Alphabétique</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              className="border-startupia-turquoise/30 bg-black text-white"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              <span className="ml-1">Filtres</span>
            </Button>

            <Button
              variant="default"
              className="bg-startupia-turquoise hover:bg-startupia-turquoise/90 text-black"
              onClick={handleAddStartup}
            >
              <BadgePlus className="h-4 w-4" />
              <span className="ml-1">Ajouter un projet</span>
            </Button>
            
            <Button
              variant="outline"
              className={`border-startupia-turquoise/30 bg-black text-white ${viewMode === 'directory' ? 'bg-startupia-turquoise/10' : ''}`}
            >
              Vue détaillée
            </Button>
          </div>
        </div>

        {showFilters && (
          <Card className="p-4 mb-6 bg-black/30 border border-startupia-turquoise/30 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="mb-2 font-medium">Catégorie</h3>
                <Select defaultValue={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-black/20 border-startupia-turquoise/30">
                    <SelectValue placeholder="Toutes les catégories" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-startupia-turquoise/30">
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        )}
        
        <Tabs defaultValue="all" className="mb-6 max-w-4xl mx-auto">
          <TabsList className="bg-black border border-startupia-turquoise/20 w-auto inline-flex space-x-1">
            <TabsTrigger value="all" className="data-[state=active]:bg-startupia-turquoise/20 data-[state=active]:text-white">
              <TrendingUp className="mr-2 h-4 w-4" />
              Tous
            </TabsTrigger>
            <TabsTrigger value="featured" className="data-[state=active]:bg-startupia-turquoise/20 data-[state=active]:text-white">
              <Rocket className="mr-2 h-4 w-4" />
              Lancement du jour
            </TabsTrigger>
            <TabsTrigger value="recent" className="data-[state=active]:bg-startupia-turquoise/20 data-[state=active]:text-white">
              <Clock className="mr-2 h-4 w-4" />
              Récents
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <DirectoryView searchQuery={searchQuery} showFilters={false} />
          </TabsContent>
          
          <TabsContent value="featured" className="mt-6">
            <DirectoryView searchQuery="" showFilters={false} />
          </TabsContent>
          
          <TabsContent value="recent" className="mt-6">
            <DirectoryView searchQuery="" showFilters={false} />
          </TabsContent>
        </Tabs>
      </main>

      <SubmitStartupModal 
        open={showSubmitModal} 
        onOpenChange={setShowSubmitModal}
        onSubmitSuccess={() => {
          toast.success("Votre projet a été ajouté avec succès!");
        }}
      />

      <Footer />
    </div>
  );
};

export default AIEcosystem;
