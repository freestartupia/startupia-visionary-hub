
import { supabase } from '@/integrations/supabase/client';
import { ProductComment, ProductLaunch } from '@/types/productLaunch';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { mockProductLaunches } from '@/data/mockProductLaunches';

/**
 * Récupère tous les produits
 */
export const fetchAllProducts = async (): Promise<ProductLaunch[]> => {
  try {
    // Utilisation des données mockées pour la démo
    // À remplacer par un appel Supabase réel plus tard
    return mockProductLaunches;
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    return [];
  }
};

/**
 * Récupère un produit par son ID
 */
export const fetchProductById = async (id: string): Promise<ProductLaunch | null> => {
  try {
    // Recherche dans les données mockées pour la démo
    // À remplacer par un appel Supabase réel plus tard
    const product = mockProductLaunches.find(p => p.id === id);
    
    if (!product) {
      return null;
    }
    
    return product;
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    return null;
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
  if (!productId || !content || !userName) {
    return false;
  }
  
  try {
    // Simuler l'ajout d'un commentaire pour la démo
    // À remplacer par un appel Supabase réel plus tard
    const comment: ProductComment = {
      id: uuidv4(),
      productId,
      content,
      userName,
      userAvatar: null,
      createdAt: new Date().toISOString(),
      replies: [],
      likes: 0,
      userId: ''
    };
    
    // Trouver le produit correspondant dans les données mockées
    const productIndex = mockProductLaunches.findIndex(p => p.id === productId);
    
    if (productIndex !== -1) {
      // Ajouter le commentaire au produit
      mockProductLaunches[productIndex].comments.push(comment);
    }
    
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'ajout du commentaire:', error);
    return false;
  }
};

/**
 * Vérifie si l'utilisateur a upvoté un produit
 */
export const hasUpvotedProduct = async (productId: string): Promise<boolean> => {
  // Version simplifiée pour la démo
  // Toujours retourner false pour permettre aux utilisateurs d'upvoter
  return false;
};

/**
 * Upvote un produit
 */
export const upvoteProduct = async (productId: string): Promise<boolean> => {
  try {
    // Version simplifiée sans authentification pour la démo
    
    // Simuler l'incrémentation du compteur pour les données mockées
    const productIndex = mockProductLaunches.findIndex(p => p.id === productId);
    if (productIndex !== -1) {
      mockProductLaunches[productIndex].upvotes += 1;
      
      // Afficher un toast de succès
      toast.success("Merci pour votre upvote!");
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Erreur lors de l\'upvote du produit:', error);
    toast.error("Une erreur est survenue");
    return false;
  }
};
