
import React, { useState, useEffect } from 'react';
import CoFounderSearch from '@/components/CoFounderSearch';
import ProjectsList from '@/components/ProjectsList';
import Footer from '@/components/Footer';
import { CofounderProfile } from '@/types/cofounders';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import SEO from '@/components/SEO';
import { ArrowRight } from 'lucide-react';
import { getCofounderProfiles, sendMatchRequest } from '@/services/cofounderService';
import { useQuery } from '@tanstack/react-query';

const CoFounder = () => {
  const [showProfileForm, setShowProfileForm] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Fetch cofounder profiles from the database
  const { data: profiles, isLoading, error } = useQuery({
    queryKey: ['cofounderProfiles'],
    queryFn: getCofounderProfiles,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Handler for creating a profile
  const handleCreateProfileClick = () => {
    console.log("Button clicked - new implementation");
    if (!user) {
      // Show toast and provide a direct way to navigate to auth page
      toast("Connexion requise", { 
        description: "Vous devez être connecté pour créer un profil",
        action: {
          label: "Se connecter",
          onClick: () => navigate('/auth')
        }
      });
      return;
    }
    
    // If user is authenticated, redirect to profile creation page
    navigate('/cofounder/create');
  };

  // Handler for match requests
  const handleMatchRequest = async (profileId: string) => {
    if (!user) {
      toast("Connexion requise", { 
        description: "Vous devez être connecté pour contacter un profil",
        action: {
          label: "Se connecter",
          onClick: () => navigate('/auth')
        }
      });
      return;
    }
    
    try {
      await sendMatchRequest(profileId);
      toast.success("Demande de contact envoyée !");
    } catch (error) {
      console.error("Error sending match request:", error);
      toast.error("Erreur lors de l'envoi de la demande de contact");
    }
  };

  // Filter for project owners
  const projects = profiles?.filter(profile => profile.profileType === 'project-owner') || [];

  if (error) {
    console.error("Error fetching profiles:", error);
  }

  return (
    <div className="min-h-screen bg-hero-pattern text-white">
      <SEO 
        title="Trouvez un Cofondateur pour votre Startup IA – StartupIA.fr"
        description="Vous cherchez un cofondateur technique, marketing ou produit pour lancer une startup IA ? Rejoignez StartupIA.fr et trouvez le bon profil pour concrétiser votre idée d'intelligence artificielle."
      />

      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-startupia-turquoise/30 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-startupia-turquoise/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      
      <main className="container mx-auto pt-20 md:pt-28 pb-16 px-4">
        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
            Startup <span className="gradient-text">Co-Founder</span>
          </h1>
          <p className="text-base md:text-xl text-white/80 max-w-2xl mx-auto">
            Trouvez le co-fondateur idéal pour votre startup IA ou rejoignez un projet prometteur
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center mb-8 md:mb-10 relative z-10">
            <div 
              className="inline-block w-full sm:w-auto"
              onClick={(e) => {
                e.stopPropagation();
                console.log("Container clicked");
                handleCreateProfileClick();
              }}
            >
              <button 
                type="button"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-startupia-turquoise hover:bg-startupia-turquoise/90 text-black py-4 md:py-6 px-6 md:px-8 text-base md:text-lg rounded-md button-glow cursor-pointer z-20 relative"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Inner button clicked");
                  handleCreateProfileClick();
                }}
              >
                Créer mon profil de co-fondateur <ArrowRight className="ml-2 size-4" />
              </button>
            </div>
          </div>

          <div className="mb-12 md:mb-16">
            {isLoading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-startupia-turquoise mx-auto"></div>
                <p className="mt-4 text-white/70">Chargement des profils...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20 glass-card">
                <p className="text-white/70 text-lg">Une erreur est survenue lors du chargement des profils.</p>
                <Button 
                  className="mt-4 bg-startupia-turquoise hover:bg-startupia-turquoise/90"
                  onClick={() => window.location.reload()}
                >
                  Réessayer
                </Button>
              </div>
            ) : (
              <CoFounderSearch 
                profiles={profiles || []} 
                requireAuth={true} 
                onMatchRequest={handleMatchRequest}
              />
            )}
          </div>
          
          <div className="mt-12 md:mt-16">
            <ProjectsList 
              projects={projects} 
              requireAuth={true}
              onMatchRequest={handleMatchRequest} 
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CoFounder;
