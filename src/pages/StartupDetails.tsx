
import React from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Navbar from '@/components/navbar/Navbar';
import NotFound from './NotFound';

// Type définitions pour la page
type FounderType = {
  name: string;
  role: string;
  linkedIn?: string;
  photoUrl?: string;
};

type MaturityLevel = 'Idée' | 'Pre-seed' | 'Seed' | 'MVP' | 'Série A' | 'Série B+';

interface StartupDetailsType {
  id: string;
  name: string;
  logoUrl?: string;
  shortDescription: string;
  longTermVision?: string;
  aiTools?: string[];
  aiUseCases?: string;
  sector: string;
  businessModel: string;
  maturityLevel: MaturityLevel;
  tags?: string[];
  websiteUrl?: string;
  pitchDeckUrl?: string;
  crunchbaseUrl?: string;
  notionUrl?: string;
  upvotes: number;
  viewCount: number;
  founders?: FounderType[];
}

// Exemple de données pour éviter les erreurs de compilation
const mockStartupDetails: Record<string, StartupDetailsType> = {
  "1": {
    id: "1",
    name: "IA Santé",
    shortDescription: "Solution IA pour le diagnostic médical",
    longTermVision: "Révolutionner le diagnostic médical avec l'IA pour rendre les soins de santé plus accessibles et précis",
    sector: "Santé",
    businessModel: "SaaS",
    maturityLevel: "MVP",
    aiTools: ["NLP", "Computer Vision", "Machine Learning"],
    upvotes: 42,
    viewCount: 1200,
    founders: [
      {
        name: "Marie Dupont",
        role: "CEO",
        linkedIn: "https://linkedin.com/in/mariedupont"
      }
    ]
  },
  "2": {
    id: "2",
    name: "RH Vision",
    shortDescription: "Recrutement optimisé par IA",
    sector: "RH",
    businessModel: "Freemium",
    maturityLevel: "Seed",
    upvotes: 28,
    viewCount: 950
  },
  "3": {
    id: "3",
    name: "FinTech IA",
    shortDescription: "Analyse financière automatisée",
    sector: "Finance",
    businessModel: "Abonnement",
    maturityLevel: "Série A",
    upvotes: 65,
    viewCount: 2300
  }
};

const StartupDetails = () => {
  const { id } = useParams<{ id: string }>();
  const startup = id ? mockStartupDetails[id] : undefined;

  if (!startup) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      {/* Hero section */}
      <section className="pt-24 pb-10 relative">
        <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
        <div className="absolute top-1/4 -left-40 w-96 h-96 bg-startupia-turquoise/30 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-startupia-turquoise/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Startup Logo */}
            <div className="w-24 h-24 rounded-xl bg-startupia-turquoise/10 overflow-hidden flex items-center justify-center">
              {startup.logoUrl ? (
                <img 
                  src={startup.logoUrl} 
                  alt={`${startup.name} logo`} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-startupia-turquoise">
                  {startup.name.charAt(0)}
                </span>
              )}
            </div>
            
            {/* Basic Info */}
            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{startup.name}</h1>
              <p className="text-xl text-white/80 mb-4">{startup.shortDescription}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="outline" className="border-startupia-turquoise/50">
                  {startup.sector}
                </Badge>
                <Badge variant="outline" className="border-startupia-turquoise/50">
                  {startup.businessModel}
                </Badge>
                <Badge variant="outline" className="border-startupia-turquoise/50">
                  {startup.maturityLevel}
                </Badge>
                {startup.tags?.map(tag => (
                  <Badge key={tag} variant="outline" className="border-white/20">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-3">
                {startup.websiteUrl && (
                  <Button variant="outline" size="sm" className="border-startupia-turquoise" asChild>
                    <a href={startup.websiteUrl} target="_blank" rel="noopener noreferrer">
                      Site web
                    </a>
                  </Button>
                )}
                
                {startup.pitchDeckUrl && (
                  <Button variant="outline" size="sm" className="border-white/30" asChild>
                    <a href={startup.pitchDeckUrl} target="_blank" rel="noopener noreferrer">
                      Pitch Deck
                    </a>
                  </Button>
                )}
                
                {startup.crunchbaseUrl && (
                  <Button variant="outline" size="sm" className="border-white/30" asChild>
                    <a href={startup.crunchbaseUrl} target="_blank" rel="noopener noreferrer">
                      Crunchbase
                    </a>
                  </Button>
                )}
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex flex-col items-center bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg px-6 py-4">
              <div className="text-center mb-4">
                <p className="text-3xl font-bold text-startupia-turquoise">{startup.upvotes}</p>
                <p className="text-sm text-white/60">Upvotes</p>
              </div>
              
              <div className="text-center">
                <p className="text-3xl font-bold text-white/80">{startup.viewCount}</p>
                <p className="text-sm text-white/60">Vues</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Main content */}
      <div className="container mx-auto px-4 pb-20">
        <Tabs defaultValue="details" className="mb-8">
          <TabsList className="bg-black/30 border border-startupia-turquoise/20">
            <TabsTrigger value="details" className="data-[state=active]:bg-startupia-turquoise/20">
              Détails
            </TabsTrigger>
            <TabsTrigger value="founder" className="data-[state=active]:bg-startupia-turquoise/20">
              Fondateurs
            </TabsTrigger>
            <TabsTrigger value="tech" className="data-[state=active]:bg-startupia-turquoise/20">
              Tech IA
            </TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="pt-6">
            <div className="glass-card border border-white/10 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Vision à long terme</h2>
              <p className="text-white/80 mb-6">
                {startup.longTermVision || "Aucune information disponible sur la vision à long terme."}
              </p>
            </div>
          </TabsContent>

          {/* Founders Tab */}
          <TabsContent value="founder" className="pt-6">
            <div className="glass-card border border-white/10 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Équipe fondatrice</h2>
              
              {startup.founders && startup.founders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {startup.founders.map((founder, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border border-white/10 rounded-lg">
                      <div className="w-12 h-12 rounded-full bg-startupia-turquoise/10 overflow-hidden">
                        {founder.photoUrl ? (
                          <img 
                            src={founder.photoUrl} 
                            alt={founder.name}
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-lg font-bold text-startupia-turquoise">
                              {founder.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{founder.name}</h3>
                        <p className="text-sm text-white/70">{founder.role}</p>
                        {founder.linkedIn && (
                          <a 
                            href={founder.linkedIn} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-startupia-turquoise hover:underline"
                          >
                            LinkedIn
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/60">Aucune information sur les fondateurs n'est disponible.</p>
              )}
            </div>
          </TabsContent>

          {/* Tech Tab */}
          <TabsContent value="tech" className="pt-6">
            <div className="glass-card border border-white/10 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Technologies IA</h2>
              
              {startup.aiTools && startup.aiTools.length > 0 ? (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Outils IA utilisés</h3>
                  <div className="flex flex-wrap gap-2">
                    {startup.aiTools.map((tool, index) => (
                      <Badge key={index} className="bg-startupia-turquoise/20 text-white">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-white/60 mb-6">Aucune information sur les outils IA n'est disponible.</p>
              )}
              
              {startup.aiUseCases ? (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Cas d'usage IA</h3>
                  <p className="text-white/80">{startup.aiUseCases}</p>
                </div>
              ) : (
                <p className="text-white/60">Aucune information sur les cas d'usage IA n'est disponible.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StartupDetails;
