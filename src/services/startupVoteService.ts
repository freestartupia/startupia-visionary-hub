
import { supabase } from "@/integrations/supabase/client";
import { UpvoteResponse } from "@/types/community";
import { toast } from "sonner";

/**
 * Toggle a vote on a startup
 * This handles upvoting and downvoting in a single function
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
    
    let newCount = startupData?.upvotes_count || 0;
    let isVoteUpvoted = false;
    let responseMessage = "";
    
    // Now call the RPC function and cast the response
    const { data, error } = await supabase.rpc('handle_startup_vote', {
      p_startup_id: startupId,
      p_user_id: userId,
      p_is_upvote: isUpvote,
      p_existing_vote_id: existingVote?.id || null,
      p_was_upvote: existingVote?.is_upvote || null
    });
    
    if (error) {
      console.error("Error in vote transaction:", error);
      throw error;
    }
    
    // The response should contain these properties
    if (data && typeof data === 'object') {
      const response = data as {
        message: string;
        is_upvoted: boolean;
        new_count: number;
      };
      
      return {
        success: true,
        message: response.message || "Vote mis à jour",
        upvoted: response.is_upvoted || false,
        newCount: response.new_count || 0
      };
    }
    
    return {
      success: true,
      message: "Vote mis à jour",
      upvoted: isUpvote,
      newCount: newCount
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
