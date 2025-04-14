
import { supabase } from "@/integrations/supabase/client";
import { UpvoteResponse } from "@/types/community";

export const toggleStartupVote = async (startupId: string, isUpvote: boolean): Promise<UpvoteResponse> => {
  try {
    // Vérifier l'authentification
    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError || !userData.user) {
      return {
        success: false,
        message: "Vous devez être connecté pour voter",
        upvoted: false,
        newCount: 0
      };
    }
    
    const userId = userData.user.id;
    
    // Vérifier le vote existant
    const { data: existingVote, error: voteError } = await supabase
      .from('startup_votes')
      .select('id, is_upvote')
      .eq('startup_id', startupId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (voteError) {
      console.error("Erreur de vérification du vote existant:", voteError);
      throw voteError;
    }
    
    // Récupérer le nombre de votes actuels
    const { data: startupData, error: startupError } = await supabase
      .from('startups')
      .select('upvotes_count')
      .eq('id', startupId)
      .single();
    
    if (startupError) {
      console.error("Erreur de récupération des données de la startup:", startupError);
      throw startupError;
    }
    
    const currentCount = startupData.upvotes_count || 0;
    let newCount = currentCount;
    let responseMessage = "";
    let isVoteUpvoted = false;
    
    // Supprimer le vote existant si même type
    if (existingVote && existingVote.is_upvote === isUpvote) {
      await supabase
        .from('startup_votes')
        .delete()
        .eq('id', existingVote.id);
      
      newCount = isUpvote ? Math.max(0, currentCount - 1) : currentCount + 1;
      responseMessage = "Vote retiré";
      isVoteUpvoted = false;
    }
    // Changer le vote s'il existe mais de type différent
    else if (existingVote) {
      await supabase
        .from('startup_votes')
        .update({ is_upvote: isUpvote })
        .eq('id', existingVote.id);
      
      newCount = isUpvote ? currentCount + 2 : currentCount - 2;
      responseMessage = isUpvote ? "Vote changé en positif" : "Vote changé en négatif";
      isVoteUpvoted = isUpvote;
    }
    // Ajouter un nouveau vote
    else {
      await supabase
        .from('startup_votes')
        .insert({
          startup_id: startupId,
          user_id: userId,
          is_upvote: isUpvote
        });
      
      newCount = isUpvote ? currentCount + 1 : Math.max(0, currentCount - 1);
      responseMessage = isUpvote ? "Vote positif ajouté" : "Vote négatif ajouté";
      isVoteUpvoted = isUpvote;
    }
    
    // Mettre à jour le nombre de votes de la startup
    await supabase
      .from('startups')
      .update({ upvotes_count: newCount })
      .eq('id', startupId);
    
    return {
      success: true,
      message: responseMessage,
      upvoted: isVoteUpvoted,
      newCount: newCount
    };
    
  } catch (error) {
    console.error("Erreur lors du vote:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors du vote",
      upvoted: false,
      newCount: 0
    };
  }
};

// Fonctions de compatibilité
export const toggleStartupUpvote = (startupId: string) => toggleStartupVote(startupId, true);
export const toggleStartupDownvote = (startupId: string) => toggleStartupVote(startupId, false);
