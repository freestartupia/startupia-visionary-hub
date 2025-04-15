import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CollaborativeProject, ProjectStatus } from '@/types/community';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import ProposeProjectModal from './project/ProposeProjectModal';
import ProjectFilters from './project/ProjectFilters';
import ProjectList from './project/ProjectList';

// Créer un cache pour les projets
let projectsCache = {
  data: null as CollaborativeProject[] | null,
  timestamp: 0,
  ttl: 5 * 60 * 1000 // 5 minutes
};

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

  // Optimiser le chargement des projets avec mise en cache
  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      // Vérifier si le cache est valide
      const now = Date.now();
      if (projectsCache.data && (now - projectsCache.timestamp < projectsCache.ttl)) {
        console.log("Utilisation des données en cache pour les projets");
        setProjects(projectsCache.data);
        setIsLoading(false);
        return;
      }
      
      console.log("Chargement des projets depuis Supabase");
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
        
        // Mettre à jour le cache
        projectsCache.data = data as CollaborativeProject[];
        projectsCache.timestamp = now;
      } else {
        setProjects([]);
        console.log('No projects found in the database');
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setProjects([]);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    }
  }, []);
  
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);
  
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleLike = useCallback(async (projectId: string) => {
    if (requireAuth && !user) {
      toast.error("Vous devez être connecté pour aimer un projet");
      navigate('/auth');
      return;
    }

    try {
      // Mise à jour optimiste de l'interface
      const projectIndex = projects.findIndex(p => p.id === projectId);
      if (projectIndex === -1) return;

      const updatedProjects = [...projects];
      updatedProjects[projectIndex] = {
        ...updatedProjects[projectIndex],
        likes: (updatedProjects[projectIndex].likes || 0) + 1
      };

      setProjects(updatedProjects);
      
      // Invalider le cache
      projectsCache.data = null;
      projectsCache.timestamp = 0;
      
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
  }, [projects, requireAuth, user, navigate]);

  const handleContact = useCallback((projectId: string) => {
    if (requireAuth && !user) {
      toast.error("Vous devez être connecté pour contacter l'initiateur du projet");
      navigate('/auth');
      return;
    }
    
    toast.success("Fonctionnalité en développement - Contact initiateur");
  }, [requireAuth, user, navigate]);
  
  const handleProposeProject = useCallback(() => {
    if (requireAuth && !user) {
      toast.error("Vous devez être connecté pour proposer un projet");
      navigate('/auth');
      return;
    }
    
    setIsModalOpen(true);
  }, [requireAuth, user, navigate]);

  const handleProjectSuccess = useCallback((newProject: CollaborativeProject) => {
    // Mise à jour optimiste
    setProjects(prev => [newProject, ...prev]);
    
    // Invalider le cache
    projectsCache.data = null;
    projectsCache.timestamp = 0;
  }, []);
  
  const handleProjectDeleted = useCallback(() => {
    // Invalidate cache and fetch projects again
    projectsCache.data = null;
    projectsCache.timestamp = 0;
    fetchProjects();
  }, [fetchProjects]);
  
  const filteredProjects = useMemo(() => {
    return projects
      .filter(project => selectedStatus === 'all' || project.status === selectedStatus)
      .filter(project => {
        if (searchTerm === '') return true;
        
        const query = searchTerm.toLowerCase();
        return project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.skills?.some(skill => skill.toLowerCase().includes(query));
      });
  }, [projects, selectedStatus, searchTerm]);
  
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
        onProjectDeleted={handleProjectDeleted}
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

export default React.memo(CollaborativeProjects);
