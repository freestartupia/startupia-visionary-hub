
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getCofounderProfile, updateCofounderProfile, createCofounderProfile } from '@/services/cofounderService';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';

const CofounderProfileEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const isNewProfile = !id;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    id: '',
    name: '',
    profileType: 'collaborator', // 'collaborator' ou 'project-owner'
    role: '',
    seekingRoles: [],
    pitch: '',
    sector: '',
    objective: '',
    aiTools: [],
    availability: '',
    vision: '',
    region: '',
    photoUrl: '',
    portfolioUrl: '',
    linkedinUrl: '',
    websiteUrl: '',
    projectName: '',
    projectStage: '',
    hasAiBadge: false
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (isNewProfile) {
        setLoading(false);
        return;
      }

      try {
        const fetchedProfile = await getCofounderProfile(id as string);
        if (fetchedProfile) {
          setProfile(fetchedProfile);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger le profil",
          variant: "destructive",
        });
        navigate('/profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, isNewProfile, navigate, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (isNewProfile) {
        await createCofounderProfile(profile);
        toast({
          title: "Profil créé",
          description: "Votre profil a été créé avec succès.",
        });
      } else {
        await updateCofounderProfile(profile);
        toast({
          title: "Profil mis à jour",
          description: "Votre profil a été mis à jour avec succès.",
        });
      }
      navigate('/profile');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du profil:', error);
      toast({
        title: "Erreur",
        description: `Impossible d'enregistrer le profil: ${error}`,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-startupia-turquoise"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-hero-pattern text-white">
        {/* Background elements */}
        <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
        
        <div className="container mx-auto px-4 pt-32 pb-16 relative z-10">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/profile')}
            className="mb-6"
          >
            <ArrowLeft size={16} className="mr-2" />
            Retour au profil
          </Button>

          <div className="glass-card p-6 rounded-lg">
            <h1 className="text-2xl font-semibold mb-6">
              {isNewProfile ? "Créer un profil cofondateur" : "Modifier votre profil cofondateur"}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Ici, vous pouvez ajouter tous les champs du formulaire pour éditer/créer un profil */}
              {/* Pour l'instant, je vais juste ajouter un message temporaire */}

              <div>
                <p className="text-white/70 mb-4">
                  Ce formulaire permettra de créer ou modifier votre profil de cofondateur. 
                  Tous les champs nécessaires (nom, type de profil, compétences, etc.) seront ajoutés ici.
                </p>
                
                <Button 
                  type="submit" 
                  className="bg-startupia-turquoise hover:bg-startupia-turquoise/90 text-black"
                  disabled={saving}
                >
                  {saving && <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black mr-2"></div>}
                  <Save size={16} className="mr-2" />
                  {isNewProfile ? "Créer le profil" : "Enregistrer les modifications"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CofounderProfileEdit;
