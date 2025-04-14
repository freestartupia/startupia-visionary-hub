
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadProps {
  onImageChange: (file: File | null) => void;
  imagePreview: string | null;
  onImageRemove: () => void;
  label?: string;
  accept?: string;
  maxSize?: number; // in MB
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageChange,
  imagePreview,
  onImageRemove,
  label = "Image",
  accept = ".webp,.jpg,.jpeg,.png",
  maxSize = 2 // Default 2MB
}) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // Check file type
      const fileType = file.type;
      const validTypes = accept.split(',').map(type => {
        return type.startsWith('.') ? 
          `image/${type.substring(1)}` : 
          type;
      });
      
      if (!validTypes.includes(fileType) && !validTypes.some(type => fileType.includes(type.replace('.', '')))) {
        toast.error(`Format d'image non supporté. Utilisez ${accept.replace(/\./g, '')} formats.`);
        return;
      }
      
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`L'image est trop grande. La taille maximum est de ${maxSize}MB.`);
        return;
      }
      
      onImageChange(file);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="image-upload" className="text-white">{label}</Label>
      {!imagePreview ? (
        <div className="flex items-center justify-center w-full">
          <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer border-gray-700 bg-gray-900 hover:bg-gray-800">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-startupia-turquoise" />
              <p className="mb-2 text-sm text-white">
                <span className="font-semibold">Cliquez pour télécharger</span> ou glisser-déposer
              </p>
              <p className="text-xs text-gray-400">
                {accept.replace(/\./g, '').toUpperCase()} (MAX. {maxSize}MB)
              </p>
            </div>
            <Input 
              id="image-upload" 
              type="file" 
              className="hidden" 
              accept={accept}
              onChange={handleImageChange}
            />
          </label>
        </div>
      ) : (
        <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-700">
          <img
            src={imagePreview}
            alt="Aperçu"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={onImageRemove}
            className="absolute top-2 right-2 bg-black/70 p-1 rounded-full hover:bg-black"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
