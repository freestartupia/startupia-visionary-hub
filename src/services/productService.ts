
import { supabase } from '@/integrations/supabase/client';
import { ProductLaunch, ProductComment } from '@/types/productLaunch';

export async function fetchProductLaunches(): Promise<ProductLaunch[]> {
  try {
    const { data, error } = await supabase
      .from('product_launches')
      .select(`
        *,
        comments:product_comments(*)
      `)
      .order('featured_order', { ascending: true, nullsLast: true });
    
    if (error) {
      console.error('Error fetching product launches:', error);
      throw error;
    }
    
    // Transform data to match ProductLaunch type
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      logoUrl: item.logo_url || '',
      tagline: item.tagline,
      description: item.description,
      launchDate: item.launch_date,
      createdBy: item.created_by,
      creatorAvatarUrl: item.creator_avatar_url,
      websiteUrl: item.website_url,
      demoUrl: item.demo_url || undefined,
      category: item.category,
      upvotes: item.upvotes,
      comments: item.comments ? mapComments(item.comments) : [],
      status: item.status,
      startupId: item.startup_id || undefined,
      mediaUrls: item.media_urls || [],
      betaSignupUrl: item.beta_signup_url || undefined,
      featuredOrder: item.featured_order,
      badgeCode: item.badge_code || undefined
    }));
  } catch (error) {
    console.error('Failed to fetch product launches:', error);
    return [];
  }
}

export async function fetchProductById(id: string): Promise<ProductLaunch | null> {
  try {
    const { data, error } = await supabase
      .from('product_launches')
      .select(`
        *,
        comments:product_comments(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching product:', error);
      return null;
    }
    
    // Transform to ProductLaunch type
    return {
      id: data.id,
      name: data.name,
      logoUrl: data.logo_url || '',
      tagline: data.tagline,
      description: data.description,
      launchDate: data.launch_date,
      createdBy: data.created_by,
      creatorAvatarUrl: data.creator_avatar_url,
      websiteUrl: data.website_url,
      demoUrl: data.demo_url || undefined,
      category: data.category,
      upvotes: data.upvotes,
      comments: data.comments ? mapComments(data.comments) : [],
      status: data.status,
      startupId: data.startup_id || undefined,
      mediaUrls: data.media_urls || [],
      betaSignupUrl: data.beta_signup_url || undefined,
      featuredOrder: data.featured_order,
      badgeCode: data.badge_code || undefined
    };
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return null;
  }
}

export async function addComment(
  productId: string, 
  content: string, 
  userName: string, 
  userId?: string, 
  userAvatar?: string, 
  parentId?: string
): Promise<ProductComment | null> {
  try {
    const { data, error } = await supabase
      .from('product_comments')
      .insert({
        product_id: productId,
        user_id: userId,
        user_name: userName,
        user_avatar: userAvatar,
        content,
        parent_id: parentId
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error adding comment:', error);
      return null;
    }
    
    return {
      id: data.id,
      userId: data.user_id,
      userName: data.user_name,
      userAvatar: data.user_avatar,
      content: data.content,
      createdAt: data.created_at,
      likes: data.likes,
      replies: []
    };
  } catch (error) {
    console.error('Failed to add comment:', error);
    return null;
  }
}

export async function upvoteProduct(productId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('product_launches')
      .update({ upvotes: supabase.rpc('increment', { inc: 1 }) })
      .eq('id', productId);
    
    if (error) {
      console.error('Error upvoting product:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to upvote product:', error);
    return false;
  }
}

// Helper function to map DB comments to ProductComment type
function mapComments(comments: any[]): ProductComment[] {
  // First, group comments by parent_id
  const commentMap: Record<string, any[]> = {};
  const topLevelComments: ProductComment[] = [];
  
  comments.forEach(comment => {
    if (!commentMap[comment.id]) {
      commentMap[comment.id] = [];
    }
    
    if (comment.parent_id) {
      if (!commentMap[comment.parent_id]) {
        commentMap[comment.parent_id] = [];
      }
      commentMap[comment.parent_id].push(comment);
    } else {
      topLevelComments.push({
        id: comment.id,
        userId: comment.user_id,
        userName: comment.user_name,
        userAvatar: comment.user_avatar,
        content: comment.content,
        createdAt: comment.created_at,
        likes: comment.likes,
        replies: []
      });
    }
  });
  
  // Then recursively build the comment tree
  function addReplies(comments: ProductComment[]): ProductComment[] {
    return comments.map(comment => {
      const replies = commentMap[comment.id] || [];
      return {
        ...comment,
        replies: replies.length > 0 ? addReplies(replies.map(reply => ({
          id: reply.id,
          userId: reply.user_id,
          userName: reply.user_name,
          userAvatar: reply.user_avatar,
          content: reply.content,
          createdAt: reply.created_at,
          likes: reply.likes,
          replies: []
        }))) : []
      };
    });
  }
  
  return addReplies(topLevelComments);
}
