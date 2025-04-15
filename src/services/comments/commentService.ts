
import { supabase } from '@/integrations/supabase/client';
import { StartupComment } from '@/types/startup';

export async function fetchStartupComments(startupId: string): Promise<StartupComment[]> {
  try {
    const { data, error } = await supabase
      .from('startup_comments')
      .select('*')
      .eq('startup_id', startupId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(transformCommentFromDB);
  } catch (error) {
    console.error(`Erreur lors de la récupération des commentaires pour la startup ${startupId}:`, error);
    return [];
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
