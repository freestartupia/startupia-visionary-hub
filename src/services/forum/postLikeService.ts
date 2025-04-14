
import { LikeResponse } from '@/types/community';
import { 
  checkAuthentication, 
  checkIfUserLiked, 
  getLikeCount, 
  addLike, 
  removeLike 
} from './likeUtils';

// Get like status for a post
export const getPostLikeStatus = async (postId: string): Promise<{ liked: boolean; count: number }> => {
  try {
    const userId = await checkAuthentication();
    if (!userId) {
      return { liked: false, count: 0 };
    }
    
    const liked = await checkIfUserLiked('forum_post_likes', 'post_id', postId, userId);
    const count = await getLikeCount('forum_post_likes', 'post_id', postId);
    
    return { liked, count };
  } catch (error) {
    console.error('Error getting post like status:', error);
    return { liked: false, count: 0 };
  }
};

// Toggle like status for a post
export const togglePostLike = async (postId: string): Promise<LikeResponse> => {
  try {
    const userId = await checkAuthentication();
    
    if (!userId) {
      return { 
        success: false, 
        message: 'Vous devez être connecté pour aimer un post',
        liked: false,
        newCount: 0
      };
    }
    
    const isLiked = await checkIfUserLiked('forum_post_likes', 'post_id', postId, userId);
    
    if (isLiked) {
      return await unlikePost(postId);
    } else {
      return await likePost(postId);
    }
  } catch (error) {
    console.error('Error toggling post like:', error);
    return { 
      success: false, 
      message: 'Une erreur est survenue',
      liked: false,
      newCount: 0
    };
  }
};

// Get the number of likes for a post
export const getPostLikeCount = async (postId: string): Promise<number> => {
  return await getLikeCount('forum_post_likes', 'post_id', postId);
};

// Check if the current user has liked a post
export const checkIfUserLikedPost = async (postId: string): Promise<boolean> => {
  const userId = await checkAuthentication();
  if (!userId) return false;
  
  return await checkIfUserLiked('forum_post_likes', 'post_id', postId, userId);
};

// Like a post
export const likePost = async (postId: string): Promise<LikeResponse> => {
  return await addLike('forum_post_likes', postId, 'post_id');
};

// Unlike a post
export const unlikePost = async (postId: string): Promise<LikeResponse> => {
  return await removeLike('forum_post_likes', postId, 'post_id');
};
