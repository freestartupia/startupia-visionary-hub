
import { supabase } from "@/integrations/supabase/client";
import { UpvoteResponse } from "@/types/community";
import { toast } from "sonner";

// Define an interface for the response from our Supabase RPC function
interface HandleStartupVoteResponse {
  message: string;
  is_upvoted: boolean;
  new_count: number;
}

/**
 * Toggle a vote on a startup
 * This is a simplified, more reliable implementation
 */
export const toggleStartupVote = async (startupId: string, isUpvote: boolean): Promise<UpvoteResponse> => {
  try {
    // Check authentication
    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError || !userData.user) {
      return {
        success: false,
        message: "Vous devez être connecté pour voter",
        upvoted: false,
        newCount: 0
      };
    }
    
    const userId = userData.user.id;
    
    // First get the current vote state - we need this to know the state for proper updating
    const { data: existingVote, error: voteError } = await supabase
      .from('startup_votes')
      .select('id, is_upvote')
      .eq('startup_id', startupId)
      .eq('user_id', userId)
      .maybeSingle();
      
    if (voteError) {
      console.error("Error checking existing vote:", voteError);
      throw voteError;
    }
    
    // Get current upvote count
    const { data: startupData, error: startupError } = await supabase
      .from('startups')
      .select('upvotes_count')
      .eq('id', startupId)
      .single();
      
    if (startupError) {
      console.error("Error fetching startup data:", startupError);
      throw startupError;
    }
    
    const currentCount = startupData?.upvotes_count || 0;
    let newCount = currentCount;
    let responseMessage = "";
    let isVoteUpvoted = false;
    
    // Begin transaction using a function
    const { data, error } = await supabase.rpc<HandleStartupVoteResponse>(
      'handle_startup_vote', 
      {
        p_startup_id: startupId,
        p_user_id: userId,
        p_is_upvote: isUpvote,
        p_existing_vote_id: existingVote?.id || null,
        p_was_upvote: existingVote?.is_upvote || null
      }
    );
    
    if (error) {
      console.error("Error in vote transaction:", error);
      throw error;
    }
    
    // Return the new state based on the transaction result
    return {
      success: true,
      message: data?.message || "Vote mis à jour",
      upvoted: data?.is_upvoted || false,
      newCount: data?.new_count || 0
    };
  } catch (error) {
    console.error("Error in toggleStartupVote:", error);
    return {
      success: false,
      message: "Une erreur est survenue",
      upvoted: false,
      newCount: 0
    };
  }
};

// Simple wrapper functions for backward compatibility
export const toggleStartupUpvote = async (startupId: string): Promise<UpvoteResponse> => {
  return toggleStartupVote(startupId, true);
};

export const toggleStartupDownvote = async (startupId: string): Promise<UpvoteResponse> => {
  return toggleStartupVote(startupId, false);
};
