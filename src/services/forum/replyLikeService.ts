
import { supabase } from '@/integrations/supabase/client';
import { ForumReply } from '@/types/community';
import { 
  checkAuthentication, 
  LikeResponse, 
  checkIfUserLiked, 
  addLike, 
  removeLike,
  getLikeCount
} from './likeUtils';

export const getReplyLikeCount = async (replyId: string): Promise<number> => {
  return getLikeCount('forum_reply', replyId);
};

export const checkIfUserLikedReply = async (replyId: string): Promise<boolean> => {
  return checkIfUserLiked('forum_reply', replyId);
};

export const likeReply = async (replyId: string): Promise<LikeResponse> => {
  return addLike('forum_reply', replyId);
};

export const unlikeReply = async (replyId: string): Promise<LikeResponse> => {
  return removeLike('forum_reply', replyId);
};

// Add the missing function that's being imported elsewhere
export const getReplyLikeStatus = async (replyId: string, userId?: string): Promise<boolean> => {
  if (!userId) {
    const id = await checkAuthentication();
    if (!id) return false;
    userId = id;
  }
  
  try {
    const { data, error } = await supabase
      .from('forum_reply_likes')
      .select('*')
      .eq('user_id', userId)
      .eq('forum_reply_id', replyId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error checking reply like status:', error);
    }
    
    return !!data;
  } catch (error) {
    console.error('Error checking reply like status:', error);
    return false;
  }
};

export const toggleReplyLike = async (replyId: string): Promise<LikeResponse> => {
  try {
    const userId = await checkAuthentication();
    
    if (!userId) {
      return { success: false, error: 'Vous devez être connecté pour aimer une réponse' };
    }
    
    const isLiked = await checkIfUserLikedReply(replyId);
    
    let result: LikeResponse;
    if (isLiked) {
      result = await unlikeReply(replyId);
    } else {
      result = await likeReply(replyId);
    }
    
    return result;
  } catch (error) {
    console.error('Error toggling reply like:', error);
    return { success: false, error: 'Une erreur est survenue' };
  }
};
