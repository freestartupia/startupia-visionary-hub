
import { supabase } from '@/integrations/supabase/client';
import { ServiceListing } from '@/types/community';
import { mockServiceListings } from '@/data/mockCommunityData';

export const fetchServices = async (): Promise<ServiceListing[]> => {
  try {
    const { data, error } = await supabase
      .from('service_listings')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
    
    if (data && data.length > 0) {
      // Transform DB data to match our interface
      return data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        category: item.category as ServiceListing['category'],
        providerId: item.provider_id || '',
        providerName: item.provider_name || '',
        providerAvatar: item.provider_avatar,
        contactLink: item.contact_link,
        price: item.price,
        createdAt: item.created_at,
        expertise: item.expertise,
        linkedinUrl: item.linkedin_url
      }));
    }
    
    return mockServiceListings;
  } catch (error) {
    console.error('Error in fetchServices:', error);
    return mockServiceListings;
  }
};

// Export both function names to maintain compatibility with existing code
export const createService = async (serviceData: Partial<ServiceListing>): Promise<ServiceListing> => {
  try {
    const { data, error } = await supabase
      .from('service_listings')
      .insert(serviceData)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating service:', error);
      throw error;
    }
    
    return data as ServiceListing;
  } catch (error) {
    console.error('Error in createService:', error);
    throw error;
  }
};

// Add the same function with the name addService to match imports in components
export const addService = createService;
