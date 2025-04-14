
import { LikeResponse } from '@/types/community';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type EntityType = 'post' | 'reply' | 'resource' | 'project';

// Add the missing checkAuthentication function
export const checkAuthentication = async (): Promise<string | null> => {
  const { data, error } = await supabase.auth.getUser();
  
  if (error || !data.user) {
    return null;
  }
  
  return data.user.id;
};

// Add the missing safeRpcCall function
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

    // Check if already liked
    const { data: existingLike } = await supabase
      .from(table)
      .select('id')
      .eq(column, entityId)
      .eq('user_id', userId)
      .single();

    if (existingLike) {
      // Unlike: remove the like
      await supabase
        .from(table)
        .delete()
        .eq('id', existingLike.id);

      return {
        success: true,
        message: 'Like retiré avec succès',
        liked: false,
        newCount: Math.max(0, currentLikes - 1)
      };
    } else {
      // Like: add a new like
      await supabase
        .from(table)
        .insert({ [column]: entityId, user_id: userId });

      return {
        success: true,
        message: 'Contenu liké avec succès',
        liked: true,
        newCount: currentLikes + 1
      };
    }
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
