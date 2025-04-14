
import { supabase } from "@/integrations/supabase/client";
import { BlogPost, BlogCategory } from "@/types/blog";

// Helper function to transform snake_case database columns to camelCase for our interface
const transformBlogPost = (post: any): BlogPost => {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    category: post.category as BlogCategory,
    coverImage: post.cover_image,
    authorId: post.author_id,
    authorName: post.author_name,
    authorAvatar: post.author_avatar,
    createdAt: post.created_at,
    updatedAt: post.updated_at,
    tags: post.tags || [],
    featured: post.featured || false,
    readingTime: post.reading_time,
    status: post.status || 'pending'
  };
};

export const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching blog posts:", error);
    throw error;
  }
  
  // Transform each post to match our interface
  return (data || []).map(transformBlogPost);
};

export const fetchFeaturedPosts = async (): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching featured posts:", error);
    throw error;
  }
  
  // Transform each post to match our interface
  return (data || []).map(transformBlogPost);
};

export const getAllBlogCategories = async (): Promise<BlogCategory[]> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('category');
  
  if (error) {
    console.error("Error fetching blog categories:", error);
    throw error;
  }
  
  // Extract unique categories
  const categories = [...new Set(data.map(post => post.category))] as BlogCategory[];
  return categories;
};

export const fetchBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) {
    console.error("Error fetching blog post by slug:", error);
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    throw error;
  }
  
  // Transform post to match our interface
  return data ? transformBlogPost(data) : null;
};

// New functions for the moderation system

export const fetchPendingPosts = async (): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching pending posts:", error);
    throw error;
  }
  
  return (data || []).map(transformBlogPost);
};

export const approvePost = async (postId: string): Promise<void> => {
  const { error } = await supabase
    .from('blog_posts')
    .update({ status: 'approved' })
    .eq('id', postId);
  
  if (error) {
    console.error("Error approving post:", error);
    throw error;
  }
};

export const rejectPost = async (postId: string): Promise<void> => {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', postId);
  
  if (error) {
    console.error("Error rejecting post:", error);
    throw error;
  }
};

export const submitBlogPost = async (post: Omit<BlogPost, 'id' | 'createdAt' | 'status'>): Promise<void> => {
  const { error } = await supabase
    .from('blog_posts')
    .insert([{
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      cover_image: post.coverImage,
      author_id: post.authorId,
      author_name: post.authorName,
      author_avatar: post.authorAvatar,
      tags: post.tags,
      featured: post.featured,
      reading_time: post.readingTime,
      status: 'pending'
    }]);
  
  if (error) {
    console.error("Error submitting blog post:", error);
    throw error;
  }
};

export const checkIsAdmin = async (): Promise<boolean> => {
  try {
    // First check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    console.log("Checking admin status for user:", user.email);
    
    // Direct database check for admin role
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();
    
    if (error) {
      console.error("Error in direct admin check:", error);
      // Fallback to RPC function
      const { data: rpcData } = await supabase.rpc('is_admin');
      return !!rpcData;
    }
    
    return !!data;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};
