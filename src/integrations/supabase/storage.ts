
import { supabase } from './client';

/**
 * Crée un bucket de stockage s'il n'existe pas déjà
 */
export const createStorageBucket = async (bucketName: string) => {
  try {
    const { data: existingBucket } = await supabase.storage.getBucket(bucketName);
    
    if (!existingBucket) {
      const { data, error } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 1024 * 1024 * 2, // 2MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
      });
      
      if (error) throw error;
      return data;
    }
    
    return existingBucket;
  } catch (error) {
    console.error('Erreur lors de la création du bucket:', error);
    throw error;
  }
};

/**
 * Télécharge un fichier dans un bucket de stockage
 */
export const uploadFile = async (
  bucketName: string,
  filePath: string,
  file: File
) => {
  try {
    // Create bucket if it doesn't exist
    await createStorageBucket(bucketName);
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erreur lors du téléchargement du fichier:', error);
    throw error;
  }
};

/**
 * Obtient l'URL publique d'un fichier
 */
export const getPublicUrl = (bucketName: string, filePath: string) => {
  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);
    
  return data.publicUrl;
};

/**
 * Supprime un fichier du stockage
 */
export const deleteFile = async (bucketName: string, filePath: string) => {
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression du fichier:', error);
    throw error;
  }
};

// Initialiser les buckets au démarrage de l'application
export const initializeStorage = async () => {
  try {
    // Créer le bucket pour les avatars utilisateurs et contenu utilisateur
    await createStorageBucket('user_content');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation du stockage:', error);
  }
};

export default {
  createStorageBucket,
  uploadFile,
  getPublicUrl,
  deleteFile,
  initializeStorage
};
