
import { supabase } from "@/integrations/supabase/client";
import { ForumReply } from "@/types/community";
import { mapReplyFromDB } from "@/utils/forumMappers";
import { toast } from "sonner";

// Function to get replies for a specific post
export const getRepliesForPost = async (postId: string): Promise<ForumReply[]> => {
  try {
    const { data: repliesData, error: repliesError } = await supabase
      .from('forum_replies')
      .select('*')
      .eq('parent_id', postId)
      .order('created_at', { ascending: true });
      
    if (repliesError) {
      console.error("Error fetching replies:", repliesError);
      return [];
    }
    
    // Map raw data to our TypeScript interface
    const replies = repliesData.map(mapReplyFromDB);
    
    // Get current user for like status
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    
    // Import like status check function
    const { getReplyLikeStatus } = await import('./forumLikeService');
    
    // Process each reply to add nested replies and like status
    const processedReplies = await Promise.all(replies.map(async (reply) => {
      // Get nested replies if any
      const { data: nestedRepliesData, error: nestedError } = await supabase
        .from('forum_replies')
        .select('*')
        .eq('reply_parent_id', reply.id)
        .order('created_at', { ascending: true });
        
      let nestedReplies: ForumReply[] = [];
      
      if (!nestedError && nestedRepliesData.length > 0) {
        nestedReplies = await Promise.all(nestedRepliesData.map(async (nestedReply) => {
          const mappedReply = mapReplyFromDB(nestedReply);
          
          // Check like status for nested reply
          if (userId) {
            mappedReply.isLiked = await getReplyLikeStatus(mappedReply.id, userId);
          }
          
          return mappedReply;
        }));
      }
      
      // Check like status for this reply
      let isLiked = false;
      if (userId) {
        isLiked = await getReplyLikeStatus(reply.id, userId);
      }
      
      return { ...reply, nestedReplies, isLiked };
    }));
    
    return processedReplies;
  } catch (error) {
    console.error("Error in getRepliesForPost:", error);
    return [];
  }
};

// Function to add a reply to a post
export const addReplyToPost = async (
  postId: string,
  content: string,
  authorName: string,
  authorAvatar?: string,
  parentReplyId?: string
): Promise<ForumReply> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      console.error("User not authenticated:", userError);
      toast.error("Vous devez être connecté pour répondre");
      throw userError || new Error("User not authenticated");
    }
    
    const newReply = {
      parent_id: postId,
      reply_parent_id: parentReplyId || null,
      content,
      author_id: userData.user.id,
      author_name: authorName,
      author_avatar: authorAvatar,
      created_at: new Date().toISOString(),
      likes: 0
    };
    
    const { data, error } = await supabase
      .from('forum_replies')
      .insert(newReply)
      .select()
      .single();
      
    if (error) {
      console.error("Error adding reply:", error);
      toast.error("Impossible d'ajouter la réponse");
      throw error;
    }
    
    toast.success("Réponse ajoutée avec succès");
    return mapReplyFromDB(data);
  } catch (error) {
    console.error("Error in addReplyToPost:", error);
    throw error;
  }
};
