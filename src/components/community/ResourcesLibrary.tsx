
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ResourceFormat, ResourceListing } from '@/types/community';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import ResourceCard from './resource/ResourceCard';
import ResourceFilters from './resource/ResourceFilters';
import EmptyResourcesState from './resource/EmptyResourcesState';
import ShareResourceModal from './resource/ShareResourceModal';
import { fetchResources } from '@/services/resourceListingService';

interface ResourcesLibraryProps {
  requireAuth?: boolean;
}

// Mettre en place un cache local pour les ressources
let resourcesCache = {
  data: null as ResourceListing[] | null,
  timestamp: 0,
  ttl: 5 * 60 * 1000 // 5 minutes de TTL
};

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
  
  // Optimiser le chargement des ressources avec mise en cache
  const loadResources = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Vérifier si le cache est valide
      const now = Date.now();
      if (resourcesCache.data && (now - resourcesCache.timestamp < resourcesCache.ttl)) {
        console.log("Utilisation des données en cache pour les ressources");
        setResources(resourcesCache.data);
        setIsLoading(false);
        return;
      }
      
      // Sinon charger depuis l'API
      console.log("Chargement des ressources depuis Supabase");
      const resourceData = await fetchResources();
      
      if (resourceData.length > 0) {
        setResources(resourceData);
        
        // Mettre à jour le cache
        resourcesCache.data = resourceData;
        resourcesCache.timestamp = now;
      } else {
        console.log("No resources found in the database");
        setResources([]);
      }
    } catch (error) {
      console.error("Error loading resources:", error);
      setResources([]);
    } finally {
      // Réduire le temps de chargement simulé pour améliorer la réactivité
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    }
  }, []);

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);
  
  // Utiliser useMemo pour filtrer les ressources seulement quand nécessaire
  const filteredResources = useMemo(() => {
    return resources
      .filter(resource => selectedFormat === 'all' || resource.format === selectedFormat)
      .filter(resource => 
        (isPaidOnly === null) || 
        (isPaidOnly === true && resource.is_paid) || 
        (isPaidOnly === false && !resource.is_paid)
      )
      .filter(resource => {
        if (searchTerm === '') return true;
        
        const query = searchTerm.toLowerCase();
        return resource.title.toLowerCase().includes(query) ||
          resource.description.toLowerCase().includes(query) ||
          resource.target_audience.toLowerCase().includes(query);
      });
  }, [resources, selectedFormat, isPaidOnly, searchTerm]);

  const handleShareResource = useCallback(() => {
    if (requireAuth && !user) {
      toast.error("Vous devez être connecté pour partager une ressource");
      navigate('/auth');
      return;
    }
    
    setIsModalOpen(true);
  }, [requireAuth, user, navigate]);

  const handleResourceSuccess = useCallback((newResource: ResourceListing) => {
    // Mise à jour optimiste
    setResources(prev => [newResource, ...prev]);
    
    // Invalider le cache
    resourcesCache.data = null;
    resourcesCache.timestamp = 0;
    
    toast.success("Votre ressource a été ajoutée avec succès!");
  }, []);

  const handleResourceDeleted = useCallback((resourceId: string) => {
    // Mise à jour optimiste
    setResources(prev => prev.filter(resource => resource.id !== resourceId));
    
    // Invalider le cache
    resourcesCache.data = null;
    resourcesCache.timestamp = 0;
  }, []);

  // Optimiser les états de chargement avec des squelettes préfabriqués
  const loadingSkeletons = useMemo(() => (
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
  ), []);

  if (isLoading) {
    return loadingSkeletons;
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

// Utiliser React.memo pour éviter les rendus inutiles
export default React.memo(ResourcesLibrary);
