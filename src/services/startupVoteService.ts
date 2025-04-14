
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
    
    // If vote exists with the same type, remove it
    if (existingVote && existingVote.is_upvote === isUpvote) {
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
      
      // After removal, get the updated count
      const { data: updatedData } = await supabase
        .from('startups')
        .select('upvotes_count')
        .eq('id', startupId)
        .single();
        
      const currentCount = updatedData?.upvotes_count || 0;
      
      // Adjust count after vote removal
      const newCount = isUpvote ? Math.max(0, currentCount - 1) : Math.max(0, currentCount + 1);
      
      // Update count in database
      await supabase
        .from('startups')
        .update({ upvotes_count: newCount })
        .eq('id', startupId);
      
      return {
        success: true,
        message: "Vote retiré",
        upvoted: false,
        newCount
      };
    } 
    // If vote exists with different type, change it
    else if (existingVote && existingVote.is_upvote !== isUpvote) {
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
      
      // After change, get the updated count
      const { data: updatedData } = await supabase
        .from('startups')
        .select('upvotes_count')
        .eq('id', startupId)
        .single();
        
      const currentCount = updatedData?.upvotes_count || 0;
      
      // Adjust count after vote change
      const newCount = isUpvote ? Math.max(0, currentCount + 2) : Math.max(0, currentCount - 2);
      
      // Update count in database
      await supabase
        .from('startups')
        .update({ upvotes_count: newCount })
        .eq('id', startupId);
      
      return {
        success: true,
        message: "Vote modifié",
        upvoted: isUpvote,
        newCount
      };
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
      
      // After insertion, get the updated count
      const { data: updatedData } = await supabase
        .from('startups')
        .select('upvotes_count')
        .eq('id', startupId)
        .single();
        
      const currentCount = updatedData?.upvotes_count || 0;
      
      // Adjust count after new vote
      const newCount = isUpvote ? currentCount + 1 : Math.max(0, currentCount - 1);
      
      // Update count in database
      await supabase
        .from('startups')
        .update({ upvotes_count: newCount })
        .eq('id', startupId);
      
      return {
        success: true,
        message: isUpvote ? "Vote ajouté" : "Vote négatif ajouté",
        upvoted: isUpvote,
        newCount
      };
    }
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
