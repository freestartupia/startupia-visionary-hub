
import { supabase } from '@/integrations/supabase/client';
import { LikeResponse } from '@/types/community';

// Check if user is authenticated and return userId
export const checkAuthentication = async (): Promise<string | null> => {
  const { data, error } = await supabase.auth.getUser();
  
  if (error || !data.user) {
    return null;
  }
  
  return data.user.id;
};

// Check if the current user has liked a specific content
export const checkIfUserLiked = async (contentType: 'forum_post' | 'forum_reply', contentId: string): Promise<boolean> => {
  try {
    const userId = await checkAuthentication();
    
    if (!userId) {
      return false;
    }
    
    const table = contentType === 'forum_post' ? 'forum_post_likes' : 'forum_reply_likes';
    const idField = contentType === 'forum_post' ? 'post_id' : 'reply_id';
    
    const { data, error } = await supabase
      .from(table)
      .select('id')
      .eq(idField, contentId)
      .eq('user_id', userId)
      .maybeSingle();
      
    if (error) {
      console.error(`Error checking if user liked ${contentType}:`, error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error(`Error checking if user liked ${contentType}:`, error);
    return false;
  }
};

// Get the number of likes for a specific content
export const getLikeCount = async (contentType: 'forum_post' | 'forum_reply', contentId: string): Promise<number> => {
  try {
    const table = contentType === 'forum_post' ? 'forum_post_likes' : 'forum_reply_likes';
    const idField = contentType === 'forum_post' ? 'post_id' : 'reply_id';
    
    const { count, error } = await supabase
      .from(table)
      .select('id', { count: 'exact' })
      .eq(idField, contentId);
      
    if (error) {
      console.error(`Error getting like count for ${contentType}:`, error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error(`Error getting like count for ${contentType}:`, error);
    return 0;
  }
};

// Add a like to a specific content
export const addLike = async (contentType: 'forum_post' | 'forum_reply', contentId: string): Promise<LikeResponse> => {
  try {
    const userId = await checkAuthentication();
    
    if (!userId) {
      return { 
        success: false, 
        message: 'Vous devez être connecté pour aimer ce contenu' 
      };
    }
    
    const table = contentType === 'forum_post' ? 'forum_post_likes' : 'forum_reply_likes';
    const idField = contentType === 'forum_post' ? 'post_id' : 'reply_id';
    
    const { error } = await supabase
      .from(table)
      .insert({
        [idField]: contentId,
        user_id: userId
      });
      
    if (error) {
      console.error(`Error adding like to ${contentType}:`, error);
      return { 
        success: false, 
        message: 'Une erreur est survenue' 
      };
    }
    
    return { success: true, message: 'Like ajouté avec succès' };
  } catch (error) {
    console.error(`Error adding like to ${contentType}:`, error);
    return { 
      success: false, 
      message: 'Une erreur est survenue' 
    };
  }
};

// Remove a like from a specific content
export const removeLike = async (contentType: 'forum_post' | 'forum_reply', contentId: string): Promise<LikeResponse> => {
  try {
    const userId = await checkAuthentication();
    
    if (!userId) {
      return { 
        success: false, 
        message: 'Vous devez être connecté pour retirer votre like' 
      };
    }
    
    const table = contentType === 'forum_post' ? 'forum_post_likes' : 'forum_reply_likes';
    const idField = contentType === 'forum_post' ? 'post_id' : 'reply_id';
    
    const { error } = await supabase
      .from(table)
      .delete()
      .eq(idField, contentId)
      .eq('user_id', userId);
      
    if (error) {
      console.error(`Error removing like from ${contentType}:`, error);
      return { 
        success: false, 
        message: 'Une erreur est survenue' 
      };
    }
    
    return { success: true, message: 'Like retiré avec succès' };
  } catch (error) {
    console.error(`Error removing like from ${contentType}:`, error);
    return { 
      success: false, 
      message: 'Une erreur est survenue' 
    };
  }
};
