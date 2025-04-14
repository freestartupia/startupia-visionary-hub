
import { supabase } from '@/integrations/supabase/client';

export type LikeTableName = 'forum_post_likes' | 'forum_reply_likes';
export type ItemIdField = 'post_id' | 'reply_id';

/**
 * Check if user is authenticated
 */
export const checkAuthentication = async (): Promise<{ authenticated: boolean, userId?: string }> => {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error || !data.user) {
      console.error('Authentication check failed:', error);
      return { authenticated: false };
    }
    
    return { authenticated: true, userId: data.user.id };
  } catch (error) {
    console.error('Error checking authentication:', error);
    return { authenticated: false };
  }
};

/**
 * Generic function to add a like
 */
export const addLike = async (
  tableName: LikeTableName,
  idField: ItemIdField,
  itemId: string,
  userId: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from(tableName)
      .insert({
        [idField]: itemId,
        user_id: userId
      });
      
    if (error) {
      console.error(`Error adding like to ${tableName}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error adding like to ${tableName}:`, error);
    return false;
  }
};

/**
 * Generic function to remove a like
 */
export const removeLike = async (
  tableName: LikeTableName,
  idField: ItemIdField,
  itemId: string,
  userId: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq(idField, itemId)
      .eq('user_id', userId);
      
    if (error) {
      console.error(`Error removing like from ${tableName}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error removing like from ${tableName}:`, error);
    return false;
  }
};
