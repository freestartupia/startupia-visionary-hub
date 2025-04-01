import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StartupFilters from '@/components/StartupFilters';
import StartupCard from '@/components/StartupCard';
import { Startup } from '@/types/startup';
import { mockStartups } from '@/data/mockStartups';
import Footer from '@/components/Footer';
import { Search, Filter, Plus, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import SEO from '@/components/SEO';

const StartupIndex = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStartups, setFilteredStartups] = useState<Startup[]>(mockStartups);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const categories = Array.from(new Set(mockStartups.map(startup => startup.sector)));

  useEffect(() => {
    const filtered = mockStartups.filter(startup =>
      startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredStartups(filtered);
  }, [searchQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleAddStartup = () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour ajouter une startup.",
      });
      navigate('/auth');
      return;
    }
    navigate('/startup/new');
  };

  return (
    <div className="min-h-screen bg-hero-pattern text-white">
      <SEO 
        title="Annuaire des Startups IA Françaises – Directory StartupIA.fr"
        description="Explorez le plus grand annuaire des startups d'intelligence artificielle en France : recherchez par secteur, technologie ou stade de développement et découvrez les innovations IA françaises."
      />
      
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-startupia-turquoise/30 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-startupia-turquoise/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      <div className="container mx-auto pt-24 pb-16 px-4 relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Startups <span className="text-startupia-turquoise">IA</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Découvrez les startups qui façonnent l'avenir de l'intelligence artificielle en France
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="w-full md:w-1/3">
            <Input
              type="text"
              placeholder="Rechercher une startup..."
              value={searchQuery}
              onChange={handleSearch}
              className="bg-black/30 border-none text-white placeholder:text-white/60 rounded-md shadow-none focus-visible:ring-startupia-turquoise focus-visible:ring-2"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="bg-black/30 border-startupia-turquoise text-startupia-turquoise hover:bg-startupia-turquoise/10"
              onClick={handleToggleFilters}
            >
              <Filter className="mr-2" size={16} />
              Filtres
            </Button>
            <Button
              className="bg-startupia-turquoise text-black hover:bg-startupia-light-turquoise transition-all"
              onClick={handleAddStartup}
            >
              <Plus className="mr-2" size={16} />
              Ajouter
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="mb-8">
            <StartupFilters startups={mockStartups} setFilteredStartups={setFilteredStartups} />
          </div>
        )}

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="inline-flex h-10 items-center justify-start space-x-1 rounded-md bg-black/20 p-1 mb-4">
            <TabsTrigger value="all" className="data-[state=active]:bg-startupia-turquoise/20">
              Toutes
            </TabsTrigger>
            {categories.map(category => (
              <TabsTrigger key={category} value={category} className="data-[state=active]:bg-startupia-turquoise/20">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="all" className="mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStartups.map(startup => (
                <StartupCard key={startup.id} startup={startup} />
              ))}
            </div>
          </TabsContent>
          {categories.map(category => (
            <TabsContent key={category} value={category} className="mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStartups.filter(startup => startup.sector === category).map(startup => (
                  <StartupCard key={startup.id} startup={startup} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default StartupIndex;
