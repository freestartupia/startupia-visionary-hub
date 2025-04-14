
import { supabase } from "@/integrations/supabase/client";
import { StartupComment } from "@/types/startup";

/**
 * Récupère les commentaires pour une startup spécifique
 */
export const fetchStartupComments = async (startupId: string): Promise<StartupComment[]> => {
  try {
    const { data, error } = await supabase
      .from('startup_comments')
      .select('*')
      .eq('startup_id', startupId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Erreur lors du chargement des commentaires:', error);
      return [];
    }
    
    return data as StartupComment[];
  } catch (error) {
    console.error('Exception lors du chargement des commentaires:', error);
    return [];
  }
};

/**
 * Ajoute un commentaire à une startup
 */
export const addStartupComment = async (
  startupId: string, 
  content: string, 
  userId: string,
  userName: string,
  userAvatar?: string
): Promise<StartupComment | null> => {
  try {
    const { data, error } = await supabase
      .from('startup_comments')
      .insert({
        startup_id: startupId,
        user_id: userId,
        content,
        user_name: userName,
        user_avatar: userAvatar
      })
      .select()
      .single();
      
    if (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
      return null;
    }
    
    return data as StartupComment;
  } catch (error) {
    console.error('Exception lors de l\'ajout du commentaire:', error);
    return null;
  }
};

/**
 * Supprime un commentaire
 */
export const deleteStartupComment = async (commentId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('startup_comments')
      .delete()
      .eq('id', commentId);
      
    if (error) {
      console.error('Erreur lors de la suppression du commentaire:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception lors de la suppression du commentaire:', error);
    return false;
  }
};
