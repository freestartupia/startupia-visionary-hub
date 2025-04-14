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
    
    // Check if user already upvoted this startup
    const { data: existingUpvote } = await supabase
      .from('post_upvotes')
      .select('id, is_upvote')
      .eq('post_id', startupId)
      .eq('user_id', userData.user.id)
      .single();
    
    let upvoted = false;
    let message = "";
    
    // If already upvoted, remove the upvote
    if (existingUpvote && existingUpvote.is_upvote === true) {
      const { error: deleteError } = await supabase
        .from('post_upvotes')
        .delete()
        .eq('post_id', startupId)
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
      
      // Decrease the upvote count directly
      const { error: updateCountError } = await supabase
        .from('startups')
        .update({ upvotes_count: supabase.sql`upvotes_count - 1` })
        .eq('id', startupId);
        
      if (updateCountError) {
        console.error("Error updating startup upvote count:", updateCountError);
      }
      
      message = "Vote retiré";
      upvoted = false;
    } 
    // If already downvoted, change to upvote
    else if (existingUpvote && existingUpvote.is_upvote === false) {
      const { error: updateError } = await supabase
        .from('post_upvotes')
        .update({ is_upvote: true })
        .eq('post_id', startupId)
        .eq('user_id', userData.user.id);
        
      if (updateError) {
        console.error("Error updating upvote:", updateError);
        return {
          success: false,
          message: "Impossible de mettre à jour votre vote",
          upvoted: false,
          newCount: 0
        };
      }
      
      // Increase the upvote count by 2 (removing downvote + adding upvote)
      const { error: updateCountError } = await supabase
        .from('startups')
        .update({ upvotes_count: supabase.sql`upvotes_count + 2` })
        .eq('id', startupId);
        
      if (updateCountError) {
        console.error("Error updating startup upvote count:", updateCountError);
      }
      
      message = "Vote modifié";
      upvoted = true;
    }
    // Otherwise, add an upvote
    else {
      const { error: insertError } = await supabase
        .from('post_upvotes')
        .insert({
          post_id: startupId,
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
      
      // Increase the upvote count
      const { error: updateCountError } = await supabase
        .from('startups')
        .update({ upvotes_count: supabase.sql`upvotes_count + 1` })
        .eq('id', startupId);
        
      if (updateCountError) {
        console.error("Error updating startup upvote count:", updateCountError);
      }
      
      message = "Vote ajouté";
      upvoted = true;
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
      .from('post_upvotes')
      .select('id, is_upvote')
      .eq('post_id', startupId)
      .eq('user_id', userData.user.id)
      .single();
    
    let downvoted = false;
    let message = "";
    
    // If already downvoted, remove the vote
    if (existingVote && existingVote.is_upvote === false) {
      const { error: deleteError } = await supabase
        .from('post_upvotes')
        .delete()
        .eq('post_id', startupId)
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
      
      // Increase the upvote count (removing a downvote increases the count)
      const { error: updateCountError } = await supabase
        .from('startups')
        .update({ upvotes_count: supabase.sql`upvotes_count + 1` })
        .eq('id', startupId);
        
      if (updateCountError) {
        console.error("Error updating startup upvote count:", updateCountError);
      }
      
      message = "Vote retiré";
      downvoted = false;
    } 
    // If already upvoted, change to downvote
    else if (existingVote && existingVote.is_upvote === true) {
      const { error: updateError } = await supabase
        .from('post_upvotes')
        .update({ is_upvote: false })
        .eq('post_id', startupId)
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
      
      // Decrease the upvote count by 2 (removing upvote + adding downvote)
      const { error: updateCountError } = await supabase
        .from('startups')
        .update({ upvotes_count: supabase.sql`upvotes_count - 2` })
        .eq('id', startupId);
        
      if (updateCountError) {
        console.error("Error updating startup upvote count:", updateCountError);
      }
      
      message = "Vote modifié";
      downvoted = true;
    }
    // Otherwise, add a downvote
    else {
      const { error: insertError } = await supabase
        .from('post_upvotes')
        .insert({
          post_id: startupId,
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
      
      // Decrease the upvote count
      const { error: updateCountError } = await supabase
        .from('startups')
        .update({ upvotes_count: supabase.sql`upvotes_count - 1` })
        .eq('id', startupId);
        
      if (updateCountError) {
        console.error("Error updating startup upvote count:", updateCountError);
      }
      
      message = "Vote négatif ajouté";
      downvoted = true;
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
