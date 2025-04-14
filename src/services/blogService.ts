
import { supabase } from "@/integrations/supabase/client";
import { BlogPost, BlogCategory } from "@/types/blog";

export const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching blog posts:", error);
    throw error;
  }
  
  return data || [];
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
  
  return data || [];
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
  
  return data;
};
