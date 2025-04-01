
import React, { useState, useEffect, Suspense, lazy } from "react";
import { mockStartups } from "@/data/mockStartups";
import { Startup } from "@/types/startup";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePagination } from "@/hooks/usePagination";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ErrorMessage from "@/components/ui/error-message";
import { Filter, TrendingUp, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Lazy load components
const StartupCard = lazy(() => import("@/components/StartupCard"));
const StartupFilters = lazy(() => import("@/components/StartupFilters"));

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
  const [viewMode, setViewMode] = useState<string>("grid");
  const [sortBy, setSortBy] = useState<string>("trending");

  // Get unique sectors for category tabs
  const sectors = Array.from(new Set(mockStartups.map(startup => startup.sector)));
  
  // Set up pagination
  const pagination = usePagination({ 
    initialPageSize: 12, 
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
        
        setFilteredStartups(filtered);
        pagination.setTotal(filtered.length);
        setIsLoading(false);
      } catch (err) {
        setError("Une erreur est survenue lors de la filtration des startups.");
        setIsLoading(false);
      }
    }, 300);
  }, [searchQuery, activeCategory, startups]);
  
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

  // Category tabs shown in the screenshot
  const categoryOptions = [
    { value: "all", label: "Toutes les catégories" },
    ...sectors.map(sector => ({ value: sector, label: sector }))
  ];

  // Technology tabs shown in the screenshot
  const techOptions = [
    { value: "all", label: "Toutes les technologies" },
    { value: "llm", label: "LLM" },
    { value: "api", label: "API Interne" },
    { value: "hugging_face", label: "Hugging Face" } 
  ];
  
  // Stage tabs shown in the screenshot
  const stageOptions = [
    { value: "all", label: "Tous les stades" },
    { value: "idee", label: "Idée" },
    { value: "mvp", label: "MVP" },
    { value: "beta", label: "Beta" },
    { value: "launched", label: "Lancé" }
  ];

  // Sort options shown in the screenshot
  const sortOptions = [
    { value: "trending", label: "🔥 Tendance" },
    { value: "latest", label: "Lancement du jour" },
    { value: "recent", label: "Récents" }
  ];

  if (error) {
    return <ErrorMessage message={error} onRetry={handleRetry} className="my-12" />;
  }

  return (
    <div className="mb-16">
      {/* Category filtering section as shown in the screenshot */}
      <div className="mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-white text-sm mb-2">Catégorie</p>
            <Select defaultValue="all">
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
            <p className="text-white text-sm mb-2">Tech IA utilisée</p>
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
            <p className="text-white text-sm mb-2">Stade</p>
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
      
      {/* View tabs as shown in the screenshot */}
      <div className="flex items-center space-x-2 mb-8">
        <button className="bg-gray-800/50 hover:bg-gray-700/50 px-4 py-2 rounded-md flex items-center space-x-2">
          <TrendingUp size={16} className="text-yellow-500" />
          <span className="text-white text-sm">Tous</span>
        </button>
        
        <button className="bg-transparent hover:bg-gray-800/50 px-4 py-2 rounded-md flex items-center space-x-2">
          <CalendarDays size={16} className="text-white/70" />
          <span className="text-white/70 text-sm">Lancement du jour</span>
        </button>
        
        <button className="bg-transparent hover:bg-gray-800/50 px-4 py-2 rounded-md flex items-center space-x-2">
          <Filter size={16} className="text-white/70" />
          <span className="text-white/70 text-sm">Récents</span>
        </button>
      </div>
      
      <div className="mt-0">
        {isLoading ? (
          <div className="py-32">
            <LoadingSpinner size="lg" />
          </div>
        ) : paginatedStartups.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6">
              {paginatedStartups.map((startup) => (
                <Suspense key={startup.id} fallback={<div className="aspect-square bg-black/20 animate-pulse rounded-lg"></div>}>
                  <div className="bg-black/20 border border-gray-800 rounded-lg p-4 flex items-center justify-between hover:border-gray-700 transition-all">
                    <div className="flex items-center space-x-4">
                      <div className="bg-yellow-900/30 text-yellow-600 w-12 h-12 rounded-md flex items-center justify-center font-bold text-xl">
                        {startup.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{startup.name}</h3>
                        <p className="text-gray-400 text-sm">{startup.shortDescription}</p>
                        <div className="flex mt-2 space-x-2">
                          <span className="bg-yellow-900/20 text-yellow-600 text-xs px-2 py-1 rounded">
                            Autre
                          </span>
                          <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded">
                            API Interne
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center space-x-1 text-gray-400">
                        <span>94</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12"></path><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"></path></svg>
                      </div>
                      <button className="mt-2 bg-gray-800 text-white px-3 py-1 text-sm rounded hover:bg-gray-700 transition-colors">
                        Découvrir
                      </button>
                    </div>
                  </div>
                </Suspense>
              ))}
            </div>
            
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-12">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => pagination.prevPage()} 
                        className={pagination.currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(5, pagination.totalPages) }).map((_, i) => {
                      let pageNumber: number;
                      
                      // Logic for determining which page numbers to show
                      if (pagination.totalPages <= 5 || pagination.currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (pagination.currentPage >= pagination.totalPages - 2) {
                        pageNumber = pagination.totalPages - 4 + i;
                      } else {
                        pageNumber = pagination.currentPage - 2 + i;
                      }
                      
                      if (pageNumber > 0 && pageNumber <= pagination.totalPages) {
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink 
                              isActive={pagination.currentPage === pageNumber}
                              onClick={() => pagination.goToPage(pageNumber)}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}
                    
                    {pagination.totalPages > 5 && pagination.currentPage < pagination.totalPages - 2 && (
                      <>
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink 
                            onClick={() => pagination.goToPage(pagination.totalPages)}
                          >
                            {pagination.totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      </>
                    )}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => pagination.nextPage()}
                        className={pagination.currentPage >= pagination.totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
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
