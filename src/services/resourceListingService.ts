
import { supabase } from '@/integrations/supabase/client';
import { ResourceListing } from '@/types/community';

// Helper function to convert database types to our app types
export const mapDbResourceToResourceListing = (dbResource: any): ResourceListing => {
  return {
    id: dbResource.id,
    title: dbResource.title,
    description: dbResource.description,
    format: dbResource.format,
    target_audience: dbResource.target_audience,
    access_link: dbResource.access_link,
    is_paid: dbResource.is_paid || false,
    price: dbResource.price,
    author_id: dbResource.author_id,
    author_name: dbResource.author_name,
    author_avatar: dbResource.author_avatar,
    created_at: dbResource.created_at,
    community_validated: dbResource.community_validated || false,
    votes: dbResource.votes || 0
  };
};

// Helper function to convert our app types to database types
export const mapResourceListingToDb = (resource: ResourceListing) => {
  return {
    id: resource.id,
    title: resource.title,
    description: resource.description,
    format: resource.format,
    target_audience: resource.target_audience,
    access_link: resource.access_link,
    is_paid: resource.is_paid,
    price: resource.price,
    author_id: resource.author_id,
    author_name: resource.author_name,
    author_avatar: resource.author_avatar,
    created_at: resource.created_at,
    community_validated: resource.community_validated,
    votes: resource.votes
  };
};

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
      return data.map(mapDbResourceToResourceListing);
    } else {
      console.log('No resources found in the database');
      return [];
    }
  } catch (err) {
    console.error('Error fetching resources:', err);
    return [];
  }
};

export const addResource = async (resource: ResourceListing): Promise<ResourceListing | null> => {
  try {
    const dbResource = mapResourceListingToDb(resource);
    
    const { data, error } = await supabase
      .from('resource_listings')
      .insert(dbResource)
      .select()
      .single();
    
    if (error) {
      console.error('Error adding resource:', error);
      throw error;
    }
    
    if (data) {
      return mapDbResourceToResourceListing(data);
    } else {
      return null;
    }
  } catch (err) {
    console.error('Error adding resource:', err);
    return null;
  }
};
