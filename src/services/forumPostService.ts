
import { supabase } from '@/integrations/supabase/client';
import { ForumPost, PopulatedForumPost, ForumCategory } from '@/types/community';
import { getPostLikeStatus } from './forum/postLikeService';
import { ForumPostDB } from '@/types/forumTypes';

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

const mapDbPostToForumPost = (postData: ForumPostDB): ForumPost => {
  return {
    id: postData.id,
    title: postData.title,
    content: postData.content,
    category: postData.category as ForumCategory,
    authorId: postData.author_id,
    authorName: postData.author_name,
    authorAvatar: postData.author_avatar || null,
    tags: postData.tags || [],
    createdAt: postData.created_at,
    updatedAt: postData.updated_at || null,
    likes: postData.likes || 0,
    views: postData.views || 0,
    isPinned: postData.is_pinned || false,
    replies: [],
    isLiked: false
  };
};

const populatePostWithLikeInfo = async (postData: ForumPostDB): Promise<PopulatedForumPost> => {
  const { liked, count } = await getPostLikeStatus(postData.id);
  const post = mapDbPostToForumPost(postData);

  return {
    ...post,
    userHasLiked: liked,
    formattedCreatedAt: formatPostDate(post.createdAt)
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
      return await populatePostWithLikeInfo(post as ForumPostDB);
    }));

    return populatedPosts;
  } catch (error) {
    console.error("Error fetching forum posts:", error);
    return [];
  }
};

export const createForumPost = async (title: string, content: string, userId: string): Promise<{ data: ForumPost | null, error: any }> => {
  try {
    // Get user info to include author name and avatar
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error("Error getting user data:", userError);
      return { data: null, error: userError };
    }
    
    // Get user profile to get name
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('first_name, last_name, avatar_url')
      .eq('id', userId)
      .single();
      
    if (profileError) {
      console.error("Error getting profile data:", profileError);
    }
    
    const authorName = profileData 
      ? `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() 
      : 'Utilisateur StartupIA';
    
    const newPost = {
      title,
      content,
      author_id: userId,
      author_name: authorName,
      author_avatar: profileData?.avatar_url || null,
      category: 'Général' as ForumCategory // Use a valid ForumCategory value
    };

    const { data: postData, error } = await supabase
      .from('forum_posts')
      .insert(newPost)
      .select()
      .single();

    if (error) {
      console.error("Error creating forum post:", error);
      return { data: null, error };
    }

    const post = mapDbPostToForumPost(postData as ForumPostDB);
    return { data: post, error: null };
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

    return await populatePostWithLikeInfo(data as ForumPostDB);
  } catch (error) {
    console.error("Error fetching forum post:", error);
    return null;
  }
};
