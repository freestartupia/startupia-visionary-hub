
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LikeResponse {
  liked: boolean;
  newCount: number;
}

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

// Function to check if a user has liked a reply
export const getReplyLikeStatus = async (replyId: string, userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('forum_reply_likes')
      .select('id')
      .eq('reply_id', replyId)
      .eq('user_id', userId)
      .single();
      
    if (error && error.code !== 'PGRST116') {
      console.error("Error checking reply like status:", error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error("Error in getReplyLikeStatus:", error);
    return false;
  }
};

// Function to toggle like on a post
export const togglePostLike = async (postId: string): Promise<LikeResponse> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      console.error("User not authenticated:", userError);
      toast.error("Vous devez être connecté pour liker un post");
      throw userError || new Error("User not authenticated");
    }
    
    const userId = userData.user.id;
    
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
      const { data: updateData, error: updateError } = await supabase.rpc(
        'decrement_post_likes', 
        { post_id: postId }
      );
      
      if (updateError) {
        console.error("Error decrementing likes:", updateError);
        throw updateError;
      }
      
      return {
        liked: false,
        newCount: updateData.new_count
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
      const { data: updateData, error: updateError } = await supabase.rpc(
        'increment_post_likes', 
        { post_id: postId }
      );
      
      if (updateError) {
        console.error("Error incrementing likes:", updateError);
        throw updateError;
      }
      
      return {
        liked: true,
        newCount: updateData.new_count
      };
    }
  } catch (error) {
    console.error("Error in togglePostLike:", error);
    throw error;
  }
};

// Function to toggle like on a reply
export const toggleReplyLike = async (replyId: string): Promise<LikeResponse> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      console.error("User not authenticated:", userError);
      toast.error("Vous devez être connecté pour liker une réponse");
      throw userError || new Error("User not authenticated");
    }
    
    const userId = userData.user.id;
    
    // Check if user already liked the reply
    const { data: existingLike, error: likeError } = await supabase
      .from('forum_reply_likes')
      .select('id')
      .eq('reply_id', replyId)
      .eq('user_id', userId)
      .single();
      
    if (likeError && likeError.code !== 'PGRST116') {
      console.error("Error checking existing reply like:", likeError);
      throw likeError;
    }
    
    if (existingLike) {
      // Unlike: Remove like from database
      const { error: unlikeError } = await supabase
        .from('forum_reply_likes')
        .delete()
        .eq('id', existingLike.id);
        
      if (unlikeError) {
        console.error("Error unliking reply:", unlikeError);
        throw unlikeError;
      }
      
      // Decrement likes count
      const { data: updateData, error: updateError } = await supabase.rpc(
        'decrement_reply_likes', 
        { reply_id: replyId }
      );
      
      if (updateError) {
        console.error("Error decrementing reply likes:", updateError);
        throw updateError;
      }
      
      return {
        liked: false,
        newCount: updateData.new_count
      };
    } else {
      // Like: Add new like to database
      const { error: addLikeError } = await supabase
        .from('forum_reply_likes')
        .insert({
          reply_id: replyId,
          user_id: userId
        });
        
      if (addLikeError) {
        console.error("Error liking reply:", addLikeError);
        throw addLikeError;
      }
      
      // Increment likes count
      const { data: updateData, error: updateError } = await supabase.rpc(
        'increment_reply_likes', 
        { reply_id: replyId }
      );
      
      if (updateError) {
        console.error("Error incrementing reply likes:", updateError);
        throw updateError;
      }
      
      return {
        liked: true,
        newCount: updateData.new_count
      };
    }
  } catch (error) {
    console.error("Error in toggleReplyLike:", error);
    throw error;
  }
};
