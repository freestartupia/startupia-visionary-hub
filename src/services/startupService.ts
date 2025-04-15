import { supabase } from "@/integrations/supabase/client";
import { Startup } from "@/types/startup";

export const getStartups = async (): Promise<Startup[]> => {
  try {
    const { data, error } = await supabase
      .from('startups')
      .select('*')
      .order('upvotes', { ascending: false }); // Tri par nombre de votes décroissant
      
    if (error) {
      console.error('Error fetching startups:', error);
      throw new Error('Failed to fetch startups');
    }
    
    // Get the current user to check upvotes
    const { data: { user } } = await supabase.auth.getUser();
    
    // Get all upvotes for the current user
    let userUpvotes: Record<string, boolean> = {};
    if (user) {
      const { data: upvotesData } = await supabase
        .from('startup_upvotes')
        .select('startup_id')
        .eq('user_id', user.id);
        
      if (upvotesData) {
        userUpvotes = upvotesData.reduce((acc, upvote) => {
          acc[upvote.startup_id] = true;
          return acc;
        }, {} as Record<string, boolean>);
      }
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
      upvotes: item.upvotes || 0,
      isUpvoted: userUpvotes[item.id] || false,
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
    
    // Get the current user to check if they've upvoted this startup
    const { data: { user } } = await supabase.auth.getUser();
    
    let isUpvoted = false;
    if (user) {
      const { data: upvoteData, error: upvoteError } = await supabase
        .from('startup_upvotes')
        .select('*')
        .eq('startup_id', id)
        .eq('user_id', user.id)
        .maybeSingle();
        
      isUpvoted = !!upvoteData;
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
      upvotes: data.upvotes || 0,
      isUpvoted: isUpvoted,
    } as Startup;
  } catch (error) {
    console.error('Error in getStartupById:', error);
    return null;
  }
};

export const upvoteStartup = async (startupId: string): Promise<boolean> => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('User not authenticated');
      return false;
    }
    
    // Check if the user has already upvoted this startup
    const { data: existingUpvote } = await supabase
      .from('startup_upvotes')
      .select('*')
      .eq('startup_id', startupId)
      .eq('user_id', user.id)
      .maybeSingle();
      
    if (existingUpvote) {
      console.log('User has already upvoted this startup');
      return false;
    }
    
    // Add an upvote record
    const { error: upvoteError } = await supabase
      .from('startup_upvotes')
      .insert({
        startup_id: startupId,
        user_id: user.id
      });
      
    if (upvoteError) {
      console.error('Error adding upvote:', upvoteError);
      return false;
    }
    
    // Increment the upvote count in the startups table
    await supabase.rpc('increment_startup_upvotes', { startup_id: startupId });
    
    return true;
  } catch (error) {
    console.error('Error in upvoteStartup:', error);
    return false;
  }
};

export const downvoteStartup = async (startupId: string): Promise<boolean> => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('User not authenticated');
      return false;
    }
    
    // Remove the upvote record
    const { error: deleteError } = await supabase
      .from('startup_upvotes')
      .delete()
      .eq('startup_id', startupId)
      .eq('user_id', user.id);
      
    if (deleteError) {
      console.error('Error removing upvote:', deleteError);
      return false;
    }
    
    // Decrement the upvote count in the startups table
    await supabase.rpc('decrement_startup_upvotes', { startup_id: startupId });
    
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
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }
    
    const { data, error } = await supabase
      .from('startup_upvotes')
      .select('*')
      .eq('startup_id', startupId)
      .eq('user_id', user.id)
      .maybeSingle();
      
    if (error) {
      console.error('Error checking if startup is upvoted:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error in isStartupUpvotedByUser:', error);
    return false;
  }
};
