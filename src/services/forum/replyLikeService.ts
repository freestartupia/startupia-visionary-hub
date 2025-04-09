
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LikeResponse, checkAuthentication, likeReply } from "./likeUtils";

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
    
    // Utiliser la fonction générique likeReply
    const likeResponse = await likeReply(replyId);
    
    // Get the current like count to return
    const { data: replyData } = await supabase
      .from('forum_replies')
      .select('likes')
      .eq('id', replyId)
      .single();
    
    return {
      ...likeResponse,
      newCount: likeResponse.liked 
        ? (replyData?.likes || 0) + 1 
        : (replyData?.likes || 0)
    };
    
  } catch (error) {
    console.error("Error in toggleReplyLike:", error);
    throw error;
  }
};
