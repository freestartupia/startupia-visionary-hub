
import React from 'react';
import { ExternalLink, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ResourceListing } from '@/types/community';
import { formatDate } from '@/components/community/forum/utils';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { deleteResource } from '@/services/resourceListingService';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ResourceCardProps {
  resource: ResourceListing;
  onDelete?: (resourceId: string) => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onDelete }) => {
  const { user } = useAuth();
  const isOwner = user && resource.author_id === user.id;
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  const handleDeleteResource = async () => {
    if (!isOwner) {
      toast.error("Vous n'êtes pas autorisé à supprimer cette ressource");
      return;
    }
    
    try {
      const success = await deleteResource(resource.id);
      
      if (success) {
        toast.success("Ressource supprimée avec succès");
        if (onDelete) {
          onDelete(resource.id);
        }
      } else {
        throw new Error("Échec de la suppression");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la ressource:", error);
      toast.error("Erreur lors de la suppression de la ressource");
    }
  };

  return (
    <Card className="glass-card hover-scale transition-transform duration-300 flex flex-col h-full">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge>{resource.format}</Badge>
          <span className="text-sm text-white/60">
            {formatDate(resource.created_at)}
          </span>
        </div>
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold">{resource.title}</h3>
          {isOwner && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-red-500 hover:bg-red-500/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action ne peut pas être annulée. La ressource sera définitivement supprimée.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteResource} className="bg-red-500 hover:bg-red-600">
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-white/80 mb-4">{resource.description}</p>
        <div className="text-white/80">
          <strong>Pour:</strong> {resource.target_audience}
        </div>
        <div className="text-white/80 mt-2">
          <strong>Prix:</strong> {resource.is_paid ? resource.price || 'Payant' : 'Gratuit'}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 border-t border-white/10 pt-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            {resource.author_avatar ? (
              <AvatarImage 
                src={resource.author_avatar} 
                alt={resource.author_name || 'Auteur'} 
              />
            ) : (
              <AvatarFallback>
                {resource.author_name ? getInitials(resource.author_name) : 'U'}
              </AvatarFallback>
            )}
          </Avatar>
          <span className="font-medium">
            {resource.author_name || 'Utilisateur'}
          </span>
        </div>
        <Button className="w-full" asChild>
          <a 
            href={resource.access_link} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Accéder à la ressource
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResourceCard;
