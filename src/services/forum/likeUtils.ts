
import { supabase } from "@/integrations/supabase/client";

export interface LikeResponse {
  success: boolean;
  message: string;
  liked: boolean;
  newCount: number;
}

// Fonction utilitaire pour vérifier l'authentification
export const checkAuthentication = async (): Promise<string | null> => {
  const { data } = await supabase.auth.getSession();
  if (!data.session?.user) {
    return null;
  }
  return data.session.user.id;
};

// Fonction sécurisée pour appeler RPC
export const safeRpcCall = async <T>(
  fnName: string, 
  params: Record<string, any>
): Promise<T | null> => {
  try {
    const { data, error } = await supabase.rpc(fnName, params);
    if (error) {
      console.error(`Error calling ${fnName}:`, error);
      return null;
    }
    return data as T;
  } catch (error) {
    console.error(`Exception calling ${fnName}:`, error);
    return null;
  }
};

// Fonction générique pour liker/unliker un post
export const likePost = async (postId: string): Promise<LikeResponse> => {
  try {
    const userId = await checkAuthentication();
    
    if (!userId) {
      return {
        success: false,
        message: "Authentication required",
        liked: false,
        newCount: 0
      };
    }
    
    // Vérifier si l'utilisateur a déjà liké
    const { data: existingLike, error: likeError } = await supabase
      .from('forum_post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();
      
    if (likeError && likeError.code !== 'PGRST116') {
      console.error(`Error checking existing post like:`, likeError);
      throw likeError;
    }
    
    if (existingLike) {
      // Unlike: Remove like
      const { error: unlikeError } = await supabase
        .from('forum_post_likes')
        .delete()
        .eq('id', existingLike.id);
        
      if (unlikeError) {
        console.error(`Error unliking post:`, unlikeError);
        throw unlikeError;
      }
      
      return {
        success: true,
        message: `Post unliked successfully`,
        liked: false,
        newCount: 0 // Placeholder, will be updated by the caller
      };
    } else {
      // Like: Add new like
      const { error: addLikeError } = await supabase
        .from('forum_post_likes')
        .insert({
          post_id: postId,
          user_id: userId
        });
        
      if (addLikeError) {
        console.error(`Error liking post:`, addLikeError);
        throw addLikeError;
      }
      
      return {
        success: true,
        message: `Post liked successfully`,
        liked: true,
        newCount: 0 // Placeholder, will be updated by the caller
      };
    }
  } catch (error) {
    console.error(`Error in likePost:`, error);
    throw error;
  }
};

// Fonction générique pour liker/unliker une réponse
export const likeReply = async (replyId: string): Promise<LikeResponse> => {
  try {
    const userId = await checkAuthentication();
    
    if (!userId) {
      return {
        success: false,
        message: "Authentication required",
        liked: false,
        newCount: 0
      };
    }
    
    // Vérifier si l'utilisateur a déjà liké
    const { data: existingLike, error: likeError } = await supabase
      .from('forum_reply_likes')
      .select('id')
      .eq('reply_id', replyId)
      .eq('user_id', userId)
      .single();
      
    if (likeError && likeError.code !== 'PGRST116') {
      console.error(`Error checking existing reply like:`, likeError);
      throw likeError;
    }
    
    if (existingLike) {
      // Unlike: Remove like
      const { error: unlikeError } = await supabase
        .from('forum_reply_likes')
        .delete()
        .eq('id', existingLike.id);
        
      if (unlikeError) {
        console.error(`Error unliking reply:`, unlikeError);
        throw unlikeError;
      }
      
      return {
        success: true,
        message: `Reply unliked successfully`,
        liked: false,
        newCount: 0 // Placeholder, will be updated by the caller
      };
    } else {
      // Like: Add new like
      const { error: addLikeError } = await supabase
        .from('forum_reply_likes')
        .insert({
          reply_id: replyId,
          user_id: userId
        });
        
      if (addLikeError) {
        console.error(`Error liking reply:`, addLikeError);
        throw addLikeError;
      }
      
      return {
        success: true,
        message: `Reply liked successfully`,
        liked: true,
        newCount: 0 // Placeholder, will be updated by the caller
      };
    }
  } catch (error) {
    console.error(`Error in likeReply:`, error);
    throw error;
  }
};
