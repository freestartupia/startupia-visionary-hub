
import { LikeResponse } from '@/types/community';
import { checkAuthentication, checkIfUserLiked, getLikeCount, addLike, removeLike } from './likeUtils';

// Get like status for a reply
export const getReplyLikeStatus = async (replyId: string): Promise<{ liked: boolean; count: number }> => {
  try {
    const liked = await checkIfUserLiked('forum_reply', replyId);
    const count = await getLikeCount('forum_reply', replyId);
    
    return { liked, count };
  } catch (error) {
    console.error('Error getting reply like status:', error);
    return { liked: false, count: 0 };
  }
};

// Toggle like status for a reply
export const toggleReplyLike = async (replyId: string): Promise<LikeResponse> => {
  try {
    const userId = await checkAuthentication();
    
    if (!userId) {
      return { 
        success: false, 
        message: 'Vous devez être connecté pour aimer une réponse' 
      };
    }
    
    const isLiked = await checkIfUserLiked('forum_reply', replyId);
    
    if (isLiked) {
      return await unlikeReply(replyId);
    } else {
      return await likeReply(replyId);
    }
  } catch (error) {
    console.error('Error toggling reply like:', error);
    return { 
      success: false, 
      message: 'Une erreur est survenue' 
    };
  }
};

// Get the number of likes for a reply
export const getReplyLikeCount = async (replyId: string): Promise<number> => {
  return await getLikeCount('forum_reply', replyId);
};

// Check if the current user has liked a reply
export const checkIfUserLikedReply = async (replyId: string): Promise<boolean> => {
  return await checkIfUserLiked('forum_reply', replyId);
};

// Like a reply
export const likeReply = async (replyId: string): Promise<LikeResponse> => {
  return await addLike('forum_reply', replyId);
};

// Unlike a reply
export const unlikeReply = async (replyId: string): Promise<LikeResponse> => {
  return await removeLike('forum_reply', replyId);
};
