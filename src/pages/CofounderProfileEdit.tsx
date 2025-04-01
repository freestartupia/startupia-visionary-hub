
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card } from '@/components/ui/card';
import CoFounderProfile from '@/components/CoFounderProfile';
import { CofounderProfile } from '@/types/cofounders';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const CofounderProfileEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<CofounderProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('cofounder_profiles')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        // Convert database response to CofounderProfile type
        const cofounderProfile: CofounderProfile = {
          id: data.id,
          name: data.name,
          profileType: data.profile_type,
          role: data.role,
          seekingRoles: data.seeking_roles || [],
          pitch: data.pitch,
          sector: data.sector,
          objective: data.objective,
          aiTools: data.ai_tools || [],
          availability: data.availability,
          vision: data.vision,
          region: data.region,
          linkedinUrl: data.linkedin_url,
          portfolioUrl: data.portfolio_url,
          websiteUrl: data.website_url,
          photoUrl: data.photo_url,
          dateCreated: data.date_created,
          hasAIBadge: data.has_ai_badge || false,
          projectName: data.project_name,
          projectStage: data.project_stage,
          matches: data.matches || []
        };
        
        setProfile(cofounderProfile);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error("Impossible de charger le profil");
        navigate('/profile');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [id, navigate]);

  const handleProfileUpdated = () => {
    toast.success("Profil mis à jour avec succès");
    navigate('/profile');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 mx-auto animate-spin text-startupia-turquoise mb-4" />
          <p>Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="p-6 border border-gray-800 bg-black">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">Profil introuvable</h3>
            <p className="text-gray-400 mb-6">
              Le profil que vous essayez de modifier n'existe pas.
            </p>
            <button 
              className="bg-startupia-turquoise text-black px-4 py-2 rounded hover:bg-startupia-turquoise/90"
              onClick={() => navigate('/profile')}
            >
              Retour au profil
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Modifier mon profil | Startupia.fr</title>
      </Helmet>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Modifier mon profil</h1>
        <CoFounderProfile initialData={profile} isEditing={true} onProfileUpdated={handleProfileUpdated} />
      </div>
    </>
  );
};

export default CofounderProfileEdit;
