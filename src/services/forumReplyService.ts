
import { supabase } from '@/integrations/supabase/client';
import { ForumReply, PopulatedForumReply } from '@/types/community';
import { getReplyLikeStatus } from './forum/replyLikeService';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ForumReplyDB } from '@/types/forumTypes';

const formatReplyDate = (date: string): string => {
  return formatDistanceToNow(new Date(date), {
    locale: ptBR,
    addSuffix: true,
  });
};

const populateReplyWithLikeInfo = async (replyData: ForumReplyDB): Promise<PopulatedForumReply> => {
  const { liked, count } = await getReplyLikeStatus(replyData.id);
  
  const reply: ForumReply = {
    id: replyData.id,
    content: replyData.content,
    authorId: replyData.author_id,
    authorName: replyData.author_name,
    authorAvatar: replyData.author_avatar || null,
    createdAt: replyData.created_at,
    updatedAt: replyData.updated_at || null,
    likes: replyData.likes || 0,
    parentId: replyData.parent_id || null,
    replyParentId: replyData.reply_parent_id || null,
    isLiked: false,
    nestedReplies: []
  };

  return {
    ...reply,
    userHasLiked: liked,
    formattedCreatedAt: formatReplyDate(reply.createdAt),
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
    const newReply = {
      post_id: postId,
      content: content,
      author_id: userId,
      author_avatar: userAvatar,
      author_name: userName,
    };

    const { data: replyData, error } = await supabase
      .from('forum_replies')
      .insert(newReply)
      .select()
      .single();

    if (error) {
      console.error('Error creating forum reply:', error);
      return { data: null, error };
    }

    // Convert DB format to ForumReply type
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
      isLiked: false,
      nestedReplies: []
    };

    return { data: reply, error: null };
  } catch (error) {
    console.error('Error creating forum reply:', error);
    return { data: null, error };
  }
};

export const getForumRepliesByPostId = async (postId: string): Promise<{ data: PopulatedForumReply[] | null; error: any }> => {
  try {
    const { data: repliesData, error } = await supabase
      .from('forum_replies')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching forum replies:', error);
      return { data: null, error };
    }

    if (!repliesData) {
      return { data: [], error: null };
    }

    // Populate like info for each reply
    const populatedReplies = await Promise.all(
      repliesData.map(reply => populateReplyWithLikeInfo(reply as ForumReplyDB))
    );

    return { data: populatedReplies, error: null };
  } catch (error) {
    console.error('Error fetching forum replies:', error);
    return { data: null, error };
  }
};
