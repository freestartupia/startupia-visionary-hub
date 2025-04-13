
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ResourceFormat, ResourceListing } from '@/types/community';
import { useAuth } from '@/contexts/AuthContext';
import { mockResources } from '@/data/mockCommunityData';
import ResourceFilters from './resource/ResourceFilters';
import ResourceCard from './resource/ResourceCard';
import LoadingState from './resource/LoadingState';
import ErrorState from './resource/ErrorState';
import EmptyResourcesState from './resource/EmptyResourcesState';
import ShareResourceModal from './resource/ShareResourceModal';
import { fetchResources } from '@/services/resourceListingService';

interface ResourcesLibraryProps {
  requireAuth?: boolean;
}

const ResourcesLibrary: React.FC<ResourcesLibraryProps> = ({ requireAuth = false }) => {
  const [selectedFormat, setSelectedFormat] = useState<ResourceFormat | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [resources, setResources] = useState<ResourceListing[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const formats: (ResourceFormat | 'all')[] = [
    'all', 'Vidéo', 'Article', 'E-book', 'Webinaire', 
    'Bootcamp', 'Cours', 'Podcast', 'Autre'
  ];
  
  useEffect(() => {
    const loadResources = async () => {
      setIsLoading(true);
      try {
        // Try to fetch from Supabase first
        const resourceData = await fetchResources();
        
        if (resourceData.length > 0) {
          setResources(resourceData);
        } else {
          // Fallback to mock data if no resources found
          setResources(mockResources);
        }
      } catch (error) {
        console.error("Error loading resources:", error);
        // Fallback to mock data on error
        setResources(mockResources);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      loadResources();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filtrer les ressources en fonction du format sélectionné et du terme de recherche
  const filteredResources = resources.filter(resource => {
    const matchesFormat = selectedFormat === 'all' || resource.format === selectedFormat;
    const matchesSearch = searchTerm === '' || 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFormat && matchesSearch;
  });
  
  const getInitials = (name: string | null): string => {
    if (!name) return "??"; // Protection contre les noms null ou undefined
    
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
    
    setIsModalOpen(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleResourceSuccess = (newResource: ResourceListing) => {
    // In a real application, we would refresh the data from Supabase
    // For now, we'll just add the new resource to our local state
    setResources([newResource, ...resources]);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <ResourceFilters
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        handleShareResource={handleShareResource}
        selectedFormat={selectedFormat}
        setSelectedFormat={setSelectedFormat}
        formats={formats}
      />
      
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <ResourceCard 
              key={resource.id} 
              resource={resource} 
              getInitials={getInitials} 
              formatDate={formatDate} 
            />
          ))}
        </div>
      ) : (
        <EmptyResourcesState handleShareResource={handleShareResource} />
      )}
      
      <ShareResourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleResourceSuccess}
        formats={formats}
      />
    </div>
  );
};

export default ResourcesLibrary;
