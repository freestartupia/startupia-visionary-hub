
import { supabase } from "@/integrations/supabase/client";
import { LikeResponse } from "@/types/community";

// Fonction générique pour vérifier si un utilisateur a aimé un contenu
export const getLikeStatus = async (
  table: string, 
  contentField: string, 
  contentId: string
): Promise<boolean> => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    return false;
  }
  
  const { data, error } = await supabase
    .from(table)
    .select('id')
    .eq(contentField, contentId)
    .eq('user_id', userData.user.id)
    .single();
    
  return !!data && !error;
};

// Fonction générique pour basculer le statut "j'aime" d'un contenu
export const toggleLike = async (
  table: string,
  contentTable: string,
  contentField: string,
  contentId: string,
  likesField: string = 'likes'
): Promise<LikeResponse> => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    throw new Error('User not authenticated');
  }
  
  // Vérifiez si l'utilisateur a déjà aimé le contenu
  const { data: existingLike } = await supabase
    .from(table)
    .select('id')
    .eq(contentField, contentId)
    .eq('user_id', userData.user.id)
    .single();
  
  let isLiked = false;
  
  // Commencer une transaction
  const { data: contentData, error: contentError } = await supabase
    .from(contentTable)
    .select(likesField)
    .eq('id', contentId)
    .single();
  
  if (contentError) {
    throw contentError;
  }
  
  const currentLikes = contentData ? (contentData[likesField] || 0) : 0;
  
  if (existingLike) {
    // Si l'utilisateur a déjà aimé le contenu, supprimez le "j'aime"
    const { error: deleteError } = await supabase
      .from(table)
      .delete()
      .eq('id', existingLike.id);
    
    if (deleteError) {
      throw deleteError;
    }
    
    // Décrémentez le compteur de "j'aime"
    const { error: updateError } = await supabase
      .from(contentTable)
      .update({ [likesField]: Math.max(0, currentLikes - 1) })
      .eq('id', contentId);
    
    if (updateError) {
      throw updateError;
    }
    
    isLiked = false;
  } else {
    // Si l'utilisateur n'a pas encore aimé le contenu, ajoutez un "j'aime"
    const { error: insertError } = await supabase
      .from(table)
      .insert({
        [contentField]: contentId,
        user_id: userData.user.id
      });
    
    if (insertError) {
      throw insertError;
    }
    
    // Incrémentez le compteur de "j'aime"
    const { error: updateError } = await supabase
      .from(contentTable)
      .update({ [likesField]: currentLikes + 1 })
      .eq('id', contentId);
    
    if (updateError) {
      throw updateError;
    }
    
    isLiked = true;
  }
  
  return {
    isLiked,
    likesCount: isLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1)
  };
};
