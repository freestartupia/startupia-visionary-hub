import { supabase } from '@/integrations/supabase/client';
import { StartupComment } from '@/types/startup';

interface PaginatedComments {
  data: StartupComment[];
  total: number;
}

export async function fetchStartupComments(
  startupId: string, 
  page: number = 1, 
  pageSize: number = 5
): Promise<PaginatedComments> {
  try {
    // Calculer l'offset basé sur la page et la taille de page
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Récupérer les commentaires avec pagination
    const { data, error, count } = await supabase
      .from('startup_comments')
      .select('*', { count: 'exact' })
      .eq('startup_id', startupId)
      .order('created_at', { ascending: false })
      .range(from, to);
    
    if (error) throw error;
    
    return {
      data: data.map(transformCommentFromDB),
      total: count || 0
    };
  } catch (error) {
    console.error(`Erreur lors de la récupération des commentaires pour la startup ${startupId}:`, error);
    return { data: [], total: 0 };
  }
}

export async function addComment(comment: Omit<StartupComment, 'id' | 'createdAt' | 'likes'>): Promise<StartupComment | null> {
  try {
    const { data, error } = await supabase
      .from('startup_comments')
      .insert([{
        startup_id: comment.startupId,
        user_id: comment.userId,
        user_name: comment.userName,
        user_avatar: comment.userAvatar,
        content: comment.content,
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    return transformCommentFromDB(data);
  } catch (error) {
    console.error('Erreur lors de l\'ajout du commentaire:', error);
    return null;
  }
}

export async function deleteComment(commentId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('startup_comments')
      .delete()
      .eq('id', commentId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Erreur lors de la suppression du commentaire ${commentId}:`, error);
    return false;
  }
}

function transformCommentFromDB(data: any): StartupComment {
  return {
    id: data.id,
    startupId: data.startup_id,
    userId: data.user_id,
    userName: data.user_name,
    userAvatar: data.user_avatar,
    content: data.content,
    createdAt: data.created_at,
    likes: data.likes || 0
  };
}
