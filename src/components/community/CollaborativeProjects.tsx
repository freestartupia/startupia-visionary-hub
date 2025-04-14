
import React, { useState, useEffect } from 'react';
import { CollaborativeProject, ProjectStatus } from '@/types/community';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import ProposeProjectModal from './project/ProposeProjectModal';
import ProjectFilters from './project/ProjectFilters';
import ProjectList from './project/ProjectList';

interface CollaborativeProjectsProps {
  requireAuth?: boolean;
}

const CollaborativeProjects: React.FC<CollaborativeProjectsProps> = ({ requireAuth = false }) => {
  const [projects, setProjects] = useState<CollaborativeProject[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const statuses: (ProjectStatus | 'all')[] = [
    'all', 'Idée', 'En cours', 'Recherche de collaborateurs', 'MVP', 'Lancé'
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('collaborative_projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching projects:', error);
        throw error;
      }
      
      if (data && data.length > 0) {
        setProjects(data as CollaborativeProject[]);
      } else {
        setProjects([]);
        console.log('No projects found in the database');
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleLike = async (projectId: string) => {
    if (requireAuth && !user) {
      toast.error("Vous devez être connecté pour aimer un projet");
      navigate('/auth');
      return;
    }

    try {
      const projectIndex = projects.findIndex(p => p.id === projectId);
      if (projectIndex === -1) return;

      const updatedProjects = [...projects];
      updatedProjects[projectIndex] = {
        ...updatedProjects[projectIndex],
        likes: (updatedProjects[projectIndex].likes || 0) + 1
      };

      setProjects(updatedProjects);
      
      try {
        const { error } = await supabase
          .from('collaborative_projects')
          .update({ likes: updatedProjects[projectIndex].likes })
          .eq('id', projectId);
          
        if (error) throw error;
        toast.success("Vous avez aimé ce projet");
      } catch (err) {
        console.log('Could not update in database, but UI is updated');
        toast.success("Vous avez aimé ce projet");
      }
    } catch (err) {
      console.error('Error liking project:', err);
      toast.error("Une erreur est survenue");
    }
  };

  const handleContact = (projectId: string) => {
    if (requireAuth && !user) {
      toast.error("Vous devez être connecté pour contacter l'initiateur du projet");
      navigate('/auth');
      return;
    }
    
    toast.success("Fonctionnalité en développement - Contact initiateur");
  };
  
  const handleProposeProject = () => {
    if (requireAuth && !user) {
      toast.error("Vous devez être connecté pour proposer un projet");
      navigate('/auth');
      return;
    }
    
    setIsModalOpen(true);
  };

  const handleProjectSuccess = (newProject: CollaborativeProject) => {
    setProjects([newProject, ...projects]);
  };
  
  const filteredProjects = projects
    .filter(project => selectedStatus === 'all' || project.status === selectedStatus)
    .filter(project => 
      searchTerm === '' || 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="w-12 h-12 border-t-2 border-startupia-turquoise border-solid rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProjectFilters 
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        statuses={statuses}
        onProposeProject={handleProposeProject}
      />
      
      <ProjectList 
        projects={filteredProjects}
        onLike={handleLike}
        onContact={handleContact}
        onProposeProject={handleProposeProject}
      />
      
      <ProposeProjectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleProjectSuccess}
        statuses={statuses}
      />
    </div>
  );
};

export default CollaborativeProjects;
