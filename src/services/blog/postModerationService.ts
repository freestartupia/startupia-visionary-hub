
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types/blog';
import { checkUserHasRole } from '@/services/roleService';
import { mapDbPostToBlogPost } from './mappers';

/**
 * Gets blog posts by status (pending/published/rejected)
 * Only accessible by admins and moderators
 */
export const getBlogPostsByStatus = async (status: 'pending' | 'published' | 'rejected'): Promise<BlogPost[]> => {
  try {
    // Check if user has admin or moderator role
    const isAdmin = await checkUserHasRole('admin');
    const isModerator = await checkUserHasRole('moderator');
    
    if (!isAdmin && !isModerator) {
      console.error('Unauthorized access to moderation functions');
      return [];
    }
    
    console.log(`Fetching ${status} blog posts`);
    
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error(`Error fetching ${status} blog posts:`, error);
      throw error;
    }
    
    console.log(`Found ${data?.length || 0} ${status} blog posts`, data);
    
    return (data || []).map(mapDbPostToBlogPost);
  } catch (error) {
    console.error(`Error fetching ${status} blog posts:`, error);
    throw error;
  }
};

/**
 * Updates the status of a blog post (approve/reject)
 * Only accessible by admins and moderators
 */
export const updateBlogPostStatus = async (
  postId: string, 
  status: 'published' | 'rejected', 
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

    // Check if user has admin or moderator role
    const isAdmin = await checkUserHasRole('admin');
    const isModerator = await checkUserHasRole('moderator');
    
    if (!isAdmin && !isModerator) {
      return { 
        success: false, 
        error: 'Vous n\'avez pas les permissions pour modérer des articles' 
      };
    }

    console.log(`Updating post ${postId} status to ${status}`);
    
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
