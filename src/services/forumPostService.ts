import { supabase } from "@/integrations/supabase/client";
import { ForumPost, ForumCategory } from "@/types/community";
import { mapPostFromDB } from "@/utils/forumMappers";
import { toast } from "sonner";
import { getPostLikeStatus } from "./forum/postLikeService";
import { getRepliesForPost } from "./forumReplyService";

// Function to get all forum posts
export const getForumPosts = async (): Promise<ForumPost[]> => {
  try {
    const { data: postsData, error: postsError } = await supabase
      .from('forum_posts')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (postsError) {
      console.error("Error fetching posts:", postsError);
      toast.error("Impossible de charger les discussions");
      throw postsError;
    }
    
    // Get current user for like status
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    
    // Map posts to our TypeScript interface
    const posts = postsData.map(mapPostFromDB);
    
    const postsWithReplies = await Promise.all(posts.map(async (post) => {
      // Get replies for this post
      const replies = await getRepliesForPost(post.id);
      
      // Check if user liked the post
      let isLiked = false;
      if (userId) {
        isLiked = await getPostLikeStatus(post.id, userId);
      }
      
      return { ...post, replies, isLiked };
    }));
    
    return postsWithReplies;
  } catch (error) {
    console.error("Error in getForumPosts:", error);
    toast.error("Impossible de charger les discussions");
    return [];
  }
};

// Function to get a specific forum post with its replies
export const getForumPost = async (postId: string): Promise<ForumPost> => {
  try {
    const { data: postData, error: postError } = await supabase
      .from('forum_posts')
      .select('*')
      .eq('id', postId)
      .single();
      
    if (postError) {
      console.error("Error fetching post:", postError);
      toast.error("Impossible de charger la discussion");
      throw postError;
    }
    
    const post = mapPostFromDB(postData);
    
    // Get current user for like status
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    
    // Get all replies for this post
    const replies = await getRepliesForPost(postId);
    
    // Check if user liked the post
    const { getPostLikeStatus } = await import("./forum/postLikeService");
    let isLiked = false;
    if (userId) {
      isLiked = await getPostLikeStatus(postId, userId);
    }
    
    return { ...post, replies, isLiked };
  } catch (error) {
    console.error("Error in getForumPost:", error);
    toast.error("Impossible de charger la discussion");
    throw error;
  }
};

// Function to create a new post
export const createForumPost = async (
  title: string,
  content: string,
  category: ForumCategory,
  authorName: string,
  authorAvatar?: string
): Promise<ForumPost> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      console.error("User not authenticated:", userError);
      toast.error("Vous devez être connecté pour créer un post");
      throw userError || new Error("User not authenticated");
    }
    
    const newPost = {
      title,
      content,
      category,
      author_id: userData.user.id,
      author_name: authorName,
      author_avatar: authorAvatar,
      tags: [],
      created_at: new Date().toISOString(),
      is_pinned: false,
      likes: 0,
      views: 0
    };
    
    const { data, error } = await supabase
      .from('forum_posts')
      .insert(newPost)
      .select()
      .single();
      
    if (error) {
      console.error("Error creating post:", error);
      toast.error("Impossible de créer la discussion");
      throw error;
    }
    
    toast.success("Discussion créée avec succès");
    return mapPostFromDB({ ...data, replies: [] });
  } catch (error) {
    console.error("Error in createForumPost:", error);
    throw error;
  }
};

// Function to increment the view count of a post
export const incrementPostViews = async (postId: string): Promise<void> => {
  try {
    const { data: post, error: getError } = await supabase
      .from('forum_posts')
      .select('views')
      .eq('id', postId)
      .single();
      
    if (getError) {
      console.error("Error fetching post views:", getError);
      return;
    }
    
    const newViewCount = (post.views || 0) + 1;
    
    const { error: updateError } = await supabase
      .from('forum_posts')
      .update({ views: newViewCount })
      .eq('id', postId);
      
    if (updateError) {
      console.error("Error updating views:", updateError);
    }
  } catch (error) {
    console.error("Error in incrementPostViews:", error);
  }
};
