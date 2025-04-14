
import { supabase } from '@/integrations/supabase/client';
import { ForumReply, PopulatedForumReply } from '@/types/community';
import { getReplyLikeStatus } from './replyLikeService';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const formatReplyDate = (date: string): string => {
  return formatDistanceToNow(new Date(date), {
    locale: fr,
    addSuffix: true,
  });
};

export const populateReplyWithLikeInfo = async (reply: any): Promise<PopulatedForumReply> => {
  const { liked, count } = await getReplyLikeStatus(reply.id);

  return {
    id: reply.id,
    content: reply.content,
    authorId: reply.author_id || "",
    authorName: reply.author_name,
    authorAvatar: reply.author_avatar,
    createdAt: reply.created_at,
    updatedAt: reply.updated_at,
    likes: count,
    parentId: reply.parent_id,
    replyParentId: reply.reply_parent_id,
    userHasLiked: liked,
    formattedCreatedAt: formatReplyDate(reply.created_at),
    children: [],
    isLiked: liked,
    nestedReplies: []
  };
};

export const getRepliesForPost = async (postId: string): Promise<ForumReply[]> => {
  try {
    const { data: replies, error } = await supabase
      .from('forum_replies')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching forum replies:', error);
      return [];
    }

    if (!replies || replies.length === 0) {
      return [];
    }

    // Populate like info for each reply
    const populatedReplies = await Promise.all(replies.map(reply => populateReplyWithLikeInfo(reply)));
    
    // Organize replies into a tree structure
    const topLevelReplies: PopulatedForumReply[] = [];
    const nestedReplies: Record<string, PopulatedForumReply[]> = {};
    
    // Group nested replies by parent ID
    populatedReplies.forEach(reply => {
      if (reply.replyParentId) {
        if (!nestedReplies[reply.replyParentId]) {
          nestedReplies[reply.replyParentId] = [];
        }
        nestedReplies[reply.replyParentId].push(reply);
      } else {
        topLevelReplies.push(reply);
      }
    });
    
    // Attach nested replies to their parents
    topLevelReplies.forEach(reply => {
      if (nestedReplies[reply.id]) {
        reply.nestedReplies = nestedReplies[reply.id];
      }
    });

    return topLevelReplies;
  } catch (error) {
    console.error('Error fetching forum replies:', error);
    return [];
  }
};

export const addReplyToPost = async (
  postId: string,
  content: string,
  userId: string,
  userAvatar: string | null,
  userName: string,
  replyToId?: string
): Promise<{ success: boolean; reply?: ForumReply; error?: any }> => {
  try {
    const newReply = {
      post_id: postId,
      content,
      author_id: userId,
      author_name: userName,
      author_avatar: userAvatar,
      reply_parent_id: replyToId
    };

    const { data, error } = await supabase
      .from('forum_replies')
      .insert(newReply)
      .select()
      .single();

    if (error) {
      console.error('Error creating forum reply:', error);
      return { success: false, error };
    }

    const populatedReply = await populateReplyWithLikeInfo(data);
    return { success: true, reply: populatedReply };
  } catch (error) {
    console.error('Error creating forum reply:', error);
    return { success: false, error };
  }
};
