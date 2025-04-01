
import React, { useState } from 'react';
import Navbar from '@/components/navbar/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

// Mock data for development purposes
import { mockCofounderProfiles } from '@/data/mockCofounderProfiles';

const CoFounder = () => {
  const [profiles] = useState<CofounderProfile[]>(mockCofounderProfiles);
  const [activeTab, setActiveTab] = useState<string>('search');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast: toastUI } = useToast();

  // Filter for project owners
  const projects = profiles.filter(profile => profile.profileType === 'project-owner');

  const handleTabChange = (value: string) => {
    if ((value === 'profile') && !user) {
      toastUI({
        title: "Connexion requise",
        description: "Vous devez être connecté pour créer un profil",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    setActiveTab(value);
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

      <Navbar />
      
      <main className="container mx-auto pt-28 pb-16 px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Startup <span className="gradient-text">Co-Founder</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Trouvez le co-fondateur idéal pour votre startup IA ou rejoignez un projet prometteur
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full max-w-6xl mx-auto">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="search">Rechercher</TabsTrigger>
            <TabsTrigger value="profile">Créer un profil</TabsTrigger>
            <TabsTrigger value="projects">Projets</TabsTrigger>
          </TabsList>
          
          <TabsContent value="search" className="mt-0">
            <CoFounderSearch 
              profiles={profiles} 
              requireAuth={true} 
              onMatchRequest={handleMatchRequest}
            />
          </TabsContent>
          
          <TabsContent value="profile" className="mt-0">
            {user ? (
              <CoFounderProfile />
            ) : (
              <div className="text-center py-12 glass-card">
                <h3 className="text-2xl font-semibold mb-4">Connexion requise</h3>
                <p className="text-white/70 mb-6">
                  Vous devez être connecté pour créer ou modifier votre profil.
                </p>
                <Button 
                  onClick={() => navigate('/auth')}
                  className="bg-startupia-turquoise hover:bg-startupia-turquoise/90"
                >
                  Se connecter / S'inscrire
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="projects" className="mt-0">
            <ProjectsList 
              projects={projects} 
              requireAuth={true}
              onMatchRequest={handleMatchRequest} 
            />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default CoFounder;
