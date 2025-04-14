
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
  try {
    console.log("Fetching all blog posts");
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching blog posts:", error);
      return [];
    }
    
    console.log("Successfully fetched blog posts:", data?.length);
    
    // Transform each post to match our interface
    return (data || []).map(transformBlogPost);
  } catch (error) {
    console.error("Exception fetching blog posts:", error);
    return [];
  }
};

export const fetchFeaturedPosts = async (): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching featured posts:", error);
      return [];
    }
    
    // Transform each post to match our interface
    return (data || []).map(transformBlogPost);
  } catch (error) {
    console.error("Exception fetching featured posts:", error);
    return [];
  }
};

export const getAllBlogCategories = async (): Promise<BlogCategory[]> => {
  try {
    console.log("Fetching blog categories");
    // Instead of getting categories via blog_posts, fetch them directly from the enum or fixed list
    // This avoids potential issues with the blog_posts table
    const categories: BlogCategory[] = [
      'Actualités',
      'Growth',
      'Technique',
      'Interviews',
      'Outils',
      'Levées de fonds',
      'Startup du mois'
    ];
    
    console.log("Using static categories list:", categories);
    return categories;
  } catch (error) {
    console.error("Exception fetching blog categories:", error);
    return [];
  }
};

export const fetchBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
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
      return null;
    }
    
    // Transform post to match our interface
    return data ? transformBlogPost(data) : null;
  } catch (error) {
    console.error("Exception fetching blog post by slug:", error);
    return null;
  }
};

// New functions for the moderation system

export const fetchPendingPosts = async (): Promise<BlogPost[]> => {
  try {
    console.log("Fetching pending posts");
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching pending posts:", error);
      return [];
    }
    
    console.log("Pending posts fetched:", data?.length);
    console.log("Pending posts data:", data);
    
    return (data || []).map(transformBlogPost);
  } catch (error) {
    console.error("Exception fetching pending posts:", error);
    return [];
  }
};

export const approvePost = async (postId: string): Promise<void> => {
  try {
    console.log("Approving post with ID:", postId);
    const { error } = await supabase
      .from('blog_posts')
      .update({ status: 'approved' })
      .eq('id', postId);
    
    if (error) {
      console.error("Error approving post:", error);
      throw error;
    }
    
    console.log("Post approved successfully");
  } catch (error) {
    console.error("Exception while approving post:", error);
    throw error;
  }
};

export const rejectPost = async (postId: string): Promise<void> => {
  try {
    console.log("Rejecting post with ID:", postId);
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', postId);
    
    if (error) {
      console.error("Error rejecting post:", error);
      throw error;
    }
    
    console.log("Post rejected and deleted successfully");
  } catch (error) {
    console.error("Exception while rejecting post:", error);
    throw error;
  }
};

export const submitBlogPost = async (post: Omit<BlogPost, 'id' | 'createdAt' | 'status'>): Promise<void> => {
  try {
    console.log("Submitting blog post:", post.title);
    const { error, data } = await supabase
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
      }])
      .select();
    
    if (error) {
      console.error("Error submitting blog post:", error);
      throw error;
    }
    
    console.log("Blog post submitted successfully:", data);
  } catch (error) {
    console.error("Exception submitting blog post:", error);
    throw error;
  }
};

// Simplified admin check that doesn't rely on RLS or user_roles table
export const checkIsAdmin = async (): Promise<boolean> => {
  try {
    // First check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log("No authenticated user found");
      return false;
    }
    
    console.log("Checking admin status for user:", user.email);
    
    // Hardcoded admin check for your email (temporary solution)
    // In a production environment, this should be replaced with a proper role-based system
    const adminEmails = ['skyzohd22@gmail.com']; // Add your admin email here
    const isAdmin = adminEmails.includes(user.email || '');
    
    console.log(`User ${user.email} admin status:`, isAdmin);
    return isAdmin;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};
