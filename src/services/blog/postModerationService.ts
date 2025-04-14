
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types/blog';
import { mapDbPostToBlogPost } from './mappers';

// Helper function to check if user is admin or moderator without using checkUserHasRole
const checkAdminOrModeratorRole = async (): Promise<boolean> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      console.error('User not authenticated:', userError);
      return false;
    }
    
    // Check if user is a hardcoded admin (temporary)
    // Make sure both email addresses are included for testing
    if (userData.user.email === 'adilboudih2@gmail.com' || userData.user.email === 'skyzohd22@gmail.com') {
      return true;
    }
    
    // Direct query to user_roles table with the correct user ID filter
    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userData.user.id);
      
    if (rolesError) {
      console.error('Error checking user roles:', rolesError);
      return false;
    }
    
    // Check if user has admin or moderator role
    const hasRole = roles && roles.some(role => 
      role.role === 'admin' || role.role === 'moderator'
    );
    
    return hasRole || false;
  } catch (error) {
    console.error('Error checking admin role:', error);
    return false;
  }
};

/**
 * Gets blog posts by status (pending/published/rejected)
 * Only accessible by admins and moderators
 */
export const getBlogPostsByStatus = async (status: 'pending' | 'published' | 'rejected'): Promise<BlogPost[]> => {
  try {
    // Check if user has admin or moderator role
    const isAdminOrModerator = await checkAdminOrModeratorRole();
    
    if (!isAdminOrModerator) {
      console.error('Unauthorized access to moderation functions');
      return [];
    }
    
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error(`Error fetching ${status} blog posts:`, error);
      return [];
    }
    
    console.log(`Fetched ${data?.length || 0} ${status} blog posts`);
    return (data || []).map(mapDbPostToBlogPost);
  } catch (error) {
    console.error(`Error fetching ${status} blog posts:`, error);
    return [];
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
    // Check if user has admin or moderator role
    const isAdminOrModerator = await checkAdminOrModeratorRole();
    
    if (!isAdminOrModerator) {
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
