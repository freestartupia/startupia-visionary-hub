
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

// LikeResponse interface for consistent return types
export interface LikeResponse {
  success: boolean;
  message: string;
  likeCount?: number;
  liked?: boolean;
  // Add these properties that are being used in the components
  newCount?: number;
}

// Authentication check utility
export const checkAuthentication = (user: User | null): LikeResponse | null => {
  if (!user) {
    return {
      success: false,
      message: "Vous devez être connecté pour effectuer cette action"
    };
  }
  return null;
};

// Prepare post ID for database operations
export const preparePostId = (postId: string): string => {
  return postId;
};

// Safe RPC call utility function
export async function safeRpcCall<T>(
  functionName: string,
  params: Record<string, any>
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const { data, error } = await supabase.rpc(functionName, params);
    
    if (error) {
      console.error(`Error calling RPC function ${functionName}:`, error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error(`Exception in RPC function ${functionName}:`, error);
    return { data: null, error: error as Error };
  }
}

// Fetch current like status
export async function fetchLikeStatus(postId: string, userId: string, type: string = 'post') {
  const { data, error } = await supabase
    .from(type === 'post' ? 'forum_post_likes' : 'forum_reply_likes')
    .select('*')
    .eq(type === 'post' ? 'post_id' : 'reply_id', postId)
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGSQL_ERROR') {
    console.error('Error fetching like status:', error);
  }

  return { data, error };
}

// Count likes for a post or reply
export async function countLikes(id: string, type: string = 'post') {
  const { count, error } = await supabase
    .from(type === 'post' ? 'forum_post_likes' : 'forum_reply_likes')
    .select('*', { count: 'exact', head: true })
    .eq(type === 'post' ? 'post_id' : 'reply_id', id);

  if (error) {
    console.error('Error counting likes:', error);
    return 0;
  }

  return count || 0;
}
