
import { supabase } from '@/integrations/supabase/client';
import { mockStartups } from '@/data/mockStartups';
import { toast } from 'sonner';

/**
 * Fonction pour upvoter une startup
 * Utilise des données mockées pour la démonstration
 */
export const upvoteStartup = async (startupId: string): Promise<boolean> => {
  try {
    console.log('Tentative d\'upvote pour la startup:', startupId);
    
    // Vérifier si l'ID est au format UUID (contient des tirets)
    // Si c'est le cas, nous sommes probablement sur la page de détails
    // Sinon, c'est un ID simple comme 'mistral-ai'
    const isUUID = startupId.includes('-') && startupId.length > 20;
    
    // Trouver la startup dans les données mockées
    let startupIndex = -1;
    
    if (isUUID) {
      // Si c'est un UUID, chercher dans le champ id mais aussi vérifier si un ID simple correspond
      startupIndex = mockStartups.findIndex(s => s.id === startupId);
    } else {
      // Si c'est un ID simple, chercher directement
      startupIndex = mockStartups.findIndex(s => s.id === startupId);
    }
    
    if (startupIndex === -1) {
      console.error('Startup non trouvée:', startupId);
      console.log('IDs disponibles:', mockStartups.map(s => s.id));
      toast.error("Startup non trouvée");
      return false;
    }
    
    // Incrémenter le compteur d'upvotes
    mockStartups[startupIndex].upvotes = (mockStartups[startupIndex].upvotes || 0) + 1;
    
    // Succès
    console.log(`Startup upvotée: ${startupId}, nouveau compteur: ${mockStartups[startupIndex].upvotes}`);
    toast.success("Startup upvotée avec succès!");
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'upvote:', error);
    toast.error("Une erreur est survenue");
    return false;
  }
};

/**
 * Fonction pour enlever un upvote
 */
export const removeStartupUpvote = async (startupId: string): Promise<boolean> => {
  try {
    console.log('Tentative de retrait d\'upvote pour la startup:', startupId);
    
    // Vérifier si l'ID est au format UUID (contient des tirets)
    const isUUID = startupId.includes('-') && startupId.length > 20;
    
    // Trouver la startup dans les données mockées
    let startupIndex = -1;
    
    if (isUUID) {
      // Si c'est un UUID, chercher dans le champ id mais aussi vérifier si un ID simple correspond
      startupIndex = mockStartups.findIndex(s => s.id === startupId);
    } else {
      // Si c'est un ID simple, chercher directement
      startupIndex = mockStartups.findIndex(s => s.id === startupId);
    }
    
    if (startupIndex === -1) {
      console.error('Startup non trouvée:', startupId);
      console.log('IDs disponibles:', mockStartups.map(s => s.id));
      toast.error("Startup non trouvée");
      return false;
    }
    
    // Décrémenter le compteur d'upvotes (minimum 0)
    mockStartups[startupIndex].upvotes = Math.max(0, (mockStartups[startupIndex].upvotes || 0) - 1);
    
    // Succès
    console.log(`Upvote retiré: ${startupId}, nouveau compteur: ${mockStartups[startupIndex].upvotes}`);
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
