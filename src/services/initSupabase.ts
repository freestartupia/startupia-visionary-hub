
import { supabase } from "@/integrations/supabase/client";

const initBlogImagesBucket = async () => {
  try {
    // Vérifier si le bucket existe déjà
    const { data: existingBucket } = await supabase.storage.getBucket('blog_images');
    
    if (!existingBucket) {
      // Créer le bucket s'il n'existe pas
      const { error } = await supabase.storage.createBucket('blog_images', {
        public: true,
        fileSizeLimit: 1024 * 1024 * 2, // 2MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
      });
      
      if (error) throw error;
      console.log('Bucket blog_images créé avec succès');
    }
  } catch (error) {
    console.error('Erreur lors de l\'initialisation du bucket blog_images:', error);
  }
};

export const initializeSupabase = async () => {
  await initBlogImagesBucket();
  // Ajouter d'autres initialisations ici si nécessaire
};

export default initializeSupabase;
