
import React, { useState, useEffect, Suspense, lazy } from "react";
import { mockStartups } from "@/data/mockStartups";
import { Startup } from "@/types/startup";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePagination } from "@/hooks/usePagination";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ErrorMessage from "@/components/ui/error-message";

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

  if (error) {
    return <ErrorMessage message={error} onRetry={handleRetry} className="my-12" />;
  }

  return (
    <div className="mb-16">
      {/* Filters panel */}
      {showFilters && (
        <div className="mt-4 mb-8">
          <Suspense fallback={<LoadingSpinner size="sm" className="py-4" />}>
            <StartupFilters startups={startups} setFilteredStartups={setFilteredStartups} />
          </Suspense>
        </div>
      )}
      
      {/* Category tabs */}
      <Tabs 
        value={activeCategory} 
        onValueChange={(value) => {
          setActiveCategory(value);
          pagination.goToPage(1); // Reset to first page when changing category
        }}
        className="mb-8"
      >
        <TabsList className="inline-flex h-10 items-center justify-start space-x-1 overflow-x-auto w-full pb-1 mb-2">
          <TabsTrigger value="all" className="data-[state=active]:bg-startupia-turquoise/20">
            Tous
          </TabsTrigger>
          {sectors.map(sector => (
            <TabsTrigger 
              key={sector} 
              value={sector} 
              className="data-[state=active]:bg-startupia-turquoise/20 whitespace-nowrap"
            >
              {sector}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <div className="mb-6 text-white/70 text-sm">
          {filteredStartups.length} startup{filteredStartups.length !== 1 ? 's' : ''} trouvée{filteredStartups.length !== 1 ? 's' : ''}
        </div>
        
        <div className="mt-0">
          {isLoading ? (
            <div className="py-32">
              <LoadingSpinner size="lg" />
            </div>
          ) : paginatedStartups.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedStartups.map((startup) => (
                  <Suspense key={startup.id} fallback={<div className="aspect-square bg-black/20 animate-pulse rounded-lg"></div>}>
                    <StartupCard startup={startup} />
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
      </Tabs>
    </div>
  );
};

export default DirectoryView;
