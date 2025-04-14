
import { supabase } from '@/integrations/supabase/client';
import { ServiceListing } from '@/types/community';

// Helper function to convert database types to our app types
export const mapDbServiceToServiceListing = (dbService: any): ServiceListing => {
  return {
    id: dbService.id,
    title: dbService.title,
    description: dbService.description,
    category: dbService.category,
    expertise: dbService.expertise || [],
    price: dbService.price || '',
    providerId: dbService.provider_id || '',
    providerName: dbService.provider_name,
    providerAvatar: dbService.provider_avatar,
    contactLink: dbService.contact_link,
    linkedinUrl: dbService.linkedin_url,
    createdAt: dbService.created_at,
  };
};

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
      return data.map(mapDbServiceToServiceListing);
    } else {
      console.log('No services found in the database');
      return [];
    }
  } catch (err) {
    console.error('Error fetching services:', err);
    return [];
  }
};
