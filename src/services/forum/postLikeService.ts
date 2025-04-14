
import { supabase } from '@/integrations/supabase/client';
import { LikeResponse } from '@/types/community';
import { checkAuthentication, checkIfUserLiked, getLikeCount, addLike, removeLike } from './likeUtils';

// Get like status for a post
export const getPostLikeStatus = async (postId: string): Promise<{ liked: boolean; count: number }> => {
  try {
    const liked = await checkIfUserLiked('forum_post', postId);
    const count = await getLikeCount('forum_post', postId);
    
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
      return { success: false, error: 'Vous devez être connecté pour aimer un post' };
    }
    
    const isLiked = await checkIfUserLiked('forum_post', postId);
    
    if (isLiked) {
      return await unlikePost(postId);
    } else {
      return await likePost(postId);
    }
  } catch (error) {
    console.error('Error toggling post like:', error);
    return { success: false, error: 'Une erreur est survenue' };
  }
};

// Get the number of likes for a post
export const getPostLikeCount = async (postId: string): Promise<number> => {
  return await getLikeCount('forum_post', postId);
};

// Check if the current user has liked a post
export const checkIfUserLikedPost = async (postId: string): Promise<boolean> => {
  return await checkIfUserLiked('forum_post', postId);
};

// Like a post
export const likePost = async (postId: string): Promise<LikeResponse> => {
  return await addLike('forum_post', postId);
};

// Unlike a post
export const unlikePost = async (postId: string): Promise<LikeResponse> => {
  return await removeLike('forum_post', postId);
};
