import { supabase } from "@/integrations/supabase/client";
import { UpvoteResponse } from "@/types/community";
import { toast } from "sonner";

// Toggle upvote on a startup
export const toggleStartupUpvote = async (startupId: string): Promise<UpvoteResponse> => {
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
    
    // Check if user already voted this startup
    const { data: existingVote } = await supabase
      .from('startup_votes')
      .select('id, is_upvote')
      .eq('startup_id', startupId)
      .eq('user_id', userData.user.id)
      .single();
    
    let upvoted = false;
    let message = "";
    let countDelta = 0;
    
    // If already upvoted, remove the vote
    if (existingVote && existingVote.is_upvote === true) {
      const { error: deleteError } = await supabase
        .from('startup_votes')
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
      
      countDelta = -1;
      message = "Vote retiré";
      upvoted = false;
    } 
    // If already downvoted, change to upvote
    else if (existingVote && existingVote.is_upvote === false) {
      const { error: updateError } = await supabase
        .from('startup_votes')
        .update({ is_upvote: true })
        .eq('startup_id', startupId)
        .eq('user_id', userData.user.id);
        
      if (updateError) {
        console.error("Error updating vote:", updateError);
        return {
          success: false,
          message: "Impossible de mettre à jour votre vote",
          upvoted: false,
          newCount: 0
        };
      }
      
      countDelta = 2; // +2 because we're removing a downvote (-1) and adding an upvote (+1)
      message = "Vote modifié";
      upvoted = true;
    }
    // Otherwise, add an upvote
    else {
      const { error: insertError } = await supabase
        .from('startup_votes')
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
      
      countDelta = 1;
      message = "Vote ajouté";
      upvoted = true;
    }
    
    // Update the upvote count
    if (countDelta !== 0) {
      // Get current count first
      const { data: currentData } = await supabase
        .from('startups')
        .select('upvotes_count')
        .eq('id', startupId)
        .single();
        
      const currentCount = currentData?.upvotes_count || 0;
      const newCount = currentCount + countDelta;
      
      // Update with the calculated value
      const { error: updateCountError } = await supabase
        .from('startups')
        .update({ upvotes_count: newCount })
        .eq('id', startupId);
        
      if (updateCountError) {
        console.error("Error updating startup upvote count:", updateCountError);
      }
    }
    
    // Get the current upvote count
    const { data: startupData, error: startupError } = await supabase
      .from('startups')
      .select('upvotes_count')
      .eq('id', startupId)
      .single();
      
    const newCount = startupData?.upvotes_count || 0;
    
    return {
      success: true,
      message,
      upvoted,
      newCount
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

// Toggle downvote on a startup
export const toggleStartupDownvote = async (startupId: string): Promise<UpvoteResponse> => {
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
    
    // Check if user already voted on this startup
    const { data: existingVote } = await supabase
      .from('startup_votes')
      .select('id, is_upvote')
      .eq('startup_id', startupId)
      .eq('user_id', userData.user.id)
      .single();
    
    let downvoted = false;
    let message = "";
    let countDelta = 0;
    
    // If already downvoted, remove the vote
    if (existingVote && existingVote.is_upvote === false) {
      const { error: deleteError } = await supabase
        .from('startup_votes')
        .delete()
        .eq('startup_id', startupId)
        .eq('user_id', userData.user.id);
        
      if (deleteError) {
        console.error("Error removing downvote:", deleteError);
        return {
          success: false,
          message: "Impossible de supprimer votre vote",
          upvoted: false,
          newCount: 0
        };
      }
      
      countDelta = 1; // Removing a downvote increases the count
      message = "Vote retiré";
      downvoted = false;
    } 
    // If already upvoted, change to downvote
    else if (existingVote && existingVote.is_upvote === true) {
      const { error: updateError } = await supabase
        .from('startup_votes')
        .update({ is_upvote: false })
        .eq('startup_id', startupId)
        .eq('user_id', userData.user.id);
        
      if (updateError) {
        console.error("Error updating to downvote:", updateError);
        return {
          success: false,
          message: "Impossible de mettre à jour votre vote",
          upvoted: false,
          newCount: 0
        };
      }
      
      countDelta = -2; // -2 because we're removing an upvote (+1) and adding a downvote (-1)
      message = "Vote modifié";
      downvoted = true;
    }
    // Otherwise, add a downvote
    else {
      const { error: insertError } = await supabase
        .from('startup_votes')
        .insert({
          startup_id: startupId,
          user_id: userData.user.id,
          is_upvote: false
        });
        
      if (insertError) {
        console.error("Error adding downvote:", insertError);
        return {
          success: false,
          message: "Impossible d'ajouter votre vote",
          upvoted: false,
          newCount: 0
        };
      }
      
      countDelta = -1;
      message = "Vote négatif ajouté";
      downvoted = true;
    }
    
    // Update the upvote count
    if (countDelta !== 0) {
      // Get current count first
      const { data: currentData } = await supabase
        .from('startups')
        .select('upvotes_count')
        .eq('id', startupId)
        .single();
        
      const currentCount = currentData?.upvotes_count || 0;
      const newCount = currentCount + countDelta;
      
      // Update with the calculated value
      const { error: updateCountError } = await supabase
        .from('startups')
        .update({ upvotes_count: newCount })
        .eq('id', startupId);
        
      if (updateCountError) {
        console.error("Error updating startup upvote count:", updateCountError);
      }
    }
    
    // Get the current upvote count
    const { data: startupData, error: startupError } = await supabase
      .from('startups')
      .select('upvotes_count')
      .eq('id', startupId)
      .single();
      
    const newCount = startupData?.upvotes_count || 0;
    
    return {
      success: true,
      message,
      upvoted: !downvoted,
      newCount
    };
  } catch (error) {
    console.error("Error in toggleStartupDownvote:", error);
    return {
      success: false,
      message: "Une erreur est survenue",
      upvoted: false,
      newCount: 0
    };
  }
};
