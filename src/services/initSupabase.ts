
import { supabase } from "@/integrations/supabase/client";

// Fonction simple, ne crée plus de buckets automatiquement pour éviter les erreurs RLS
export const initializeSupabase = async () => {
  // Aucune initialisation nécessaire pour le moment
  console.log('Supabase initialisé avec succès');
};

export default initializeSupabase;
