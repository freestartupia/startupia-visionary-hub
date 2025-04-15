
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
    is_paid: dbResource.is_paid,
    price: dbResource.price,
    author_id: dbResource.author_id,
    author_name: dbResource.author_name,
    author_avatar: dbResource.author_avatar,
    created_at: dbResource.created_at,
    community_validated: dbResource.community_validated,
    votes: dbResource.votes,
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
    votes: resource.votes,
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
    
    // Process the resources to ensure all have author data
    if (data && data.length > 0) {
      const processedResources = await Promise.all(
        data.map(async (resource) => {
          const dbResource = mapDbResourceToResourceListing(resource);
          
          // If the resource has an author ID but is missing name or avatar, try to fetch it
          if (dbResource.author_id && (!dbResource.author_name || !dbResource.author_avatar)) {
            try {
              const { data: profileData } = await supabase
                .from('profiles')
                .select('first_name, last_name, avatar_url')
                .eq('id', dbResource.author_id)
                .single();
                
              if (profileData) {
                const fullName = [profileData.first_name, profileData.last_name]
                  .filter(Boolean)
                  .join(' ');
                  
                if (fullName && !dbResource.author_name) {
                  dbResource.author_name = fullName;
                }
                
                if (profileData.avatar_url && !dbResource.author_avatar) {
                  dbResource.author_avatar = profileData.avatar_url;
                }
              }
            } catch (err) {
              console.error('Error fetching profile data for resource:', err);
            }
          }
          
          return dbResource;
        })
      );
      
      return processedResources;
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
    // Ensure profile data is included
    if (resource.author_id) {
      // Fetch profile data from the profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url')
        .eq('id', resource.author_id)
        .single();
        
      if (profileError) {
        console.error('Error fetching profile data:', profileError);
      } else if (profileData) {
        // Set author name and avatar from profile
        const fullName = [profileData.first_name, profileData.last_name]
          .filter(Boolean)
          .join(' ');
          
        // Only use profile data if the resource doesn't already have this info
        if (fullName) {
          resource.author_name = fullName;
          console.log('Setting author name from profile:', fullName);
        }
        
        if (profileData.avatar_url) {
          resource.author_avatar = profileData.avatar_url;
          console.log('Found avatar URL in profiles:', profileData.avatar_url);
        }
      }
    }
    
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

export const deleteResource = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('resource_listings')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting resource:', error);
      throw error;
    }
    
    return true;
  } catch (err) {
    console.error('Error deleting resource:', err);
    return false;
  }
};
