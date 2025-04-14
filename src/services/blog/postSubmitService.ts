
import { supabase } from '@/integrations/supabase/client';
import { BlogPost, BlogCategory } from '@/types/blog';
import { generateUniqueSlug } from '@/lib/utils';

/**
 * Submits a new blog post for moderation
 */
export const submitBlogPost = async (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; error?: string; }> => {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error || !data.user) {
      return { 
        success: false, 
        error: 'Vous devez être connecté pour soumettre un article' 
      };
    }

    // Check if slug already exists and generate a unique one if needed
    const uniqueSlug = await generateUniqueSlug(post.slug);
    
    const postToInsert = {
      title: post.title,
      slug: uniqueSlug,
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
