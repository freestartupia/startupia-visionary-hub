
import { supabase } from "@/integrations/supabase/client";
import { UpvoteResponse } from "@/types/community";

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
    
    // If no vote exists, create a new one
    if (!existingVote) {
      await supabase
        .from('startup_votes')
        .insert({
          startup_id: startupId,
          user_id: userData.user.id,
          is_upvote: isUpvote
        });
      
      // Update count in startups table
      const { data: startupData } = await supabase
        .from('startups')
        .select('upvotes_count')
        .eq('id', startupId)
        .single();
      
      const currentCount = startupData?.upvotes_count || 0;
      const newCount = isUpvote ? currentCount + 1 : currentCount - 1;
      
      await supabase
        .from('startups')
        .update({ upvotes_count: newCount })
        .eq('id', startupId);
      
      return {
        success: true,
        message: isUpvote ? "Vote positif ajouté" : "Vote négatif ajouté",
        upvoted: isUpvote,
        newCount
      };
    }
    
    // If vote exists with same type, remove it
    if (existingVote.is_upvote === isUpvote) {
      await supabase
        .from('startup_votes')
        .delete()
        .eq('id', existingVote.id);
      
      // Update count in startups table
      const { data: startupData } = await supabase
        .from('startups')
        .select('upvotes_count')
        .eq('id', startupId)
        .single();
      
      const currentCount = startupData?.upvotes_count || 0;
      const newCount = isUpvote ? Math.max(0, currentCount - 1) : Math.max(0, currentCount + 1);
      
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
    await supabase
      .from('startup_votes')
      .update({ is_upvote: isUpvote })
      .eq('id', existingVote.id);
    
    // Update count in startups table
    const { data: startupData } = await supabase
      .from('startups')
      .select('upvotes_count')
      .eq('id', startupId)
      .single();
    
    const currentCount = startupData?.upvotes_count || 0;
    // If changing from downvote to upvote: +2 (remove downvote + add upvote)
    // If changing from upvote to downvote: -2 (remove upvote + add downvote)
    const newCount = isUpvote ? currentCount + 2 : currentCount - 2;
    
    await supabase
      .from('startups')
      .update({ upvotes_count: newCount })
      .eq('id', startupId);
    
    return {
      success: true,
      message: isUpvote ? "Vote changé en positif" : "Vote changé en négatif",
      upvoted: isUpvote,
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

// Simple wrapper functions for backward compatibility
export const toggleStartupUpvote = async (startupId: string): Promise<UpvoteResponse> => {
  return toggleStartupVote(startupId, true);
};

export const toggleStartupDownvote = async (startupId: string): Promise<UpvoteResponse> => {
  return toggleStartupVote(startupId, false);
};
