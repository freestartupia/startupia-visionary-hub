import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { checkAuthentication } from "./likeUtils";
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
        error: "Authentication required",
        likes: 0,
        isLiked: false
      };
    }
    
    // Check if the user has already liked this post
    const { data: existingLike, error: checkError } = await supabase
      .from('forum_post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error("Error checking like status:", checkError);
      throw checkError;
    }
    
    let isLiked = false;
    
    // If the user has already liked the post, remove the like
    if (existingLike) {
      const { error: unlikeError } = await supabase
        .from('forum_post_likes')
        .delete()
        .eq('id', existingLike.id);
      
      if (unlikeError) {
        console.error("Error removing like:", unlikeError);
        throw unlikeError;
      }
    } else {
      // Otherwise, add a new like
      const { error: likeError } = await supabase
        .from('forum_post_likes')
        .insert({
          post_id: postId,
          user_id: userId
        });
      
      if (likeError) {
        console.error("Error adding like:", likeError);
        throw likeError;
      }
      
      isLiked = true;
    }
    
    // Get the updated likes count
    const { data: postData, error: getPostError } = await supabase
      .from('forum_posts')
      .select('likes')
      .eq('id', postId)
      .single();
    
    if (getPostError) {
      console.error("Error getting post data:", getPostError);
      throw getPostError;
    }
    
    return {
      success: true,
      likes: postData.likes,
      isLiked: isLiked
    };
    
  } catch (error) {
    console.error("Error in togglePostLike:", error);
    throw error;
  }
};
