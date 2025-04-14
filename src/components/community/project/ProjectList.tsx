
import React from 'react';
import { Button } from '@/components/ui/button';
import { CollaborativeProject } from '@/types/community';
import ProjectCard from './ProjectCard';

interface ProjectListProps {
  projects: CollaborativeProject[];
  onLike: (projectId: string) => void;
  onContact: (projectId: string) => void;
  onProposeProject: () => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ 
  projects, 
  onLike, 
  onContact, 
  onProposeProject 
}) => {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12 col-span-full">
        <p className="text-white/60">Aucun projet trouvé pour ce statut.</p>
        <Button variant="outline" className="mt-4" onClick={onProposeProject}>
          Proposer un projet
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projects.map((project) => (
        <ProjectCard 
          key={project.id} 
          project={project} 
          onLike={onLike} 
          onContact={onContact} 
        />
      ))}
    </div>
  );
};

export default ProjectList;
