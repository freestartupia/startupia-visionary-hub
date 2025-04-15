
import { supabase } from '@/integrations/supabase/client';
import { mockStartups } from '@/data/mockStartups';
import { toast } from 'sonner';

/**
 * Fonction pour upvoter une startup
 * Essaie d'abord avec Supabase, puis fallback sur les données mockées
 */
export const upvoteStartup = async (startupId: string): Promise<boolean> => {
  try {
    console.log('Tentative d\'upvote pour la startup:', startupId);
    
    // Tentative d'upvote dans Supabase
    const { data: existingUpvotes, error: fetchError } = await supabase
      .from('startups')
      .select('id, upvotes')
      .eq('id', startupId)
      .single();
    
    if (!fetchError && existingUpvotes) {
      // La startup existe dans Supabase, on incrémente son compteur
      const { error: updateError } = await supabase
        .from('startups')
        .update({ upvotes: (existingUpvotes.upvotes || 0) + 1 })
        .eq('id', startupId);
      
      if (updateError) {
        console.error('Erreur lors de l\'upvote dans Supabase:', updateError);
        throw updateError;
      }
      
      console.log(`Startup upvotée dans Supabase: ${startupId}`);
      toast.success("Startup upvotée avec succès!");
      return true;
    } else {
      // Fallback sur les données mockées si Supabase échoue
      console.log('Fallback sur les données mockées pour l\'upvote');
      
      // Vérifier si l'ID est au format UUID (contient des tirets)
      const isUUID = startupId.includes('-') && startupId.length > 20;
      
      // Trouver la startup dans les données mockées
      let startupIndex = mockStartups.findIndex(s => s.id === startupId);
      
      if (startupIndex === -1) {
        console.error('Startup non trouvée dans les données mockées:', startupId);
        console.log('IDs disponibles:', mockStartups.map(s => s.id));
        toast.error("Startup non trouvée");
        return false;
      }
      
      // Incrémenter le compteur d'upvotes
      mockStartups[startupIndex].upvotes = (mockStartups[startupIndex].upvotes || 0) + 1;
      
      // Succès
      console.log(`Startup upvotée dans les données mockées: ${startupId}, nouveau compteur: ${mockStartups[startupIndex].upvotes}`);
      toast.success("Startup upvotée avec succès!");
      return true;
    }
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
    
    // Tentative de mise à jour dans Supabase
    const { data: existingUpvotes, error: fetchError } = await supabase
      .from('startups')
      .select('id, upvotes')
      .eq('id', startupId)
      .single();
    
    if (!fetchError && existingUpvotes) {
      // La startup existe dans Supabase, on décrémente son compteur
      const { error: updateError } = await supabase
        .from('startups')
        .update({ upvotes: Math.max(0, (existingUpvotes.upvotes || 0) - 1) })
        .eq('id', startupId);
      
      if (updateError) {
        console.error('Erreur lors du retrait d\'upvote dans Supabase:', updateError);
        throw updateError;
      }
      
      console.log(`Upvote retiré dans Supabase: ${startupId}`);
      toast.success("Upvote retiré avec succès!");
      return true;
    } else {
      // Fallback sur les données mockées
      console.log('Fallback sur les données mockées pour le retrait d\'upvote');
      
      // Trouver la startup dans les données mockées
      let startupIndex = mockStartups.findIndex(s => s.id === startupId);
      
      if (startupIndex === -1) {
        console.error('Startup non trouvée dans les données mockées:', startupId);
        console.log('IDs disponibles:', mockStartups.map(s => s.id));
        toast.error("Startup non trouvée");
        return false;
      }
      
      // Décrémenter le compteur d'upvotes (minimum 0)
      mockStartups[startupIndex].upvotes = Math.max(0, (mockStartups[startupIndex].upvotes || 0) - 1);
      
      // Succès
      console.log(`Upvote retiré dans les données mockées: ${startupId}, nouveau compteur: ${mockStartups[startupIndex].upvotes}`);
      toast.success("Upvote retiré avec succès!");
      return true;
    }
  } catch (error) {
    console.error('Erreur lors du retrait de l\'upvote:', error);
    toast.error("Une erreur est survenue");
    return false;
  }
};

/**
 * Vérifie si l'utilisateur a déjà upvoté
 */
export const hasUpvotedStartup = async (startupId: string): Promise<boolean> => {
  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    
    if (!userId) return false;
    
    // Vérifier dans Supabase si l'upvote existe
    const { data, error } = await supabase
      .from('startup_upvotes')
      .select('*')
      .eq('startup_id', startupId)
      .eq('user_id', userId)
      .single();
    
    return !!data && !error;
  } catch (error) {
    console.error('Erreur lors de la vérification d\'upvote:', error);
    return false;
  }
};
