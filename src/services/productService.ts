
import { supabase } from '@/integrations/supabase/client';
import { ProductComment, ProductLaunch } from '@/types/productLaunch';
import { v4 as uuidv4 } from 'uuid';

/**
 * Récupère un produit par son ID
 */
export const fetchProductById = async (id: string): Promise<ProductLaunch | null> => {
  try {
    const { data, error } = await supabase
      .from('product_launches')
      .select('*, product_comments(*)')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching product by ID:', error);
      return null;
    }
    
    if (!data) return null;
    
    // Map database fields to ProductLaunch interface
    return {
      id: data.id,
      name: data.name,
      logoUrl: data.logo_url,
      tagline: data.tagline,
      description: data.description,
      launchDate: data.launch_date,
      createdBy: data.created_by,
      creatorAvatarUrl: data.creator_avatar_url,
      websiteUrl: data.website_url,
      demoUrl: data.demo_url,
      category: data.category,
      upvotes: data.upvotes || 0,
      comments: data.product_comments || [],
      status: data.status,
      mediaUrls: data.media_urls,
      betaSignupUrl: data.beta_signup_url,
      startupId: data.startup_id,
      featuredOrder: data.featured_order
    };
  } catch (error) {
    console.error('Error in fetchProductById:', error);
    return null;
  }
};

/**
 * Récupère tous les produits lancés
 */
export const fetchAllProducts = async (): Promise<ProductLaunch[]> => {
  try {
    const { data, error } = await supabase
      .from('product_launches')
      .select('*')
      .order('launch_date', { ascending: false });
    
    if (error) {
      console.error('Error fetching all products:', error);
      return [];
    }
    
    // Map database fields to ProductLaunch interface
    return (data || []).map(item => ({
      id: item.id,
      name: item.name,
      logoUrl: item.logo_url,
      tagline: item.tagline,
      description: item.description,
      launchDate: item.launch_date,
      createdBy: item.created_by,
      creatorAvatarUrl: item.creator_avatar_url,
      websiteUrl: item.website_url,
      demoUrl: item.demo_url,
      category: item.category,
      upvotes: item.upvotes || 0,
      comments: [],
      status: item.status,
      mediaUrls: item.media_urls,
      betaSignupUrl: item.beta_signup_url,
      startupId: item.startup_id,
      featuredOrder: item.featured_order
    }));
  } catch (error) {
    console.error('Error in fetchAllProducts:', error);
    return [];
  }
};

/**
 * Ajoute un commentaire à un produit
 */
export const addComment = async (
  productId: string, 
  content: string, 
  userName: string
): Promise<boolean> => {
  try {
    const commentId = uuidv4();
    
    const { error } = await supabase
      .from('product_comments')
      .insert([{
        id: commentId,
        product_id: productId,
        user_id: 'anonymous', // Utilisateur anonyme pour l'instant
        user_name: userName,
        content: content,
        created_at: new Date().toISOString(),
        likes: 0
      }]);
    
    if (error) {
      console.error('Error adding comment:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in addComment:', error);
    return false;
  }
};

/**
 * Incrémente le nombre de votes d'un produit
 */
export const upvoteProduct = async (productId: string): Promise<boolean> => {
  try {
    // First try using RPC if it exists
    try {
      const { error } = await supabase
        .rpc('increment_product_upvotes', { product_id: productId });
      
      if (!error) {
        return true;
      }
    } catch (rpcError) {
      console.log('RPC not available, using fallback', rpcError);
    }
    
    // Fallback if the RPC function doesn't exist
    const { error } = await supabase
      .from('product_launches')
      .update({ upvotes: supabase.rpc('increment').single() })
      .eq('id', productId);
    
    if (error) {
      console.error('Error upvoting product:', error);
      
      // Second fallback - get current value and increment it
      const { data: currentProduct } = await supabase
        .from('product_launches')
        .select('upvotes')
        .eq('id', productId)
        .single();
      
      if (currentProduct) {
        const newCount = (currentProduct.upvotes || 0) + 1;
        const { error: updateError } = await supabase
          .from('product_launches')
          .update({ upvotes: newCount })
          .eq('id', productId);
        
        if (updateError) {
          console.error('Error in second fallback upvote:', updateError);
          return false;
        }
        return true;
      }
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in upvoteProduct:', error);
    return false;
  }
};

/**
 * Crée un nouveau produit
 */
export const createProduct = async (product: Partial<ProductLaunch>): Promise<string | null> => {
  try {
    const productId = product.id || uuidv4();
    
    // Map the ProductLaunch interface to database fields
    const { error } = await supabase
      .from('product_launches')
      .insert([{
        id: productId,
        name: product.name,
        logo_url: product.logoUrl,
        tagline: product.tagline,
        description: product.description,
        launch_date: product.launchDate,
        created_by: product.createdBy,
        creator_avatar_url: product.creatorAvatarUrl,
        website_url: product.websiteUrl,
        demo_url: product.demoUrl,
        category: product.category || [],
        upvotes: 0,
        status: product.status,
        media_urls: product.mediaUrls,
        beta_signup_url: product.betaSignupUrl,
        startup_id: product.startupId,
        featured_order: product.featuredOrder
      }]);
    
    if (error) {
      console.error('Error creating product:', error);
      return null;
    }
    
    return productId;
  } catch (error) {
    console.error('Error in createProduct:', error);
    return null;
  }
};

// Fonction pour rechercher des produits par critères
export const searchProducts = async (
  query: string, 
  category?: string
): Promise<ProductLaunch[]> => {
  try {
    let searchQuery = supabase
      .from('product_launches')
      .select('*');
    
    if (query) {
      searchQuery = searchQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%,tagline.ilike.%${query}%`);
    }
    
    if (category && category !== 'Tous') {
      searchQuery = searchQuery.contains('category', [category]);
    }
    
    const { data, error } = await searchQuery.order('launch_date', { ascending: false });
    
    if (error) {
      console.error('Error searching products:', error);
      return [];
    }
    
    // Map database fields to ProductLaunch interface
    return (data || []).map(item => ({
      id: item.id,
      name: item.name,
      logoUrl: item.logo_url,
      tagline: item.tagline,
      description: item.description,
      launchDate: item.launch_date,
      createdBy: item.created_by,
      creatorAvatarUrl: item.creator_avatar_url,
      websiteUrl: item.website_url,
      demoUrl: item.demo_url,
      category: item.category,
      upvotes: item.upvotes || 0,
      comments: [],
      status: item.status,
      mediaUrls: item.media_urls,
      betaSignupUrl: item.beta_signup_url,
      startupId: item.startup_id,
      featuredOrder: item.featured_order
    }));
  } catch (error) {
    console.error('Error in searchProducts:', error);
    return [];
  }
};
