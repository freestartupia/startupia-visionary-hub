
import { supabase } from "@/integrations/supabase/client";
import { UpvoteResponse } from "@/types/community";
import { toast } from "sonner";

// Function to check if a user has upvoted a post
export const checkPostUpvote = async (postId: string): Promise<boolean> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      return false;
    }
    
    const { data, error } = await supabase
      .from('post_upvotes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userData.user.id)
      .single();
      
    if (error && error.code !== 'PGRST116') { // PGRST116 is the error code for "no rows returned"
      console.error("Error checking upvote status:", error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error("Error in checkPostUpvote:", error);
    return false;
  }
};

// Function to toggle upvote on a post
export const togglePostUpvote = async (postId: string): Promise<UpvoteResponse> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      toast.error("Vous devez être connecté pour voter");
      return {
        success: false,
        message: "Authentication required",
        upvoted: false,
        newCount: 0
      };
    }

    // Check if the user has already upvoted the post
    const { data, error } = await supabase
      .from('post_upvotes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userData.user.id)
      .single();
    
    let isUpvoted = false;
    
    // Get current upvote count
    const { data: postData, error: postError } = await supabase
      .from('forum_posts')
      .select('upvotes_count')
      .eq('id', postId)
      .single();
      
    if (postError) {
      throw postError;
    }
    
    const currentUpvotes = postData?.upvotes_count || 0;
    
    if (data && !error) {
      // If the user has already upvoted the post, remove the upvote
      const { error: deleteError } = await supabase
        .from('post_upvotes')
        .delete()
        .eq('id', data.id);
        
      if (deleteError) {
        throw deleteError;
      }
      
      isUpvoted = false;
    } else {
      // If the user hasn't upvoted the post, add an upvote
      const { error: insertError } = await supabase
        .from('post_upvotes')
        .insert({ post_id: postId, user_id: userData.user.id });
        
      if (insertError) {
        throw insertError;
      }
      
      isUpvoted = true;
    }
    
    // The trigger handles incrementing/decrementing the upvotes_count
    // Retrieve the updated count
    const { data: updatedPost, error: updateError } = await supabase
      .from('forum_posts')
      .select('upvotes_count')
      .eq('id', postId)
      .single();
    
    if (updateError) {
      throw updateError;
    }
    
    const newCount = updatedPost?.upvotes_count || 0;
    
    return {
      success: true,
      message: isUpvoted ? "Post upvoté" : "Upvote retiré",
      upvoted: isUpvoted,
      newCount: newCount
    };
    
  } catch (error) {
    console.error("Error in togglePostUpvote:", error);
    toast.error("Erreur lors de l'interaction avec le post");
    throw error;
  }
};
