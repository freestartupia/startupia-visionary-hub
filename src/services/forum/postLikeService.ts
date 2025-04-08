
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LikeResponse, checkAuthentication, safeRpcCall } from "./likeUtils";

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
    const userId = await checkAuthentication().catch(error => {
      toast.error("Vous devez être connecté pour liker un post");
      throw error;
    });
    
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
      
      // Decrement likes count
      const updateData = await safeRpcCall<{ new_count: number }>(
        'decrement_post_likes', 
        { post_id: postId }
      );
      
      return {
        liked: false,
        newCount: updateData.new_count || 0
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
      
      // Increment likes count
      const updateData = await safeRpcCall<{ new_count: number }>(
        'increment_post_likes', 
        { post_id: postId }
      );
      
      return {
        liked: true,
        newCount: updateData.new_count || 0
      };
    }
  } catch (error) {
    console.error("Error in togglePostLike:", error);
    throw error;
  }
};
