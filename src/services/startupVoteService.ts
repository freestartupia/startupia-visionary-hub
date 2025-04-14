import { supabase } from "@/integrations/supabase/client";
import { UpvoteResponse } from "@/types/community";

// Generic toggle vote function that handles both upvotes and downvotes
export const toggleStartupVote = async (startupId: string, isUpvote: boolean): Promise<UpvoteResponse> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      return {
        success: false,
        message: "Vous devez être connecté pour voter",
        upvoted: false,
        newCount: 0
      };
    }
    
    // Check if user already voted this startup
    const { data: existingVote } = await supabase
      .from('startup_votes')
      .select('id, is_upvote')
      .eq('startup_id', startupId)
      .eq('user_id', userData.user.id)
      .single();
    
    let message = "";
    let countDelta = 0;
    let resultIsUpvoted = false;
    
    // If vote exists, we need to handle removal or change
    if (existingVote) {
      // If same vote type, remove the vote
      if (existingVote.is_upvote === isUpvote) {
        const { error: deleteError } = await supabase
          .from('startup_votes')
          .delete()
          .eq('id', existingVote.id);
          
        if (deleteError) {
          console.error("Error removing vote:", deleteError);
          return {
            success: false,
            message: "Impossible de supprimer votre vote",
            upvoted: existingVote.is_upvote,
            newCount: 0
          };
        }
        
        countDelta = isUpvote ? -1 : 1; // Upvote removal: -1, Downvote removal: +1
        message = "Vote retiré";
        resultIsUpvoted = false;
      } 
      // If different vote type, change the vote
      else {
        const { error: updateError } = await supabase
          .from('startup_votes')
          .update({ is_upvote: isUpvote })
          .eq('id', existingVote.id);
          
        if (updateError) {
          console.error("Error updating vote:", updateError);
          return {
            success: false,
            message: "Impossible de mettre à jour votre vote",
            upvoted: existingVote.is_upvote,
            newCount: 0
          };
        }
        
        countDelta = isUpvote ? 2 : -2; // From down to up: +2, From up to down: -2
        message = "Vote modifié";
        resultIsUpvoted = isUpvote;
      }
    }
    // If no existing vote, add a new vote
    else {
      const { error: insertError } = await supabase
        .from('startup_votes')
        .insert({
          startup_id: startupId,
          user_id: userData.user.id,
          is_upvote: isUpvote
        });
        
      if (insertError) {
        console.error("Error adding vote:", insertError);
        return {
          success: false,
          message: "Impossible d'ajouter votre vote",
          upvoted: false,
          newCount: 0
        };
      }
      
      countDelta = isUpvote ? 1 : -1; // New upvote: +1, New downvote: -1
      message = isUpvote ? "Vote ajouté" : "Vote négatif ajouté";
      resultIsUpvoted = isUpvote;
    }
    
    // Update the vote count atomically
    if (countDelta !== 0) {
      // Get current count
      const { data: currentData } = await supabase
        .from('startups')
        .select('upvotes_count')
        .eq('id', startupId)
        .single();
        
      const currentCount = currentData?.upvotes_count || 0;
      // Ensure count never goes below 0
      const newCount = Math.max(0, currentCount + countDelta);
      
      // Update with the calculated value
      const { error: updateCountError } = await supabase
        .from('startups')
        .update({ upvotes_count: newCount })
        .eq('id', startupId);
        
      if (updateCountError) {
        console.error("Error updating startup upvote count:", updateCountError);
      }
      
      // Return the new count from our calculation
      return {
        success: true,
        message,
        upvoted: resultIsUpvoted,
        newCount
      };
    }
    
    // Fallback to fetching count if no change was made
    const { data: startupData } = await supabase
      .from('startups')
      .select('upvotes_count')
      .eq('id', startupId)
      .single();
      
    const newCount = startupData?.upvotes_count || 0;
    
    return {
      success: true,
      message,
      upvoted: resultIsUpvoted,
      newCount
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

// Keep the exported functions for backward compatibility, but use the unified implementation
export const toggleStartupUpvote = async (startupId: string): Promise<UpvoteResponse> => {
  return toggleStartupVote(startupId, true);
};

export const toggleStartupDownvote = async (startupId: string): Promise<UpvoteResponse> => {
  return toggleStartupVote(startupId, false);
};
