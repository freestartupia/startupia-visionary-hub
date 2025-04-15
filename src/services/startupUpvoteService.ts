
import { supabase } from '@/integrations/supabase/client';
import { mockStartups } from '@/data/mockStartups';
import { toast } from 'sonner';

/**
 * Fonction simplifiée pour upvoter une startup
 * Utilise des données mockées pour la démonstration
 */
export const upvoteStartup = async (startupId: string): Promise<boolean> => {
  try {
    // Trouver la startup dans les données mockées
    const startupIndex = mockStartups.findIndex(s => s.id === startupId);
    
    if (startupIndex === -1) {
      console.error('Startup non trouvée:', startupId);
      return false;
    }
    
    // Incrémenter le compteur d'upvotes
    mockStartups[startupIndex].upvotes = (mockStartups[startupIndex].upvotes || 0) + 1;
    
    // Succès
    toast.success("Startup upvotée avec succès!");
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'upvote:', error);
    toast.error("Une erreur est survenue");
    return false;
  }
};

/**
 * Fonction simplifiée pour enlever un upvote
 */
export const removeStartupUpvote = async (startupId: string): Promise<boolean> => {
  try {
    // Trouver la startup dans les données mockées
    const startupIndex = mockStartups.findIndex(s => s.id === startupId);
    
    if (startupIndex === -1) {
      console.error('Startup non trouvée:', startupId);
      return false;
    }
    
    // Décrémenter le compteur d'upvotes (minimum 0)
    mockStartups[startupIndex].upvotes = Math.max(0, (mockStartups[startupIndex].upvotes || 0) - 1);
    
    // Succès
    toast.success("Upvote retiré avec succès!");
    return true;
  } catch (error) {
    console.error('Erreur lors du retrait de l\'upvote:', error);
    toast.error("Une erreur est survenue");
    return false;
  }
};

/**
 * Vérifie si l'utilisateur a déjà upvoté
 * Version simplifiée qui simule un état aléatoire pour la démo
 */
export const hasUpvotedStartup = async (startupId: string): Promise<boolean> => {
  // Pour la démo, on retourne toujours false pour permettre d'upvoter
  return false;
};
