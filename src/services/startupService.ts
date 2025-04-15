
import { supabase } from "@/integrations/supabase/client";
import { Startup } from "@/types/startup";

export const getStartups = async (): Promise<Startup[]> => {
  try {
    const { data, error } = await supabase
      .from('startups')
      .select('*');
      
    if (error) {
      console.error('Error fetching startups:', error);
      throw new Error('Failed to fetch startups');
    }
    
    return data.map(item => ({
      id: item.id,
      name: item.name,
      logoUrl: item.logo_url || '',
      shortDescription: item.short_description,
      longTermVision: item.long_term_vision || '',
      founders: Array.isArray(item.founders) ? item.founders : [],
      aiUseCases: item.ai_use_cases || '',
      aiTools: item.ai_tools || [],
      sector: item.sector,
      businessModel: item.business_model,
      maturityLevel: item.maturity_level,
      aiImpactScore: item.ai_impact_score,
      tags: item.tags || [],
      websiteUrl: item.website_url || '',
      pitchDeckUrl: item.pitch_deck_url,
      crunchbaseUrl: item.crunchbase_url,
      notionUrl: item.notion_url,
      dateAdded: item.date_added,
      viewCount: item.view_count || 0,
      isFeatured: item.is_featured || false,
      upvotes: item.upvotes || 0, // Get actual upvotes from DB
    })) as Startup[];
  } catch (error) {
    console.error('Error in getStartups:', error);
    return [];
  }
};

export const getStartupById = async (id: string): Promise<Startup | null> => {
  try {
    const { data, error } = await supabase
      .from('startups')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching startup:', error);
      return null;
    }
    
    // If we got here, we have data
    return {
      id: data.id,
      name: data.name,
      logoUrl: data.logo_url || '',
      shortDescription: data.short_description,
      longTermVision: data.long_term_vision || '',
      founders: Array.isArray(data.founders) ? data.founders : [],
      aiUseCases: data.ai_use_cases || '',
      aiTools: data.ai_tools || [],
      sector: data.sector,
      businessModel: data.business_model,
      maturityLevel: data.maturity_level,
      aiImpactScore: data.ai_impact_score,
      tags: data.tags || [],
      websiteUrl: data.website_url || '',
      pitchDeckUrl: data.pitch_deck_url,
      crunchbaseUrl: data.crunchbase_url,
      notionUrl: data.notion_url,
      dateAdded: data.date_added,
      viewCount: data.view_count || 0,
      isFeatured: data.is_featured || false,
      upvotes: data.upvotes || 0, // Get actual upvotes from DB
    } as Startup;
  } catch (error) {
    console.error('Error in getStartupById:', error);
    return null;
  }
};

// Update these functions to handle upvotes
export const upvoteStartup = async (startupId: string): Promise<boolean> => {
  try {
    // Since we don't have a real database yet, we'll just simulate a successful upvote
    console.log(`Upvoting startup with ID: ${startupId}`);
    
    // In a real implementation, we would update the database
    // const { error } = await supabase.rpc('increment_startup_upvotes', { startup_id: startupId });
    // return !error;
    
    return true;
  } catch (error) {
    console.error('Error in upvoteStartup:', error);
    return false;
  }
};

export const downvoteStartup = async (startupId: string): Promise<boolean> => {
  try {
    // Since we don't have a real database yet, we'll just simulate a successful downvote
    console.log(`Downvoting startup with ID: ${startupId}`);
    
    // In a real implementation, we would update the database
    // const { error } = await supabase.rpc('decrement_startup_upvotes', { startup_id: startupId });
    // return !error;
    
    return true;
  } catch (error) {
    console.error('Error in downvoteStartup:', error);
    return false;
  }
};

export const getStartupUpvotes = async (startupId: string): Promise<number> => {
  try {
    // For now, just return a mock value
    return Math.floor(Math.random() * 50);
  } catch (error) {
    console.error('Error in getStartupUpvotes:', error);
    return 0;
  }
};

export const isStartupUpvotedByUser = async (startupId: string): Promise<boolean> => {
  try {
    // For now, just return a mock value
    return Math.random() > 0.5;
  } catch (error) {
    console.error('Error in isStartupUpvotedByUser:', error);
    return false;
  }
};
