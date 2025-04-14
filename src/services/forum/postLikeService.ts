
import { supabase } from '@/integrations/supabase/client';
import { ForumPost } from '@/types/community';
import { 
  checkAuthentication, 
  LikeResponse, 
  checkIfUserLiked, 
  addLike, 
  removeLike,
  getLikeCount
} from './likeUtils';

export const getPostLikeCount = async (postId: string): Promise<number> => {
  return getLikeCount('forum_post', postId);
};

export const checkIfUserLikedPost = async (postId: string): Promise<boolean> => {
  return checkIfUserLiked('forum_post', postId);
};

export const likePost = async (postId: string): Promise<LikeResponse> => {
  return addLike('forum_post', postId);
};

export const unlikePost = async (postId: string): Promise<LikeResponse> => {
  return removeLike('forum_post', postId);
};

// Add the missing function that's being imported elsewhere
export const getPostLikeStatus = async (postId: string, userId?: string): Promise<boolean> => {
  if (!userId) {
    const id = await checkAuthentication();
    if (!id) return false;
    userId = id;
  }
  
  try {
    const { data, error } = await supabase
      .from('forum_post_likes')
      .select('*')
      .eq('user_id', userId)
      .eq('forum_post_id', postId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error checking post like status:', error);
    }
    
    return !!data;
  } catch (error) {
    console.error('Error checking post like status:', error);
    return false;
  }
};

export const togglePostLike = async (postId: string): Promise<LikeResponse> => {
  try {
    const userId = await checkAuthentication();
    
    if (!userId) {
      return { success: false, error: 'Vous devez être connecté pour aimer un post' };
    }
    
    const isLiked = await checkIfUserLikedPost(postId);
    
    let result: LikeResponse;
    if (isLiked) {
      result = await unlikePost(postId);
    } else {
      result = await likePost(postId);
    }
    
    return result;
  } catch (error) {
    console.error('Error toggling post like:', error);
    return { success: false, error: 'Une erreur est survenue' };
  }
};
