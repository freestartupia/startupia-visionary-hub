
import React from 'react';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import { mockStartups } from '@/data/mockStartups';
import { mockProductLaunches } from '@/data/mockProductLaunches';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { incrementValue, supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import SEO from '@/components/SEO';
import RankingsHeader from '@/components/rankings/RankingsHeader';
import RankingsTabContent from '@/components/rankings/RankingsTabContent';

const Rankings = () => {
  const { toast } = useToast();
  
  // Top voted startups (would be from DB in production)
  const topStartups = [...mockStartups]
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 3);
    
  // New promising startups (would be from DB in production)
  const newStartups = [...mockStartups]
    .filter(s => s.maturityLevel === 'MVP' || s.maturityLevel === 'Seed')
    .slice(0, 3);
    
  // Top AI tools from product launches
  const topTools = [...mockProductLaunches]
    .sort((a, b) => b.upvotes - a.upvotes)
    .slice(0, 3);

  // Top AI tools with affiliate links (would be from a specific database in production)
  const topAIToolsWithAffiliates = [
    { 
      id: 1, 
      name: "Genius Copilot", 
      avatar: "https://placehold.co/400x400/2E2E2E/2EDBA0?text=GC&font=montserrat",
      points: 58,
      badge: "🔥 Marketing",
      link: "/product/genius-copilot",
      description: "Assistant IA multimodal pour les équipes marketing. Analyse et génère du contenu automatiquement."
    },
    { 
      id: 2, 
      name: "Neuron Labs", 
      avatar: "https://placehold.co/400x400/2E2E2E/2EDBA0?text=NL&font=montserrat",
      points: 127,
      badge: "👨‍💻 No-Code",
      link: "/product/neuron-labs",
      description: "Créez des agents IA personnalisés sans coder. Idéal pour les entreprises de toutes tailles."
    },
    { 
      id: 3, 
      name: "Sentient", 
      avatar: "https://placehold.co/400x400/2E2E2E/F4C770?text=S&font=montserrat",
      points: 215,
      badge: "🎯 Service Client",
      link: "/product/sentient",
      description: "Analyse émotionnelle en temps réel pour vos conversations client. Augmentez votre satisfaction client de 23%."
    },
    { 
      id: 4, 
      name: "AIdar", 
      avatar: "https://placehold.co/400x400/2E2E2E/2EDBA0?text=AD&font=montserrat",
      points: 89,
      badge: "🏭 Industrie",
      link: "/product/aidar",
      description: "Détection proactive des anomalies industrielles. Réduisez vos coûts de maintenance de 40%."
    }
  ];

  // Top contributors (hardcoded for now)
  const topContributors = [
    { id: 1, name: 'Sophie Martin', avatar: 'https://i.pravatar.cc/150?img=1', points: 245, badge: '🏆 Expert' },
    { id: 2, name: 'Thomas Dubois', avatar: 'https://i.pravatar.cc/150?img=12', points: 198, badge: '🔥 Power User' },
    { id: 3, name: 'Julie Leroy', avatar: 'https://i.pravatar.cc/150?img=5', points: 156, badge: '⚡️ Actif' },
    { id: 4, name: 'Antoine Bernard', avatar: 'https://i.pravatar.cc/150?img=8', points: 132, badge: '👨‍💻 Contributeur' }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO 
        title="Top Startups et Outils IA – Les Tendances IA en Temps Réel"
        description="Découvrez les startups IA les plus votées, les outils IA émergents et les tendances qui façonnent l'avenir de l'intelligence artificielle en France. Classement mis à jour en continu."
      />
      
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      
      <Navbar />
      
      <main className="container mx-auto pt-24 pb-16 px-4 relative z-10">
        <RankingsHeader 
          title="Classements & Tendances" 
          subtitle="Découvrez les startups et outils IA français qui font l'actualité"
        />
        
        <Tabs defaultValue="weekly" className="mb-10">
          <div className="flex justify-center mb-6">
            <TabsList>
              <TabsTrigger value="weekly">Cette semaine</TabsTrigger>
              <TabsTrigger value="monthly">Ce mois</TabsTrigger>
              <TabsTrigger value="alltime">Tout temps</TabsTrigger>
            </TabsList>
          </div>

          {/* Weekly content */}
          <TabsContent value="weekly">
            <RankingsTabContent 
              topStartups={topStartups}
              newStartups={newStartups}
              topAIToolsWithAffiliates={topAIToolsWithAffiliates}
              topContributors={topContributors}
            />
          </TabsContent>
          
          {/* Monthly content */}
          <TabsContent value="monthly">
            <RankingsTabContent 
              topStartups={topStartups}
              newStartups={newStartups}
              topAIToolsWithAffiliates={topAIToolsWithAffiliates}
              topContributors={topContributors}
              isDemo={true}
            />
          </TabsContent>
          
          {/* All time content */}
          <TabsContent value="alltime">
            <RankingsTabContent 
              topStartups={topStartups}
              newStartups={newStartups}
              topAIToolsWithAffiliates={topAIToolsWithAffiliates}
              topContributors={topContributors}
              isDemo={true}
            />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Rankings;
