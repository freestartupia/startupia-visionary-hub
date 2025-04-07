
import { supabase } from "@/integrations/supabase/client";
import { ForumPost, ForumReply, ForumCategory } from "@/types/community";
import { toast } from "sonner";

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

const mapReplyFromDB = (reply: any): ForumReply => {
  return {
    id: reply.id,
    content: reply.content,
    authorId: reply.author_id || "",
    authorName: reply.author_name,
    authorAvatar: reply.author_avatar,
    createdAt: reply.created_at,
    updatedAt: reply.updated_at,
    likes: reply.likes || 0,
    parentId: reply.parent_id,
    replyParentId: reply.reply_parent_id,
    isLiked: false,
    nestedReplies: []
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
    
    // Get current user for like status
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    
    // Map posts to our TypeScript interface
    const posts = postsData.map(mapPostFromDB);
    
    // Fetch replies for each post
    const postsWithReplies = await Promise.all(posts.map(async (post) => {
      const { data: repliesData, error: repliesError } = await supabase
        .from('forum_replies')
        .select('*')
        .eq('parent_id', post.id)
        .order('created_at', { ascending: true });
        
      if (repliesError) {
        console.error("Error fetching replies:", repliesError);
        return { ...post, replies: [] };
      }
      
      const replies = repliesData.map(mapReplyFromDB);
      
      // If user is logged in, check if they liked the post
      if (userId) {
        // Check if post is liked
        const { data: postLikeData } = await supabase
          .from('forum_post_likes')
          .select('*')
          .eq('post_id', post.id)
          .eq('user_id', userId)
          .maybeSingle();
          
        post.isLiked = !!postLikeData;
        
        // Check replies likes
        for (const reply of replies) {
          const { data: replyLikeData } = await supabase
            .from('forum_reply_likes')
            .select('*')
            .eq('reply_id', reply.id)
            .eq('user_id', userId)
            .maybeSingle();
            
          reply.isLiked = !!replyLikeData;
        }
      }
      
      return { ...post, replies };
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
    
    // Fetch replies for the post
    const { data: repliesData, error: repliesError } = await supabase
      .from('forum_replies')
      .select('*')
      .eq('parent_id', postId)
      .order('created_at', { ascending: true });
      
    if (repliesError) {
      console.error("Error fetching replies:", repliesError);
      return { ...post, replies: [] };
    }
    
    const replies = await Promise.all(repliesData.map(async (reply) => {
      const mappedReply = mapReplyFromDB(reply);
      
      // Fetch nested replies if any
      const { data: nestedRepliesData, error: nestedError } = await supabase
        .from('forum_replies')
        .select('*')
        .eq('reply_parent_id', reply.id)
        .order('created_at', { ascending: true });
        
      if (!nestedError && nestedRepliesData.length > 0) {
        mappedReply.nestedReplies = nestedRepliesData.map(mapReplyFromDB);
        
        // Check likes status for nested replies
        if (userId) {
          for (const nestedReply of mappedReply.nestedReplies) {
            const { data: nestedLikeData } = await supabase
              .from('forum_reply_likes')
              .select('*')
              .eq('reply_id', nestedReply.id)
              .eq('user_id', userId)
              .maybeSingle();
              
            nestedReply.isLiked = !!nestedLikeData;
          }
        }
      } else {
        mappedReply.nestedReplies = [];
      }
      
      // Check if user liked this reply
      if (userId) {
        const { data: replyLikeData } = await supabase
          .from('forum_reply_likes')
          .select('*')
          .eq('reply_id', reply.id)
          .eq('user_id', userId)
          .maybeSingle();
          
        mappedReply.isLiked = !!replyLikeData;
      }
      
      return mappedReply;
    }));
    
    // Check if user liked the post
    if (userId) {
      const { data: postLikeData } = await supabase
        .from('forum_post_likes')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .maybeSingle();
        
      post.isLiked = !!postLikeData;
    }
    
    return { ...post, replies };
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

// Function to add a reply to a post
export const addReplyToPost = async (
  postId: string,
  content: string,
  authorName: string,
  authorAvatar?: string,
  parentReplyId?: string
): Promise<ForumReply> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      console.error("User not authenticated:", userError);
      toast.error("Vous devez être connecté pour répondre");
      throw userError || new Error("User not authenticated");
    }
    
    const newReply = {
      parent_id: postId,
      reply_parent_id: parentReplyId || null,
      content,
      author_id: userData.user.id,
      author_name: authorName,
      author_avatar: authorAvatar,
      created_at: new Date().toISOString(),
      likes: 0
    };
    
    const { data, error } = await supabase
      .from('forum_replies')
      .insert(newReply)
      .select()
      .single();
      
    if (error) {
      console.error("Error adding reply:", error);
      toast.error("Impossible d'ajouter la réponse");
      throw error;
    }
    
    toast.success("Réponse ajoutée avec succès");
    return mapReplyFromDB(data);
  } catch (error) {
    console.error("Error in addReplyToPost:", error);
    throw error;
  }
};

// Function to toggle like/unlike a post
export const togglePostLike = async (postId: string): Promise<{ liked: boolean, newCount: number }> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      console.error("User not authenticated:", userError);
      toast.error("Vous devez être connecté pour liker un post");
      throw userError || new Error("User not authenticated");
    }
    
    // Check if the user has already liked this post
    const { data: existingLike, error: checkError } = await supabase
      .from('forum_post_likes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', userData.user.id)
      .maybeSingle();
      
    if (checkError) {
      console.error("Error checking like:", checkError);
      toast.error("Une erreur est survenue");
      throw checkError;
    }
    
    let liked = false;
    let newCount = 0;
    
    if (existingLike) {
      // If the user has already liked, remove the like
      const { error: deleteError } = await supabase
        .from('forum_post_likes')
        .delete()
        .eq('id', existingLike.id);
        
      if (deleteError) {
        console.error("Error removing like:", deleteError);
        toast.error("Impossible de retirer le like");
        throw deleteError;
      }
      
      // Fetch current like count
      const { data: post, error: getError } = await supabase
        .from('forum_posts')
        .select('likes')
        .eq('id', postId)
        .single();
        
      if (getError) {
        console.error("Error fetching post likes:", getError);
      } else {
        // Decrement like count
        newCount = Math.max(0, (post.likes || 1) - 1);
        await supabase
          .from('forum_posts')
          .update({ likes: newCount })
          .eq('id', postId);
      }
      
      liked = false;
    } else {
      // If the user hasn't liked yet, add a like
      const { error: insertError } = await supabase
        .from('forum_post_likes')
        .insert({
          post_id: postId,
          user_id: userData.user.id,
          created_at: new Date().toISOString()
        });
        
      if (insertError) {
        console.error("Error adding like:", insertError);
        toast.error("Impossible d'ajouter le like");
        throw insertError;
      }
      
      // Fetch current like count
      const { data: post, error: getError } = await supabase
        .from('forum_posts')
        .select('likes')
        .eq('id', postId)
        .single();
        
      if (getError) {
        console.error("Error fetching post likes:", getError);
      } else {
        // Increment like count
        newCount = (post.likes || 0) + 1;
        await supabase
          .from('forum_posts')
          .update({ likes: newCount })
          .eq('id', postId);
      }
      
      liked = true;
    }
    
    return { liked, newCount };
  } catch (error) {
    console.error("Error in togglePostLike:", error);
    throw error;
  }
};

