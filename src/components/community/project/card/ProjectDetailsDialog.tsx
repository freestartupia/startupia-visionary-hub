
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { CollaborativeProject, ProjectStatus } from '@/types/community';

interface ProjectDetailsDialogProps {
  project: CollaborativeProject;
  isOpen: boolean;
  onClose: () => void;
  onContact: () => void;
  isProjectCreator: boolean;
  onDeleteClick: () => void;
}

const ProjectDetailsDialog: React.FC<ProjectDetailsDialogProps> = ({
  project,
  isOpen,
  onClose,
  onContact,
  isProjectCreator,
  onDeleteClick
}) => {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
          
          {isProjectCreator && (
            <div className="flex gap-2 pt-4 border-t">
              <Button 
                variant="outline"
                className="flex-1 bg-red-500/10 hover:bg-red-500/20 border-red-500/30 text-red-300"
                onClick={onDeleteClick}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          <Button onClick={() => {
            onContact();
            onClose();
          }}>
            Contacter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailsDialog;
