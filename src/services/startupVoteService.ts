
import { supabase } from "@/integrations/supabase/client";
import { UpvoteResponse } from "@/types/community";

export const toggleStartupVote = async (startupId: string, isUpvote: boolean): Promise<UpvoteResponse> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      return {
        success: false,
        message: "Vous devez être connecté pour voter",
        upvoted: false,
        newCount: 0
      };
    }
    
    // Vérifier si l'utilisateur a déjà voté pour ce startup
    const { data: existingVote } = await supabase
      .from('startup_votes')
      .select('id, is_upvote')
      .eq('startup_id', startupId)
      .eq('user_id', userData.user.id)
      .single();
      
    // Obtenir le nombre actuel de votes
    const { data: startupData } = await supabase
      .from('startups')
      .select('upvotes_count')
      .eq('id', startupId)
      .single();
      
    const currentCount = startupData?.upvotes_count || 0;
    let newCount = currentCount;
    
    // Si aucun vote n'existe, en créer un nouveau
    if (!existingVote) {
      await supabase
        .from('startup_votes')
        .insert({
          startup_id: startupId,
          user_id: userData.user.id,
          is_upvote: isUpvote
        });
      
      // Mettre à jour le compteur
      newCount = isUpvote ? currentCount + 1 : Math.max(0, currentCount - 1);
      
      await supabase
        .from('startups')
        .update({ upvotes_count: newCount })
        .eq('id', startupId);
      
      return {
        success: true,
        message: isUpvote ? "Vote positif ajouté" : "Vote négatif ajouté",
        upvoted: isUpvote,
        newCount
      };
    }
    
    // Si le vote existe déjà avec le même type, le supprimer
    if (existingVote.is_upvote === isUpvote) {
      await supabase
        .from('startup_votes')
        .delete()
        .eq('id', existingVote.id);
      
      // Mettre à jour le compteur
      newCount = isUpvote ? Math.max(0, currentCount - 1) : Math.min(currentCount + 1, currentCount);
      
      await supabase
        .from('startups')
        .update({ upvotes_count: newCount })
        .eq('id', startupId);
      
      return {
        success: true,
        message: "Vote retiré",
        upvoted: false,
        newCount
      };
    }
    
    // Si le vote existe avec un type différent, le changer
    await supabase
      .from('startup_votes')
      .update({ is_upvote: isUpvote })
      .eq('id', existingVote.id);
    
    // Mettre à jour le compteur
    if (isUpvote) {
      // Changement de downvote à upvote: +2 (supprimer downvote + ajouter upvote)
      newCount = currentCount + 2;
    } else {
      // Changement de upvote à downvote: -2 (supprimer upvote + ajouter downvote)
      newCount = Math.max(0, currentCount - 2);
    }
    
    await supabase
      .from('startups')
      .update({ upvotes_count: newCount })
      .eq('id', startupId);
    
    return {
      success: true,
      message: isUpvote ? "Vote changé en positif" : "Vote changé en négatif",
      upvoted: isUpvote,
      newCount
    };
  } catch (error) {
    console.error("Error in toggleStartupVote:", error);
    return {
      success: false,
      message: "Une erreur est survenue",
      upvoted: false,
      newCount: 0
    };
  }
};

// Fonctions wrapper simples pour la rétrocompatibilité
export const toggleStartupUpvote = async (startupId: string): Promise<UpvoteResponse> => {
  return toggleStartupVote(startupId, true);
};

export const toggleStartupDownvote = async (startupId: string): Promise<UpvoteResponse> => {
  return toggleStartupVote(startupId, false);
};
