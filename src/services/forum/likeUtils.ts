
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Import LikeResponse from types/community
import type { LikeResponse } from "@/types/community";

// Export the type
export type { LikeResponse };

export type EntityType = 'post' | 'reply';

// Add the checkAuthentication function
export const checkAuthentication = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      return null;
    }
    return data.user.id;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return null;
  }
};

// Add the safeRpcCall function
export const safeRpcCall = async <T>(
  functionName: string,
  params: Record<string, any>
): Promise<{ data: T | null; error: any }> => {
  try {
    const { data, error } = await supabase.rpc(functionName, params);
    return { data, error };
  } catch (error) {
    console.error(`Error calling RPC function ${functionName}:`, error);
    return { data: null, error };
  }
};

// Simplified likeEntity function that only handles post and reply types
export const likeEntity = async (
  entityId: string,
  userId: string | undefined,
  entityType: EntityType,
  currentLikes: number
): Promise<LikeResponse> => {
  if (!userId) {
    toast.error('Vous devez être connecté pour liker ce contenu');
    return {
      success: false,
      message: 'Utilisateur non authentifié',
      liked: false,
      newCount: currentLikes
    };
  }

  try {
    let isLiked = false;
    
    // Handle Post likes
    if (entityType === 'post') {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('forum_post_likes')
        .select('id')
        .eq('post_id', entityId)
        .eq('user_id', userId)
        .single();

      if (existingLike) {
        // Unlike: remove the like
        await supabase
          .from('forum_post_likes')
          .delete()
          .eq('id', existingLike.id);
        isLiked = false;
      } else {
        // Like: add a new like
        await supabase
          .from('forum_post_likes')
          .insert({ post_id: entityId, user_id: userId });
        isLiked = true;
      }
    } 
    // Handle Reply likes
    else if (entityType === 'reply') {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('forum_reply_likes')
        .select('id')
        .eq('reply_id', entityId)
        .eq('user_id', userId)
        .single();

      if (existingLike) {
        // Unlike: remove the like
        await supabase
          .from('forum_reply_likes')
          .delete()
          .eq('id', existingLike.id);
        isLiked = false;
      } else {
        // Like: add a new like
        await supabase
          .from('forum_reply_likes')
          .insert({ reply_id: entityId, user_id: userId });
        isLiked = true;
      }
    }

    // Calculate new count based on like status
    const newCount = isLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1);

    return {
      success: true,
      message: isLiked ? 'Contenu liké avec succès' : 'Like retiré avec succès',
      liked: isLiked,
      newCount
    };
  } catch (error) {
    console.error(`Erreur lors du like/unlike (${entityType}):`, error);
    toast.error("Une erreur s'est produite");
    return {
      success: false,
      message: "Une erreur s'est produite",
      liked: false,
      newCount: currentLikes
    };
  }
};

// Helper functions for checking like status
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
