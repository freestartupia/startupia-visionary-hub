
import React, { useState, useEffect } from 'react';
import { Search, Filter, ExternalLink, ThumbsUp, Users, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ResourceFormat, ResourceListing } from '@/types/community';
import { mockResources } from '@/data/mockCommunityData';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { usePagination } from '@/hooks/usePagination';
import LoadingSpinner from '@/components/ui/loading-spinner';
import ErrorMessage from '@/components/ui/error-message';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

interface ResourcesLibraryProps {
  requireAuth?: boolean;
}

const ResourcesLibrary: React.FC<ResourcesLibraryProps> = ({ requireAuth = false }) => {
  const [resources, setResources] = useState<ResourceListing[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<ResourceFormat | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isVoting, setIsVoting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const formats: (ResourceFormat | 'all')[] = [
    'all', 'Vidéo', 'Article', 'E-book', 'Webinaire', 
    'Bootcamp', 'Cours', 'Podcast', 'Autre'
  ];
  
  // Setup pagination
  const pagination = usePagination({ initialPageSize: 9 });
  
  // Load resources
  useEffect(() => {
    fetchResources();
  }, []);
  
  // Filter resources when format or search changes
  useEffect(() => {
    if (isLoading) return;
    
    const filtered = mockResources.filter(resource => {
      // Filter by format
      const formatMatch = selectedFormat === 'all' || resource.format === selectedFormat;
      
      // Filter by search
      const searchMatch = !searchTerm || 
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.targetAudience.toLowerCase().includes(searchTerm.toLowerCase());
        
      return formatMatch && searchMatch;
    });
    
    setResources(filtered);
    pagination.setTotal(filtered.length);
    pagination.goToPage(1); // Reset to first page when filter changes
  }, [selectedFormat, searchTerm]);
  
  const fetchResources = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setResources(mockResources);
      pagination.setTotal(mockResources.length);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError("Impossible de charger les ressources");
      setIsLoading(false);
    }
  };
  
  // Get paginated resources
  const paginatedResources = resources.slice(
    pagination.pageItems.skip,
    pagination.pageItems.skip + pagination.pageItems.take
  );
    
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  };

  const handleShareResource = () => {
    if (requireAuth && !user) {
      toast.error("Vous devez être connecté pour partager une ressource");
      navigate('/auth');
      return;
    }
    
    toast.success("Fonctionnalité en développement");
  };
  
  const handleVoteResource = async (resourceId: string) => {
    if (requireAuth && !user) {
      toast.error("Vous devez être connecté pour voter");
      navigate('/auth');
      return;
    }
    
    setIsVoting(resourceId);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update resources with new vote count
      setResources(prevResources => 
        prevResources.map(resource => 
          resource.id === resourceId ? { ...resource, votes: resource.votes + 1 } : resource
        )
      );
      
      toast.success("Vote enregistré !");
    } catch (err) {
      console.error('Error voting for resource:', err);
      toast.error("Erreur lors du vote");
    } finally {
      setIsVoting(null);
    }
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une formation ou ressource..."
            className="pl-10"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <Button className="flex items-center gap-2" onClick={handleShareResource}>
          Partager une ressource
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {formats.map((format) => (
          <Badge 
            key={format} 
            variant={selectedFormat === format ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedFormat(format)}
          >
            {format === 'all' ? 'Tous' : format}
          </Badge>
        ))}
      </div>
      
      {isLoading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <ErrorMessage 
          message={error} 
          onRetry={fetchResources}
        />
      ) : paginatedResources.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedResources.map((resource) => (
              <Card 
                key={resource.id} 
                className="glass-card hover-scale transition-transform duration-300 flex flex-col h-full"
              >
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge>{resource.format}</Badge>
                    <div className="flex items-center space-x-2">
                      {resource.isPaid ? (
                        <Badge variant="outline" className="text-yellow-300 border-yellow-300">
                          {resource.price}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-green-400 border-green-400">
                          Gratuit
                        </Badge>
                      )}
                      {resource.communityValidated && (
                        <Badge variant="secondary" className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          Validé
                        </Badge>
                      )}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold">{resource.title}</h3>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-white/80 mb-4">{resource.description}</p>
                  <div className="text-white/80">
                    <strong>Public cible:</strong> {resource.targetAudience}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={resource.authorAvatar} alt={resource.authorName} />
                        <AvatarFallback>{getInitials(resource.authorName)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="text-sm font-medium">{resource.authorName}</span>
                        <p className="text-xs text-white/60">{formatDate(resource.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button 
                        className="flex items-center gap-1 text-white/60 hover:text-white disabled:opacity-50"
                        onClick={() => handleVoteResource(resource.id)}
                        disabled={isVoting === resource.id}
                      >
                        {isVoting === resource.id ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <ThumbsUp className="h-4 w-4 mr-1" />
                        )}
                        <span className="text-sm">{resource.votes}</span>
                      </button>
                    </div>
                  </div>
                  <Button className="w-full" asChild>
                    <a href={resource.accessLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Accéder à la ressource
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-12 flex justify-center">
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
        <div className="text-center py-12 col-span-full">
          <p className="text-white/60">Aucune ressource trouvée pour ce format.</p>
          <Button variant="outline" className="mt-4" onClick={handleShareResource}>
            Partager une ressource
          </Button>
        </div>
      )}
    </div>
  );
};

export default ResourcesLibrary;
