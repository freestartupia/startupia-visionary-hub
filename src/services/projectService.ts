
import { supabase } from '@/integrations/supabase/client';
import { CollaborativeProject } from '@/types/community';
import { mockProjects } from '@/data/mockCommunityData';

export const fetchProjects = async (): Promise<CollaborativeProject[]> => {
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
      // Transform the data to match the CollaborativeProject interface
      return data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        status: item.status as CollaborativeProject['status'],
        initiator_id: item.initiator_id,
        initiator_name: item.initiator_name,
        initiator_avatar: item.initiator_avatar,
        created_at: item.created_at,
        skills: item.skills,
        likes: item.likes,
        applications: item.applications,
        category: item.category
      }));
    }
    
    // Return mock data as fallback
    return mockProjects;
  } catch (error) {
    console.error('Error in fetchProjects:', error);
    return mockProjects;
  }
};

export const createProject = async (projectData: Partial<CollaborativeProject>): Promise<CollaborativeProject> => {
  try {
    const { data, error } = await supabase
      .from('collaborative_projects')
      .insert(projectData)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating project:', error);
      throw error;
    }
    
    return data as CollaborativeProject;
  } catch (error) {
    console.error('Error in createProject:', error);
    throw error;
  }
};
