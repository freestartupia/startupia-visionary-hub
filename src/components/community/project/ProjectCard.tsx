
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { CollaborativeProject } from '@/types/community';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import ProjectCardHeader from './card/ProjectCardHeader';
import ProjectCardContent from './card/ProjectCardContent';
import ProjectCardFooter from './card/ProjectCardFooter';
import ProjectDetailsDialog from './card/ProjectDetailsDialog';
import DeleteProjectDialog from './card/DeleteProjectDialog';
import DeleteButton from './card/DeleteButton';

interface ProjectCardProps {
  project: CollaborativeProject;
  onLike: (projectId: string) => void;
  onContact: (projectId: string) => void;
  onProjectDeleted?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onLike, onContact, onProjectDeleted }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();
  
  const isProjectCreator = user && project.initiator_id === user.id;

  const handleDelete = async () => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from('collaborative_projects')
        .delete()
        .eq('id', project.id);
        
      if (error) throw error;
      
      toast.success("Projet supprimé avec succès");
      if (onProjectDeleted) onProjectDeleted();
      
      setIsDialogOpen(false);
    } catch (err) {
      console.error('Erreur lors de la suppression du projet:', err);
      toast.error("Une erreur est survenue lors de la suppression du projet");
    } finally {
      setIsDeleting(false);
      setIsDeleteAlertOpen(false);
    }
  };

  return (
    <>
      <Card className="glass-card hover-scale transition-transform duration-300 relative">
        {isProjectCreator && (
          <DeleteButton 
            onClick={() => setIsDeleteAlertOpen(true)}
            disabled={isDeleting}
          />
        )}
        
        <ProjectCardHeader 
          title={project.title}
          status={project.status}
          category={project.category}
        />
        
        <ProjectCardContent 
          description={project.description}
          skills={project.skills}
        />
        
        <ProjectCardFooter 
          initiatorName={project.initiator_name}
          initiatorAvatar={project.initiator_avatar}
          createdAt={project.created_at}
          likes={project.likes}
          applications={project.applications}
          onLike={() => onLike(project.id)}
          onContact={() => onContact(project.id)}
          onViewDetails={() => setIsDialogOpen(true)}
        />
      </Card>

      <DeleteProjectDialog 
        isOpen={isDeleteAlertOpen}
        onClose={() => setIsDeleteAlertOpen(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />

      <ProjectDetailsDialog 
        project={project}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onContact={() => onContact(project.id)}
        isProjectCreator={isProjectCreator}
        onDeleteClick={() => {
          setIsDialogOpen(false);
          setTimeout(() => setIsDeleteAlertOpen(true), 100);
        }}
      />
    </>
  );
};

export default ProjectCard;
