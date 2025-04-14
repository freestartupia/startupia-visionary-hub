
import { SupabaseClient } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";

export interface LikeResponse {
  success: boolean;
  message: string;
  isLiked?: boolean;
  likeCount?: number;
  liked?: boolean;
  newCount?: number;
}

// Function to check authentication
export const checkAuthentication = async (): Promise<string | null> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      return null;
    }
    
    return userData.user.id;
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
};

// Function to like a post
export const likePost = async (postId: string): Promise<LikeResponse> => {
  try {
    const userId = await checkAuthentication();
    
    if (!userId) {
      return {
        success: false,
        message: "Authentication required",
        liked: false
      };
    }
    
    const result = await handleToggleLike(supabase, 'forum_post_likes', 'post_id', postId, userId);
    
    // Determine if the post is now liked based on the result
    return {
      ...result,
      liked: result.isLiked
    };
    
  } catch (error) {
    console.error("Error in likePost:", error);
    return {
      success: false,
      message: "Error toggling like",
      liked: false
    };
  }
};

// Function to like a reply
export const likeReply = async (replyId: string): Promise<LikeResponse> => {
  try {
    const userId = await checkAuthentication();
    
    if (!userId) {
      return {
        success: false,
        message: "Authentication required",
        liked: false
      };
    }
    
    const result = await handleToggleLike(supabase, 'forum_reply_likes', 'reply_id', replyId, userId);
    
    // Determine if the reply is now liked based on the result
    return {
      ...result,
      liked: result.isLiked
    };
    
  } catch (error) {
    console.error("Error in likeReply:", error);
    return {
      success: false,
      message: "Error toggling like",
      liked: false
    };
  }
};

export const handleToggleLike = async (
  supabase: SupabaseClient,
  table: string,
  field: string,
  id: string,
  userId: string
): Promise<LikeResponse> => {
  try {
    // Check if the user has already liked this item
    const { data: existingLike } = await supabase
      .from(table)
      .select('id')
      .eq(field, id)
      .eq('user_id', userId)
      .single();

    if (existingLike) {
      // Unlike - remove the like
      const { error: deleteError } = await supabase
        .from(table)
        .delete()
        .eq(field, id)
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      return {
        success: true,
        message: 'Like removed successfully',
        isLiked: false,
      };
    } else {
      // Like - add a new like
      const { error: insertError } = await supabase
        .from(table)
        .insert({ [field]: id, user_id: userId });

      if (insertError) throw insertError;

      return {
        success: true,
        message: 'Liked successfully',
        isLiked: true,
      };
    }
  } catch (error) {
    console.error(`Error toggling like for ${table}:`, error);
    toast.error(`Une erreur est survenue. Veuillez réessayer.`);
    return {
      success: false,
      message: 'Error toggling like',
    };
  }
};
