
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ResourceFormat, ResourceListing } from '@/types/community';
import { useAuth } from '@/contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { addResource } from '@/services/resourceListingService';
import { Switch } from '@/components/ui/switch';

interface ShareResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (resource: ResourceListing) => void;
  formats: (ResourceFormat | 'all')[];
}

type FormData = {
  title: string;
  description: string;
  format: ResourceFormat;
  targetAudience: string;
  accessLink: string;
  isPaid: boolean;
  price: string;
};

const ShareResourceModal: React.FC<ShareResourceModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  formats 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<FormData>();
  
  const isPaid = watch('isPaid');
  
  const filteredFormats = formats.filter(format => format !== 'all') as ResourceFormat[];
  
  const handleClose = () => {
    reset();
    onClose();
  };
  
  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast.error("Vous devez être connecté pour partager une ressource");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newResource: ResourceListing = {
        id: uuidv4(),
        title: data.title,
        description: data.description,
        format: data.format,
        target_audience: data.targetAudience,
        access_link: data.accessLink,
        is_paid: data.isPaid,
        price: data.isPaid ? data.price : null,
        author_id: user.id,
        author_name: user.user_metadata?.name || 'Utilisateur anonyme',
        author_avatar: user.user_metadata?.avatar_url || null,
        created_at: new Date().toISOString(),
        community_validated: false,
        votes: 0
      };
      
      const addedResource = await addResource(newResource);
      
      if (addedResource) {
        toast.success("Votre ressource a été partagée avec succès");
        reset();
        onSuccess(addedResource);
        onClose();
      } else {
        toast.error("Une erreur est survenue lors de l'ajout de la ressource");
      }
    } catch (error) {
      console.error("Error creating resource:", error);
      toast.error("Une erreur est survenue lors de l'ajout de la ressource");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Partager une ressource avec la communauté</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              placeholder="Titre de la ressource"
              {...register("title", { required: "Le titre est requis" })}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Description de la ressource"
              rows={3}
              {...register("description", { required: "La description est requise" })}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="format">Format</Label>
            <select
              id="format"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              {...register("format", { required: "Le format est requis" })}
            >
              <option value="">Sélectionnez un format</option>
              {filteredFormats.map((format) => (
                <option key={format} value={format}>
                  {format}
                </option>
              ))}
            </select>
            {errors.format && <p className="text-sm text-red-500">{errors.format.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="targetAudience">Public cible</Label>
            <Input
              id="targetAudience"
              placeholder="À qui s'adresse cette ressource ?"
              {...register("targetAudience", { required: "Le public cible est requis" })}
            />
            {errors.targetAudience && <p className="text-sm text-red-500">{errors.targetAudience.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="accessLink">Lien d'accès</Label>
            <Input
              id="accessLink"
              placeholder="URL d'accès à la ressource"
              {...register("accessLink", { 
                required: "Le lien d'accès est requis",
                pattern: {
                  value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                  message: "Veuillez entrer une URL valide"
                }
              })}
            />
            {errors.accessLink && <p className="text-sm text-red-500">{errors.accessLink.message}</p>}
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="isPaid" 
              checked={isPaid}
              onCheckedChange={(checked) => setValue('isPaid', checked)}
            />
            <Label htmlFor="isPaid">Ressource payante</Label>
          </div>
          
          {isPaid && (
            <div className="space-y-2">
              <Label htmlFor="price">Prix</Label>
              <Input
                id="price"
                placeholder="ex: 49€, 99€-249€, etc."
                {...register("price", { 
                  required: isPaid ? "Le prix est requis pour une ressource payante" : false
                })}
              />
              {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
            </div>
          )}
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Envoi en cours..." : "Partager"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ShareResourceModal;
