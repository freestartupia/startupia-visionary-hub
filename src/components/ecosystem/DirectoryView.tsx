
import React, { useState, useEffect } from "react";
import { mockStartups } from "@/data/mockStartups";
import { Startup } from "@/types/startup";
import { usePagination } from "@/hooks/usePagination";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ErrorMessage from "@/components/ui/error-message";
import { CalendarDays, ThumbsUp, TrendingUp, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface DirectoryViewProps {
  searchQuery: string;
  showFilters: boolean;
}

const DirectoryView = ({ searchQuery, showFilters }: DirectoryViewProps) => {
  const [startups, setStartups] = useState<Startup[]>(mockStartups);
  const [filteredStartups, setFilteredStartups] = useState<Startup[]>(mockStartups);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSortTab, setActiveSortTab] = useState<string>("tous");
  const { user } = useAuth();
  const navigate = useNavigate();

  // Get unique sectors for category tabs
  const sectors = Array.from(new Set(mockStartups.map(startup => startup.sector)));
  
  // Set up pagination
  const pagination = usePagination({ 
    initialPageSize: 10, 
    totalItems: filteredStartups.length 
  });
  
  // Simulate async loading
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    const timer = setTimeout(() => {
      try {
        setIsLoading(false);
      } catch (err) {
        setError("Une erreur est survenue lors du chargement des startups.");
        setIsLoading(false);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filter startups based on search query
  useEffect(() => {
    setIsLoading(true);
    
    setTimeout(() => {
      try {
        let filtered = [...startups];
        
        if (searchQuery.trim()) {
          filtered = startups.filter((startup) =>
            startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            startup.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
            startup.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
          );
        }
        
        if (activeCategory !== "all") {
          filtered = filtered.filter((startup) => 
            startup.sector === activeCategory
          );
        }
        
        // Apply sorting based on active tab
        if (activeSortTab === "lancement") {
          // Sort by most recent launch date - mock this by reversing the array
          filtered = [...filtered].reverse();
        } else if (activeSortTab === "recents") {
          // Sort by recently added - mock this with another order
          filtered.sort((a, b) => a.name.localeCompare(b.name));
        }
        
        setFilteredStartups(filtered);
        pagination.setTotal(filtered.length);
        setIsLoading(false);
      } catch (err) {
        setError("Une erreur est survenue lors de la filtration des startups.");
        setIsLoading(false);
      }
    }, 300);
  }, [searchQuery, activeCategory, startups, activeSortTab]);
  
  // Get paginated startups
  const paginatedStartups = filteredStartups.slice(
    pagination.pageItems.skip,
    pagination.pageItems.skip + pagination.pageItems.take
  );
  
  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    
    setTimeout(() => {
      setStartups(mockStartups);
      setFilteredStartups(mockStartups);
      setIsLoading(false);
    }, 500);
  };

  const handleVote = (e: React.MouseEvent, startupName: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error("Vous devez être connecté pour voter");
      navigate('/auth');
      return;
    }
    
    toast.success(`Vous avez upvoté ${startupName}`);
  };

  const handleCategoryChange = (value: string) => {
    setActiveCategory(value);
  };

  // Category options
  const categoryOptions = [
    { value: "all", label: "Toutes les catégories" },
    ...sectors.map(sector => ({ value: sector, label: sector }))
  ];

  // Technology options
  const techOptions = [
    { value: "all", label: "Toutes les technologies" },
    { value: "llm", label: "LLM" },
    { value: "api", label: "API Interne" },
    { value: "hugging_face", label: "Hugging Face" },
    { value: "llama", label: "Llama" }
  ];
  
  // Stage options
  const stageOptions = [
    { value: "all", label: "Tous les stades" },
    { value: "idee", label: "Idée" },
    { value: "mvp", label: "MVP" },
    { value: "beta", label: "Beta" },
    { value: "launched", label: "Lancé" }
  ];

  if (error) {
    return <ErrorMessage message={error} onRetry={handleRetry} className="my-12" />;
  }

  return (
    <div className="mb-16">
      {/* Category filtering section */}
      {showFilters && (
        <div className="mb-8 space-y-4 bg-black/20 border border-gray-800 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-white text-sm mb-2 font-medium">Catégorie</p>
              <Select defaultValue="all" onValueChange={handleCategoryChange}>
                <SelectTrigger className="bg-black/30 border-gray-700 text-white w-full">
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 text-white border-gray-700">
                  {categoryOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <p className="text-white text-sm mb-2 font-medium">Tech IA utilisée</p>
              <Select defaultValue="all">
                <SelectTrigger className="bg-black/30 border-gray-700 text-white w-full">
                  <SelectValue placeholder="Toutes les technologies" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 text-white border-gray-700">
                  {techOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <p className="text-white text-sm mb-2 font-medium">Stade</p>
              <Select defaultValue="all">
                <SelectTrigger className="bg-black/30 border-gray-700 text-white w-full">
                  <SelectValue placeholder="Tous les stades" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 text-white border-gray-700">
                  {stageOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
      
      {/* View tabs */}
      <div className="flex flex-wrap items-center space-x-2 mb-8">
        <button 
          className={`${activeSortTab === 'tous' ? 'bg-gray-800/50' : 'bg-transparent hover:bg-gray-800/50'} px-4 py-2 rounded-md flex items-center space-x-2`}
          onClick={() => setActiveSortTab('tous')}
        >
          <TrendingUp size={16} className={activeSortTab === 'tous' ? "text-yellow-300" : "text-white/70"} />
          <span className={activeSortTab === 'tous' ? "text-white" : "text-white/70"}>Tous</span>
        </button>
        
        <button 
          className={`${activeSortTab === 'lancement' ? 'bg-gray-800/50' : 'bg-transparent hover:bg-gray-800/50'} px-4 py-2 rounded-md flex items-center space-x-2`}
          onClick={() => setActiveSortTab('lancement')}
        >
          <CalendarDays size={16} className={activeSortTab === 'lancement' ? "text-yellow-300" : "text-white/70"} />
          <span className={activeSortTab === 'lancement' ? "text-white" : "text-white/70"}>Lancement du jour</span>
        </button>
        
        <button 
          className={`${activeSortTab === 'recents' ? 'bg-gray-800/50' : 'bg-transparent hover:bg-gray-800/50'} px-4 py-2 rounded-md flex items-center space-x-2`}
          onClick={() => setActiveSortTab('recents')}
        >
          <Filter size={16} className={activeSortTab === 'recents' ? "text-yellow-300" : "text-white/70"} />
          <span className={activeSortTab === 'recents' ? "text-white" : "text-white/70"}>Récents</span>
        </button>
      </div>
      
      <div className="mt-0">
        {isLoading ? (
          <div className="py-32 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : paginatedStartups.length > 0 ? (
          <div className="space-y-6">
            {paginatedStartups.map((startup) => (
              <div key={startup.id} 
                   className="bg-black/20 border border-gray-800 rounded-lg p-4 flex items-start md:items-center justify-between hover:border-gray-700 transition-all"
                   onClick={() => navigate(`/startup/${startup.id}`)}
                   style={{ cursor: 'pointer' }}
              >
                <div className="flex items-center space-x-4">
                  <div className={`bg-black/40 text-yellow-400 w-12 h-12 rounded-md flex items-center justify-center font-bold text-xl ${startup.logoUrl ? 'p-0 overflow-hidden' : ''}`}>
                    {startup.logoUrl ? (
                      <img src={startup.logoUrl} alt={`${startup.name} logo`} className="w-full h-full object-cover" />
                    ) : (
                      startup.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{startup.name}</h3>
                    <p className="text-gray-400 text-sm">{startup.shortDescription}</p>
                    <div className="flex flex-wrap mt-2 gap-2">
                      {startup.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className={`${idx === 0 ? 'bg-yellow-900/20 text-yellow-400' : 'bg-gray-800 text-gray-300'} text-xs px-2 py-1 rounded`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-1 text-gray-400 mb-2 hover:bg-gray-800/50"
                    onClick={(e) => handleVote(e, startup.name)}
                  >
                    <span>{Math.floor(Math.random() * 100) + 30}</span>
                    <ThumbsUp size={16} />
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="bg-black/50 hover:bg-black/80 border border-gray-700 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/startup/${startup.id}`);
                    }}
                  >
                    Découvrir
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-white/60 text-lg">Aucune startup ne correspond à votre recherche</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectoryView;
