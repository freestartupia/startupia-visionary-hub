
import { supabase } from "@/integrations/supabase/client";
import { UpvoteResponse } from "@/types/community";

/**
 * Toggle a vote (upvote or downvote) for a startup
 * @param startupId The ID of the startup to vote for
 * @param isUpvote Whether this is an upvote (true) or downvote (false)
 * @returns Response with vote status and updated count
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
    
    // Check for existing vote
    const { data: existingVote, error: voteError } = await supabase
      .from('startup_votes')
      .select('id, is_upvote')
      .eq('startup_id', startupId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (voteError) {
      console.error("Erreur de vérification du vote existant:", voteError);
      throw voteError;
    }
    
    // Get current vote count
    const { data: startupData, error: startupError } = await supabase
      .from('startups')
      .select('upvotes_count')
      .eq('id', startupId)
      .single();
    
    if (startupError) {
      console.error("Erreur de récupération des données de la startup:", startupError);
      throw startupError;
    }
    
    // Calculate new vote count and prepare response
    const currentCount = startupData.upvotes_count || 0;
    let newCount = currentCount;
    let responseMessage = "";
    let isVoteUpvoted = false;
    
    // Handle vote operation based on existing vote status
    if (existingVote) {
      if (existingVote.is_upvote === isUpvote) {
        // Remove vote if clicking the same type again
        await removeVote(existingVote.id);
        newCount = adjustCount(currentCount, isUpvote, false);
        responseMessage = "Vote retiré";
      } else {
        // Change vote type if different
        await updateVoteType(existingVote.id, isUpvote);
        newCount = adjustCount(currentCount, isUpvote, true);
        responseMessage = isUpvote ? "Vote changé en positif" : "Vote changé en négatif";
        isVoteUpvoted = isUpvote;
      }
    } else {
      // Add new vote
      await addNewVote(startupId, userId, isUpvote);
      newCount = adjustCount(currentCount, isUpvote, false, true);
      responseMessage = isUpvote ? "Vote positif ajouté" : "Vote négatif ajouté";
      isVoteUpvoted = isUpvote;
    }
    
    // Update startup vote count
    await updateStartupVoteCount(startupId, newCount);
    
    return {
      success: true,
      message: responseMessage,
      upvoted: isVoteUpvoted,
      newCount: newCount
    };
    
  } catch (error) {
    console.error("Erreur lors du vote:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors du vote",
      upvoted: false,
      newCount: 0
    };
  }
};

/**
 * Calculate the new vote count based on the vote operation
 */
const adjustCount = (
  currentCount: number, 
  isUpvote: boolean, 
  isChangingVote: boolean = false,
  isNewVote: boolean = false
): number => {
  if (isChangingVote) {
    // When changing vote type, count changes by 2 (removing one type and adding another)
    return isUpvote ? currentCount + 2 : currentCount - 2;
  } else if (isNewVote) {
    // When adding a new vote
    return isUpvote ? currentCount + 1 : Math.max(0, currentCount - 1);
  } else {
    // When removing a vote
    return isUpvote ? Math.max(0, currentCount - 1) : currentCount + 1;
  }
};

/**
 * Add a new vote to the database
 */
const addNewVote = async (startupId: string, userId: string, isUpvote: boolean) => {
  return supabase
    .from('startup_votes')
    .insert({
      startup_id: startupId,
      user_id: userId,
      is_upvote: isUpvote
    });
};

/**
 * Update an existing vote's type
 */
const updateVoteType = async (voteId: string, isUpvote: boolean) => {
  return supabase
    .from('startup_votes')
    .update({ is_upvote: isUpvote })
    .eq('id', voteId);
};

/**
 * Remove a vote from the database
 */
const removeVote = async (voteId: string) => {
  return supabase
    .from('startup_votes')
    .delete()
    .eq('id', voteId);
};

/**
 * Update the startup's vote count
 */
const updateStartupVoteCount = async (startupId: string, newCount: number) => {
  return supabase
    .from('startups')
    .update({ upvotes_count: newCount })
    .eq('id', startupId);
};

// Compatibility functions for existing code
export const toggleStartupUpvote = (startupId: string) => toggleStartupVote(startupId, true);
export const toggleStartupDownvote = (startupId: string) => toggleStartupVote(startupId, false);