// Function to toggle like/unlike a reply
export const toggleReplyLike = async (replyId: string): Promise<{ liked: boolean, newCount: number }> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      console.error("User not authenticated:", userError);
      toast.error("Vous devez être connecté pour liker une réponse");
      throw userError || new Error("User not authenticated");
    }
    
    // Check if the user has already liked this reply
    const { data: existingLike, error: checkError } = await supabase
      .from('forum_reply_likes')
      .select('*')
      .eq('reply_id', replyId)
      .eq('user_id', userData.user.id)
      .maybeSingle();
      
    if (checkError) {
      console.error("Error checking like:", checkError);
      toast.error("Une erreur est survenue");
      throw checkError;
    }
    
    let liked = false;
    let newCount = 0;
    
    if (existingLike) {
      // If the user has already liked, remove the like
      const { error: deleteError } = await supabase
        .from('forum_reply_likes')
        .delete()
        .eq('id', existingLike.id);
        
      if (deleteError) {
        console.error("Error removing like:", deleteError);
        toast.error("Impossible de retirer le like");
        throw deleteError;
      }
      
      // Fetch current like count
      const { data: reply, error: getError } = await supabase
        .from('forum_replies')
        .select('likes')
        .eq('id', replyId)
        .single();
        
      if (getError) {
        console.error("Error fetching reply likes:", getError);
      } else {
        // Decrement like count
        newCount = Math.max(0, (reply.likes || 1) - 1);
        await supabase
          .from('forum_replies')
          .update({ likes: newCount })
          .eq('id', replyId);
      }
      
      liked = false;
    } else {
      // If the user hasn't liked yet, add a like
      const { error: insertError } = await supabase
        .from('forum_reply_likes')
        .insert({
          reply_id: replyId,
          user_id: userData.user.id,
          created_at: new Date().toISOString()
        });
        
      if (insertError) {
        console.error("Error adding like:", insertError);
        toast.error("Impossible d'ajouter le like");
        throw insertError;
      }
      
      // Fetch current like count
      const { data: reply, error: getError } = await supabase
        .from('forum_replies')
        .select('likes')
        .eq('id', replyId)
        .single();
        
      if (getError) {
        console.error("Error fetching reply likes:", getError);
      } else {
        // Increment like count
        newCount = (reply.likes || 0) + 1;
        await supabase
          .from('forum_replies')
          .update({ likes: newCount })
          .eq('id', replyId);
      }
      
      liked = true;
    }
    
    return { liked, newCount };
  } catch (error) {
    console.error("Error in toggleReplyLike:", error);
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
