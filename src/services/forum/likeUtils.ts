
import { LikeResponse } from '@/types/community';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type EntityType = 'post' | 'reply' | 'resource' | 'project';

// Export the LikeResponse type
export { LikeResponse };

// Add the checkAuthentication function
export const checkAuthentication = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      return null;
    }
    return data.user.id;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return null;
  }
};

// Add the safeRpcCall function
export const safeRpcCall = async <T>(
  functionName: string,
  params: Record<string, any>
): Promise<{ data: T | null; error: any }> => {
  try {
    const { data, error } = await supabase.rpc(functionName, params);
    return { data, error };
  } catch (error) {
    console.error(`Error calling RPC function ${functionName}:`, error);
    return { data: null, error };
  }
};

export const likeEntity = async (
  entityId: string,
  userId: string | undefined,
  entityType: EntityType,
  currentLikes: number
): Promise<LikeResponse> => {
  if (!userId) {
    toast.error('Vous devez être connecté pour liker ce contenu');
    return {
      success: false,
      message: 'Utilisateur non authentifié',
      liked: false,
      newCount: currentLikes
    };
  }

  try {
    let table: string;
    let column: string;

    switch (entityType) {
      case 'post':
        table = 'forum_post_likes';
        column = 'post_id';
        break;
      case 'reply':
        table = 'forum_reply_likes';
        column = 'reply_id';
        break;
      case 'resource':
        table = 'resource_likes';
        column = 'resource_id';
        break;
      case 'project':
        table = 'project_likes';
        column = 'project_id';
        break;
      default:
        throw new Error(`Type d'entité non supporté: ${entityType}`);
    }

    // Check if already liked - use explicit table names instead of dynamic ones
    if (entityType === 'post') {
      const { data: existingLike } = await supabase
        .from('forum_post_likes')
        .select('id')
        .eq('post_id', entityId)
        .eq('user_id', userId)
        .single();

      if (existingLike) {
        // Unlike: remove the like
        await supabase
          .from('forum_post_likes')
          .delete()
          .eq('id', existingLike.id);
      } else {
        // Like: add a new like
        await supabase
          .from('forum_post_likes')
          .insert({ post_id: entityId, user_id: userId });
      }
    } else if (entityType === 'reply') {
      const { data: existingLike } = await supabase
        .from('forum_reply_likes')
        .select('id')
        .eq('reply_id', entityId)
        .eq('user_id', userId)
        .single();

      if (existingLike) {
        // Unlike: remove the like
        await supabase
          .from('forum_reply_likes')
          .delete()
          .eq('id', existingLike.id);
      } else {
        // Like: add a new like
        await supabase
          .from('forum_reply_likes')
          .insert({ reply_id: entityId, user_id: userId });
      }
    } else if (entityType === 'resource') {
      const { data: existingLike } = await supabase
        .from('resource_likes')
        .select('id')
        .eq('resource_id', entityId)
        .eq('user_id', userId)
        .single();

      if (existingLike) {
        // Unlike: remove the like
        await supabase
          .from('resource_likes')
          .delete()
          .eq('id', existingLike.id);
      } else {
        // Like: add a new like
        await supabase
          .from('resource_likes')
          .insert({ resource_id: entityId, user_id: userId });
      }
    } else if (entityType === 'project') {
      const { data: existingLike } = await supabase
        .from('project_likes')
        .select('id')
        .eq('project_id', entityId)
        .eq('user_id', userId)
        .single();

      if (existingLike) {
        // Unlike: remove the like
        await supabase
          .from('project_likes')
          .delete()
          .eq('id', existingLike.id);
      } else {
        // Like: add a new like
        await supabase
          .from('project_likes')
          .insert({ project_id: entityId, user_id: userId });
      }
    }

    // Determine the new like status
    const liked = entityType === 'post' 
      ? await getPostLikeStatus(entityId, userId)
      : entityType === 'reply'
      ? await getReplyLikeStatus(entityId, userId)
      : false; // Add similar functions for resources and projects if needed

    // Calculate new count based on like status
    const newCount = liked ? currentLikes + 1 : Math.max(0, currentLikes - 1);

    return {
      success: true,
      message: liked ? 'Contenu liké avec succès' : 'Like retiré avec succès',
      liked,
      newCount
    };
  } catch (error) {
    console.error(`Erreur lors du like/unlike (${entityType}):`, error);
    toast.error("Une erreur s'est produite");
    return {
      success: false,
      message: "Une erreur s'est produite",
      liked: false,
      newCount: currentLikes
    };
  }
};

// Helper functions for checking like status
async function getPostLikeStatus(postId: string, userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('forum_post_likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single();
  
  return !!data;
}

async function getReplyLikeStatus(replyId: string, userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('forum_reply_likes')
    .select('id')
    .eq('reply_id', replyId)
    .eq('user_id', userId)
    .single();
  
  return !!data;
}
