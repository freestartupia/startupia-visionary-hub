
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
  functionName: string,
  params?: Record<string, any>
): Promise<{ success: boolean; data?: T; error?: string }> => {
  try {
    const { data, error } = await supabase.rpc(functionName, params || {});
    
    if (error) {
      console.error(`Erreur lors de l'appel RPC ${functionName}:`, error);
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
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
    
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('user_id', userId)
      .eq(fieldName, recordId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error(`Erreur lors de la vérification des likes pour ${type}:`, error);
    }
    
    return !!data;
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
    const tableName = `${type}_likes`;
    const fieldName = `${type}_id`;
    
    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true })
      .eq(fieldName, recordId);
    
    if (error) {
      console.error(`Erreur lors du comptage des likes pour ${type}:`, error);
      return 0;
    }
    
    return count || 0;
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
    
    const tableName = `${type}_likes`;
    const fieldName = `${type}_id`;
    
    const { error } = await supabase
      .from(tableName)
      .insert({ 
        user_id: userId,
        [fieldName]: recordId
      });
    
    if (error) {
      console.error(`Erreur lors de l'ajout du like pour ${type}:`, error);
      return { success: false, error: 'Une erreur est survenue' };
    }
    
    // Get the new count after adding like
    const newCount = await getLikeCount(type, recordId);
    
    return { success: true, liked: true, newCount };
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
    
    const tableName = `${type}_likes`;
    const fieldName = `${type}_id`;
    
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('user_id', userId)
      .eq(fieldName, recordId);
    
    if (error) {
      console.error(`Erreur lors du retrait du like pour ${type}:`, error);
      return { success: false, error: 'Une erreur est survenue' };
    }
    
    // Get the new count after removing like
    const newCount = await getLikeCount(type, recordId);
    
    return { success: true, liked: false, newCount };
  } catch (error) {
    console.error(`Erreur lors du retrait du like pour ${type}:`, error);
    return { success: false, error: 'Une erreur est survenue' };
  }
};
