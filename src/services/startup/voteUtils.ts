
import { supabase } from "@/integrations/supabase/client";
import { ExistingVote } from "./types";

/**
 * Fetches the current vote count for a startup
 */
export const fetchStartupVoteCount = async (startupId: string): Promise<number> => {
  const { data, error } = await supabase
    .from('startups')
    .select('upvotes_count')
    .eq('id', startupId)
    .single();
  
  if (error) {
    console.error("Error fetching startup vote count:", error);
    return 0;
  }
  
  return data.upvotes_count || 0;
};

/**
 * Checks if a user has already voted for a startup
 */
export const checkExistingVote = async (startupId: string, userId: string): Promise<ExistingVote | null> => {
  const { data, error } = await supabase
    .from('startup_votes')
    .select('id, is_upvote')
    .eq('startup_id', startupId)
    .eq('user_id', userId)
    .maybeSingle();
  
  if (error) {
    console.error("Error checking existing vote:", error);
    return null;
  }
  
  return data as ExistingVote | null;
};

/**
 * Verifies user authentication
 */
export const verifyAuthentication = async (): Promise<{ userId: string | null; error: string | null }> => {
  const { data, error } = await supabase.auth.getUser();
  
  if (error || !data.user) {
    return { 
      userId: null, 
      error: "Vous devez être connecté pour voter" 
    };
  }
  
  return { 
    userId: data.user.id, 
    error: null 
  };
};
