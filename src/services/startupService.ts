
import { supabase } from '@/integrations/supabase/client';
import { Startup, StartupVote } from '@/types/startup';
import { useToast } from '@/hooks/use-toast';

// Récupérer toutes les startups triées par nombre de votes
export async function fetchStartups() {
  try {
    const { data, error } = await supabase
      .from('startups')
      .select('*')
      .order('upvotes', { ascending: false })
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data.map(transformStartupFromDB);
  } catch (error) {
    console.error('Erreur lors de la récupération des startups:', error);
    return [];
  }
}

// Récupérer une startup par son ID
export async function fetchStartupById(id: string) {
  try {
    const { data, error } = await supabase
      .from('startups')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    return transformStartupFromDB(data);
  } catch (error) {
    console.error(`Erreur lors de la récupération de la startup ${id}:`, error);
    return null;
  }
}

// Créer une nouvelle startup
export async function createStartup(startup: Omit<Startup, 'id' | 'createdAt' | 'createdBy' | 'upvotes'>) {
  try {
    // Obtenir l'ID utilisateur actuel avant l'insertion
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Utilisateur non connecté');
    
    const { data, error } = await supabase
      .from('startups')
      .insert({
        name: startup.name,
        short_description: startup.shortDescription,
        website_url: startup.websiteUrl,
        logo_url: startup.logoUrl,
        category: startup.category,
        ai_technology: startup.aiTechnology,
        launch_date: startup.launchDate,
        created_by: user.id // Utiliser directement l'ID utilisateur
      })
      .select()
      .single();
      
    if (error) throw error;
    
    return transformStartupFromDB(data);
  } catch (error) {
    console.error('Erreur lors de la création de la startup:', error);
    throw error;
  }
}

// Voter pour une startup
export async function voteForStartup(startupId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Utilisateur non connecté');
    
    const { error } = await supabase
      .from('startup_votes')
      .insert([{ startup_id: startupId, user_id: user.id }]);
      
    if (error) {
      if (error.code === '23505') { // Violation de contrainte d'unicité
        throw new Error('Vous avez déjà voté pour cette startup');
      }
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error(`Erreur lors du vote pour la startup ${startupId}:`, error);
    throw error;
  }
}

// Annuler un vote pour une startup
export async function unvoteStartup(startupId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Utilisateur non connecté');
    
    const { error } = await supabase
      .from('startup_votes')
      .delete()
      .eq('startup_id', startupId)
      .eq('user_id', user.id);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Erreur lors de l'annulation du vote pour la startup ${startupId}:`, error);
    throw error;
  }
}

// Vérifier si l'utilisateur a voté pour une startup
export async function hasUserVotedForStartup(startupId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    const { data, error } = await supabase
      .from('startup_votes')
      .select('*')
      .eq('startup_id', startupId)
      .eq('user_id', user.id)
      .single();
      
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = No rows returned
    
    return !!data;
  } catch (error) {
    console.error(`Erreur lors de la vérification du vote pour la startup ${startupId}:`, error);
    return false;
  }
}

// Transformer les données de la base de données en format approprié pour l'application
function transformStartupFromDB(data: any): Startup {
  return {
    id: data.id,
    name: data.name,
    shortDescription: data.short_description,
    websiteUrl: data.website_url,
    logoUrl: data.logo_url,
    category: data.category,
    aiTechnology: data.ai_technology,
    launchDate: data.launch_date,
    createdAt: data.created_at,
    createdBy: data.created_by,
    upvotes: data.upvotes
  };
}
