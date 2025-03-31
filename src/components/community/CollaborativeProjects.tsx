
import React, { useState } from 'react';
import { Search, Filter, Heart, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CollaborativeProject, ProjectStatus } from '@/types/community';
import { mockProjects } from '@/data/mockCommunityData';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface CollaborativeProjectsProps {
  requireAuth?: boolean;
}

const CollaborativeProjects: React.FC<CollaborativeProjectsProps> = ({ requireAuth = false }) => {
  const [projects, setProjects] = useState<CollaborativeProject[]>(mockProjects);
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | 'all'>('all');
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const statuses: (ProjectStatus | 'all')[] = [
    'all', 'Idée', 'En cours', 'Recherche de collaborateurs', 'MVP', 'Lancé'
  ];
  
  const filteredProjects = selectedStatus === 'all' 
    ? projects 
    : projects.filter(project => project.status === selectedStatus);
    
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
  
  const getBadgeColorForStatus = (status: ProjectStatus) => {
    switch(status) {
      case 'Idée': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'En cours': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Recherche de collaborateurs': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'MVP': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'Lancé': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      default: return '';
    }
  };

  const handleProposeProject = () => {
    if (requireAuth && !user) {
      toast.error("Vous devez être connecté pour proposer un projet");
      navigate('/auth');
      return;
    }
    
    toast.success("Fonctionnalité en développement");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un projet..."
            className="pl-10"
          />
        </div>
        <Button className="flex items-center gap-2" onClick={handleProposeProject}>
          Proposer un projet
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {statuses.map((status) => (
          <Badge 
            key={status} 
            variant={selectedStatus === status ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedStatus(status)}
          >
            {status === 'all' ? 'Tous' : status}
          </Badge>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <Card key={project.id} className="glass-card hover-scale transition-transform duration-300">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge className={getBadgeColorForStatus(project.status)}>
                    {project.status}
                  </Badge>
                  <Badge variant="outline">{project.category}</Badge>
                </div>
                <h3 className="text-xl font-semibold">{project.title}</h3>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 mb-4">{project.description}</p>
                <div className="mb-4">
                  <p className="text-sm font-semibold mb-1">Compétences recherchées :</p>
                  <div className="flex flex-wrap gap-1">
                    {project.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 border-t border-white/10 pt-4">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={project.initiatorAvatar} alt={project.initiatorName} />
                      <AvatarFallback>{getInitials(project.initiatorName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="text-sm font-medium">{project.initiatorName}</span>
                      <p className="text-xs text-white/60">{formatDate(project.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-white/60">
                      <Heart className="h-4 w-4 mr-1" />
                      <span className="text-sm">{project.likes}</span>
                    </div>
                    <div className="flex items-center text-white/60">
                      <Users className="h-4 w-4 mr-1" />
                      <span className="text-sm">{project.applications}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 w-full">
                  <Button variant="outline" className="flex-1">
                    En savoir plus
                  </Button>
                  <Button className="flex-1">
                    Contacter
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 col-span-full">
            <p className="text-white/60">Aucun projet trouvé pour ce statut.</p>
            <Button variant="outline" className="mt-4">
              Proposer un projet
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollaborativeProjects;
