
import React, { useState } from 'react';
import { Heart, Users } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { CollaborativeProject, ProjectStatus } from '@/types/community';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface ProjectCardProps {
  project: CollaborativeProject;
  onLike: (projectId: string) => void;
  onContact: (projectId: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onLike, onContact }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
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

  const truncateDescription = (text: string) => {
    if (text.length <= 120) return text;
    return text.slice(0, 120) + '...';
  };

  return (
    <>
      <Card className="glass-card hover-scale transition-transform duration-300">
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
          <div className="text-white/80 mb-4">
            {truncateDescription(project.description)}
          </div>
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
                <AvatarImage src={project.initiator_avatar} alt={project.initiator_name} />
                <AvatarFallback>{getInitials(project.initiator_name)}</AvatarFallback>
              </Avatar>
              <div>
                <span className="text-sm font-medium">{project.initiator_name}</span>
                <p className="text-xs text-white/60">{formatDate(project.created_at)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                className="flex items-center text-white/60 hover:text-white transition-colors"
                onClick={() => onLike(project.id)}
              >
                <Heart className="h-4 w-4 mr-1" />
                <span className="text-sm">{project.likes || 0}</span>
              </button>
              <div className="flex items-center text-white/60">
                <Users className="h-4 w-4 mr-1" />
                <span className="text-sm">{project.applications}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 w-full">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setIsDialogOpen(true)}
            >
              En savoir plus
            </Button>
            <Button 
              className="flex-1"
              onClick={() => onContact(project.id)}
            >
              Contacter
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getBadgeColorForStatus(project.status)}>
                {project.status}
              </Badge>
              <Badge variant="outline">{project.category}</Badge>
            </div>
            <DialogTitle className="text-2xl">{project.title}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 my-4">
            <div>
              <h4 className="text-sm font-semibold mb-2">Description du projet</h4>
              <p className="text-sm">{project.description}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-2">Compétences recherchées</h4>
              <div className="flex flex-wrap gap-1">
                {project.skills.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-3 pt-4 border-t">
              <Avatar className="h-10 w-10">
                <AvatarImage src={project.initiator_avatar} alt={project.initiator_name} />
                <AvatarFallback>{getInitials(project.initiator_name)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{project.initiator_name}</p>
                <p className="text-xs text-muted-foreground">Projet créé le {formatDate(project.created_at)}</p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Fermer
            </Button>
            <Button onClick={() => {
              onContact(project.id);
              setIsDialogOpen(false);
            }}>
              Contacter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectCard;
