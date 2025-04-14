
import { supabase } from '@/integrations/supabase/client';

export interface LikeResponse {
  success: boolean;
  error?: string;
  liked?: boolean;
  // Add newCount property to match what the UI is expecting
  newCount?: number;
}

/**
 * Vérifie si l'utilisateur est authentifié
 */
export const checkAuthentication = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error || !data.user) {
      return null;
    }
    
    return data.user.id;
  } catch (error) {
    console.error('Erreur de vérification d\'authentification:', error);
    return null;
  }
};

/**
 * Vérifie si l'utilisateur est un administrateur
 */
export const checkAdminStatus = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('is_admin');
    
    if (error) {
      console.error('Erreur de vérification du statut admin:', error);
      return false;
    }
    
    return data || false;
  } catch (error) {
    console.error('Erreur de vérification du statut admin:', error);
    return false;
  }
};

/**
 * Fonction générique pour appeler un RPC de manière sécurisée
 */
export const safeRpcCall = async <T>(
  functionName: 'is_admin',
  params: Record<string, never> = {}
): Promise<{ success: boolean; data?: boolean; error?: string }> => {
  try {
    const { data, error } = await supabase.rpc(functionName, params);
    
    if (error) {
      console.error(`Erreur lors de l'appel RPC ${functionName}:`, error);
      return { success: false, error: error.message };
    }
    
    return { success: true, data: data as boolean };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error(`Erreur lors de l'appel RPC ${functionName}:`, error);
    return { success: false, error: errorMessage };
  }
};

/**
 * Vérifie si l'utilisateur a aimé un élément
 */
export const checkIfUserLiked = async (
  type: 'forum_post' | 'forum_reply',
  recordId: string
): Promise<boolean> => {
  try {
    const userId = await checkAuthentication();
    
    if (!userId) {
      return false;
    }
    
    const tableName = `${type}_likes`;
    const fieldName = `${type}_id`;
    
    if (type === 'forum_post') {
      const { data, error } = await supabase
        .from('forum_post_likes')
        .select('*')
        .eq('user_id', userId)
        .eq('post_id', recordId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error(`Erreur lors de la vérification des likes pour ${type}:`, error);
      }
      
      return !!data;
    } else if (type === 'forum_reply') {
      const { data, error } = await supabase
        .from('forum_reply_likes')
        .select('*')
        .eq('user_id', userId)
        .eq('reply_id', recordId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error(`Erreur lors de la vérification des likes pour ${type}:`, error);
      }
      
      return !!data;
    }
    
    return false;
  } catch (error) {
    console.error(`Erreur lors de la vérification des likes pour ${type}:`, error);
    return false;
  }
};

/**
 * Obtient le nombre de likes pour un élément
 */
export const getLikeCount = async (
  type: 'forum_post' | 'forum_reply',
  recordId: string
): Promise<number> => {
  try {
    if (type === 'forum_post') {
      const { count, error } = await supabase
        .from('forum_post_likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', recordId);
      
      if (error) {
        console.error(`Erreur lors du comptage des likes pour ${type}:`, error);
        return 0;
      }
      
      return count || 0;
    } else if (type === 'forum_reply') {
      const { count, error } = await supabase
        .from('forum_reply_likes')
        .select('*', { count: 'exact', head: true })
        .eq('reply_id', recordId);
      
      if (error) {
        console.error(`Erreur lors du comptage des likes pour ${type}:`, error);
        return 0;
      }
      
      return count || 0;
    }
    
    return 0;
  } catch (error) {
    console.error(`Erreur lors du comptage des likes pour ${type}:`, error);
    return 0;
  }
};

/**
 * Ajoute un like à un élément
 */
export const addLike = async (
  type: 'forum_post' | 'forum_reply',
  recordId: string
): Promise<LikeResponse> => {
  try {
    const userId = await checkAuthentication();
    
    if (!userId) {
      return { success: false, error: 'Vous devez être connecté pour aimer un élément' };
    }
    
    if (type === 'forum_post') {
      const { error } = await supabase
        .from('forum_post_likes')
        .insert({ 
          user_id: userId,
          post_id: recordId
        });
      
      if (error) {
        console.error(`Erreur lors de l'ajout du like pour ${type}:`, error);
        return { success: false, error: 'Une erreur est survenue' };
      }
      
      // Get the new count after adding like
      const newCount = await getLikeCount(type, recordId);
      
      return { success: true, liked: true, newCount };
    } else if (type === 'forum_reply') {
      const { error } = await supabase
        .from('forum_reply_likes')
        .insert({ 
          user_id: userId,
          reply_id: recordId
        });
      
      if (error) {
        console.error(`Erreur lors de l'ajout du like pour ${type}:`, error);
        return { success: false, error: 'Une erreur est survenue' };
      }
      
      // Get the new count after adding like
      const newCount = await getLikeCount(type, recordId);
      
      return { success: true, liked: true, newCount };
    }
    
    return { success: false, error: 'Type d\'élément non supporté' };
  } catch (error) {
    console.error(`Erreur lors de l'ajout du like pour ${type}:`, error);
    return { success: false, error: 'Une erreur est survenue' };
  }
};

/**
 * Retire un like d'un élément
 */
export const removeLike = async (
  type: 'forum_post' | 'forum_reply',
  recordId: string
): Promise<LikeResponse> => {
  try {
    const userId = await checkAuthentication();
    
    if (!userId) {
      return { success: false, error: 'Vous devez être connecté pour retirer votre like' };
    }
    
    if (type === 'forum_post') {
      const { error } = await supabase
        .from('forum_post_likes')
        .delete()
        .eq('user_id', userId)
        .eq('post_id', recordId);
      
      if (error) {
        console.error(`Erreur lors du retrait du like pour ${type}:`, error);
        return { success: false, error: 'Une erreur est survenue' };
      }
      
      // Get the new count after removing like
      const newCount = await getLikeCount(type, recordId);
      
      return { success: true, liked: false, newCount };
    } else if (type === 'forum_reply') {
      const { error } = await supabase
        .from('forum_reply_likes')
        .delete()
        .eq('user_id', userId)
        .eq('reply_id', recordId);
      
      if (error) {
        console.error(`Erreur lors du retrait du like pour ${type}:`, error);
        return { success: false, error: 'Une erreur est survenue' };
      }
      
      // Get the new count after removing like
      const newCount = await getLikeCount(type, recordId);
      
      return { success: true, liked: false, newCount };
    }
    
    return { success: false, error: 'Type d\'élément non supporté' };
  } catch (error) {
    console.error(`Erreur lors du retrait du like pour ${type}:`, error);
    return { success: false, error: 'Une erreur est survenue' };
  }
};
