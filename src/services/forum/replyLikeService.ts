
import { supabase } from "@/integrations/supabase/client";

/**
 * Interface pour la réponse de la fonction toggleReplyLike
 */
export interface ReplyLikeResponse {
  likes: number;
  isLiked: boolean;
}

/**
 * Vérifie si l'utilisateur a aimé une réponse
 * @param replyId ID de la réponse
 * @returns true si l'utilisateur a aimé la réponse, false sinon
 */
export const checkReplyLike = async (replyId: string): Promise<boolean> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    
    if (!userId) return false;
    
    const { data } = await supabase
      .from('forum_reply_likes')
      .select('*')
      .eq('reply_id', replyId)
      .eq('user_id', userId)
      .maybeSingle();
      
    return !!data;
  } catch (error) {
    console.error('Erreur lors de la vérification du like de la réponse:', error);
    return false;
  }
};

/**
 * Ajoute ou supprime un like à une réponse
 * @param replyId ID de la réponse
 * @returns Object contenant le nouveau nombre de likes et le statut du like
 */
export const toggleReplyLike = async (replyId: string): Promise<ReplyLikeResponse> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      throw new Error('Utilisateur non authentifié');
    }
    
    const userId = userData.user.id;
    
    // Vérifier si l'utilisateur a déjà liké cette réponse
    const { data: existingLike } = await supabase
      .from('forum_reply_likes')
      .select('*')
      .eq('reply_id', replyId)
      .eq('user_id', userId)
      .maybeSingle();
      
    let isLiked = false;
    
    if (existingLike) {
      // Si le like existe déjà, le supprimer
      const { error: deleteError } = await supabase
        .from('forum_reply_likes')
        .delete()
        .eq('reply_id', replyId)
        .eq('user_id', userId);
        
      if (deleteError) {
        console.error('Erreur lors de la suppression du like:', deleteError);
        throw deleteError;
      }
      
      // Décrémenter le compteur de likes dans la table forum_replies
      const { error: updateError } = await supabase
        .from('forum_replies')
        .update({ likes: supabase.rpc('decrement', { value: 1 }) })
        .eq('id', replyId);
        
      if (updateError) {
        console.error('Erreur lors de la mise à jour du compteur de likes:', updateError);
        throw updateError;
      }
    } else {
      // Si le like n'existe pas, l'ajouter
      const { error: insertError } = await supabase
        .from('forum_reply_likes')
        .insert({
          reply_id: replyId,
          user_id: userId
        });
        
      if (insertError) {
        console.error('Erreur lors de l\'ajout du like:', insertError);
        throw insertError;
      }
      
      // Incrémenter le compteur de likes dans la table forum_replies
      const { error: updateError } = await supabase
        .from('forum_replies')
        .update({ likes: supabase.rpc('increment', { value: 1 }) })
        .eq('id', replyId);
        
      if (updateError) {
        console.error('Erreur lors de la mise à jour du compteur de likes:', updateError);
        throw updateError;
      }
      
      isLiked = true;
    }
    
    // Récupérer le nombre total de likes pour cette réponse
    const { data: replyData, error: replyError } = await supabase
      .from('forum_replies')
      .select('likes')
      .eq('id', replyId)
      .single();
      
    if (replyError) {
      console.error('Erreur lors de la récupération du nombre de likes:', replyError);
      throw replyError;
    }
    
    // Retourner le nouveau nombre de likes et le statut du like
    return {
      likes: replyData.likes || 0,
      isLiked
    };
  } catch (error) {
    console.error('Error in toggleReplyLike:', error);
    throw error;
  }
};
