
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Function to check if a user has liked a post
export const getPostLikeStatus = async (postId: string, userId: string): Promise<boolean> => {
  try {
    // Use RPC call instead of directly accessing the forum_post_likes table
    const { data, error } = await supabase.rpc('check_post_like', {
      post_id_param: postId,
      user_id_param: userId
    });
    
    if (error) {
      console.error("Error checking post like status:", error);
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
    // Use RPC call instead of directly accessing the forum_reply_likes table
    const { data, error } = await supabase.rpc('check_reply_like', {
      reply_id_param: replyId,
      user_id_param: userId
    });
    
    if (error) {
      console.error("Error checking reply like status:", error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error("Error in getReplyLikeStatus:", error);
    return false;
  }
};

// Function to toggle like/unlike a post
export const togglePostLike = async (postId: string): Promise<{ liked: boolean, newCount: number }> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      console.error("User not authenticated:", userError);
      toast.error("Vous devez être connecté pour liker un post");
      throw userError || new Error("User not authenticated");
    }
    
    // Use an RPC to handle the toggle operation in a single call
    const { data, error } = await supabase.rpc('toggle_post_like', {
      post_id_param: postId,
      user_id_param: userData.user.id
    });
    
    if (error) {
      console.error("Error toggling post like:", error);
      toast.error("Une erreur est survenue");
      throw error;
    }
    
    if (!data) {
      throw new Error("No data returned from toggle_post_like");
    }
    
    return { 
      liked: data.liked, 
      newCount: data.new_count 
    };
  } catch (error) {
    console.error("Error in togglePostLike:", error);
    throw error;
  }
};

// Function to toggle like/unlike a reply
export const toggleReplyLike = async (replyId: string): Promise<{ liked: boolean, newCount: number }> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      console.error("User not authenticated:", userError);
      toast.error("Vous devez être connecté pour liker une réponse");
      throw userError || new Error("User not authenticated");
    }
    
    // Use an RPC to handle the toggle operation in a single call
    const { data, error } = await supabase.rpc('toggle_reply_like', {
      reply_id_param: replyId,
      user_id_param: userData.user.id
    });
    
    if (error) {
      console.error("Error toggling reply like:", error);
      toast.error("Une erreur est survenue");
      throw error;
    }
    
    if (!data) {
      throw new Error("No data returned from toggle_reply_like");
    }
    
    return { 
      liked: data.liked, 
      newCount: data.new_count 
    };
  } catch (error) {
    console.error("Error in toggleReplyLike:", error);
    throw error;
  }
};
