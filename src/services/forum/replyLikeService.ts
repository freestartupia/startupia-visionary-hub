import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { checkAuthentication } from "./likeUtils";
import type { LikeResponse } from "@/types/community";

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

// Function to toggle like on a reply
export const toggleReplyLike = async (replyId: string): Promise<LikeResponse> => {
  try {
    const userId = await checkAuthentication();
    
    if (!userId) {
      toast.error("Vous devez être connecté pour liker une réponse");
      return {
        success: false,
        error: "Authentication required",
        likes: 0,
        isLiked: false
      };
    }
    
    // Check if the user has already liked this reply
    const { data: existingLike, error: checkError } = await supabase
      .from('forum_reply_likes')
      .select('id')
      .eq('reply_id', replyId)
      .eq('user_id', userId)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error("Error checking like status:", checkError);
      throw checkError;
    }
    
    let isLiked = false;
    
    // If the user has already liked the reply, remove the like
    if (existingLike) {
      const { error: unlikeError } = await supabase
        .from('forum_reply_likes')
        .delete()
        .eq('id', existingLike.id);
      
      if (unlikeError) {
        console.error("Error removing like:", unlikeError);
        throw unlikeError;
      }
    } else {
      // Otherwise, add a new like
      const { error: likeError } = await supabase
        .from('forum_reply_likes')
        .insert({
          reply_id: replyId,
          user_id: userId
        });
      
      if (likeError) {
        console.error("Error adding like:", likeError);
        throw likeError;
      }
      
      isLiked = true;
    }
    
    // Update the likes count on the reply
    const { data: replyData, error: updateError } = await supabase.rpc(
      'toggle_reply_like',
      { reply_id: replyId, is_liked: isLiked }
    );
    
    if (updateError) {
      console.error("Error updating likes count:", updateError);
      throw updateError;
    }
    
    return {
      success: true,
      likes: replyData.new_count,
      isLiked: isLiked
    };
    
  } catch (error) {
    console.error("Error in toggleReplyLike:", error);
    throw error;
  }
};
