
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface LikeResponse {
  success: boolean;
  message: string;
  liked: boolean;
  newCount: number;
}

// Fonction utilitaire pour vérifier l'authentification
export const checkAuthentication = async (): Promise<string | null> => {
  const { data } = await supabase.auth.getSession();
  if (!data.session?.user) {
    return null;
  }
  return data.session.user.id;
};

// Fonction sécurisée pour appeler RPC
export const safeRpcCall = async <T>(
  fnName: string, 
  params: Record<string, any>
): Promise<T | null> => {
  try {
    const { data, error } = await supabase.rpc(fnName, params);
    if (error) {
      console.error(`Error calling ${fnName}:`, error);
      return null;
    }
    return data as T;
  } catch (error) {
    console.error(`Exception calling ${fnName}:`, error);
    return null;
  }
};

// Fonction générique pour liker/unliker une entité
export const likeEntity = async (
  entityId: string,
  entityType: 'post' | 'reply',
  tableName: string
): Promise<LikeResponse> => {
  try {
    const userId = await checkAuthentication();
    
    if (!userId) {
      return {
        success: false,
        message: "Authentication required",
        liked: false,
        newCount: 0
      };
    }
    
    // Vérifier si l'utilisateur a déjà liké
    const { data: existingLike, error: likeError } = await supabase
      .from(tableName)
      .select('id')
      .eq(`${entityType}_id`, entityId)
      .eq('user_id', userId)
      .single();
      
    if (likeError && likeError.code !== 'PGRST116') {
      console.error(`Error checking existing ${entityType} like:`, likeError);
      throw likeError;
    }
    
    if (existingLike) {
      // Unlike: Remove like
      const { error: unlikeError } = await supabase
        .from(tableName)
        .delete()
        .eq('id', existingLike.id);
        
      if (unlikeError) {
        console.error(`Error unliking ${entityType}:`, unlikeError);
        throw unlikeError;
      }
      
      return {
        success: true,
        message: `${entityType} unliked successfully`,
        liked: false,
        newCount: 0 // Placeholder, will be updated by the caller
      };
    } else {
      // Like: Add new like
      const { error: addLikeError } = await supabase
        .from(tableName)
        .insert({
          [`${entityType}_id`]: entityId,
          user_id: userId
        });
        
      if (addLikeError) {
        console.error(`Error liking ${entityType}:`, addLikeError);
        throw addLikeError;
      }
      
      return {
        success: true,
        message: `${entityType} liked successfully`,
        liked: true,
        newCount: 0 // Placeholder, will be updated by the caller
      };
    }
  } catch (error) {
    console.error(`Error in like${entityType}:`, error);
    throw error;
  }
};
