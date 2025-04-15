
import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ResourceFormat, ResourceListing } from '@/types/community';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { mockResourceListings } from '@/data/mockCommunityData';
import ResourceCard from './resource/ResourceCard';
import ResourceFilters from './resource/ResourceFilters';
import EmptyResourcesState from './resource/EmptyResourcesState';
import ShareResourceModal from './resource/ShareResourceModal';
import { fetchResources } from '@/services/resourceListingService';

interface ResourcesLibraryProps {
  requireAuth?: boolean;
}

const ResourcesLibrary: React.FC<ResourcesLibraryProps> = ({ requireAuth = false }) => {
  const [resources, setResources] = useState<ResourceListing[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<ResourceFormat | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaidOnly, setIsPaidOnly] = useState<boolean | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const formats: (ResourceFormat | 'all')[] = [
    'all', 'Vidéo', 'Article', 'E-book', 'Webinaire', 'Bootcamp', 'Cours', 'Podcast', 'Autre'
  ];
  
  useEffect(() => {
    const loadResources = async () => {
      try {
        setIsLoading(true);
        // Try to fetch from API first
        const resourceData = await fetchResources();
        
        if (resourceData.length > 0) {
          setResources(resourceData);
        } else {
          console.log("No resources found in the database, using mock data");
          setResources(mockResourceListings);
        }
      } catch (error) {
        console.error("Error loading resources:", error);
        // Fallback to mock data
        setResources(mockResourceListings);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }
    };

    loadResources();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredResources = resources
    .filter(resource => selectedFormat === 'all' || resource.format === selectedFormat)
    .filter(resource => 
      (isPaidOnly === null) || 
      (isPaidOnly === true && resource.is_paid) || 
      (isPaidOnly === false && !resource.is_paid)
    )
    .filter(resource => 
      searchTerm === '' || 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.target_audience.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleShareResource = () => {
    if (requireAuth && !user) {
      toast.error("Vous devez être connecté pour partager une ressource");
      navigate('/auth');
      return;
    }
    
    setIsModalOpen(true);
  };

  const handleResourceSuccess = (newResource: ResourceListing) => {
    setResources([newResource, ...resources]);
    toast.success("Votre ressource a été ajoutée avec succès!");
  };

  const handleResourceDeleted = (resourceId: string) => {
    // Remove the deleted resource from our local state
    setResources(resources.filter(resource => resource.id !== resourceId));
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <Skeleton className="h-10 w-full md:w-1/2" />
          <Skeleton className="h-10 w-full md:w-48" />
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-8 w-24" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ResourceFilters 
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        selectedFormat={selectedFormat}
        setSelectedFormat={setSelectedFormat}
        handleShareResource={handleShareResource}
        formats={formats}
        isPaidOnly={isPaidOnly}
        setIsPaidOnly={setIsPaidOnly}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.length > 0 ? (
          filteredResources.map((resource) => (
            <ResourceCard 
              key={resource.id} 
              resource={resource}
              onDelete={handleResourceDeleted} 
            />
          ))
        ) : (
          <EmptyResourcesState handleShareResource={handleShareResource} />
        )}
      </div>

      <ShareResourceModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleResourceSuccess}
        formats={formats.filter(f => f !== 'all') as ResourceFormat[]}
      />
    </div>
  );
};

export default ResourcesLibrary;
