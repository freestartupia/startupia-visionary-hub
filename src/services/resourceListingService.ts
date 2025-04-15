
import { supabase } from '@/integrations/supabase/client';
import { ResourceListing } from '@/types/community';
import { mockResources } from '@/data/mockCommunityData';

export const fetchResources = async (): Promise<ResourceListing[]> => {
  try {
    const { data, error } = await supabase
      .from('resource_listings')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching resources:', error);
      throw error;
    }
    
    if (data && data.length > 0) {
      // Transform DB data to match our interface
      return data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        format: item.format as ResourceListing['format'],
        access_link: item.access_link,
        url: item.access_link, // For compatibility
        authorId: item.author_id || '',
        author_id: item.author_id,
        authorName: item.author_name || '',
        author_name: item.author_name,
        authorAvatar: item.author_avatar,
        author_avatar: item.author_avatar,
        createdAt: item.created_at,
        created_at: item.created_at,
        upvotes: item.votes || 0,
        votes: item.votes,
        views: 0, // Default value if not available
        is_paid: item.is_paid,
        price: item.price,
        target_audience: item.target_audience,
        community_validated: item.community_validated
      }));
    }
    
    return mockResources;
  } catch (error) {
    console.error('Error in fetchResources:', error);
    return mockResources;
  }
};

export const createResource = async (resourceData: Partial<ResourceListing>): Promise<ResourceListing> => {
  try {
    const { data, error } = await supabase
      .from('resource_listings')
      .insert(resourceData)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating resource:', error);
      throw error;
    }
    
    return data as ResourceListing;
  } catch (error) {
    console.error('Error in createResource:', error);
    throw error;
  }
};

// Add the missing functions that are imported in components
export const addResource = createResource;

export const deleteResource = async (resourceId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('resource_listings')
      .delete()
      .eq('id', resourceId);
      
    if (error) {
      console.error('Error deleting resource:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteResource:', error);
    return false;
  }
};
