
import { supabase } from "@/integrations/supabase/client";
import { ForumPost, ForumCategory } from "@/types/community";
import { toast } from "sonner";

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
      tags: []
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
    
    return {
      id: data.id,
      title: data.title,
      content: data.content,
      category: data.category,
      authorId: data.author_id,
      authorName: data.author_name,
      authorAvatar: data.author_avatar,
      tags: data.tags || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      likes: data.likes || 0,
      views: data.views || 0,
      isPinned: data.is_pinned || false,
      replies: [],
      isLiked: false
    };
  } catch (error) {
    console.error("Error in createForumPost:", error);
    throw error;
  }
};
