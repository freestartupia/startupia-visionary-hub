
import { supabase } from "@/integrations/supabase/client";
import { ForumPost } from "@/types/community";
import { mapPostFromDB } from "@/utils/forumMappers";
import { toast } from "sonner";
import { getPostLikeStatus } from "./postLikeService";
import { getRepliesForPost } from "../forumReplyService";

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
