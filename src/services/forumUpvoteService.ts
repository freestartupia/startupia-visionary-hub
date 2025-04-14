import { supabase } from "@/integrations/supabase/client";
import { UpvoteResponse } from "@/types/community";
import { toast } from "sonner";

// Check if a post is upvoted by the current user
export const checkPostUpvote = async (postId: string): Promise<boolean> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return false;
    
    const { data, error } = await supabase
      .from('post_upvotes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', userData.user.id)
      .single();
      
    if (error && error.code !== 'PGRST116') {
      console.error("Error checking post upvote:", error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error("Error in checkPostUpvote:", error);
    return false;
  }
};

// Toggle upvote on a post
export const togglePostUpvote = async (postId: string): Promise<UpvoteResponse> => {
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
    
    // Check if user already upvoted this post
    const { data: existingUpvote } = await supabase
      .from('post_upvotes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', userData.user.id)
      .single();
    
    let upvoted = false;
    let message = "";
    
    // If already upvoted, remove the upvote
    if (existingUpvote) {
      const { error: deleteError } = await supabase
        .from('post_upvotes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userData.user.id);
        
      if (deleteError) {
        console.error("Error removing upvote:", deleteError);
        return {
          success: false,
          message: "Impossible de supprimer votre vote",
          upvoted: true,
          newCount: 0
        };
      }
      
      message = "Vote retiré";
      upvoted = false;
    } 
    // Otherwise, add an upvote
    else {
      const { error: insertError } = await supabase
        .from('post_upvotes')
        .insert({
          post_id: postId,
          user_id: userData.user.id
        });
        
      if (insertError) {
        console.error("Error adding upvote:", insertError);
        return {
          success: false,
          message: "Impossible d'ajouter votre vote",
          upvoted: false,
          newCount: 0
        };
      }
      
      message = "Vote ajouté";
      upvoted = true;
    }
    
    // Get the updated upvote count
    const { data: postData, error: postError } = await supabase
      .from('forum_posts')
      .select('upvotes_count')
      .eq('id', postId)
      .single();
      
    if (postError) {
      console.error("Error fetching updated post:", postError);
      return {
        success: true,
        message,
        upvoted,
        newCount: upvoted ? 1 : 0
      };
    }
    
    return {
      success: true,
      message,
      upvoted,
      newCount: postData.upvotes_count
    };
  } catch (error) {
    console.error("Error in togglePostUpvote:", error);
    return {
      success: false,
      message: "Une erreur est survenue",
      upvoted: false,
      newCount: 0
    };
  }
};
