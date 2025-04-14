
import { supabase } from "@/integrations/supabase/client";
import { ForumPost, PopulatedForumPost } from "@/types/community";
import { toast } from "sonner";
import { getPostLikeStatus } from "./postLikeService";
import { getRepliesForPost } from "./replyService";

// Helper function to map database data to our TypeScript types
const mapPostFromDB = (post: any): ForumPost => {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    category: post.category,
    authorId: post.author_id || "",
    authorName: post.author_name,
    authorAvatar: post.author_avatar,
    tags: post.tags || [],
    createdAt: post.created_at,
    updatedAt: post.updated_at,
    likes: post.likes || 0,
    views: post.views || 0,
    isPinned: post.is_pinned || false,
    replies: [],
    isLiked: false
  };
};

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
    
    // Map posts to our TypeScript interface
    const posts = postsData.map(mapPostFromDB);
    
    const postsWithReplies = await Promise.all(posts.map(async (post) => {
      // Get replies for this post
      const replies = await getRepliesForPost(post.id);
      
      // Check if user liked the post
      const { liked } = await getPostLikeStatus(post.id);
      
      return { ...post, replies, isLiked: liked };
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
    
    // Get all replies for this post
    const replies = await getRepliesForPost(postId);
    
    // Check if user liked the post
    const { liked } = await getPostLikeStatus(postId);
    
    return { ...post, replies, isLiked: liked };
  } catch (error) {
    console.error("Error in getForumPost:", error);
    toast.error("Impossible de charger la discussion");
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
