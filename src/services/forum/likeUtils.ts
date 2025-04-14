
import { supabase } from '@/integrations/supabase/client';
import { LikeResponse } from '@/types/community';

// Get the current user's ID or null if not authenticated
export const checkAuthentication = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error || !data.user) {
      console.error('Authentication error:', error);
      return null;
    }
    
    return data.user.id;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
};

// Check if a user has liked a specific item (post or reply)
export const checkIfUserLiked = async (
  tableName: 'forum_post_likes' | 'forum_reply_likes',
  idField: string,
  itemId: string,
  userId: string
): Promise<boolean> => {
  try {
    if (tableName === 'forum_post_likes') {
      const { data, error } = await supabase
        .from('forum_post_likes')
        .select('id')
        .eq(idField, itemId)
        .eq('user_id', userId)
        .maybeSingle();
        
      if (error) {
        console.error('Error checking post like status:', error);
        return false;
      }
      
      return !!data;
    } else {
      const { data, error } = await supabase
        .from('forum_reply_likes')
        .select('id')
        .eq(idField, itemId)
        .eq('user_id', userId)
        .maybeSingle();
        
      if (error) {
        console.error('Error checking reply like status:', error);
        return false;
      }
      
      return !!data;
    }
  } catch (error) {
    console.error(`Error checking like status:`, error);
    return false;
  }
};

// Get the count of likes for a specific item (post or reply)
export const getLikeCount = async (
  tableName: 'forum_post_likes' | 'forum_reply_likes',
  idField: string,
  itemId: string
): Promise<number> => {
  try {
    if (tableName === 'forum_post_likes') {
      const { count, error } = await supabase
        .from('forum_post_likes')
        .select('id', { count: 'exact', head: true })
        .eq(idField, itemId);
        
      if (error) {
        console.error('Error getting post like count:', error);
        return 0;
      }
      
      return count || 0;
    } else {
      const { count, error } = await supabase
        .from('forum_reply_likes')
        .select('id', { count: 'exact', head: true })
        .eq(idField, itemId);
        
      if (error) {
        console.error('Error getting reply like count:', error);
        return 0;
      }
      
      return count || 0;
    }
  } catch (error) {
    console.error(`Error getting like count:`, error);
    return 0;
  }
};

// Add a like to a specific item (post or reply)
export const addLike = async (
  tableName: 'forum_post_likes' | 'forum_reply_likes',
  itemId: string,
  idField: string
): Promise<LikeResponse> => {
  try {
    const userId = await checkAuthentication();
    
    if (!userId) {
      return { 
        success: false, 
        message: 'Vous devez être connecté pour aimer un contenu',
        liked: false,
        newCount: 0
      };
    }
    
    // Check if already liked
    const alreadyLiked = await checkIfUserLiked(tableName, idField, itemId, userId);
    
    if (alreadyLiked) {
      return { 
        success: true, 
        message: 'Vous avez déjà aimé ce contenu',
        liked: true,
        newCount: await getLikeCount(tableName, idField, itemId)
      };
    }
    
    // Add the like
    if (tableName === 'forum_post_likes') {
      const { error } = await supabase
        .from('forum_post_likes')
        .insert({
          post_id: itemId,
          user_id: userId
        });
        
      if (error) {
        console.error('Error adding post like:', error);
        return { 
          success: false, 
          message: 'Erreur lors de l\'ajout du like',
          liked: false,
          newCount: 0
        };
      }
    } else {
      const { error } = await supabase
        .from('forum_reply_likes')
        .insert({
          reply_id: itemId,
          user_id: userId
        });
        
      if (error) {
        console.error('Error adding reply like:', error);
        return { 
          success: false, 
          message: 'Erreur lors de l\'ajout du like',
          liked: false,
          newCount: 0
        };
      }
    }
    
    const newCount = await getLikeCount(tableName, idField, itemId);
    
    return { 
      success: true, 
      message: 'Contenu aimé',
      liked: true,
      newCount
    };
  } catch (error) {
    console.error(`Error adding like:`, error);
    return { 
      success: false, 
      message: 'Une erreur est survenue',
      liked: false,
      newCount: 0
    };
  }
};

// Remove a like from a specific item (post or reply)
export const removeLike = async (
  tableName: 'forum_post_likes' | 'forum_reply_likes',
  itemId: string,
  idField: string
): Promise<LikeResponse> => {
  try {
    const userId = await checkAuthentication();
    
    if (!userId) {
      return { 
        success: false, 
        message: 'Vous devez être connecté pour ne plus aimer un contenu',
        liked: false,
        newCount: 0
      };
    }
    
    // Check if already liked
    const alreadyLiked = await checkIfUserLiked(tableName, idField, itemId, userId);
    
    if (!alreadyLiked) {
      return { 
        success: true, 
        message: 'Vous n\'avez pas aimé ce contenu',
        liked: false,
        newCount: await getLikeCount(tableName, idField, itemId)
      };
    }
    
    // Remove the like
    if (tableName === 'forum_post_likes') {
      const { error } = await supabase
        .from('forum_post_likes')
        .delete()
        .eq(idField, itemId)
        .eq('user_id', userId);
        
      if (error) {
        console.error('Error removing post like:', error);
        return { 
          success: false, 
          message: 'Erreur lors de la suppression du like',
          liked: true,
          newCount: 0
        };
      }
    } else {
      const { error } = await supabase
        .from('forum_reply_likes')
        .delete()
        .eq(idField, itemId)
        .eq('user_id', userId);
        
      if (error) {
        console.error('Error removing reply like:', error);
        return { 
          success: false, 
          message: 'Erreur lors de la suppression du like',
          liked: true,
          newCount: 0
        };
      }
    }
    
    const newCount = await getLikeCount(tableName, idField, itemId);
    
    return { 
      success: true, 
      message: 'Like supprimé',
      liked: false,
      newCount
    };
  } catch (error) {
    console.error(`Error removing like:`, error);
    return { 
      success: false, 
      message: 'Une erreur est survenue',
      liked: true,
      newCount: 0
    };
  }
};
