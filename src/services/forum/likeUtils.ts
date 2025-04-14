
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { LikeResponse } from "@/types/community";

// Check if user is authenticated and return user ID
export const checkAuthentication = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error("Authentication error:", error);
      return null;
    }
    
    return data.user?.id || null;
  } catch (error) {
    console.error("Error in checkAuthentication:", error);
    return null;
  }
};

// Generic function to toggle a like (post or reply)
export const likePost = async (postId: string): Promise<LikeResponse> => {
  try {
    const userId = await checkAuthentication();
    
    if (!userId) {
      return {
        success: false,
        message: "Authentication required",
        liked: false,
        newCount: 0
      };
    }
    
    // Check if the user already liked this post
    const { data: existingLike, error: checkError } = await supabase
      .from('forum_post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();
      
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error("Error checking existing like:", checkError);
      throw checkError;
    }
    
    let liked: boolean;
    
    // If the user already liked the post, remove the like
    if (existingLike) {
      const { error: deleteError } = await supabase
        .from('forum_post_likes')
        .delete()
        .eq('id', existingLike.id);
        
      if (deleteError) {
        console.error("Error removing like:", deleteError);
        throw deleteError;
      }
      
      liked = false;
      
      // Decrement post likes count
      const { error: updateError } = await supabase
        .from('forum_posts')
        .update({ likes: supabase.rpc('decrement', { x: 1 }) })
        .eq('id', postId);
        
      if (updateError) {
        console.error("Error updating post likes count:", updateError);
        throw updateError;
      }
      
      toast.success("Like retiré");
    } 
    // If the user hasn't liked the post yet, add a like
    else {
      const { error: insertError } = await supabase
        .from('forum_post_likes')
        .insert({ post_id: postId, user_id: userId });
        
      if (insertError) {
        console.error("Error adding like:", insertError);
        throw insertError;
      }
      
      liked = true;
      
      // Increment post likes count
      const { error: updateError } = await supabase
        .from('forum_posts')
        .update({ likes: supabase.rpc('increment', { x: 1 }) })
        .eq('id', postId);
        
      if (updateError) {
        console.error("Error updating post likes count:", updateError);
        throw updateError;
      }
      
      toast.success("Post liké !");
    }
    
    // Get updated likes count
    const { data: post, error: postError } = await supabase
      .from('forum_posts')
      .select('likes')
      .eq('id', postId)
      .single();
      
    if (postError) {
      console.error("Error getting updated post:", postError);
      throw postError;
    }
    
    return {
      success: true,
      message: liked ? "Post liké" : "Like retiré",
      liked,
      newCount: post.likes
    };
    
  } catch (error) {
    console.error("Error in likePost:", error);
    toast.error("Une erreur est survenue");
    return {
      success: false,
      message: "Une erreur est survenue",
      liked: false,
      newCount: 0
    };
  }
};

// For reply likes
export const likeReply = async (replyId: string): Promise<LikeResponse> => {
  try {
    const userId = await checkAuthentication();
    
    if (!userId) {
      return {
        success: false,
        message: "Authentication required",
        liked: false,
        newCount: 0
      };
    }
    
    // Check if the user already liked this reply
    const { data: existingLike, error: checkError } = await supabase
      .from('forum_reply_likes')
      .select('id')
      .eq('reply_id', replyId)
      .eq('user_id', userId)
      .single();
      
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error("Error checking existing reply like:", checkError);
      throw checkError;
    }
    
    let liked: boolean;
    
    // If the user already liked the reply, remove the like
    if (existingLike) {
      const { error: deleteError } = await supabase
        .from('forum_reply_likes')
        .delete()
        .eq('id', existingLike.id);
        
      if (deleteError) {
        console.error("Error removing reply like:", deleteError);
        throw deleteError;
      }
      
      liked = false;
      
      // Decrement reply likes count
      const { error: updateError } = await supabase
        .from('forum_replies')
        .update({ likes: supabase.rpc('decrement', { x: 1 }) })
        .eq('id', replyId);
        
      if (updateError) {
        console.error("Error updating reply likes count:", updateError);
        throw updateError;
      }
      
      toast.success("Like retiré");
    } 
    // If the user hasn't liked the reply yet, add a like
    else {
      const { error: insertError } = await supabase
        .from('forum_reply_likes')
        .insert({ reply_id: replyId, user_id: userId });
        
      if (insertError) {
        console.error("Error adding reply like:", insertError);
        throw insertError;
      }
      
      liked = true;
      
      // Increment reply likes count
      const { error: updateError } = await supabase
        .from('forum_replies')
        .update({ likes: supabase.rpc('increment', { x: 1 }) })
        .eq('id', replyId);
        
      if (updateError) {
        console.error("Error updating reply likes count:", updateError);
        throw updateError;
      }
      
      toast.success("Réponse likée !");
    }
    
    // Get updated likes count
    const { data: reply, error: replyError } = await supabase
      .from('forum_replies')
      .select('likes')
      .eq('id', replyId)
      .single();
      
    if (replyError) {
      console.error("Error getting updated reply:", replyError);
      throw replyError;
    }
    
    return {
      success: true,
      message: liked ? "Réponse likée" : "Like retiré",
      liked,
      newCount: reply.likes
    };
    
  } catch (error) {
    console.error("Error in likeReply:", error);
    toast.error("Une erreur est survenue");
    return {
      success: false,
      message: "Une erreur est survenue",
      liked: false,
      newCount: 0
    };
  }
};
