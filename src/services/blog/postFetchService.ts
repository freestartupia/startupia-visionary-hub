
import { supabase } from '@/integrations/supabase/client';
import { BlogPost, BlogCategory } from '@/types/blog';
import { mapDbPostToBlogPost } from './mappers';

/**
 * Fetches all published blog posts
 */
export const fetchAllBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }
    
    return (data || []).map(mapDbPostToBlogPost);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
};

/**
 * Fetches featured blog posts
 */
export const fetchFeaturedBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(3);
      
    if (error) {
      console.error('Error fetching featured blog posts:', error);
      return [];
    }
    
    return (data || []).map(mapDbPostToBlogPost);
  } catch (error) {
    console.error('Error fetching featured blog posts:', error);
    return [];
  }
};

/**
 * Fetches a single blog post by slug
 */
export const fetchBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();
      
    if (error) {
      console.error(`Error fetching blog post with slug ${slug}:`, error);
      return null;
    }
    
    return mapDbPostToBlogPost(data);
  } catch (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error);
    return null;
  }
};

/**
 * Fetches blog posts by category
 */
export const fetchBlogPostsByCategory = async (category: BlogCategory): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('category', category)
      .eq('status', 'published')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error(`Error fetching blog posts for category ${category}:`, error);
      return [];
    }
    
    return (data || []).map(mapDbPostToBlogPost);
  } catch (error) {
    console.error(`Error fetching blog posts for category ${category}:`, error);
    return [];
  }
};

/**
 * Gets all unique blog categories
 */
export const getAllBlogCategories = async (): Promise<BlogCategory[]> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('category')
      .eq('status', 'published')
      .order('category');
      
    if (error) {
      console.error('Error fetching blog categories:', error);
      return [];
    }
    
    // Extract unique categories
    const categories = [...new Set(data.map(post => post.category))];
    return categories as BlogCategory[];
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return [];
  }
};
