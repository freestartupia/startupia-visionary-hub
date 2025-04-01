
import React, { useState } from 'react';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import RankingsList from '@/components/rankings/RankingsList';
import { Button } from '@/components/ui/button';

interface AITool {
  id: number;
  name: string;
  avatar?: string;
  points: number;
  badge?: string;
  link?: string;
  description?: string;
  category: string;
}

const Tools = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock AI tools data with affiliate links
  const aiTools: AITool[] = [
    { 
      id: 1, 
      name: "Genius Copilot", 
      avatar: "https://placehold.co/400x400/2E2E2E/2EDBA0?text=GC&font=montserrat",
      points: 58,
      badge: "🔥 Marketing",
      link: "/product/genius-copilot",
      description: "Assistant IA multimodal pour les équipes marketing. Analyse et génère du contenu automatiquement.",
      category: "Marketing"
    },
    { 
      id: 2, 
      name: "Neuron Labs", 
      avatar: "https://placehold.co/400x400/2E2E2E/2EDBA0?text=NL&font=montserrat",
      points: 127,
      badge: "👨‍💻 No-Code",
      link: "/product/neuron-labs",
      description: "Créez des agents IA personnalisés sans coder. Idéal pour les entreprises de toutes tailles.",
      category: "No-Code"
    },
    { 
      id: 3, 
      name: "Sentient", 
      avatar: "https://placehold.co/400x400/2E2E2E/F4C770?text=S&font=montserrat",
      points: 215,
      badge: "🎯 Service Client",
      link: "/product/sentient",
      description: "Analyse émotionnelle en temps réel pour vos conversations client. Augmentez votre satisfaction client de 23%.",
      category: "Service Client"
    },
    { 
      id: 4, 
      name: "AIdar", 
      avatar: "https://placehold.co/400x400/2E2E2E/2EDBA0?text=AD&font=montserrat",
      points: 89,
      badge: "🏭 Industrie",
      link: "/product/aidar",
      description: "Détection proactive des anomalies industrielles. Réduisez vos coûts de maintenance de 40%.",
      category: "Industrie"
    },
    { 
      id: 5, 
      name: "TextWiz", 
      avatar: "https://placehold.co/400x400/2E2E2E/F4C770?text=TW&font=montserrat",
      points: 143,
      badge: "✍️ Rédaction",
      link: "/product/textwiz",
      description: "Rédaction IA avancée et optimisation SEO. Multipliez votre production de contenu par 5.",
      category: "Rédaction"
    },
    { 
      id: 6, 
      name: "VoiceGenius", 
      avatar: "https://placehold.co/400x400/2E2E2E/2EDBA0?text=VG&font=montserrat",
      points: 76,
      badge: "🎤 Audio",
      link: "/product/voicegenius",
      description: "Synthèse vocale ultra-réaliste en français. Idéal pour podcasts et contenus audio.",
      category: "Audio"
    },
    { 
      id: 7, 
      name: "DesignMind", 
      avatar: "https://placehold.co/400x400/2E2E2E/F4C770?text=DM&font=montserrat",
      points: 182,
      badge: "🎨 Design",
      link: "/product/designmind",
      description: "Création graphique automatisée pour tous vos besoins marketing. 100+ templates disponibles.",
      category: "Design"
    },
    { 
      id: 8, 
      name: "DataSense", 
      avatar: "https://placehold.co/400x400/2E2E2E/2EDBA0?text=DS&font=montserrat",
      points: 134,
      badge: "📊 Analyse",
      link: "/product/datasense",
      description: "Analysez vos données sans expertise technique. Insights actionnables en quelques clics.",
      category: "Analyse"
    }
  ];

  // Get unique categories
  const categories = ['Tous', ...Array.from(new Set(aiTools.map(tool => tool.category)))];

  // Filter tools based on search query
  const filteredTools = aiTools.filter(tool => {
    const searchLower = searchQuery.toLowerCase();
    return tool.name.toLowerCase().includes(searchLower) || 
           tool.description.toLowerCase().includes(searchLower) || 
           tool.badge?.toLowerCase().includes(searchLower) ||
           tool.category.toLowerCase().includes(searchLower);
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      
      <Navbar />
      
      <main className="container mx-auto pt-24 pb-16 px-4 relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Top <span className="text-startupia-turquoise">Outils IA</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Découvrez et utilisez les meilleurs outils IA français
          </p>
        </div>

        {/* Search bar */}
        <div className="relative max-w-md mx-auto mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
          <Input
            type="text"
            placeholder="Rechercher un outil..."
            className="pl-10 py-6 bg-black/30 border-startupia-turquoise/20 rounded-xl w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="Tous" className="mb-10">
          <div className="flex justify-center mb-6 overflow-x-auto pb-2">
            <TabsList>
              {categories.map(category => (
                <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Content for All tab */}
          <TabsContent value="Tous">
            <Card className="bg-black/50 border-startupia-turquoise/20">
              <CardContent className="pt-6">
                <RankingsList items={filteredTools} showDescription={true} />
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Content for each category */}
          {categories.slice(1).map(category => (
            <TabsContent key={category} value={category}>
              <Card className="bg-black/50 border-startupia-turquoise/20">
                <CardContent className="pt-6">
                  <RankingsList 
                    items={filteredTools.filter(tool => tool.category === category)} 
                    showDescription={true} 
                  />
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
        
        {/* Featured Tool Section */}
        <section className="mb-10">
          <Card className="bg-black/20 border-startupia-gold/50 overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 p-6 md:p-10">
                <div className="text-startupia-gold font-medium mb-2">Outil vedette</div>
                <h2 className="text-2xl font-bold mb-4">Sentient</h2>
                <p className="text-white/80 mb-6">
                  Augmentez votre satisfaction client de 23% grâce à l'analyse émotionnelle en temps réel de vos conversations.
                  Détecte automatiquement les frustrations clients et suggère les meilleures réponses.
                </p>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-startupia-gold rounded-full mr-2"></div>
                    <span>Compatible avec tous les CRM majeurs</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-startupia-gold rounded-full mr-2"></div>
                    <span>Installation en moins de 10 minutes</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-startupia-gold rounded-full mr-2"></div>
                    <span>Essai gratuit de 14 jours</span>
                  </div>
                </div>
                <Button variant="outline" className="border-startupia-gold text-startupia-gold hover:bg-startupia-gold/10">
                  Essayer Sentient
                </Button>
              </div>
              <div className="md:w-1/2 bg-black/30 flex items-center justify-center p-6">
                <img 
                  src="https://placehold.co/600x400/2E2E2E/F4C770?text=Sentient+Demo&font=montserrat" 
                  alt="Sentient Demo" 
                  className="rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </Card>
        </section>
        
        {/* Call To Action */}
        <section className="text-center">
          <h2 className="text-2xl font-bold mb-4">Vous développez un outil IA ?</h2>
          <p className="text-white/80 mb-6 max-w-2xl mx-auto">
            Présentez votre outil sur Startupia et bénéficiez d'une visibilité auprès de notre communauté tech.
          </p>
          <Button className="bg-startupia-turquoise text-black hover:bg-startupia-turquoise/90">
            Soumettre votre outil
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Tools;
