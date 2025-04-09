
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LikeResponse, safeRpcCall } from "./likeUtils";

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
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    
    if (!userId) {
      toast.error("Vous devez être connecté pour liker un post");
      return {
        success: false,
        message: "Authentication required",
        liked: false,
        newCount: 0
      };
    }
    
    // Check if user already liked the post
    const { data: existingLike, error: likeError } = await supabase
      .from('forum_post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();
      
    if (likeError && likeError.code !== 'PGRST116') {
      console.error("Error checking existing like:", likeError);
      throw likeError;
    }
    
    if (existingLike) {
      // Unlike: Remove like from database
      const { error: unlikeError } = await supabase
        .from('forum_post_likes')
        .delete()
        .eq('id', existingLike.id);
        
      if (unlikeError) {
        console.error("Error unliking post:", unlikeError);
        throw unlikeError;
      }
      
      // Decrement likes count using RPC function
      const { data, error } = await safeRpcCall<{ new_count: number }>(
        'toggle_post_like', 
        { post_id: postId }
      );
      
      return {
        success: true,
        message: "Post unliked successfully",
        liked: false,
        newCount: data?.new_count || 0
      };
    } else {
      // Like: Add new like to database
      const { error: addLikeError } = await supabase
        .from('forum_post_likes')
        .insert({
          post_id: postId,
          user_id: userId
        });
        
      if (addLikeError) {
        console.error("Error liking post:", addLikeError);
        throw addLikeError;
      }
      
      // Increment likes count using RPC function
      const { data, error } = await safeRpcCall<{ new_count: number }>(
        'toggle_post_like', 
        { post_id: postId }
      );
      
      return {
        success: true,
        message: "Post liked successfully",
        liked: true,
        newCount: data?.new_count || 0
      };
    }
  } catch (error) {
    console.error("Error in togglePostLike:", error);
    throw error;
  }
};
