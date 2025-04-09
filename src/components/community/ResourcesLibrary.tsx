
import React, { useState, useEffect } from 'react';
import { Search, Filter, ExternalLink, ThumbsUp, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ResourceFormat, ResourceListing } from '@/types/community';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

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
        .order('votes', { ascending: false });
      
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
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-startupia-turquoise"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-white/60">Une erreur est survenue lors du chargement des ressources.</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </div>
      ) : filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="glass-card hover-scale transition-transform duration-300 flex flex-col h-full">
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
                    <ThumbsUp className="h-4 w-4 mr-1 text-white/60" />
                    <span className="text-sm text-white/60">{resource.votes}</span>
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
      ) : (
        <div className="text-center py-12 col-span-full">
          <p className="text-white/60">Aucune ressource trouvée pour ce format ou cette recherche.</p>
          <Button variant="outline" className="mt-4" onClick={handleShareResource}>
            Partager une ressource
          </Button>
        </div>
      )}
    </div>
  );
};

export default ResourcesLibrary;
