
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
  
  // Si c'est une réponse à un commentaire, créer une notification pour l'auteur du commentaire parent
  if (replyParentId) {
    try {
      // Récupérer le commentaire parent pour connaître son auteur
      const { data: parentReply } = await supabase
        .from('forum_replies')
        .select('author_id, author_name')
        .eq('id', replyParentId)
        .single();
      
      if (parentReply && parentReply.author_id !== userData.user.id) {
        // Créer une notification pour l'auteur du commentaire parent
        await supabase
          .from('notifications')
          .insert({
            type: 'reply',
            content: `a répondu à votre commentaire`,
            sender_id: userData.user.id,
            sender_name: authorName,
            sender_avatar: authorAvatar,
            recipient_id: parentReply.author_id,
            entity_id: data.id,
            entity_type: 'forum_reply'
          });
        
        console.log('Notification créée pour la réponse au commentaire');
      }
    } catch (notifError) {
      console.error('Erreur lors de la création de la notification:', notifError);
      // Ne pas échouer la fonction principale si la notification échoue
    }
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
  
  // Organiser les réponses en hiérarchie
  const rootReplies: ForumReply[] = [];
  const nestedRepliesMap: Record<string, ForumReply[]> = {};
  
  // Regrouper les réponses imbriquées par leur parent
  replies.forEach(reply => {
    if (reply.replyParentId) {
      if (!nestedRepliesMap[reply.replyParentId]) {
        nestedRepliesMap[reply.replyParentId] = [];
      }
      nestedRepliesMap[reply.replyParentId].push(reply);
    } else {
      rootReplies.push(reply);
    }
  });
  
  // Ajouter les réponses imbriquées à leurs parents
  rootReplies.forEach(reply => {
    const nestedReplies = nestedRepliesMap[reply.id] || [];
    reply.nestedReplies = nestedReplies;
  });
  
  return rootReplies;
};
