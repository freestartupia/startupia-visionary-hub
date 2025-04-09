
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { likePost, checkAuthentication } from "./likeUtils";
import type { LikeResponse } from "@/types/community";

// Function to check if a user has liked a post
export const getPostLikeStatus = async (postId: string, userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('forum_post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();
      
    if (error && error.code !== 'PGRST116') { // PGRST116 is the error code for "no rows returned"
      console.error("Error checking like status:", error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error("Error in getPostLikeStatus:", error);
    return false;
  }
};

// Function to toggle like on a post
export const togglePostLike = async (postId: string): Promise<LikeResponse> => {
  try {
    const userId = await checkAuthentication();
    
    if (!userId) {
      toast.error("Vous devez être connecté pour liker un post");
      return {
        success: false,
        message: "Authentication required",
        liked: false,
        newCount: 0
      };
    }
    
    // Utiliser la fonction générique likePost
    const likeResponse = await likePost(postId);
    
    // Get the current like count to return
    const { data: postData } = await supabase
      .from('forum_posts')
      .select('likes')
      .eq('id', postId)
      .single();
    
    return {
      ...likeResponse,
      newCount: likeResponse.liked 
        ? (postData?.likes || 0) + 1 
        : (postData?.likes || 0)
    };
    
  } catch (error) {
    console.error("Error in togglePostLike:", error);
    throw error;
  }
};
