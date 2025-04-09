
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LikeResponse, checkAuthentication, safeRpcCall } from "./likeUtils";

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
        message: "Authentication required",
        liked: false,
        newCount: 0
      };
    }
    
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
      
      // Get the current like count to return
      const { data: replyData } = await supabase
        .from('forum_replies')
        .select('likes')
        .eq('id', replyId)
        .single();
      
      return {
        success: true,
        message: "Reply unliked successfully",
        liked: false,
        newCount: replyData?.likes || 0
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
      
      // Get the current like count to return
      const { data: replyData } = await supabase
        .from('forum_replies')
        .select('likes')
        .eq('id', replyId)
        .single();
      
      return {
        success: true,
        message: "Reply liked successfully",
        liked: true,
        newCount: (replyData?.likes || 0) + 1
      };
    }
  } catch (error) {
    console.error("Error in toggleReplyLike:", error);
    throw error;
  }
};
