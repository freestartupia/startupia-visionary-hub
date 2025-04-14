
import { supabase } from "@/integrations/supabase/client";
import { ForumReply } from "@/types/community";
import { toast } from "sonner";
import { getReplyLikeStatus } from "./replyLikeService";

// Add a reply to a post
export const addReplyToPost = async (
  postId: string,
  content: string,
  parentReplyId?: string
): Promise<ForumReply | null> => {
  try {
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      console.error("Error getting user:", userError);
      toast.error("Vous devez être connecté pour répondre");
      return null;
    }
    
    const userId = userData.user.id;
    
    // Get user profile for name and avatar
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('first_name, last_name, avatar_url')
      .eq('id', userId)
      .single();
      
    if (profileError) {
      console.error("Error getting profile:", profileError);
      // Continue without profile info, will use fallbacks
    }
    
    // Create author name from profile or use email as fallback
    const authorName = profile 
      ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
      : userData.user.email?.split('@')[0] || 'Utilisateur';
      
    // Prepare the reply data
    const replyData = {
      content,
      author_id: userId,
      author_name: authorName,
      author_avatar: profile?.avatar_url || null,
      parent_id: postId,
      reply_parent_id: parentReplyId || null
    };
    
    // Insert the reply
    const { data: newReply, error: insertError } = await supabase
      .from('forum_replies')
      .insert(replyData)
      .select()
      .single();
      
    if (insertError) {
      console.error("Error creating reply:", insertError);
      toast.error("Impossible d'ajouter votre réponse");
      return null;
    }
    
    // Convert DB reply to ForumReply format
    const reply: ForumReply = {
      id: newReply.id,
      content: newReply.content,
      authorId: newReply.author_id,
      authorName: newReply.author_name,
      authorAvatar: newReply.author_avatar,
      createdAt: newReply.created_at,
      updatedAt: newReply.updated_at,
      likes: newReply.likes || 0,
      parentId: newReply.parent_id,
      replyParentId: newReply.reply_parent_id,
      isLiked: false,
      nestedReplies: []
    };
    
    toast.success("Réponse publiée avec succès!");
    return reply;
    
  } catch (error) {
    console.error("Error in addReplyToPost:", error);
    toast.error("Une erreur est survenue");
    return null;
  }
};

// Get all replies for a specific post
export const getPostReplies = async (postId: string): Promise<ForumReply[]> => {
  try {
    const { data: repliesData, error: repliesError } = await supabase
      .from('forum_replies')
      .select('*')
      .eq('parent_id', postId)
      .order('created_at', { ascending: true });
      
    if (repliesError) {
      console.error("Error fetching replies:", repliesError);
      throw repliesError;
    }
    
    // Get current user for like status
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    
    // Group replies by their ID to build the nested structure
    const repliesMap = new Map<string, ForumReply>();
    const topLevelReplies: ForumReply[] = [];
    
    // First pass: create reply objects and add them to the map
    for (const replyData of repliesData) {
      let isLiked = false;
      
      // Check like status if user is logged in
      if (userId) {
        isLiked = await getReplyLikeStatus(replyData.id, userId);
      }
      
      const reply: ForumReply = {
        id: replyData.id,
        content: replyData.content,
        authorId: replyData.author_id,
        authorName: replyData.author_name,
        authorAvatar: replyData.author_avatar,
        createdAt: replyData.created_at,
        updatedAt: replyData.updated_at,
        likes: replyData.likes || 0,
        parentId: replyData.parent_id,
        replyParentId: replyData.reply_parent_id,
        isLiked,
        nestedReplies: []
      };
      
      repliesMap.set(reply.id, reply);
    }
    
    // Second pass: build the nested structure
    repliesData.forEach(replyData => {
      const reply = repliesMap.get(replyData.id);
      
      if (reply) {
        if (replyData.reply_parent_id) {
          // This is a nested reply
          const parentReply = repliesMap.get(replyData.reply_parent_id);
          if (parentReply) {
            parentReply.nestedReplies = parentReply.nestedReplies || [];
            parentReply.nestedReplies.push(reply);
          } else {
            // If parent not found (shouldn't happen), add to top level
            topLevelReplies.push(reply);
          }
        } else {
          // This is a top-level reply
          topLevelReplies.push(reply);
        }
      }
    });
    
    return topLevelReplies;
  } catch (error) {
    console.error("Error in getPostReplies:", error);
    return [];
  }
};
