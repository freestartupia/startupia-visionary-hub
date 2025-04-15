import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type StartupUpvoteResponse = {
  success: boolean;
  message: string;
  upvoted: boolean;
  newCount: number;
};

// Check if a startup is upvoted by the current user
export const checkStartupUpvote = async (startupId: string): Promise<boolean> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return false;
    
    const { data, error } = await supabase
      .from('startup_upvotes')
      .select('is_upvote')
      .eq('startup_id', startupId)
      .eq('user_id', userData.user.id)
      .single();
      
    if (error && error.code !== 'PGRST116') {
      console.error("Error checking startup upvote:", error);
      return false;
    }
    
    return !!data && data.is_upvote === true;
  } catch (error) {
    console.error("Error in checkStartupUpvote:", error);
    return false;
  }
};

// Toggle upvote on a startup
export const toggleStartupUpvote = async (startupId: string): Promise<StartupUpvoteResponse> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      toast.error("Vous devez être connecté pour voter");
      return {
        success: false,
        message: "Authentification requise",
        upvoted: false,
        newCount: 0
      };
    }
    
    // Check if user already upvoted this startup
    const { data: existingUpvote } = await supabase
      .from('startup_upvotes')
      .select('id, is_upvote')
      .eq('startup_id', startupId)
      .eq('user_id', userData.user.id)
      .single();
    
    let upvoted = false;
    let message = "";
    
    // If already upvoted, remove the upvote
    if (existingUpvote && existingUpvote.is_upvote === true) {
      const { error: deleteError } = await supabase
        .from('startup_upvotes')
        .delete()
        .eq('startup_id', startupId)
        .eq('user_id', userData.user.id);
        
      if (deleteError) {
        console.error("Error removing upvote:", deleteError);
        return {
          success: false,
          message: "Impossible de supprimer votre vote",
          upvoted: true,
          newCount: 0
        };
      }
      
      message = "Vote retiré";
      upvoted = false;
    } 
    // Otherwise, add an upvote
    else {
      const { error: insertError } = await supabase
        .from('startup_upvotes')
        .insert({
          startup_id: startupId,
          user_id: userData.user.id,
          is_upvote: true
        });
        
      if (insertError) {
        console.error("Error adding upvote:", insertError);
        return {
          success: false,
          message: "Impossible d'ajouter votre vote",
          upvoted: false,
          newCount: 0
        };
      }
      
      message = "Vote ajouté";
      upvoted = true;
    }
    
    // Update the upvote count for the startup
    const { data: updateData, error: updateError } = await supabase.rpc(
      'update_startup_votes_count',
      { startup_id_param: startupId }
    );
    
    if (updateError) {
      console.error("Error updating startup votes count:", updateError);
    }
    
    // Get the updated upvote count
    const { data: startupData, error: startupError } = await supabase
      .from('startups')
      .select('votes_count')
      .eq('id', startupId)
      .single();
      
    if (startupError) {
      console.error("Error fetching updated startup:", startupError);
      return {
        success: true,
        message,
        upvoted,
        newCount: upvoted ? 1 : 0
      };
    }
    
    return {
      success: true,
      message,
      upvoted,
      newCount: startupData.votes_count || 0
    };
  } catch (error) {
    console.error("Error in toggleStartupUpvote:", error);
    return {
      success: false,
      message: "Une erreur est survenue",
      upvoted: false,
      newCount: 0
    };
  }
};
