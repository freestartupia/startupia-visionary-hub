
import { supabase } from "@/integrations/supabase/client";
import { LikeResponse } from "@/types/community";
import { toast } from "sonner";

// Function to check if a user is authenticated
export const checkAuthentication = async (): Promise<string | null> => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    return null;
  }
  
  return userData.user.id;
};

// Specific function for checking if a user has liked a post
export const getLikeStatus = async (
  contentId: string, 
  userId: string
): Promise<boolean> => {
  const { data, error } = await supabase
    .from('forum_post_likes')
    .select('id')
    .eq('post_id', contentId)
    .eq('user_id', userId)
    .single();
    
  return !!data && !error;
};

// Specific function for toggling post likes
export const likePost = async (postId: string): Promise<LikeResponse> => {
  const userId = await checkAuthentication();
  
  if (!userId) {
    throw new Error('User not authenticated');
  }
  
  // Check if the user has already liked the post
  const { data, error } = await supabase
    .from('forum_post_likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single();
  
  let isLiked = false;
  
  // Get current like count
  const { data: postData, error: postError } = await supabase
    .from('forum_posts')
    .select('likes')
    .eq('id', postId)
    .single();
    
  if (postError) {
    throw postError;
  }
  
  const currentLikes = postData?.likes || 0;
  
  if (data && !error) {
    // If the user has already liked the post, remove the like
    const { error: deleteError } = await supabase
      .from('forum_post_likes')
      .delete()
      .eq('id', data.id);
      
    if (deleteError) {
      throw deleteError;
    }
    
    // Decrement the like count
    const { error: updateError } = await supabase
      .from('forum_posts')
      .update({ likes: Math.max(0, currentLikes - 1) })
      .eq('id', postId);
      
    if (updateError) {
      throw updateError;
    }
    
    isLiked = false;
  } else {
    // If the user hasn't liked the post, add a like
    const { error: insertError } = await supabase
      .from('forum_post_likes')
      .insert({ post_id: postId, user_id: userId });
      
    if (insertError) {
      throw insertError;
    }
    
    // Increment the like count
    const { error: updateError } = await supabase
      .from('forum_posts')
      .update({ likes: currentLikes + 1 })
      .eq('id', postId);
      
    if (updateError) {
      throw updateError;
    }
    
    isLiked = true;
  }
  
  return {
    success: true,
    message: isLiked ? "Post aimé" : "J'aime retiré",
    liked: isLiked,
    newCount: isLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1)
  };
};

// Specific function for toggling reply likes
export const likeReply = async (replyId: string): Promise<LikeResponse> => {
  const userId = await checkAuthentication();
  
  if (!userId) {
    throw new Error('User not authenticated');
  }
  
  // Check if the user has already liked the reply
  const { data, error } = await supabase
    .from('forum_reply_likes')
    .select('id')
    .eq('reply_id', replyId)
    .eq('user_id', userId)
    .single();
  
  let isLiked = false;
  
  // Get current like count
  const { data: replyData, error: replyError } = await supabase
    .from('forum_replies')
    .select('likes')
    .eq('id', replyId)
    .single();
    
  if (replyError) {
    throw replyError;
  }
  
  const currentLikes = replyData?.likes || 0;
  
  if (data && !error) {
    // If the user has already liked the reply, remove the like
    const { error: deleteError } = await supabase
      .from('forum_reply_likes')
      .delete()
      .eq('id', data.id);
      
    if (deleteError) {
      throw deleteError;
    }
    
    // Decrement the like count
    const { error: updateError } = await supabase
      .from('forum_replies')
      .update({ likes: Math.max(0, currentLikes - 1) })
      .eq('id', replyId);
      
    if (updateError) {
      throw updateError;
    }
    
    isLiked = false;
  } else {
    // If the user hasn't liked the reply, add a like
    const { error: insertError } = await supabase
      .from('forum_reply_likes')
      .insert({ reply_id: replyId, user_id: userId });
      
    if (insertError) {
      throw insertError;
    }
    
    // Increment the like count
    const { error: updateError } = await supabase
      .from('forum_replies')
      .update({ likes: currentLikes + 1 })
      .eq('id', replyId);
      
    if (updateError) {
      throw updateError;
    }
    
    isLiked = true;
  }
  
  return {
    success: true,
    message: isLiked ? "Réponse aimée" : "J'aime retiré",
    liked: isLiked,
    newCount: isLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1)
  };
};
