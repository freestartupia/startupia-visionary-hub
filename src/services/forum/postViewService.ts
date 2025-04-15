
import { supabase } from "@/integrations/supabase/client";

/**
 * Incrémente le compteur de vues d'un post du forum
 * @param postId ID du post
 */
export const incrementPostViews = async (postId: string): Promise<void> => {
  try {
    await supabase.rpc('increment_post_views', { post_id: postId });
  } catch (error) {
    console.error('Erreur lors de l\'incrémentation des vues du post:', error);
  }
};

