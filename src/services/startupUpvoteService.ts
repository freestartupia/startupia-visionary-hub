
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
    
    // Vérifier si l'utilisateur est authentifié
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'anonymous';
    
    // Vérifier si l'utilisateur a déjà upvoté cette startup
    const { data: existingUpvote, error: upvoteCheckError } = await supabase
      .from('startup_upvotes')
      .select('*')
      .eq('startup_id', startupId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (upvoteCheckError) {
      console.error('Erreur lors de la vérification d\'upvote:', upvoteCheckError);
      // Continuer car cela peut être une première tentative
    }
    
    if (existingUpvote) {
      console.log('L\'utilisateur a déjà upvoté cette startup');
      toast.error("Vous avez déjà upvoté cette startup");
      return false;
    }
    
    // Récupérer le compte actuel d'upvotes
    const { data: startup, error: fetchError } = await supabase
      .from('startups')
      .select('upvotes')
      .eq('id', startupId)
      .maybeSingle();
    
    if (fetchError) {
      console.error('Erreur lors de la récupération du startup:', fetchError);
      throw fetchError;
    }
    
    if (!startup) {
      console.error('Startup non trouvée:', startupId);
      toast.error("Startup non trouvée");
      return false;
    }
    
    // Calculer le nouveau nombre d'upvotes
    const currentUpvotes = startup.upvotes || 0;
    const newUpvoteCount = currentUpvotes + 1;
    
    // Mettre à jour le compteur d'upvotes
    const { error: updateError } = await supabase
      .from('startups')
      .update({ upvotes: newUpvoteCount })
      .eq('id', startupId);
    
    if (updateError) {
      console.error('Erreur lors de la mise à jour des upvotes:', updateError);
      throw updateError;
    }
    
    // Enregistrer l'upvote de l'utilisateur
    const { error: upvoteRecordError } = await supabase
      .from('startup_upvotes')
      .insert({
        startup_id: startupId,
        user_id: userId
      });
    
    if (upvoteRecordError) {
      console.error('Erreur lors de l\'enregistrement de l\'upvote:', upvoteRecordError);
      
      // Annuler l'augmentation du compteur si l'enregistrement échoue
      const { error: revertError } = await supabase
        .from('startups')
        .update({ upvotes: currentUpvotes })
        .eq('id', startupId);
      
      if (revertError) {
        console.error('Erreur lors de l\'annulation de l\'upvote:', revertError);
      }
      
      throw upvoteRecordError;
    }
    
    console.log(`Startup upvotée avec succès: ${startupId}, nouveau compteur: ${newUpvoteCount}`);
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
    
    // Vérifier si l'utilisateur est authentifié
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'anonymous';
    
    // Vérifier si l'utilisateur a déjà upvoté cette startup
    const { data: existingUpvote, error: upvoteCheckError } = await supabase
      .from('startup_upvotes')
      .select('*')
      .eq('startup_id', startupId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (upvoteCheckError) {
      console.error('Erreur lors de la vérification d\'upvote:', upvoteCheckError);
      throw upvoteCheckError;
    }
    
    if (!existingUpvote) {
      console.log('L\'utilisateur n\'a pas upvoté cette startup');
      toast.error("Vous n'avez pas upvoté cette startup");
      return false;
    }
    
    // Récupérer le compte actuel d'upvotes
    const { data: startup, error: fetchError } = await supabase
      .from('startups')
      .select('upvotes')
      .eq('id', startupId)
      .maybeSingle();
    
    if (fetchError) {
      console.error('Erreur lors de la récupération du startup:', fetchError);
      throw fetchError;
    }
    
    if (!startup) {
      console.error('Startup non trouvée:', startupId);
      toast.error("Startup non trouvée");
      return false;
    }
    
    // Calculer le nouveau nombre d'upvotes
    const currentUpvotes = startup.upvotes || 0;
    const newUpvoteCount = Math.max(0, currentUpvotes - 1);
    
    // Mettre à jour le compteur d'upvotes
    const { error: updateError } = await supabase
      .from('startups')
      .update({ upvotes: newUpvoteCount })
      .eq('id', startupId);
    
    if (updateError) {
      console.error('Erreur lors de la mise à jour des upvotes:', updateError);
      throw updateError;
    }
    
    // Supprimer l'enregistrement de l'upvote
    const { error: deleteError } = await supabase
      .from('startup_upvotes')
      .delete()
      .match({ startup_id: startupId, user_id: userId });
    
    if (deleteError) {
      console.error('Erreur lors de la suppression de l\'upvote:', deleteError);
      
      // Annuler la diminution du compteur si la suppression échoue
      const { error: revertError } = await supabase
        .from('startups')
        .update({ upvotes: currentUpvotes })
        .eq('id', startupId);
      
      if (revertError) {
        console.error('Erreur lors de l\'annulation du retrait d\'upvote:', revertError);
      }
      
      throw deleteError;
    }
    
    console.log(`Upvote retiré avec succès: ${startupId}, nouveau compteur: ${newUpvoteCount}`);
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
 */
export const hasUpvotedStartup = async (startupId: string): Promise<boolean> => {
  try {
    // Récupérer l'ID utilisateur
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;
    
    if (!userId) {
      return false;
    }
    
    // Vérifier dans Supabase si l'upvote existe
    const { data, error } = await supabase
      .from('startup_upvotes')
      .select('*')
      .eq('startup_id', startupId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Erreur lors de la vérification d\'upvote:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Erreur lors de la vérification d\'upvote:', error);
    return false;
  }
};
