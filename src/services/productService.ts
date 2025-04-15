
import { supabase } from '@/integrations/supabase/client';
import { ProductLaunch, ProductComment } from '@/types/productLaunch';
import { toast } from 'sonner';

/**
 * Fetch all product launches
 * @returns Array of ProductLaunch objects
 */
export const fetchProducts = async (): Promise<ProductLaunch[]> => {
  try {
    const { data, error } = await supabase
      .from('product_launches')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }
    
    return processProductData(data || []);
  } catch (error) {
    console.error('Exception fetching products:', error);
    return [];
  }
};

/**
 * Fetch a product launch by ID
 * @param id The ID of the product to fetch
 * @returns The ProductLaunch object or null if not found
 */
export const fetchProductById = async (id: string): Promise<ProductLaunch | null> => {
  try {
    const { data, error } = await supabase
      .from('product_launches')
      .select('*, comments(*)')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching product by ID:', error);
      return null;
    }
    
    if (!data) return null;
    
    // Process the product data
    return {
      id: data.id,
      name: data.name,
      logoUrl: data.logo_url || '',
      tagline: data.tagline || '',
      description: data.description || '',
      launchDate: data.launch_date,
      createdBy: data.created_by,
      creatorAvatarUrl: data.creator_avatar_url,
      websiteUrl: data.website_url || '',
      demoUrl: data.demo_url,
      category: data.category || [],
      upvotes: data.upvotes || 0,
      comments: processCommentData(data.comments || []),
      status: data.status || 'upcoming',
      startupId: data.startup_id,
      mediaUrls: data.media_urls || [],
      betaSignupUrl: data.beta_signup_url,
      featuredOrder: data.featured_order,
      badgeCode: data.badge_code
    };
  } catch (error) {
    console.error('Exception fetching product by ID:', error);
    return null;
  }
};

/**
 * Create a new product launch
 * @param product The product launch data to create
 * @returns The created product launch or null if failed
 */
export const createProduct = async (product: Partial<ProductLaunch>): Promise<ProductLaunch | null> => {
  try {
    // Get the current user session for the creator
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;
    
    if (!user) {
      console.error('No user is logged in');
      return null;
    }
    
    // Convert from client model to database model
    const dbProduct = {
      name: product.name,
      logo_url: product.logoUrl,
      tagline: product.tagline,
      description: product.description,
      launch_date: product.launchDate,
      created_by: product.createdBy || user.email,
      creator_avatar_url: product.creatorAvatarUrl,
      website_url: product.websiteUrl,
      demo_url: product.demoUrl,
      category: product.category,
      status: product.status || 'upcoming',
      startup_id: product.startupId,
      media_urls: product.mediaUrls,
      beta_signup_url: product.betaSignupUrl,
      user_id: user.id
    };
    
    const { data, error } = await supabase
      .from('product_launches')
      .insert(dbProduct)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating product:', error);
      return null;
    }
    
    return fetchProductById(data.id);
  } catch (error) {
    console.error('Exception creating product:', error);
    return null;
  }
};

/**
 * Add a comment to a product launch
 * @param productId The ID of the product to comment on
 * @param content The content of the comment
 * @param userName The name of the user making the comment
 * @returns True if successful, false otherwise
 */
export const addComment = async (
  productId: string,
  content: string,
  userName: string
): Promise<boolean> => {
  try {
    // Get the current user session
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;
    
    if (!user) {
      console.error('No user is logged in');
      return false;
    }
    
    const { error } = await supabase
      .from('product_comments')
      .insert({
        product_id: productId,
        user_id: user.id,
        user_name: userName,
        content: content
      });
    
    if (error) {
      console.error('Error adding comment:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception adding comment:', error);
    return false;
  }
};

/**
 * Upvote a product launch
 * @param productId The ID of the product to upvote
 * @returns True if successful, false otherwise
 */
export const upvoteProduct = async (productId: string): Promise<boolean> => {
  try {
    // Get the current user session
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;
    
    if (!user) {
      console.error('No user is logged in');
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour voter",
        variant: "destructive"
      });
      return false;
    }
    
    // First, check if user has already upvoted
    const { data: existingUpvote, error: checkError } = await supabase
      .from('product_upvotes')
      .select('id')
      .eq('product_id', productId)
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (checkError) {
      console.error('Error checking existing upvote:', checkError);
      return false;
    }
    
    if (existingUpvote) {
      toast({
        title: "Déjà voté",
        description: "Vous avez déjà soutenu ce produit",
      });
      return false;
    }
    
    // Insert the upvote
    const { error } = await supabase
      .from('product_upvotes')
      .insert({
        product_id: productId,
        user_id: user.id
      });
    
    if (error) {
      console.error('Error upvoting product:', error);
      return false;
    }
    
    // Update the upvote count in the product
    const { error: updateError } = await supabase.rpc('increment_product_upvotes', { product_id: productId });
    
    if (updateError) {
      console.error('Error incrementing upvote count:', updateError);
      // We still return true because the upvote was recorded
    }
    
    return true;
  } catch (error) {
    console.error('Exception upvoting product:', error);
    return false;
  }
};

/**
 * Check if the current user has upvoted a product
 * @param productId The ID of the product to check
 * @returns True if the user has upvoted, false otherwise
 */
export const hasUpvotedProduct = async (productId: string): Promise<boolean> => {
  try {
    // Get the current user session
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;
    
    if (!user) {
      return false;
    }
    
    const { data, error } = await supabase
      .from('product_upvotes')
      .select('id')
      .eq('product_id', productId)
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (error) {
      console.error('Error checking if user has upvoted product:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Exception checking if user has upvoted product:', error);
    return false;
  }
};

// Helper functions to process data
const processProductData = (data: any[]): ProductLaunch[] => {
  return data.map(item => ({
    id: item.id,
    name: item.name,
    logoUrl: item.logo_url || '',
    tagline: item.tagline || '',
    description: item.description || '',
    launchDate: item.launch_date,
    createdBy: item.created_by,
    creatorAvatarUrl: item.creator_avatar_url,
    websiteUrl: item.website_url || '',
    demoUrl: item.demo_url,
    category: item.category || [],
    upvotes: item.upvotes || 0,
    comments: [], // Comments are loaded separately when needed
    status: item.status || 'upcoming',
    startupId: item.startup_id,
    mediaUrls: item.media_urls || [],
    betaSignupUrl: item.beta_signup_url,
    featuredOrder: item.featured_order,
    badgeCode: item.badge_code
  }));
};

const processCommentData = (data: any[]): ProductComment[] => {
  return data.map(item => ({
    id: item.id,
    userId: item.user_id,
    userName: item.user_name,
    userAvatar: item.user_avatar,
    content: item.content,
    createdAt: item.created_at,
    likes: item.likes || 0,
    replies: item.replies ? processCommentData(item.replies) : []
  }));
};
