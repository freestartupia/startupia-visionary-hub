import { supabase } from '@/integrations/supabase/client';
import { ForumReply, PopulatedForumReply } from '@/types/community';
import { getReplyLikeStatus } from './forum/replyLikeService';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const formatReplyDate = (date: string): string => {
  return formatDistanceToNow(new Date(date), {
    locale: ptBR,
    addSuffix: true,
  });
};

const populateReplyWithLikeInfo = async (reply: ForumReply): Promise<PopulatedForumReply> => {
  const { liked, count } = await getReplyLikeStatus(reply.id);

  return {
    ...reply,
    userHasLiked: liked,
    formattedCreatedAt: formatReplyDate(reply.created_at),
    children: [] // Will be populated later if needed
  };
};

export const createForumReply = async (
  postId: string,
  content: string,
  userId: string,
  userAvatar: string | null,
  userName: string
): Promise<{ data: ForumReply | null; error: any }> => {
  try {
    const { data: reply, error } = await supabase
      .from('forum_replies')
      .insert([
        {
          post_id: postId,
          content: content,
          user_id: userId,
          user_avatar: userAvatar,
          user_name: userName,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating forum reply:', error);
      return { data: null, error };
    }

    return { data: reply, error: null };
  } catch (error) {
    console.error('Error creating forum reply:', error);
    return { data: null, error };
  }
};

export const getForumRepliesByPostId = async (postId: string): Promise<{ data: PopulatedForumReply[] | null; error: any }> => {
  try {
    const { data: replies, error } = await supabase
      .from('forum_replies')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching forum replies:', error);
      return { data: null, error };
    }

    if (!replies) {
      return { data: [], error: null };
    }

    // Populate like info for each reply
    const populatedReplies = await Promise.all(replies.map(reply => populateReplyWithLikeInfo(reply)));

    return { data: populatedReplies, error: null };
  } catch (error) {
    console.error('Error fetching forum replies:', error);
    return { data: null, error };
  }
};
