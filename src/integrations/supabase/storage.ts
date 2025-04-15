
import { supabase } from './client';

/**
 * Version simplifiée: utilise uniquement des buckets existants
 */
export const getPublicUrl = (bucketName: string, filePath: string) => {
  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);
    
  return data.publicUrl;
};

/**
 * Télécharge un fichier dans un bucket de stockage existant
 */
export const uploadFile = async (
  bucketName: string,
  filePath: string,
  file: File
) => {
  try {
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

// Pas d'initialisation automatique
export const initializeStorage = async () => {
  // Ne fait rien pour éviter les erreurs RLS
};

export default {
  uploadFile,
  getPublicUrl,
  deleteFile,
  initializeStorage
};
