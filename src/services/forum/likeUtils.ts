
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
  
  // Utilisons la méthode rpc pour une requête générique
  const { data, error } = await supabase.rpc('check_user_like', {
    table_name: table,
    content_field: contentField,
    content_id: contentId,
    user_identifier: userData.user.id
  });
    
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
  
  // Vérifiez si l'utilisateur a déjà aimé le contenu en utilisant rpc
  const { data: existingLike } = await supabase.rpc('check_user_like', {
    table_name: table,
    content_field: contentField,
    content_id: contentId,
    user_identifier: userData.user.id
  });
  
  let isLiked = false;
  
  // Commencer une transaction
  // Récupérer le contenu actuel
  const { data: contentData, error: contentError } = await supabase.rpc('get_content_likes', {
    content_table: contentTable,
    content_id: contentId,
    likes_field: likesField
  });
  
  if (contentError) {
    throw contentError;
  }
  
  const currentLikes = contentData ? contentData : 0;
  
  if (existingLike) {
    // Si l'utilisateur a déjà aimé le contenu, supprimez le "j'aime"
    const { error: deleteError } = await supabase.rpc('remove_user_like', {
      table_name: table,
      content_field: contentField,
      content_id: contentId,
      user_identifier: userData.user.id
    });
    
    if (deleteError) {
      throw deleteError;
    }
    
    // Décrémentez le compteur de "j'aime"
    const { error: updateError } = await supabase.rpc('update_content_likes', {
      content_table: contentTable,
      content_id: contentId,
      likes_field: likesField,
      likes_value: Math.max(0, currentLikes - 1)
    });
    
    if (updateError) {
      throw updateError;
    }
    
    isLiked = false;
  } else {
    // Si l'utilisateur n'a pas encore aimé le contenu, ajoutez un "j'aime"
    const { error: insertError } = await supabase.rpc('add_user_like', {
      table_name: table,
      content_field: contentField,
      content_id: contentId,
      user_identifier: userData.user.id
    });
    
    if (insertError) {
      throw insertError;
    }
    
    // Incrémentez le compteur de "j'aime"
    const { error: updateError } = await supabase.rpc('update_content_likes', {
      content_table: contentTable,
      content_id: contentId,
      likes_field: likesField,
      likes_value: currentLikes + 1
    });
    
    if (updateError) {
      throw updateError;
    }
    
    isLiked = true;
  }
  
  return {
    success: true,
    message: isLiked ? "Contenu aimé" : "J'aime retiré",
    liked: isLiked,
    newCount: isLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1)
  };
};
