
import React from 'react';
import { CofounderProfile } from '@/types/cofounders';
import { Button } from '@/components/ui/button';
import { Users, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import AuthRequired from '@/components/AuthRequired';

interface ProjectsListProps {
  projects: CofounderProfile[];
  requireAuth?: boolean;
}

const ProjectsList: React.FC<ProjectsListProps> = ({ projects, requireAuth = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleApply = (projectId: string) => {
    if (requireAuth && !user) {
      toast.error("Vous devez être connecté pour postuler à un projet");
      navigate('/auth');
      return;
    }
    
    // In a real app, this would send an application to the project owner
    toast.success("Votre candidature a été envoyée !");
  };

  return (
    <div className="space-y-8">
      {projects.map((project) => (
        <div key={project.id} className="glass-card p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-bold mb-1">{project.projectName}</h3>
              <p className="text-white/60">
                <span className="text-startupia-turquoise">Secteur:</span> {project.sector} • 
                <span className="ml-2 text-startupia-turquoise">Stade:</span> {project.projectStage}
              </p>
            </div>
            {project.hasAIBadge && (
              <div className="bg-startupia-gold/20 text-startupia-gold px-3 py-1 rounded-full flex items-center">
                <Star size={16} className="mr-1" />
                Projet IA
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <h4 className="font-semibold text-white/80 mb-1">Pitch</h4>
            <p>{project.pitch}</p>
          </div>
          
          <div className="mb-4">
            <h4 className="font-semibold text-white/80 mb-1">Vision</h4>
            <p>{project.vision}</p>
          </div>
          
          <div className="mb-6">
            <h4 className="font-semibold text-white/80 mb-2">Profils recherchés</h4>
            <div className="flex flex-wrap gap-2">
              {project.seekingRoles.map((role, index) => (
                <span 
                  key={index} 
                  className="bg-white/10 px-3 py-1 rounded-full text-sm"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 items-center justify-between border-t border-white/10 pt-4">
            <div className="flex items-center">
              <img 
                src={project.photoUrl || '/placeholder.svg'} 
                alt={project.name} 
                className="w-10 h-10 rounded-full mr-3 border border-white/20"
              />
              <div>
                <p className="font-medium">{project.name}</p>
                <p className="text-sm text-white/60">{project.role}</p>
              </div>
            </div>
            
            <AuthRequired forActiveParticipation={requireAuth}>
              <Button 
                onClick={() => handleApply(project.id)} 
                className="bg-startupia-turquoise hover:bg-startupia-turquoise/90"
              >
                <Users className="mr-2" size={16} />
                Rejoindre le projet
              </Button>
            </AuthRequired>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectsList;
