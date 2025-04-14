import { supabase } from '@/integrations/supabase/client';
import { BlogPost, BlogCategory } from '@/types/blog';

// Map database response to BlogPost type
const mapDbPostToBlogPost = (dbPost: any): BlogPost => {
  return {
    id: dbPost.id,
    title: dbPost.title,
    slug: dbPost.slug,
    excerpt: dbPost.excerpt,
    content: dbPost.content,
    category: dbPost.category as BlogCategory,
    coverImage: dbPost.cover_image,
    authorId: dbPost.author_id,
    authorName: dbPost.author_name,
    authorAvatar: dbPost.author_avatar,
    createdAt: dbPost.created_at,
    updatedAt: dbPost.updated_at,
    tags: dbPost.tags || [],
    featured: dbPost.featured || false,
    readingTime: dbPost.reading_time,
  };
};

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

export const submitBlogPost = async (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; error?: string; }> => {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error || !data.user) {
      return { 
        success: false, 
        error: 'Vous devez être connecté pour soumettre un article' 
      };
    }

    const postToInsert = {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      cover_image: post.coverImage,
      author_id: data.user.id,
      author_name: post.authorName,
      author_avatar: post.authorAvatar,
      tags: post.tags,
      reading_time: post.readingTime,
      status: 'pending', // All submitted posts start as pending
    };
    
    const { error: insertError } = await supabase
      .from('blog_posts')
      .insert(postToInsert);
      
    if (insertError) {
      console.error('Error submitting blog post:', insertError);
      return { 
        success: false, 
        error: 'Une erreur est survenue lors de la soumission de l\'article' 
      };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error submitting blog post:', error);
    return { 
      success: false, 
      error: 'Une erreur est survenue lors de la soumission de l\'article' 
    };
  }
};

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

export const getBlogPostsByStatus = async (status: 'pending' | 'published' | 'rejected'): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error(`Error fetching ${status} blog posts:`, error);
      return [];
    }
    
    return (data || []).map(mapDbPostToBlogPost);
  } catch (error) {
    console.error(`Error fetching ${status} blog posts:`, error);
    return [];
  }
};

export const updateBlogPostStatus = async (
  postId: string, 
  status: 'pending' | 'published' | 'rejected', 
  adminReason?: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      return { 
        success: false, 
        error: 'Vous devez être connecté pour modérer un article' 
      };
    }

    // TODO: Implement an admin role check
    const isAdmin = userData.user.email === 'skyzohd22@gmail.com'; // Hardcoded admin email for now
    
    if (!isAdmin) {
      return { 
        success: false, 
        error: 'Vous n\'avez pas les permissions pour modérer des articles' 
      };
    }

    const { error } = await supabase
      .from('blog_posts')
      .update({ 
        status, 
        admin_reason: adminReason,
        updated_at: new Date().toISOString() 
      })
      .eq('id', postId);
      
    if (error) {
      console.error('Error updating blog post status:', error);
      return { 
        success: false, 
        error: 'Une erreur est survenue lors de la modération de l\'article' 
      };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error updating blog post status:', error);
    return { 
      success: false, 
      error: 'Une erreur est survenue lors de la modération de l\'article' 
    };
  }
};
