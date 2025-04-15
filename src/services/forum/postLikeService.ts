
import { supabase } from "@/integrations/supabase/client";
import { invalidatePostsCache } from "./postFetchService";

/**
 * Vérifie si un utilisateur a liké un post
 * @param postId ID du post
 * @param userId ID de l'utilisateur (optionnel, utilise l'utilisateur connecté par défaut)
 * @returns true si l'utilisateur a liké le post, false sinon
 */
export const getPostLikeStatus = async (postId: string, userId?: string): Promise<boolean> => {
  try {
    // Si userId n'est pas fourni, récupérer l'utilisateur connecté
    if (!userId) {
      const { data: userData } = await supabase.auth.getUser();
      userId = userData.user?.id;
    }
    
    if (!userId) {
      return false;
    }
    
    const { data, error } = await supabase
      .from('forum_post_likes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle();
      
    if (error) {
      console.error('Erreur lors de la vérification du like:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Erreur dans getPostLikeStatus:', error);
    return false;
  }
};

/**
 * Interface pour la réponse de la fonction togglePostLike
 */
export interface LikeResponse {
  likes: number;
  isLiked: boolean;
}

/**
 * Ajoute ou supprime un like à un post du forum
 * @param postId ID du post à liker/unliker
 * @returns Object contenant le nouveau nombre de likes et le statut du like
 */
export const togglePostLike = async (postId: string): Promise<LikeResponse> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      throw new Error('Utilisateur non authentifié');
    }
    
    const userId = userData.user.id;
    
    // Vérifier si l'utilisateur a déjà liké ce post
    const { data: existingLike } = await supabase
      .from('forum_post_likes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle();
      
    let isLiked = false;
    
    if (existingLike) {
      // Si le like existe déjà, le supprimer
      const { error: deleteError } = await supabase
        .from('forum_post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);
        
      if (deleteError) {
        console.error('Erreur lors de la suppression du like:', deleteError);
        throw deleteError;
      }
      
      // Décrémenter le compteur de likes dans la table forum_posts
      const { error: updateError } = await supabase
        .from('forum_posts')
        .update({ likes: supabase.rpc('decrement', { value: 1 }) })
        .eq('id', postId);
        
      if (updateError) {
        console.error('Erreur lors de la mise à jour du compteur de likes:', updateError);
        throw updateError;
      }
    } else {
      // Si le like n'existe pas, l'ajouter
      const { error: insertError } = await supabase
        .from('forum_post_likes')
        .insert({
          post_id: postId,
          user_id: userId
        });
        
      if (insertError) {
        console.error('Erreur lors de l\'ajout du like:', insertError);
        throw insertError;
      }
      
      // Incrémenter le compteur de likes dans la table forum_posts
      const { error: updateError } = await supabase
        .from('forum_posts')
        .update({ likes: supabase.rpc('increment', { value: 1 }) })
        .eq('id', postId);
        
      if (updateError) {
        console.error('Erreur lors de la mise à jour du compteur de likes:', updateError);
        throw updateError;
      }
      
      isLiked = true;
    }
    
    // Récupérer le nombre total de likes pour ce post
    const { data: postData, error: postError } = await supabase
      .from('forum_posts')
      .select('likes')
      .eq('id', postId)
      .single();
      
    if (postError) {
      console.error('Erreur lors de la récupération du nombre de likes:', postError);
      throw postError;
    }
    
    // Invalider le cache
    invalidatePostsCache();
    
    // Retourner le nouveau nombre de likes et le statut du like
    return {
      likes: postData.likes || 0,
      isLiked
    };
  } catch (error) {
    console.error('Error in togglePostLike:', error);
    throw error;
  }
};
