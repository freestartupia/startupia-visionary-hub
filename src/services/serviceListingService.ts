
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

// Helper function to convert our app types to database types
export const mapServiceListingToDb = (service: ServiceListing) => {
  // Format emails as mailto: links if they aren't already
  let contactLink = service.contactLink;
  if (contactLink && contactLink.includes('@') && !contactLink.startsWith('http') && !contactLink.startsWith('mailto:')) {
    contactLink = `mailto:${contactLink}`;
  }
  
  // Format Instagram handles as URLs if they start with @
  if (contactLink && contactLink.startsWith('@') && !contactLink.includes('.')) {
    contactLink = `https://instagram.com/${contactLink.substring(1)}`;
  }
  
  return {
    id: service.id,
    title: service.title,
    description: service.description,
    category: service.category,
    expertise: service.expertise,
    price: service.price,
    provider_id: service.providerId,
    provider_name: service.providerName,
    provider_avatar: service.providerAvatar,
    contact_link: contactLink,
    linkedin_url: service.linkedinUrl,
    created_at: service.createdAt,
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

export const addService = async (service: ServiceListing): Promise<ServiceListing | null> => {
  try {
    const dbService = mapServiceListingToDb(service);
    
    const { data, error } = await supabase
      .from('service_listings')
      .insert(dbService)
      .select()
      .single();
    
    if (error) {
      console.error('Error adding service:', error);
      throw error;
    }
    
    if (data) {
      return mapDbServiceToServiceListing(data);
    } else {
      return null;
    }
  } catch (err) {
    console.error('Error adding service:', err);
    return null;
  }
};
