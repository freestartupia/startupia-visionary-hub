
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

const BLOG_BUCKET = 'blog_images';

export const uploadBlogImage = async (file: File): Promise<string | null> => {
  try {
    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      toast.error("Le fichier doit être une image");
      return null;
    }
    
    // Vérifier la taille du fichier (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 2MB");
      return null;
    }
    
    // Générer un nom de fichier unique
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;
    
    // Télécharger le fichier
    const { error: uploadError } = await supabase.storage
      .from(BLOG_BUCKET)
      .upload(filePath, file);
      
    if (uploadError) {
      console.error('Erreur lors du téléchargement de l\'image:', uploadError);
      toast.error(`Impossible de télécharger l'image: ${uploadError.message}`);
      return null;
    }
    
    // Obtenir l'URL publique
    const { data } = supabase.storage
      .from(BLOG_BUCKET)
      .getPublicUrl(filePath);
      
    return data.publicUrl;
  } catch (error) {
    console.error('Erreur lors du téléchargement de l\'image:', error);
    toast.error("Une erreur est survenue lors du téléchargement de l'image");
    return null;
  }
};
