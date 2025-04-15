
import { supabase } from '@/integrations/supabase/client';
import { Startup } from '@/types/startup';
import { useToast } from '@/hooks/use-toast';

// Cache pour éviter des requêtes répétées
let startupsCache = {
  data: null as Startup[] | null,
  timestamp: 0,
  ttl: 5 * 60 * 1000 // 5 minutes de TTL
};

// Interface pour les résultats paginés
export interface PaginatedStartups {
  data: Startup[];
  total: number;
}

// Récupérer les startups avec pagination
export async function fetchStartupsPaginated(
  page: number = 1, 
  pageSize: number = 10, 
  orderBy: 'upvotes' | 'recent' = 'upvotes'
): Promise<PaginatedStartups> {
  try {
    // Calculer l'offset basé sur la page et la taille de page
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    let query = supabase
      .from('startups')
      .select('*', { count: 'exact' });
      
    // Appliquer l'ordre
    if (orderBy === 'upvotes') {
      query = query.order('upvotes', { ascending: false }).order('created_at', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }
    
    // Appliquer la pagination
    query = query.range(from, to);
    
    const { data, error, count } = await query;
      
    if (error) throw error;
    
    const startups = data.map(transformStartupFromDB);
    
    return {
      data: startups,
      total: count || 0
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des startups paginées:', error);
    return { data: [], total: 0 };
  }
}

// Récupérer toutes les startups triées par nombre de votes
export async function fetchStartups() {
  try {
    // Utiliser le cache si disponible et valide
    const now = Date.now();
    if (startupsCache.data && (now - startupsCache.timestamp < startupsCache.ttl)) {
      return startupsCache.data;
    }

    const { data, error } = await supabase
      .from('startups')
      .select('*')
      .order('upvotes', { ascending: false })
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    const startups = data.map(transformStartupFromDB);
    
    // Mettre à jour le cache
    startupsCache.data = startups;
    startupsCache.timestamp = now;
    
    return startups;
  } catch (error) {
    console.error('Erreur lors de la récupération des startups:', error);
    return [];
  }
}

// Cache pour les startups individuelles
const startupDetailCache = new Map<string, { data: Startup, timestamp: number }>();

// Récupérer une startup par son ID
export async function fetchStartupById(id: string) {
  try {
    // Vérifier le cache
    const now = Date.now();
    const cached = startupDetailCache.get(id);
    if (cached && (now - cached.timestamp < startupsCache.ttl)) {
      return cached.data;
    }
    
    const { data, error } = await supabase
      .from('startups')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    const startup = transformStartupFromDB(data);
    
    // Mettre à jour le cache
    startupDetailCache.set(id, { data: startup, timestamp: now });
    
    return startup;
  } catch (error) {
    console.error(`Erreur lors de la récupération de la startup ${id}:`, error);
    return null;
  }
}

// Créer une nouvelle startup
export async function createStartup(startup: Omit<Startup, 'id' | 'createdAt' | 'createdBy' | 'upvotes'> & { logoFile?: File }) {
  try {
    // Obtain current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Utilisateur non connecté');
    
    let logoUrl = startup.logoUrl;
    
    // If a logo file is provided, upload it
    if (startup.logoFile) {
      const fileExt = startup.logoFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `startup-logos/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, startup.logoFile);

      if (uploadError) {
        console.error('Erreur lors du téléchargement du logo:', uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);
      
      logoUrl = urlData.publicUrl;
    }

    // Prepare startup data for database insertion
    const { data, error } = await supabase
      .from('startups')
      .insert({
        name: startup.name,
        short_description: startup.shortDescription,
        website_url: startup.websiteUrl,
        logo_url: logoUrl,
        category: startup.category,
        ai_technology: startup.aiTechnology,
        launch_date: startup.launchDate,
        created_by: user.id
      })
      .select()
      .single();
      
    if (error) throw error;
    
    // Invalider le cache après création
    startupsCache.data = null;
    startupsCache.timestamp = 0;
    
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
    
    // Invalider le cache après un vote
    startupsCache.data = null;
    startupsCache.timestamp = 0;
    startupDetailCache.delete(startupId);
    
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
    
    // Invalider le cache après un unvote
    startupsCache.data = null;
    startupsCache.timestamp = 0;
    startupDetailCache.delete(startupId);
    
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
