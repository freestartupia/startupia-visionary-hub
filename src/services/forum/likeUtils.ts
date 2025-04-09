
import { supabase } from "@/integrations/supabase/client";

export interface LikeResponse {
  success: boolean;
  message: string;
  liked?: boolean;
  error?: string;
}

// Type sécurisé pour les tables
type TableNames = 'forum_posts' | 'forum_replies';
type LikeTableNames = 'forum_post_likes' | 'forum_reply_likes';

const getCorrespondingLikeTable = (table: TableNames): LikeTableNames => {
  const map: Record<TableNames, LikeTableNames> = {
    'forum_posts': 'forum_post_likes',
    'forum_replies': 'forum_reply_likes'
  };
  return map[table];
};

const getIdColumnName = (table: TableNames): string => {
  if (table === 'forum_posts') return 'post_id';
  return 'reply_id';
};

// Fonction générique pour gérer les appels RPC en toute sécurité
export const safeRpcCall = async <T>(
  functionName: string,
  params: Record<string, any>
): Promise<{ data: T | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase.rpc(functionName, params);
    
    if (error) {
      console.error(`Erreur lors de l'appel RPC ${functionName}:`, error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error(`Exception lors de l'appel RPC ${functionName}:`, error);
    return { data: null, error: error as Error };
  }
};

// Fonction générique pour liker ou unliker un post ou une réponse
export const toggleLike = async (
  table: TableNames,
  itemId: string,
  userId: string
): Promise<LikeResponse> => {
  const likeTable = getCorrespondingLikeTable(table);
  const idColumn = getIdColumnName(table);

  try {
    // Vérifier si l'utilisateur a déjà aimé l'élément
    const { data: existingLike, error: selectError } = await supabase
      .from(likeTable)
      .select('*')
      .eq(idColumn, itemId)
      .eq('user_id', userId)
      .single();

    if (selectError) {
      console.error("Erreur lors de la vérification du like existant:", selectError);
      return { success: false, message: "Erreur lors de la vérification du like.", error: selectError.message };
    }

    if (existingLike) {
      // L'utilisateur a déjà aimé, donc on unlike
      const { error: deleteError } = await supabase
        .from(likeTable)
        .delete()
        .eq(idColumn, itemId)
        .eq('user_id', userId);

      if (deleteError) {
        console.error("Erreur lors du unlike:", deleteError);
        return { success: false, message: "Erreur lors du unlike.", error: deleteError.message };
      }

      // Décrémenter le nombre de likes dans la table principale
      const { error: decrementError } = await supabase
        .from(table)
        .update({ likes: supabase.rpc('decrement', { x: 1 }) })
        .eq('id', itemId);

      if (decrementError) {
        console.error("Erreur lors de la décrémentation des likes:", decrementError);
        return { success: false, message: "Erreur lors de la décrémentation des likes.", error: decrementError.message };
      }

      return { success: true, message: "Unliked avec succès.", liked: false };
    } else {
      // L'utilisateur n'a pas encore aimé, donc on like
      const insertData = {
        [idColumn]: itemId,
        user_id: userId
      };

      const { error: insertError } = await supabase
        .from(likeTable)
        .insert([insertData]);

      if (insertError) {
        console.error("Erreur lors du like:", insertError);
        return { success: false, message: "Erreur lors du like.", error: insertError.message };
      }

      // Incrémenter le nombre de likes dans la table principale
      const { error: incrementError } = await supabase
        .from(table)
        .update({ likes: supabase.rpc('increment', { x: 1 }) })
        .eq('id', itemId);

      if (incrementError) {
        console.error("Erreur lors de l'incrémentation des likes:", incrementError);
        return { success: false, message: "Erreur lors de l'incrémentation des likes.", error: incrementError.message };
      }

      return { success: true, message: "Liked avec succès.", liked: true };
    }
  } catch (error) {
    console.error("Erreur inattendue lors du toggle du like:", error);
    return { success: false, message: "Erreur inattendue lors du toggle du like.", error: (error as Error).message };
  }
};
