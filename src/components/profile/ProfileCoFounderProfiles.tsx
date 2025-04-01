
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, User, Edit, Trash2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { CofounderProfile } from '@/types/cofounders';
import { supabase } from '@/integrations/supabase/client';
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
import { toast } from 'sonner';

const ProfileCoFounderProfiles = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<CofounderProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [profileToDelete, setProfileToDelete] = useState<CofounderProfile | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const fetchUserProfiles = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('cofounder_profiles')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Convert database response to CofounderProfile type
      const cofounderProfiles: CofounderProfile[] = (data || []).map(profile => ({
        id: profile.id,
        name: profile.name,
        profileType: profile.profile_type,
        role: profile.role,
        seekingRoles: profile.seeking_roles || [],
        pitch: profile.pitch,
        sector: profile.sector,
        objective: profile.objective,
        aiTools: profile.ai_tools || [],
        availability: profile.availability,
        vision: profile.vision,
        region: profile.region,
        linkedinUrl: profile.linkedin_url,
        portfolioUrl: profile.portfolio_url,
        websiteUrl: profile.website_url,
        photoUrl: profile.photo_url,
        dateCreated: profile.date_created,
        hasAIBadge: profile.has_ai_badge || false,
        projectName: profile.project_name,
        projectStage: profile.project_stage,
        matches: profile.matches || []
      }));
      
      setProfiles(cofounderProfiles);
    } catch (error) {
      console.error('Error fetching user profiles:', error);
      toast.error("Erreur lors du chargement des profils");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUserProfiles();
  }, [user]);

  const handleDeleteClick = (profile: CofounderProfile) => {
    setProfileToDelete(profile);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!profileToDelete) return;
    
    setIsDeleting(profileToDelete.id);
    
    try {
      const { error } = await supabase
        .from('cofounder_profiles')
        .delete()
        .eq('id', profileToDelete.id);
        
      if (error) throw error;
      
      // Remove the profile from local state
      setProfiles(profiles.filter(p => p.id !== profileToDelete.id));
      toast.success("Profil supprimé avec succès");
    } catch (error) {
      console.error('Error deleting profile:', error);
      toast.error("Erreur lors de la suppression du profil");
    } finally {
      setIsDeleting(null);
      setShowDeleteDialog(false);
      setProfileToDelete(null);
    }
  };
  
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-48 bg-gray-800/40 rounded-lg"></div>
        <div className="h-48 bg-gray-800/40 rounded-lg"></div>
      </div>
    );
  }
  
  return (
    <>
      <Card className="border border-gray-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Mes profils de cofondateur</CardTitle>
            <CardDescription>
              Gérez vos profils pour trouver des collaborateurs
            </CardDescription>
          </div>
          <Link to="/cofounder">
            <Button className="bg-startupia-turquoise text-black hover:bg-startupia-turquoise/90">
              <Plus className="h-4 w-4 mr-2" />
              Créer un profil
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {profiles.length === 0 ? (
            <div className="text-center py-12">
              <User className="h-12 w-12 mx-auto text-gray-500 mb-4" />
              <h3 className="text-lg font-medium">Aucun profil</h3>
              <p className="text-gray-400 mt-2 mb-6">
                Vous n'avez pas encore créé de profil de cofondateur
              </p>
              <Link to="/cofounder">
                <Button className="bg-startupia-turquoise text-black hover:bg-startupia-turquoise/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Créer mon premier profil
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profiles.map(profile => (
                <Card key={profile.id} className="bg-black/50 border-gray-800 hover:border-gray-700 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      {profile.photoUrl ? (
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-startupia-turquoise/30">
                          <img 
                            src={profile.photoUrl} 
                            alt={profile.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-startupia-light-purple to-startupia-turquoise rounded-full flex items-center justify-center text-xl font-bold">
                          {profile.name.charAt(0)}
                        </div>
                      )}
                      
                      <div>
                        <h3 className="font-medium text-lg">{profile.name}</h3>
                        <p className="text-gray-400">{profile.role}</p>
                        
                        <div className="mt-2">
                          <span className="text-xs bg-gray-800 px-2 py-1 rounded-full mr-2">
                            {profile.profileType === 'project-owner' ? 'Porteur de projet' : 'Collaborateur'}
                          </span>
                          <span className="text-xs bg-startupia-purple/30 px-2 py-1 rounded-full">
                            {profile.sector}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" className="flex-1" asChild>
                        <Link to={`/cofounder/edit/${profile.id}`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </Link>
                      </Button>
                      
                      <Button 
                        variant="destructive" 
                        className="flex-1 bg-red-900/20 hover:bg-red-900/30" 
                        onClick={() => handleDeleteClick(profile)}
                        disabled={isDeleting === profile.id}
                      >
                        {isDeleting === profile.id ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Suppression...
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <Button 
                      variant="secondary" 
                      className="w-full mt-2 bg-startupia-turquoise/10 hover:bg-startupia-turquoise/20 text-startupia-turquoise" 
                      asChild
                    >
                      <Link to={`/cofounders?profile=${profile.id}`}>
                        Voir les matchs
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-black border border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce profil? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border border-gray-700">Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm} 
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Suppression...
                </>
              ) : (
                "Supprimer"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProfileCoFounderProfiles;
