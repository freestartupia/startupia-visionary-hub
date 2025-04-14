
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
      .select('*, comments(*)')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching product by ID:', error);
      return null;
    }
    
    return data;
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
      .order('launchDate', { ascending: false });
    
    if (error) {
      console.error('Error fetching all products:', error);
      return [];
    }
    
    return data || [];
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
    const comment: Partial<ProductComment> = {
      id: commentId,
      userId: 'anonymous', // Utilisateur anonyme pour l'instant
      userName,
      content,
      createdAt: new Date().toISOString(),
      likes: 0
    };
    
    const { error } = await supabase
      .from('product_comments')
      .insert([{
        ...comment,
        product_id: productId
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
    const { error } = await supabase
      .rpc('increment_product_upvotes', { product_id: productId });
    
    if (error) {
      console.error('Error upvoting product:', error);
      
      // Fallback si la fonction RPC n'existe pas
      const { error: updateError } = await supabase
        .from('product_launches')
        .update({ upvotes: supabase.sql`upvotes + 1` })
        .eq('id', productId);
      
      if (updateError) {
        console.error('Error in fallback upvote:', updateError);
        return false;
      }
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
    const { error } = await supabase
      .from('product_launches')
      .insert([{
        ...product,
        id: productId,
        upvotes: 0,
        comments: []
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
    
    const { data, error } = await searchQuery.order('launchDate', { ascending: false });
    
    if (error) {
      console.error('Error searching products:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in searchProducts:', error);
    return [];
  }
};
