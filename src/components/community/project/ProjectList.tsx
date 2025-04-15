
import React from 'react';
import { CollaborativeProject } from '@/types/community';
import ProjectCard from './ProjectCard';

interface ProjectListProps {
  projects: CollaborativeProject[];
  onLike: (projectId: string) => void;
  onContact: (projectId: string) => void;
  onProposeProject: () => void;
  onProjectDeleted?: () => void;  // New callback for when a project is deleted
}

const ProjectList = ({ projects, onLike, onContact, onProposeProject, onProjectDeleted }: ProjectListProps) => {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-4">Aucun projet pour le moment</h3>
        <p className="text-white/60 mb-8">Soyez le premier à proposer un projet collaboratif !</p>
        <button
          onClick={onProposeProject}
          className="px-6 py-3 bg-startupia-turquoise text-white rounded-md hover:bg-startupia-turquoise/90 transition-colors"
        >
          Proposer un projet
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onLike={onLike}
          onContact={onContact}
          onProjectDeleted={onProjectDeleted}
        />
      ))}
    </div>
  );
};

export default ProjectList;
