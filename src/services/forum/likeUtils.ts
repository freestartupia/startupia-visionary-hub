
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { LikeResponse } from "@/types/community";

// Function to check if the user is authenticated
export const checkAuthentication = async (): Promise<string | false> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return false;
  }
  
  return user.id;
};

// Generic function to handle post likes
export const likePost = async (postId: string): Promise<LikeResponse> => {
  const userId = await checkAuthentication();
  
  if (!userId) {
    throw new Error("Vous devez être connecté pour effectuer cette action");
  }
  
  try {
    // Check if the user has already liked this post
    const { data: existingLike } = await supabase
      .from('forum_post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();
    
    let liked = false;
    let newCount = 0;
    
    if (existingLike) {
      // Unlike the post
      await supabase
        .from('forum_post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);
      
      // Decrement the likes count
      const { data: updatedPost } = await supabase.rpc('decrement_post_likes', { post_id: postId });
      newCount = updatedPost?.likes || 0;
      
      liked = false;
    } else {
      // Like the post
      await supabase
        .from('forum_post_likes')
        .insert({
          post_id: postId,
          user_id: userId
        });
      
      // Increment the likes count
      const { data: updatedPost } = await supabase.rpc('increment_post_likes', { post_id: postId });
      newCount = updatedPost?.likes || 0;
      
      liked = true;
    }
    
    return {
      success: true,
      message: liked ? "Post liké avec succès" : "Like retiré avec succès",
      liked,
      newCount
    };
  } catch (error) {
    console.error("Error in likePost:", error);
    toast.error("Une erreur est survenue lors du like");
    throw error;
  }
};

// Generic function to handle reply likes
export const likeReply = async (replyId: string): Promise<LikeResponse> => {
  const userId = await checkAuthentication();
  
  if (!userId) {
    throw new Error("Vous devez être connecté pour effectuer cette action");
  }
  
  try {
    // Check if the user has already liked this reply
    const { data: existingLike } = await supabase
      .from('forum_reply_likes')
      .select('id')
      .eq('reply_id', replyId)
      .eq('user_id', userId)
      .single();
    
    let liked = false;
    let newCount = 0;
    
    if (existingLike) {
      // Unlike the reply
      await supabase
        .from('forum_reply_likes')
        .delete()
        .eq('reply_id', replyId)
        .eq('user_id', userId);
      
      // Decrement the likes count
      const { data: updatedReply } = await supabase.rpc('decrement_reply_likes', { reply_id: replyId });
      newCount = updatedReply?.likes || 0;
      
      liked = false;
    } else {
      // Like the reply
      await supabase
        .from('forum_reply_likes')
        .insert({
          reply_id: replyId,
          user_id: userId
        });
      
      // Increment the likes count
      const { data: updatedReply } = await supabase.rpc('increment_reply_likes', { reply_id: replyId });
      newCount = updatedReply?.likes || 0;
      
      liked = true;
    }
    
    return {
      success: true,
      message: liked ? "Réponse likée avec succès" : "Like retiré avec succès",
      liked,
      newCount
    };
  } catch (error) {
    console.error("Error in likeReply:", error);
    toast.error("Une erreur est survenue lors du like");
    throw error;
  }
};
