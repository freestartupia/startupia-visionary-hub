
import { supabase } from "@/integrations/supabase/client";
import { UpvoteResponse } from "@/types/community";

/**
 * Toggle a vote (upvote or downvote) for a startup
 * @param startupId The ID of the startup to vote for
 * @param isUpvote Whether this is an upvote (true) or downvote (false)
 * @returns Response with vote status and updated count
 */
export const toggleStartupVote = async (startupId: string, isUpvote: boolean): Promise<UpvoteResponse> => {
  try {
    // Check authentication
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
    
    // Get current vote count from the startup
    const { data: startupData, error: startupError } = await supabase
      .from('startups')
      .select('upvotes_count')
      .eq('id', startupId)
      .single();
    
    if (startupError) {
      console.error("Erreur de récupération des données de la startup:", startupError);
      return {
        success: false,
        message: "Erreur lors de la récupération des données de la startup",
        upvoted: false,
        newCount: 0
      };
    }
    
    const currentCount = startupData.upvotes_count || 0;
    
    // Check for existing vote
    const { data: existingVote, error: voteError } = await supabase
      .from('startup_votes')
      .select('id, is_upvote')
      .eq('startup_id', startupId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (voteError) {
      console.error("Erreur de vérification du vote existant:", voteError);
      return {
        success: false,
        message: "Erreur lors de la vérification de votre vote",
        upvoted: false,
        newCount: currentCount
      };
    }
    
    // Si l'utilisateur a déjà voté et essaie de voter à nouveau avec le même type de vote
    if (existingVote && existingVote.is_upvote === isUpvote) {
      return {
        success: false,
        message: "Vous avez déjà voté pour cette startup",
        upvoted: existingVote.is_upvote,
        newCount: currentCount
      };
    }
    
    // Perform vote operations using our database function
    const { data, error } = await supabase.rpc('handle_startup_vote', {
      p_startup_id: startupId,
      p_user_id: userId,
      p_is_upvote: isUpvote,
      p_existing_vote_id: existingVote?.id || null,
      p_was_upvote: existingVote?.is_upvote || false
    });
    
    if (error) {
      console.error("Erreur lors du vote:", error);
      return {
        success: false,
        message: "Erreur lors du vote",
        upvoted: existingVote?.is_upvote || false,
        newCount: currentCount
      };
    }
    
    // Typage correct de la réponse JSON
    const responseData = data as {
      message: string;
      new_count: number;
      is_upvoted: boolean;
    };
    
    // Return the results from the database function
    return {
      success: true,
      message: responseData.message,
      upvoted: responseData.is_upvoted,
      newCount: responseData.new_count
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

// Compatibilité pour le code existant
export const toggleStartupUpvote = (startupId: string) => toggleStartupVote(startupId, true);
export const toggleStartupDownvote = (startupId: string) => toggleStartupVote(startupId, false);
