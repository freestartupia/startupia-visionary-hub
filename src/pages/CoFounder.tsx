
import React, { useState } from 'react';
import CoFounderSearch from '@/components/CoFounderSearch';
import CoFounderProfile from '@/components/CoFounderProfile';
import ProjectsList from '@/components/ProjectsList';
import Footer from '@/components/Footer';
import { CofounderProfile } from '@/types/cofounders';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import SEO from '@/components/SEO';
import { ArrowRight } from 'lucide-react';

// Mock data for development purposes
import { mockCofounderProfiles } from '@/data/mockCofounderProfiles';

const CoFounder = () => {
  const [profiles] = useState<CofounderProfile[]>(mockCofounderProfiles);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast: toastUI } = useToast();

  // Filter for project owners
  const projects = profiles.filter(profile => profile.profileType === 'project-owner');

  const handleCreateProfileClick = () => {
    if (!user) {
      toastUI({
        title: "Connexion requise",
        description: "Vous devez être connecté pour créer un profil",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    
    setShowProfileForm(true);
  };

  const handleMatchRequest = (profileId: string) => {
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
    
    // In real app, this would trigger a backend call to send the match request
    console.log(`Match request sent to profile ${profileId}`);
    toast.success("Demande de contact envoyée !");
    
    // In a real app, we would update the UI to reflect the match request
  };

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
      
      <main className="container mx-auto pt-28 pb-16 px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Startup <span className="gradient-text">Co-Founder</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Trouvez le co-fondateur idéal pour votre startup IA ou rejoignez un projet prometteur
          </p>
        </div>

        {!showProfileForm ? (
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-center mb-10">
              <Button 
                onClick={handleCreateProfileClick}
                className="bg-startupia-turquoise hover:bg-startupia-turquoise/90 text-black button-glow py-6 px-8 text-lg"
              >
                Créer mon profil de co-fondateur <ArrowRight className="ml-2" />
              </Button>
            </div>

            <div className="mb-16">
              <CoFounderSearch 
                profiles={profiles} 
                requireAuth={true} 
                onMatchRequest={handleMatchRequest}
              />
            </div>
            
            <div className="mt-16">
              <ProjectsList 
                projects={projects} 
                requireAuth={true}
                onMatchRequest={handleMatchRequest} 
              />
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Créer mon profil</h2>
              <Button 
                variant="outline" 
                onClick={() => setShowProfileForm(false)}
                className="border-startupia-turquoise text-startupia-turquoise hover:bg-startupia-turquoise/10"
              >
                Retour à la recherche
              </Button>
            </div>
            <CoFounderProfile onProfileCreated={() => setShowProfileForm(false)} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CoFounder;
