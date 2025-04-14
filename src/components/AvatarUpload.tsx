
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Upload, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

interface AvatarUploadProps {
  userId: string;
  existingImageUrl?: string | null;
  onImageUploaded: (url: string) => void;
}

const AvatarUpload = ({ userId, existingImageUrl, onImageUploaded }: AvatarUploadProps) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(existingImageUrl || null);
  const [uploading, setUploading] = useState(false);
  
  const getInitials = () => {
    return userId.substring(0, 2).toUpperCase();
  };
  
  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Veuillez sélectionner une image');
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/avatars/${uuidv4()}.${fileExt}`;
      
      // Check if user_content bucket exists, if not create it
      const { data: bucketExists } = await supabase.storage.getBucket('user_content');
      if (!bucketExists) {
        await supabase.storage.createBucket('user_content', {
          public: true,
          fileSizeLimit: 1024 * 1024 * 2, // 2MB
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
        });
      }
      
      // Upload file to Storage
      const { error: uploadError } = await supabase.storage
        .from('user_content')
        .upload(filePath, file, { upsert: true });
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data } = supabase.storage
        .from('user_content')
        .getPublicUrl(filePath);
      
      const newAvatarUrl = data.publicUrl;
      setAvatarUrl(newAvatarUrl);
      
      // Update profile in database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: newAvatarUrl })
        .eq('id', userId);
        
      if (updateError) {
        console.error('Error updating profile:', updateError);
      }
      
      onImageUploaded(newAvatarUrl);
      toast.success("Photo de profil mise à jour");
      
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error("Erreur lors du téléchargement de l'image");
    } finally {
      setUploading(false);
    }
  };
  
  const removeAvatar = async () => {
    try {
      setUploading(true);
      
      // Update profile in database
      await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', userId);
      
      setAvatarUrl(null);
      onImageUploaded('');
      toast.success("Photo de profil supprimée");
      
    } catch (error) {
      console.error('Error removing avatar:', error);
      toast.error("Erreur lors de la suppression de l'image");
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="w-24 h-24 border-2 border-startupia-turquoise/30">
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} alt="Avatar" className="object-cover" />
        ) : null}
        <AvatarFallback className="bg-gradient-to-br from-startupia-light-purple to-startupia-turquoise text-lg">
          {getInitials()}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex space-x-2">
        <Button 
          type="button"
          variant="outline" 
          size="sm"
          className="relative"
          disabled={uploading}
        >
          <Upload size={16} className="mr-1" />
          {uploading ? 'Téléchargement...' : 'Ajouter une photo'}
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading}
          />
        </Button>
        
        {avatarUrl && (
          <Button 
            type="button"
            variant="destructive" 
            size="sm"
            onClick={removeAvatar}
            disabled={uploading}
          >
            <X size={16} className="mr-1" />
            Supprimer
          </Button>
        )}
      </div>
    </div>
  );
};

export default AvatarUpload;
