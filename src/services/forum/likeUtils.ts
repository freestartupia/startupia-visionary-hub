
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import type { LikeResponse } from '@/types/community';

/**
 * Check if user is authenticated and return user ID
 * @returns User ID if authenticated, null otherwise
 */
export const checkAuthentication = async (): Promise<string | null> => {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) {
    return null;
  }
  return sessionData.session.user.id;
};

/**
 * Toggle like status for a post
 * @param postId Post ID
 * @param userId User ID (optional, will be fetched from session if not provided)
 * @returns New like count and liked status
 */
export const togglePostLike = async (postId: string, userId?: string): Promise<{ newCount: number, liked: boolean }> => {
  try {
    // Fetch user ID if not provided
    if (!userId) {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error('Non authentifié');
      }
      userId = sessionData.session.user.id;
    }

    // Check if user already liked the post
    const { data: existingLike, error: likeCheckError } = await supabase
      .from('forum_post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();

    if (likeCheckError && likeCheckError.code !== 'PGRST116') {
      console.error('Erreur lors de la vérification du like:', likeCheckError);
      throw likeCheckError;
    }

    let liked = false;

    if (existingLike) {
      // User already liked post, remove the like
      const { error: unlikeError } = await supabase
        .from('forum_post_likes')
        .delete()
        .eq('id', existingLike.id);

      if (unlikeError) {
        console.error('Erreur lors du retrait du like:', unlikeError);
        throw unlikeError;
      }
    } else {
      // User has not liked post, add a like
      const { error: likeError } = await supabase
        .from('forum_post_likes')
        .insert({
          id: uuidv4(),
          post_id: postId,
          user_id: userId,
          created_at: new Date().toISOString()
        });

      if (likeError) {
        console.error('Erreur lors de l\'ajout du like:', likeError);
        throw likeError;
      }

      liked = true;
    }

    // Get updated like count
    const { data: likeCount, error: countError } = await supabase
      .from('forum_post_likes')
      .select('id', { count: 'exact' })
      .eq('post_id', postId);

    if (countError) {
      console.error('Erreur lors du comptage des likes:', countError);
      throw countError;
    }

    return {
      newCount: likeCount?.length || 0,
      liked
    };
  } catch (error) {
    console.error('Erreur lors du traitement du like:', error);
    toast.error('Erreur lors du traitement de votre like');
    throw error;
  }
};

/**
 * Toggle like status for a reply
 * @param replyId Reply ID
 * @param userId User ID (optional, will be fetched from session if not provided)
 * @returns New like count and liked status
 */
export const toggleReplyLike = async (replyId: string, userId?: string): Promise<{ newCount: number, liked: boolean }> => {
  try {
    // Fetch user ID if not provided
    if (!userId) {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error('Non authentifié');
      }
      userId = sessionData.session.user.id;
    }

    // Check if user already liked the reply
    const { data: existingLike, error: likeCheckError } = await supabase
      .from('forum_reply_likes')
      .select('id')
      .eq('reply_id', replyId)
      .eq('user_id', userId)
      .single();

    if (likeCheckError && likeCheckError.code !== 'PGRST116') {
      console.error('Erreur lors de la vérification du like:', likeCheckError);
      throw likeCheckError;
    }

    let liked = false;

    if (existingLike) {
      // User already liked reply, remove the like
      const { error: unlikeError } = await supabase
        .from('forum_reply_likes')
        .delete()
        .eq('id', existingLike.id);

      if (unlikeError) {
        console.error('Erreur lors du retrait du like:', unlikeError);
        throw unlikeError;
      }
    } else {
      // User has not liked reply, add a like
      const { error: likeError } = await supabase
        .from('forum_reply_likes')
        .insert({
          id: uuidv4(),
          reply_id: replyId,
          user_id: userId,
          created_at: new Date().toISOString()
        });

      if (likeError) {
        console.error('Erreur lors de l\'ajout du like:', likeError);
        throw likeError;
      }

      liked = true;
    }

    // Get updated like count
    const { data: likeCount, error: countError } = await supabase
      .from('forum_reply_likes')
      .select('id', { count: 'exact' })
      .eq('reply_id', replyId);

    if (countError) {
      console.error('Erreur lors du comptage des likes:', countError);
      throw countError;
    }

    return {
      newCount: likeCount?.length || 0,
      liked
    };
  } catch (error) {
    console.error('Erreur lors du traitement du like de réponse:', error);
    toast.error('Erreur lors du traitement de votre like');
    throw error;
  }
};

/**
 * Like a post with less code duplication
 * @param postId Post ID
 * @returns Response with liked status and new count
 */
export const likePost = async (postId: string): Promise<LikeResponse> => {
  try {
    const result = await togglePostLike(postId);
    
    return {
      success: true,
      liked: result.liked,
      newCount: result.newCount,
      message: result.liked ? "Post liké" : "Like retiré"
    };
  } catch (error) {
    console.error("Error in likePost:", error);
    return {
      success: false,
      liked: false,
      newCount: 0,
      message: "Erreur lors du traitement du like"
    };
  }
};

/**
 * Like a reply with less code duplication
 * @param replyId Reply ID
 * @returns Response with liked status and new count
 */
export const likeReply = async (replyId: string): Promise<LikeResponse> => {
  try {
    const result = await toggleReplyLike(replyId);
    
    return {
      success: true,
      liked: result.liked,
      newCount: result.newCount,
      message: result.liked ? "Réponse likée" : "Like retiré"
    };
  } catch (error) {
    console.error("Error in likeReply:", error);
    return {
      success: false,
      liked: false,
      newCount: 0,
      message: "Erreur lors du traitement du like"
    };
  }
};
