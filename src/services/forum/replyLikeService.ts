
import { supabase } from '@/integrations/supabase/client';
import { ForumReply } from '@/types/community';
import { 
  checkAuthentication, 
  LikeResponse, 
  checkIfUserLiked, 
  addLike, 
  removeLike 
} from './likeUtils';

export const getReplyLikeCount = async (replyId: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('forum_reply_likes')
      .select('*', { count: 'exact', head: true })
      .eq('forum_reply_id', replyId);
    
    if (error) {
      console.error('Error getting reply like count:', error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error('Error getting reply like count:', error);
    return 0;
  }
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

export const toggleReplyLike = async (reply: ForumReply): Promise<LikeResponse> => {
  try {
    const userId = await checkAuthentication();
    
    if (!userId) {
      return { success: false, error: 'Vous devez être connecté pour aimer une réponse' };
    }
    
    const isLiked = await checkIfUserLikedReply(reply.id);
    
    if (isLiked) {
      return unlikeReply(reply.id);
    } else {
      return likeReply(reply.id);
    }
  } catch (error) {
    console.error('Error toggling reply like:', error);
    return { success: false, error: 'Une erreur est survenue' };
  }
};
