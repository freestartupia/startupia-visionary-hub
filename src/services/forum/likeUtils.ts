
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LikeResponse } from "@/types/community";

/**
 * Check if the user is authenticated
 */
export const checkAuthentication = async (): Promise<string | null> => {
  const { data, error } = await supabase.auth.getUser();
  
  if (error || !data.user) {
    toast.error("Vous devez être connecté pour effectuer cette action");
    return null;
  }
  
  return data.user.id;
};

/**
 * Safe RPC call utility to handle errors consistently
 */
export const safeRpcCall = async <T>(
  fn: () => Promise<{ data: T | null; error: any }>,
  errorMessage: string = "Une erreur est survenue"
): Promise<{ success: boolean; data?: T; error?: string }> => {
  try {
    const { data, error } = await fn();
    
    if (error) {
      console.error(`Error in RPC call:`, error);
      toast.error(errorMessage);
      return { success: false, error: error.message };
    }
    
    return { success: true, data: data! };
  } catch (error) {
    console.error(`Exception in RPC call:`, error);
    toast.error(errorMessage);
    return { success: false, error: String(error) };
  }
};

/**
 * Get total like count for a post or reply
 */
export const getLikeCount = async (
  table: 'forum_post_likes' | 'forum_reply_likes',
  idField: 'post_id' | 'reply_id',
  id: string
): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true })
      .eq(idField, id);
      
    if (error) {
      console.error(`Error getting like count for ${table}:`, error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error(`Error getting like count for ${table}:`, error);
    return 0;
  }
};

/**
 * Check if a user has liked a post or reply
 */
export const checkIfUserLiked = async (
  table: 'forum_post_likes' | 'forum_reply_likes',
  idField: 'post_id' | 'reply_id',
  id: string,
  userId: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from(table)
      .select('id')
      .eq(idField, id)
      .eq('user_id', userId)
      .single();
      
    if (error && error.code !== 'PGRST116') {
      console.error(`Error checking if user liked ${table}:`, error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error(`Error checking if user liked ${table}:`, error);
    return false;
  }
};

/**
 * Like a post or reply
 */
export const like = async (
  table: 'forum_post_likes' | 'forum_reply_likes',
  record: Record<string, string>
): Promise<LikeResponse> => {
  try {
    const { error } = await supabase.from(table).insert([record]);
      
    if (error) {
      console.error(`Error liking ${table}:`, error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Error liking ${table}:`, error);
    return { success: false, error: String(error) };
  }
};

/**
 * Unlike a post or reply
 */
export const unlike = async (
  table: 'forum_post_likes' | 'forum_reply_likes',
  idField: 'post_id' | 'reply_id',
  id: string,
  userId: string
): Promise<LikeResponse> => {
  try {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq(idField, id)
      .eq('user_id', userId);
      
    if (error) {
      console.error(`Error unliking ${table}:`, error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Error unliking ${table}:`, error);
    return { success: false, error: String(error) };
  }
};
