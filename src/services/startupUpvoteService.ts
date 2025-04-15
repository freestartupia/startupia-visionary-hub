
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Upvote a startup
 * @param startupId The ID of the startup to upvote
 * @returns True if the upvote was successful, false otherwise
 */
export const upvoteStartup = async (startupId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('startup_upvotes')
      .insert({ startup_id: startupId });

    if (error) {
      console.error('Error upvoting startup:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception upvoting startup:', error);
    return false;
  }
};

/**
 * Remove upvote from a startup
 * @param startupId The ID of the startup to remove the upvote from
 * @returns True if the removal was successful, false otherwise
 */
export const removeStartupUpvote = async (startupId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('startup_upvotes')
      .delete()
      .eq('startup_id', startupId);

    if (error) {
      console.error('Error removing startup upvote:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception removing startup upvote:', error);
    return false;
  }
};

/**
 * Check if the current user has upvoted a startup
 * @param startupId The ID of the startup to check
 * @returns True if the user has upvoted the startup, false otherwise
 */
export const hasUpvotedStartup = async (startupId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('startup_upvotes')
      .select('id')
      .eq('startup_id', startupId)
      .maybeSingle();

    if (error) {
      console.error('Error checking if user has upvoted startup:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Exception checking if user has upvoted startup:', error);
    return false;
  }
};

/**
 * Get all startups upvoted by the current user
 * @returns An array of startup IDs that the user has upvoted
 */
export const getUserUpvotedStartups = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('startup_upvotes')
      .select('startup_id');

    if (error) {
      console.error('Error getting user upvoted startups:', error);
      return [];
    }
    
    return data.map(item => item.startup_id);
  } catch (error) {
    console.error('Exception getting user upvoted startups:', error);
    return [];
  }
};
