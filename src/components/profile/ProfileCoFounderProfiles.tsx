
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyCofounderProfiles, deleteCofounderProfile } from '@/services/cofounderService';
import type { CofounderProfile } from '@/types/cofounders';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ProfileCoFounderProfiles = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profileToDelete, setProfileToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Query to fetch user's cofounder profiles
  const { data: profiles, isLoading, error } = useQuery({
    queryKey: ['myCofounderProfiles'],
    queryFn: getMyCofounderProfiles,
    enabled: !!user,
    staleTime: 60 * 1000, // 1 minute
  });

  // Mutation to delete a profile
  const deleteMutation = useMutation({
    mutationFn: deleteCofounderProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myCofounderProfiles'] });
      toast({
        title: "Profil supprimé",
        description: "Le profil a été supprimé avec succès.",
      });
      setProfileToDelete(null);
    },
    onError: (error) => {
      console.error('Erreur lors de la suppression du profil:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le profil",
        variant: "destructive",
      });
      setProfileToDelete(null);
    }
  });

  const handleDeleteConfirm = async () => {
    if (profileToDelete) {
      deleteMutation.mutate(profileToDelete);
    }
  };

  return (
    <div className="glass-card p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Vos profils cofondateur</h2>
        <Button onClick={() => navigate('/cofounder/create')} className="bg-startupia-turquoise hover:bg-startupia-turquoise/90 text-black">
          <Plus size={16} className="mr-2" />
          Créer un profil
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-startupia-turquoise"></div>
        </div>
      ) : error ? (
        <div className="text-center py-10 border border-dashed border-white/20 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Erreur de chargement</h3>
          <p className="text-white/70 mb-4">Impossible de charger vos profils cofondateur.</p>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['myCofounderProfiles'] })} variant="outline">
            Réessayer
          </Button>
        </div>
      ) : profiles && profiles.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-white/20 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Vous n'avez pas encore de profil cofondateur</h3>
          <p className="text-white/70 mb-4">Créez votre profil pour être mis en relation avec des partenaires potentiels.</p>
          <Button onClick={() => navigate('/cofounder/create')} className="bg-startupia-turquoise hover:bg-startupia-turquoise/90 text-black">
            <Plus size={16} className="mr-2" />
            Créer un profil
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {profiles?.map((profile) => (
            <div key={profile.id} className="border border-white/10 rounded-lg p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium">{profile.name}</h3>
                  <Badge 
                    variant="outline" 
                    className={
                      profile.profileType === 'project-owner'
                        ? 'border-startupia-gold/50 text-startupia-gold'
                        : 'border-startupia-turquoise/50 text-startupia-turquoise'
                    }
                  >
                    {profile.profileType === 'project-owner' ? 'Porteur de projet' : 'Collaborateur'}
                  </Badge>
                </div>
                <p className="text-sm text-white/70">{profile.role} • {profile.sector}</p>
              </div>
              
              <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                <Button 
                  variant="outline" 
                  className="flex-1 md:flex-none"
                  asChild
                >
                  <Link to={`/cofounder/edit/${profile.id}`}>
                    <Edit size={16} className="mr-2" />
                    Modifier
                  </Link>
                </Button>
                <Button 
                  variant="destructive"
                  className="flex-1 md:flex-none"
                  onClick={() => setProfileToDelete(profile.id)}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending && profileToDelete === profile.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Trash2 size={16} className="mr-2" />
                  )}
                  Supprimer
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation dialog for deleting a profile */}
      <AlertDialog open={!!profileToDelete} onOpenChange={(open) => !open && setProfileToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce profil?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Toutes les données associées à ce profil seront définitivement supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProfileCoFounderProfiles;
