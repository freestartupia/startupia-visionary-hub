import { supabase } from '@/integrations/supabase/client';
import { ForumPost, PopulatedForumPost } from '@/types/community';
import { getPostLikeStatus } from './forum/postLikeService';

const formatPostDate = (dateStr: string): string => {
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

const populatePostWithLikeInfo = async (post: ForumPost): Promise<PopulatedForumPost> => {
  const { liked, count } = await getPostLikeStatus(post.id);

  return {
    ...post,
    userHasLiked: liked,
    formattedCreatedAt: formatPostDate(post.created_at)
  };
};

export const getForumPosts = async (): Promise<PopulatedForumPost[]> => {
  try {
    const { data, error } = await supabase
      .from('forum_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching forum posts:", error);
      return [];
    }

    const populatedPosts = await Promise.all(data.map(async (post) => {
      return await populatePostWithLikeInfo(post);
    }));

    return populatedPosts;
  } catch (error) {
    console.error("Error fetching forum posts:", error);
    return [];
  }
};

export const createForumPost = async (title: string, content: string, userId: string): Promise<{ data: ForumPost | null, error: any }> => {
  try {
    const { data, error } = await supabase
      .from('forum_posts')
      .insert([{ title, content, user_id: userId }])
      .select()
      .single();

    if (error) {
      console.error("Error creating forum post:", error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error creating forum post:", error);
    return { data: null, error: error };
  }
};

export const getForumPostById = async (postId: string): Promise<PopulatedForumPost | null> => {
  try {
    const { data, error } = await supabase
      .from('forum_posts')
      .select('*')
      .eq('id', postId)
      .single();

    if (error) {
      console.error("Error fetching forum post:", error);
      return null;
    }

    return await populatePostWithLikeInfo(data);
  } catch (error) {
    console.error("Error fetching forum post:", error);
    return null;
  }
};
