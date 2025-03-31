
import React from 'react';
import { CofounderProfile } from '@/types/cofounders';
import ProfileCard from '@/components/ProfileCard';

interface ProjectsListProps {
  projects: CofounderProfile[];
  requireAuth?: boolean;
  onMatchRequest?: (profileId: string) => void;
}

const ProjectsList = ({ projects, requireAuth = false, onMatchRequest }: ProjectsListProps) => {
  const handleMatch = (profileId: string) => {
    if (onMatchRequest) {
      onMatchRequest(profileId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Projets en recherche d'associés</h2>
        <p className="text-white/70">
          Découvrez les projets IA à la recherche de co-fondateurs et rejoignez une startup prometteuse
        </p>
      </div>
      
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProfileCard 
              key={project.id} 
              profile={project}
              onMatch={() => handleMatch(project.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass-card">
          <p className="text-white/70 text-lg">Aucun projet disponible pour le moment</p>
        </div>
      )}
    </div>
  );
};

export default ProjectsList;
