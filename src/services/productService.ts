
import { supabase } from '@/integrations/supabase/client';
import { ProductLaunch, ProductComment, ProductLaunchStatus } from '@/types/productLaunch';
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
    // First fetch the product launch
    const { data: productData, error: productError } = await supabase
      .from('product_launches')
      .select('*')
      .eq('id', id)
      .single();
    
    if (productError) {
      console.error('Error fetching product by ID:', productError);
      return null;
    }
    
    if (!productData) return null;
    
    // Then fetch the comments separately
    const { data: commentsData, error: commentsError } = await supabase
      .from('product_comments')
      .select('*')
      .eq('product_id', id)
      .order('created_at', { ascending: false });
    
    if (commentsError) {
      console.error('Error fetching product comments:', commentsError);
    }
    
    const comments = commentsError ? [] : processCommentData(commentsData || []);
    
    // Process the product data
    const status: ProductLaunchStatus = (productData.status as ProductLaunchStatus) || 'upcoming';
    
    return {
      id: productData.id,
      name: productData.name,
      logoUrl: productData.logo_url || '',
      tagline: productData.tagline || '',
      description: productData.description || '',
      launchDate: productData.launch_date,
      createdBy: productData.created_by,
      creatorAvatarUrl: productData.creator_avatar_url,
      websiteUrl: productData.website_url || '',
      demoUrl: productData.demo_url,
      category: productData.category || [],
      upvotes: productData.upvotes || 0,
      comments: comments,
      status: status,
      startupId: productData.startup_id,
      mediaUrls: productData.media_urls || [],
      betaSignupUrl: productData.beta_signup_url,
      featuredOrder: productData.featured_order,
      badgeCode: productData.badge_code
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
    
    const createdProduct = await fetchProductById(data.id);
    return createdProduct;
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
      toast({
        description: "Vous devez être connecté pour commenter"
      });
      return false;
    }
    
    const { error } = await supabase
      .from('product_comments')
      .insert({
        product_id: productId,
        user_id: user.id,
        user_name: userName || user.email,
        content: content
      });
    
    if (error) {
      console.error('Error adding comment:', error);
      toast({
        description: "Erreur lors de l'ajout du commentaire"
      });
      return false;
    }
    
    toast({
      description: "Commentaire ajouté avec succès"
    });
    
    return true;
  } catch (error) {
    console.error('Exception adding comment:', error);
    toast({
      description: "Une erreur s'est produite lors de l'ajout du commentaire"
    });
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
        description: "Vous devez être connecté pour voter"
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
      toast({
        description: "Erreur lors de la vérification du vote"
      });
      return false;
    }
    
    if (existingUpvote) {
      toast({
        description: "Vous avez déjà soutenu ce produit"
      });
      return false;
    }
    
    // Insert the upvote into the product_upvotes table
    const { error } = await supabase
      .from('product_upvotes')
      .insert({
        product_id: productId,
        user_id: user.id
      });
    
    if (error) {
      console.error('Error upvoting product:', error);
      toast({
        description: "Erreur lors du vote"
      });
      return false;
    }
    
    // Call the RPC function to increment the upvote count
    const { error: rpcError } = await supabase.rpc('increment_product_upvotes', {
      product_id: productId
    });
    
    if (rpcError) {
      console.error('Error incrementing upvote count:', rpcError);
      // We don't return false here because the upvote was recorded
      // We just couldn't increment the counter, which is a secondary operation
      toast({
        description: "Vote enregistré mais compteur non mis à jour"
      });
    } else {
      toast({
        description: "Merci pour votre soutien !"
      });
    }
    
    return true;
  } catch (error) {
    console.error('Exception upvoting product:', error);
    toast({
      description: "Une erreur s'est produite lors du vote"
    });
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
    status: (item.status as ProductLaunchStatus) || 'upcoming',
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
