
import { supabase } from '@/integrations/supabase/client';
import { LikeResponse } from '@/types/community';

export type LikeTableName = 'forum_post_likes' | 'forum_reply_likes';
export type ItemIdField = 'post_id' | 'reply_id';

/**
 * Check if user is authenticated
 */
export const checkAuthentication = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error || !data.user) {
      console.error('Authentication check failed:', error);
      return null;
    }
    
    return data.user.id;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return null;
  }
};

/**
 * Check if a user has liked an item
 */
export const checkIfUserLiked = async (
  tableName: LikeTableName,
  idField: ItemIdField,
  itemId: string,
  userId: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('id')
      .eq(idField, itemId)
      .eq('user_id', userId)
      .single();
      
    if (error) {
      // If error is 'No rows found', it means user hasn't liked
      if (error.code === 'PGRST116') {
        return false;
      }
      console.error(`Error checking if user liked in ${tableName}:`, error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error(`Error checking if user liked in ${tableName}:`, error);
    return false;
  }
};

/**
 * Get the count of likes for an item
 */
export const getLikeCount = async (
  tableName: LikeTableName,
  idField: ItemIdField,
  itemId: string
): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from(tableName)
      .select('id', { count: 'exact' })
      .eq(idField, itemId);
      
    if (error) {
      console.error(`Error getting like count from ${tableName}:`, error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error(`Error getting like count from ${tableName}:`, error);
    return 0;
  }
};

/**
 * Generic function to add a like and return the response
 */
export const addLike = async (
  tableName: LikeTableName,
  itemId: string,
  idField: ItemIdField
): Promise<LikeResponse> => {
  try {
    const userId = await checkAuthentication();
    
    if (!userId) {
      return { 
        success: false, 
        message: 'Vous devez être connecté pour aimer ce contenu',
        liked: false,
        newCount: 0
      };
    }
    
    // Insert the like
    const insertData = idField === 'post_id' 
      ? { post_id: itemId, user_id: userId }
      : { reply_id: itemId, user_id: userId };
      
    const { error } = await supabase
      .from(tableName)
      .insert(insertData);
      
    if (error) {
      console.error(`Error adding like to ${tableName}:`, error);
      return { 
        success: false, 
        message: 'Une erreur est survenue',
        liked: false,
        newCount: 0
      };
    }
    
    // Get new count
    const newCount = await getLikeCount(tableName, idField, itemId);
    
    return { 
      success: true, 
      message: 'Contenu liké avec succès',
      liked: true,
      newCount
    };
  } catch (error) {
    console.error(`Error adding like to ${tableName}:`, error);
    return { 
      success: false, 
      message: 'Une erreur est survenue',
      liked: false,
      newCount: 0
    };
  }
};

/**
 * Generic function to remove a like and return the response
 */
export const removeLike = async (
  tableName: LikeTableName,
  itemId: string,
  idField: ItemIdField
): Promise<LikeResponse> => {
  try {
    const userId = await checkAuthentication();
    
    if (!userId) {
      return { 
        success: false, 
        message: 'Vous devez être connecté pour retirer votre appréciation',
        liked: true,
        newCount: 0
      };
    }
    
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq(idField, itemId)
      .eq('user_id', userId);
      
    if (error) {
      console.error(`Error removing like from ${tableName}:`, error);
      return { 
        success: false, 
        message: 'Une erreur est survenue',
        liked: true,
        newCount: 0
      };
    }
    
    // Get new count
    const newCount = await getLikeCount(tableName, idField, itemId);
    
    return { 
      success: true, 
      message: 'Appréciation retirée avec succès',
      liked: false,
      newCount
    };
  } catch (error) {
    console.error(`Error removing like from ${tableName}:`, error);
    return { 
      success: false, 
      message: 'Une erreur est survenue',
      liked: true,
      newCount: 0
    };
  }
};
