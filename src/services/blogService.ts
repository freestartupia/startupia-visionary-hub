
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
    readingTime: post.reading_time
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
