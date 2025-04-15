import { supabase } from "@/integrations/supabase/client";
import { UpvoteResponse } from "@/types/community";
import { toast } from "sonner";

// Check if a post is upvoted by the current user
export const checkPostUpvote = async (postId: string): Promise<boolean> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return false;
    
    const { data, error } = await supabase
      .from('post_upvotes')
      .select('is_upvote')
      .eq('post_id', postId)
      .eq('user_id', userData.user.id)
      .single();
      
    if (error && error.code !== 'PGRST116') {
      console.error("Error checking post upvote:", error);
      return false;
    }
    
    return !!data && data.is_upvote === true;
  } catch (error) {
    console.error("Error in checkPostUpvote:", error);
    return false;
  }
};

// Toggle upvote on a post
export const togglePostUpvote = async (postId: string): Promise<UpvoteResponse> => {
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
    
    // Check if user already upvoted this post
    const { data: existingUpvote } = await supabase
      .from('post_upvotes')
      .select('id, is_upvote')
      .eq('post_id', postId)
      .eq('user_id', userData.user.id)
      .single();
    
    let upvoted = false;
    let message = "";
    
    // If already upvoted, remove the upvote
    if (existingUpvote && existingUpvote.is_upvote === true) {
      const { error: deleteError } = await supabase
        .from('post_upvotes')
        .delete()
        .eq('post_id', postId)
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
    // If already downvoted, change to upvote
    else if (existingUpvote && existingUpvote.is_upvote === false) {
      const { error: updateError } = await supabase
        .from('post_upvotes')
        .update({ is_upvote: true })
        .eq('post_id', postId)
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
      
      message = "Vote modifié";
      upvoted = true;
    }
    // Otherwise, add an upvote
    else {
      const { error: insertError } = await supabase
        .from('post_upvotes')
        .insert({
          post_id: postId,
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
    
    // Get the updated upvote count
    const { data: postData, error: postError } = await supabase
      .from('forum_posts')
      .select('upvotes_count')
      .eq('id', postId)
      .single();
      
    if (postError) {
      console.error("Error fetching updated post:", postError);
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
      newCount: postData.upvotes_count
    };
  } catch (error) {
    console.error("Error in togglePostUpvote:", error);
    return {
      success: false,
      message: "Une erreur est survenue",
      upvoted: false,
      newCount: 0
    };
  }
};

// Toggle downvote on a post
export const togglePostDownvote = async (postId: string): Promise<UpvoteResponse> => {
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
    
    // Check if user already voted on this post
    const { data: existingVote } = await supabase
      .from('post_upvotes')
      .select('id, is_upvote')
      .eq('post_id', postId)
      .eq('user_id', userData.user.id)
      .single();
    
    let downvoted = false;
    let message = "";
    
    // If already downvoted, remove the vote
    if (existingVote && existingVote.is_upvote === false) {
      const { error: deleteError } = await supabase
        .from('post_upvotes')
        .delete()
        .eq('post_id', postId)
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
      
      message = "Vote retiré";
      downvoted = false;
    } 
    // If already upvoted, change to downvote
    else if (existingVote && existingVote.is_upvote === true) {
      const { error: updateError } = await supabase
        .from('post_upvotes')
        .update({ is_upvote: false })
        .eq('post_id', postId)
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
      
      message = "Vote modifié";
      downvoted = true;
    }
    // Otherwise, add a downvote
    else {
      const { error: insertError } = await supabase
        .from('post_upvotes')
        .insert({
          post_id: postId,
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
      
      message = "Vote négatif ajouté";
      downvoted = true;
    }
    
    // Get the updated upvote count
    const { data: postData, error: postError } = await supabase
      .from('forum_posts')
      .select('upvotes_count')
      .eq('id', postId)
      .single();
      
    if (postError) {
      console.error("Error fetching updated post:", postError);
      return {
        success: true,
        message,
        upvoted: !downvoted,
        newCount: 0
      };
    }
    
    return {
      success: true,
      message,
      upvoted: !downvoted,
      newCount: postData.upvotes_count
    };
  } catch (error) {
    console.error("Error in togglePostDownvote:", error);
    return {
      success: false,
      message: "Une erreur est survenue",
      upvoted: false,
      newCount: 0
    };
  }
};
