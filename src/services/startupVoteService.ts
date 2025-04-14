
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
    
    let currentCount = startupData?.upvotes_count || 0;
    let newCount = currentCount;
    let isVoteUpvoted = false;
    let responseMessage = "";
    
    // Begin transaction-like operations
    // Case 1: No existing vote - create new
    if (!existingVote) {
      const { error: insertError } = await supabase
        .from('startup_votes')
        .insert({
          startup_id: startupId,
          user_id: userId,
          is_upvote: isUpvote
        });
        
      if (insertError) {
        console.error("Error inserting vote:", insertError);
        throw insertError;
      }
      
      if (isUpvote) {
        newCount = currentCount + 1;
        responseMessage = "Vote positif ajouté";
        isVoteUpvoted = true;
      } else {
        newCount = Math.max(0, currentCount - 1);
        responseMessage = "Vote négatif ajouté";
        isVoteUpvoted = false;
      }
    } 
    // Case 2: Existing vote with same type - remove it
    else if (existingVote.is_upvote === isUpvote) {
      const { error: deleteError } = await supabase
        .from('startup_votes')
        .delete()
        .eq('id', existingVote.id);
        
      if (deleteError) {
        console.error("Error deleting vote:", deleteError);
        throw deleteError;
      }
      
      if (isUpvote) {
        newCount = Math.max(0, currentCount - 1);
      } else {
        newCount = currentCount + 1;
      }
      
      responseMessage = "Vote retiré";
      isVoteUpvoted = false;
    } 
    // Case 3: Existing vote with different type - change it
    else {
      const { error: updateError } = await supabase
        .from('startup_votes')
        .update({ is_upvote: isUpvote })
        .eq('id', existingVote.id);
        
      if (updateError) {
        console.error("Error updating vote:", updateError);
        throw updateError;
      }
      
      if (isUpvote) {
        // From downvote to upvote: +2
        newCount = currentCount + 2;
        responseMessage = "Vote changé en positif";
        isVoteUpvoted = true;
      } else {
        // From upvote to downvote: -2
        newCount = Math.max(0, currentCount - 2);
        responseMessage = "Vote changé en négatif";
        isVoteUpvoted = false;
      }
    }
    
    // Update the startup's upvote count
    const { error: updateStartupError } = await supabase
      .from('startups')
      .update({ upvotes_count: newCount })
      .eq('id', startupId);
      
    if (updateStartupError) {
      console.error("Error updating startup count:", updateStartupError);
      throw updateStartupError;
    }
    
    return {
      success: true,
      message: responseMessage,
      upvoted: isVoteUpvoted,
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
