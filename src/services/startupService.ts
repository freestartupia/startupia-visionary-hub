
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
    
    const startups: Startup[] = data.map(item => ({
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
      upvotes: item.upvotes || 0,
    }));
    
    return startups;
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
    
    const startup: Startup = {
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
      upvotes: data.upvotes || 0,
    };
    
    return startup;
  } catch (error) {
    console.error('Error in getStartupById:', error);
    return null;
  }
};

export const upvoteStartup = async (startupId: string): Promise<boolean> => {
  try {
    const user = supabase.auth.getUser();
    
    // Anon users can upvote for now
    const userId = (await user).data.user?.id || 'anonymous';
    
    // First, increment the upvotes count in the startups table
    const { error: updateError } = await supabase.rpc('increment_startup_upvotes', {
      startup_id: startupId
    });
    
    if (updateError) {
      console.error('Error upvoting startup:', updateError);
      return false;
    }
    
    // If the user is authenticated, record their upvote
    if (userId !== 'anonymous') {
      const { error: recordError } = await supabase
        .from('startup_upvotes')
        .insert({ 
          startup_id: startupId, 
          user_id: userId 
        });
      
      if (recordError) {
        console.error('Error recording upvote:', recordError);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in upvoteStartup:', error);
    return false;
  }
};

export const downvoteStartup = async (startupId: string): Promise<boolean> => {
  try {
    const user = supabase.auth.getUser();
    
    // Anon users can downvote for now
    const userId = (await user).data.user?.id || 'anonymous';
    
    // First, decrement the upvotes count in the startups table
    const { error: updateError } = await supabase.rpc('decrement_startup_upvotes', {
      startup_id: startupId
    });
    
    if (updateError) {
      console.error('Error downvoting startup:', updateError);
      return false;
    }
    
    // If the user is authenticated, remove their upvote record
    if (userId !== 'anonymous') {
      const { error: recordError } = await supabase
        .from('startup_upvotes')
        .delete()
        .eq('startup_id', startupId)
        .eq('user_id', userId);
      
      if (recordError) {
        console.error('Error removing upvote record:', recordError);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in downvoteStartup:', error);
    return false;
  }
};

export const getStartupUpvotes = async (startupId: string): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('startups')
      .select('upvotes')
      .eq('id', startupId)
      .single();
      
    if (error) {
      console.error('Error fetching startup upvotes:', error);
      return 0;
    }
    
    return data.upvotes || 0;
  } catch (error) {
    console.error('Error in getStartupUpvotes:', error);
    return 0;
  }
};

export const isStartupUpvotedByUser = async (startupId: string): Promise<boolean> => {
  try {
    const user = supabase.auth.getUser();
    const userId = (await user).data.user?.id;
    
    if (!userId) return false;
    
    const { data, error } = await supabase
      .from('startup_upvotes')
      .select('*')
      .eq('startup_id', startupId)
      .eq('user_id', userId)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        // No record found
        return false;
      }
      console.error('Error checking upvote status:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error in isStartupUpvotedByUser:', error);
    return false;
  }
};
