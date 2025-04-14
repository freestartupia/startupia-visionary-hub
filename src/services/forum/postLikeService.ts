
import { supabase } from '@/integrations/supabase/client';
import { ForumPost } from '@/types/community';
import { 
  checkAuthentication, 
  LikeResponse, 
  checkIfUserLiked, 
  addLike, 
  removeLike 
} from './likeUtils';

export const getLikeCount = async (postId: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('forum_post_likes')
      .select('*', { count: 'exact', head: true })
      .eq('forum_post_id', postId);
    
    if (error) {
      console.error('Error getting post like count:', error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error('Error getting post like count:', error);
    return 0;
  }
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

export const togglePostLike = async (post: ForumPost): Promise<LikeResponse> => {
  try {
    const userId = await checkAuthentication();
    
    if (!userId) {
      return { success: false, error: 'Vous devez être connecté pour aimer un post' };
    }
    
    const isLiked = await checkIfUserLikedPost(post.id);
    
    if (isLiked) {
      return unlikePost(post.id);
    } else {
      return likePost(post.id);
    }
  } catch (error) {
    console.error('Error toggling post like:', error);
    return { success: false, error: 'Une erreur est survenue' };
  }
};
