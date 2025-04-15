
import { supabase } from "@/integrations/supabase/client";
import { invalidatePostsCache } from "./forum/postFetchService";

/**
 * Interface de réponse pour les upvotes
 */
export interface UpvoteResponse {
  upvotes: number;
  isUpvoted: boolean;
}

/**
 * Vérifie si l'utilisateur a upvoté un post
 * @param postId ID du post
 * @returns true si l'utilisateur a upvoté le post, false sinon
 */
export const checkPostUpvote = async (postId: string): Promise<boolean> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    
    if (!userId) return false;
    
    const { data } = await supabase
      .from('post_upvotes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle();
      
    return !!data;
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'upvote:', error);
    return false;
  }
};

/**
 * Ajoute ou supprime un upvote à un post du forum
 * @param postId ID du post
 * @returns Le nouveau nombre d'upvotes et si le post est upvoté par l'utilisateur
 */
export const togglePostUpvote = async (postId: string): Promise<UpvoteResponse> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      throw new Error('Utilisateur non authentifié');
    }
    
    const userId = userData.user.id;
    
    // Vérifier si l'utilisateur a déjà upvoté ce post
    const { data: existingUpvote } = await supabase
      .from('post_upvotes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle();
      
    let isUpvoted = false;
    
    if (existingUpvote) {
      // Si l'upvote existe déjà, le supprimer
      const { error: deleteError } = await supabase
        .from('post_upvotes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);
        
      if (deleteError) {
        console.error('Erreur lors de la suppression de l\'upvote:', deleteError);
        throw deleteError;
      }
      
      // Le trigger SQL s'occupe de décrémenter le compteur de upvotes dans la table forum_posts
    } else {
      // Si l'upvote n'existe pas, l'ajouter
      const { error: insertError } = await supabase
        .from('post_upvotes')
        .insert({
          post_id: postId,
          user_id: userId,
          is_upvote: true
        });
        
      if (insertError) {
        console.error('Erreur lors de l\'ajout de l\'upvote:', insertError);
        throw insertError;
      }
      
      // Le trigger SQL s'occupe d'incrémenter le compteur de upvotes dans la table forum_posts
      isUpvoted = true;
    }
    
    // Récupérer le nombre total d'upvotes pour ce post
    const { data: postData, error: postError } = await supabase
      .from('forum_posts')
      .select('upvotes_count')
      .eq('id', postId)
      .single();
      
    if (postError) {
      console.error('Erreur lors de la récupération du nombre d\'upvotes:', postError);
      throw postError;
    }
    
    // Invalider le cache
    invalidatePostsCache();
    
    // Retourner le nouveau nombre d'upvotes et le statut de l'upvote
    return {
      upvotes: postData.upvotes_count || 0,
      isUpvoted
    };
  } catch (error) {
    console.error('Error in togglePostUpvote:', error);
    throw error;
  }
};
