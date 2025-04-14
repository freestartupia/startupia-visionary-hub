
import { supabase } from "@/integrations/supabase/client";
import { ForumReply } from "@/types/community";
import { mapReplyFromDB } from "@/utils/forumMappers";

/**
 * Ajoute une réponse à un post du forum
 * @param postId ID du post auquel répondre
 * @param content Contenu de la réponse
 * @param authorName Nom de l'auteur
 * @param authorAvatar URL de l'avatar de l'auteur (optionnel)
 * @param replyParentId ID de la réponse à laquelle répondre (pour les réponses imbriquées, optionnel)
 * @returns La réponse créée
 */
export const addReplyToPost = async (
  postId: string,
  content: string,
  authorName: string,
  authorAvatar?: string,
  replyParentId?: string | null
): Promise<ForumReply> => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    throw new Error('Utilisateur non authentifié');
  }
  
  const { data, error } = await supabase
    .from('forum_replies')
    .insert({
      content,
      author_name: authorName,
      author_avatar: authorAvatar,
      author_id: userData.user.id,
      parent_id: postId,
      reply_parent_id: replyParentId || null
    })
    .select('*')
    .single();
  
  if (error) {
    console.error('Erreur lors de l\'ajout de la réponse:', error);
    throw error;
  }
  
  return mapReplyFromDB(data);
};

/**
 * Récupère les réponses d'un post du forum
 * @param postId ID du post
 * @returns Liste des réponses
 */
export const getPostReplies = async (postId: string): Promise<ForumReply[]> => {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  
  const { data, error } = await supabase
    .from('forum_replies')
    .select('*')
    .eq('parent_id', postId)
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('Erreur lors de la récupération des réponses:', error);
    throw error;
  }
  
  // Vérifier quelles réponses l'utilisateur a aimées
  let replies = data.map(mapReplyFromDB);
  
  if (userId) {
    // Récupérer les "j'aime" de l'utilisateur
    const { data: likedReplies } = await supabase
      .from('forum_reply_likes')
      .select('reply_id')
      .eq('user_id', userId);
    
    if (likedReplies && likedReplies.length > 0) {
      const likedReplyIds = likedReplies.map(like => like.reply_id);
      
      // Marquer les réponses aimées par l'utilisateur
      replies = replies.map(reply => ({
        ...reply,
        isLiked: likedReplyIds.includes(reply.id)
      }));
    }
  }
  
  return replies;
};
