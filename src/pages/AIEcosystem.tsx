import React, { useState } from 'react';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import { mockStartups } from '@/data/mockStartups';
import StartupCard from '@/components/StartupCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, TrendingUp, Rocket, Clock, BadgePlus } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import DirectoryView from '@/components/ecosystem/DirectoryView';
import SEO from '@/components/SEO';

const AIEcosystem = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState('trending');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'directory'
  const { user } = useAuth();
  const navigate = useNavigate();

  // Get all unique sectors from startups
  const categories = Array.from(new Set(mockStartups.map(startup => startup.sector)));
  
  // Get all unique AI tools
  const aiTools = Array.from(new Set(mockStartups.flatMap(startup => startup.aiTools)));

  // Filter and sort startups based on search, category, and sort order
  const filterStartups = () => {
    let filtered = [...mockStartups];
    
    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((startup) =>
        startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        startup.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        startup.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(startup => startup.sector === selectedCategory);
    }
    
    // Sort startups
    switch (sortOrder) {
      case 'trending':
        filtered.sort((a, b) => b.aiImpactScore - a.aiImpactScore);
        break;
      case 'newest':
        filtered = filtered.reverse();
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'votes':
        // Using aiImpactScore as a proxy for votes until we implement real voting
        filtered.sort((a, b) => b.aiImpactScore - a.aiImpactScore);
        break;
    }
    
    return filtered;
  };

  const filteredStartups = filterStartups();

  const handleAddStartup = () => {
    if (!user) {
      toast.error("Vous devez être connecté pour ajouter une startup");
      navigate('/auth');
      return;
    }
    
    toast.info("Cette fonctionnalité sera bientôt disponible");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO 
        title="StartupIA.fr – Le Hub des Startups & Outils IA en France"
        description="Découvrez les meilleures startups IA françaises, les outils d'intelligence artificielle du moment, et connectez-vous à une communauté active d'innovateurs. Rejoignez le hub de l'IA en France !"
      />
      
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-startupia-turquoise/30 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-startupia-turquoise/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      <Navbar />
      
      <main className="container mx-auto pt-28 pb-16 px-4 relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Hub IA Français</span>
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Explorez les meilleures startups IA françaises, votez pour vos préférées et suivez les derniers lancements
          </p>
        </div>

        {/* Search and filters bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-5xl mx-auto">
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
          
          <div className="flex gap-2 flex-wrap">
            <Select defaultValue={sortOrder} onValueChange={value => setSortOrder(value)}>
              <SelectTrigger className="bg-black/20 border-startupia-turquoise/30 min-w-[130px]">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
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
              className="border-startupia-turquoise text-white flex items-center whitespace-nowrap"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-2" size={16} />
              Filtres
            </Button>

            <Button
              variant="default"
              className="bg-startupia-turquoise hover:bg-startupia-turquoise/90 text-black whitespace-nowrap"
              onClick={handleAddStartup}
            >
              <BadgePlus className="mr-2" size={16} />
              Ajouter un projet
            </Button>

            <Button
              variant="outline"
              className="border-startupia-turquoise/30 text-white ml-auto md:ml-0"
              onClick={() => setViewMode(viewMode === 'grid' ? 'directory' : 'grid')}
            >
              {viewMode === 'grid' ? 'Vue détaillée' : 'Vue grille'}
            </Button>
          </div>
        </div>

        {/* Advanced filters panel */}
        {showFilters && (
          <Card className="p-4 mb-6 bg-black/30 border border-startupia-turquoise/30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="mb-2 font-medium">Catégorie</h3>
                <Select defaultValue={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-black/20 border-startupia-turquoise/30">
                    <SelectValue placeholder="Toutes les catégories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <h3 className="mb-2 font-medium">Tech IA utilisée</h3>
                <Select defaultValue="all">
                  <SelectTrigger className="bg-black/20 border-startupia-turquoise/30">
                    <SelectValue placeholder="Toutes les technologies" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les technologies</SelectItem>
                    {aiTools.map((tool) => (
                      <SelectItem key={tool} value={tool}>{tool}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <h3 className="mb-2 font-medium">Stade</h3>
                <Select defaultValue="all">
                  <SelectTrigger className="bg-black/20 border-startupia-turquoise/30">
                    <SelectValue placeholder="Tous les stades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les stades</SelectItem>
                    <SelectItem value="mvp">MVP</SelectItem>
                    <SelectItem value="seed">Seed</SelectItem>
                    <SelectItem value="series-a">Série A</SelectItem>
                    <SelectItem value="series-b">Série B+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        )}
        
        {/* Tabs for different views */}
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="bg-black/30 border border-startupia-turquoise/20">
            <TabsTrigger value="all" className="data-[state=active]:bg-startupia-turquoise/20">
              <TrendingUp className="mr-2" size={16} />
              Tous
            </TabsTrigger>
            <TabsTrigger value="featured" className="data-[state=active]:bg-startupia-turquoise/20">
              <Rocket className="mr-2" size={16} />
              Lancement du jour
            </TabsTrigger>
            <TabsTrigger value="recent" className="data-[state=active]:bg-startupia-turquoise/20">
              <Clock className="mr-2" size={16} />
              Récents
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            {viewMode === 'directory' ? (
              <DirectoryView searchQuery={searchQuery} showFilters={false} />
            ) : (
              <>
                {filteredStartups.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredStartups.map((startup) => (
                      <StartupCard key={startup.id} startup={startup} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <p className="text-white/70 text-xl">Aucune startup ne correspond à votre recherche</p>
                  </div>
                )}
              </>
            )}
          </TabsContent>
          
          <TabsContent value="featured" className="mt-6">
            {viewMode === 'directory' ? (
              <DirectoryView searchQuery="" showFilters={false} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredStartups.filter(s => s.aiImpactScore >= 4).map((startup) => (
                  <StartupCard key={startup.id} startup={startup} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="recent" className="mt-6">
            {viewMode === 'directory' ? (
              <DirectoryView searchQuery="" showFilters={false} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredStartups.slice(0, 4).map((startup) => (
                  <StartupCard key={startup.id} startup={startup} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default AIEcosystem;
