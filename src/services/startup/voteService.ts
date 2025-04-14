
import { supabase } from "@/integrations/supabase/client";
import { UpvoteResponse } from "@/types/community";
import { VoteOptions, VoteResult } from "./types";
import { fetchStartupVoteCount, checkExistingVote, verifyAuthentication } from "./voteUtils";

/**
 * Processes the vote using the Supabase RPC function
 */
const processVote = async (
  startupId: string, 
  userId: string, 
  isUpvote: boolean, 
  existingVoteId?: string, 
  wasUpvote?: boolean
): Promise<VoteResult | null> => {
  try {
    const { data, error } = await supabase.rpc('handle_startup_vote', {
      p_startup_id: startupId,
      p_user_id: userId,
      p_is_upvote: isUpvote,
      p_existing_vote_id: existingVoteId || null,
      p_was_upvote: wasUpvote || false
    });
    
    if (error) {
      console.error("Error processing vote:", error);
      return null;
    }
    
    return data as VoteResult;
  } catch (error) {
    console.error("Exception during vote processing:", error);
    return null;
  }
};

/**
 * Gets the final vote count from the database after processing
 */
const getFinalVoteCount = async (startupId: string, processedCount: number): Promise<number> => {
  try {
    const { data } = await supabase
      .from('startups')
      .select('upvotes_count')
      .eq('id', startupId)
      .single();
      
    return data?.upvotes_count !== undefined ? data.upvotes_count : processedCount;
  } catch (error) {
    console.error("Error getting final vote count:", error);
    return processedCount;
  }
};

/**
 * Toggle a vote (upvote or downvote) for a startup
 * @param startupId The ID of the startup to vote for
 * @param isUpvote Whether this is an upvote (true) or downvote (false)
 * @returns Response with vote status and updated count
 */
export const toggleStartupVote = async ({ startupId, isUpvote }: VoteOptions): Promise<UpvoteResponse> => {
  try {
    // Check authentication
    const { userId, error: authError } = await verifyAuthentication();
    if (authError || !userId) {
      return {
        success: false,
        message: authError || "Vous devez être connecté pour voter",
        upvoted: false,
        newCount: 0
      };
    }
    
    console.log(`Toggle vote: user=${userId}, startup=${startupId}, isUpvote=${isUpvote}`);
    
    // Get current vote count
    const currentCount = await fetchStartupVoteCount(startupId);
    console.log(`Compte de votes actuel: ${currentCount}`);
    
    // Check for existing vote
    const existingVote = await checkExistingVote(startupId, userId);
    console.log("Vote existant:", existingVote);
    
    // Process the vote
    const result = await processVote(
      startupId, 
      userId, 
      isUpvote, 
      existingVote?.id, 
      existingVote?.is_upvote
    );
    
    if (!result) {
      return {
        success: false,
        message: "Erreur lors du vote",
        upvoted: existingVote?.is_upvote || false,
        newCount: currentCount
      };
    }
    
    console.log("Réponse de vote:", result);
    
    // Get final count after processing
    const finalCount = await getFinalVoteCount(startupId, result.new_count);
    console.log(`Nouveau compte de votes (après vérification): ${finalCount}`);
    
    // Return the results
    return {
      success: true,
      message: result.message,
      upvoted: result.is_upvoted,
      newCount: finalCount
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
