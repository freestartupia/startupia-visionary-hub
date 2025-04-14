
import { supabase } from '@/integrations/supabase/client';
import { ForumReply } from '@/types/community';
import { ForumReplyDB } from '@/types/forumTypes';
import { getReplyLikeStatus } from './replyLikeService';

// Format date for display
const formatReplyDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const diffMinutes = Math.round(diff / (1000 * 60));
  const diffHours = Math.round(diff / (1000 * 3600));
  const diffDays = Math.round(diff / (1000 * 3600 * 24));

  if (diffMinutes < 60) {
    return `Il y a ${diffMinutes} minute(s)`;
  } else if (diffHours < 24) {
    return `Il y a ${diffHours} heure(s)`;
  } else if (diffDays < 7) {
    return `Il y a ${diffDays} jour(s)`;
  } else {
    return date.toLocaleDateString();
  }
};

// Map DB reply to ForumReply
const mapDbReplyToForumReply = (replyData: ForumReplyDB): ForumReply => {
  return {
    id: replyData.id,
    content: replyData.content,
    authorId: replyData.author_id,
    authorName: replyData.author_name,
    authorAvatar: replyData.author_avatar || null,
    createdAt: replyData.created_at,
    updatedAt: replyData.updated_at || null,
    likes: replyData.likes || 0,
    isLiked: false,
    parentId: replyData.parent_id,
    replyParentId: replyData.reply_parent_id || null,
    formattedCreatedAt: formatReplyDate(replyData.created_at),
    replies: []
  };
};

// Get replies for a post
export const getRepliesForPost = async (postId: string): Promise<ForumReply[]> => {
  try {
    const { data, error } = await supabase
      .from('forum_replies')
      .select('*')
      .eq('parent_id', postId)
      .is('reply_parent_id', null)
      .order('created_at', { ascending: true });

    if (error) {
      console.error("Error fetching replies:", error);
      return [];
    }

    // Populate with like info and nested replies
    const populatedReplies = await Promise.all(data.map(async (reply) => {
      const { liked } = await getReplyLikeStatus(reply.id);
      const formattedReply = mapDbReplyToForumReply(reply as ForumReplyDB);
      
      // Get nested replies
      const nestedReplies = await getNestedReplies(reply.id);
      
      return {
        ...formattedReply,
        userHasLiked: liked,
        replies: nestedReplies
      };
    }));

    return populatedReplies;
  } catch (error) {
    console.error("Error fetching replies:", error);
    return [];
  }
};

// Get nested replies
export const getNestedReplies = async (replyId: string): Promise<ForumReply[]> => {
  try {
    const { data, error } = await supabase
      .from('forum_replies')
      .select('*')
      .eq('reply_parent_id', replyId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error("Error fetching nested replies:", error);
      return [];
    }

    const populatedReplies = await Promise.all(data.map(async (reply) => {
      const { liked } = await getReplyLikeStatus(reply.id);
      const formattedReply = mapDbReplyToForumReply(reply as ForumReplyDB);
      
      return {
        ...formattedReply,
        userHasLiked: liked,
        // Don't fetch deeper nested replies to avoid infinite recursion
        replies: []
      };
    }));

    return populatedReplies;
  } catch (error) {
    console.error("Error fetching nested replies:", error);
    return [];
  }
};

// Create a new reply
export const createReply = async (
  content: string, 
  postId: string, 
  replyParentId: string | null = null
): Promise<{ success: boolean; reply: ForumReply | null; error: string | null }> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      return { 
        success: false, 
        reply: null, 
        error: "Vous devez être connecté pour répondre." 
      };
    }
    
    // Get user profile info
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('first_name, last_name, avatar_url')
      .eq('id', userData.user.id)
      .single();
      
    if (profileError) {
      console.error("Error fetching profile:", profileError);
    }
    
    const authorName = profileData 
      ? `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() 
      : 'Utilisateur StartupIA';
    
    const newReply = {
      content,
      parent_id: postId,
      reply_parent_id: replyParentId,
      author_id: userData.user.id,
      author_name: authorName,
      author_avatar: profileData?.avatar_url || null
    };
    
    const { data, error } = await supabase
      .from('forum_replies')
      .insert(newReply)
      .select()
      .single();
      
    if (error) {
      console.error("Error creating reply:", error);
      return { 
        success: false, 
        reply: null, 
        error: "Erreur lors de la création de la réponse." 
      };
    }
    
    const reply = mapDbReplyToForumReply(data as ForumReplyDB);
    
    return { 
      success: true, 
      reply: {
        ...reply,
        userHasLiked: false,
        replies: []
      }, 
      error: null 
    };
  } catch (error) {
    console.error("Error creating reply:", error);
    return { 
      success: false, 
      reply: null, 
      error: "Erreur lors de la création de la réponse." 
    };
  }
};
