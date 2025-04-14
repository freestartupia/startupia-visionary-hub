
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ResourceFormat, ResourceListing } from '@/types/community';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import ResourceFilters from './resource/ResourceFilters';
import ResourceCard from './resource/ResourceCard';
import LoadingState from './resource/LoadingState';
import ErrorState from './resource/ErrorState';
import EmptyResourcesState from './resource/EmptyResourcesState';

interface ResourcesLibraryProps {
  requireAuth?: boolean;
}

const ResourcesLibrary: React.FC<ResourcesLibraryProps> = ({ requireAuth = false }) => {
  const [selectedFormat, setSelectedFormat] = useState<ResourceFormat | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const formats: (ResourceFormat | 'all')[] = [
    'all', 'Vidéo', 'Article', 'E-book', 'Webinaire', 
    'Bootcamp', 'Cours', 'Podcast', 'Autre'
  ];
  
  // Utiliser React Query pour récupérer les formations depuis Supabase
  const { data: resources = [], isLoading, error } = useQuery({
    queryKey: ['resources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resource_listings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erreur lors de la récupération des formations:', error);
        throw error;
      }
      
      return data as ResourceListing[];
    }
  });
  
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
    
    toast.success("Fonctionnalité en développement");
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState />;
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
    </div>
  );
};

export default ResourcesLibrary;
