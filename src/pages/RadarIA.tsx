
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, Award, BarChart3, Bell, Clock, Rocket, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from '@/components/navbar/Navbar';
import { Link } from 'react-router-dom';

// Mock startup types for existing components
type Sector = "Santé" | "RH" | "Finance" | "Marketing" | "Développement" | "Education";

interface Startup {
  id: string;
  name: string;
  logoUrl?: string;
  shortDescription: string;
  sector: Sector;
  dateAdded?: string;
  aiImpactScore?: number;
}

// Mock data for existing components
const mockStartups: Startup[] = [
  {
    id: "1",
    name: "IA Santé",
    shortDescription: "Solution IA pour le diagnostic médical",
    sector: "Santé",
    aiImpactScore: 85
  },
  {
    id: "2",
    name: "RH Vision",
    shortDescription: "Recrutement optimisé par IA",
    sector: "RH",
    aiImpactScore: 78
  },
  {
    id: "3",
    name: "FinTech IA",
    shortDescription: "Analyse financière automatisée",
    sector: "Finance",
    aiImpactScore: 92
  }
];

// Helper function to get recent startups (less than 14 days old)
const getRecentStartups = (startups: Startup[]) => {
  const today = new Date();
  const twoWeeksAgo = new Date(today.setDate(today.getDate() - 14));
  
  // Add mock dateAdded if not present
  const withDates = startups.map((startup, index) => {
    if (!startup.dateAdded) {
      // Create staggered dates within the last 30 days
      const days = index % 30;
      const mockDate = new Date();
      mockDate.setDate(mockDate.getDate() - days);
      return { ...startup, dateAdded: mockDate.toISOString() };
    }
    return startup;
  });

  return withDates
    .filter(startup => startup.dateAdded && new Date(startup.dateAdded) > twoWeeksAgo)
    .sort((a, b) => 
      new Date(b.dateAdded as string).getTime() - new Date(a.dateAdded as string).getTime()
    );
};

// Helper function to get top startups by sector
const getTopStartupsBySector = (startups: Startup[], sector: Sector, limit = 5) => {
  return startups
    .filter(startup => startup.sector === sector)
    .sort((a, b) => (b.aiImpactScore || 0) - (a.aiImpactScore || 0))
    .slice(0, limit);
};

// Mock funding data
const mockFundingRounds = [
  {
    id: "fr1",
    startupId: mockStartups[0].id,
    startupName: mockStartups[0].name,
    startupLogoUrl: mockStartups[0].logoUrl,
    amount: 5000000,
    date: new Date().toISOString(),
    mainInvestor: "Eurazeo Ventures",
    round: "Série A",
    sourceUrl: "https://example.com"
  },
  {
    id: "fr2",
    startupId: mockStartups[1].id,
    startupName: mockStartups[1].name,
    startupLogoUrl: mockStartups[1].logoUrl,
    amount: 2500000,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    mainInvestor: "Elaia Partners",
    round: "Seed",
    sourceUrl: "https://example.com"
  },
  {
    id: "fr3",
    startupId: mockStartups[2].id,
    startupName: mockStartups[2].name,
    startupLogoUrl: mockStartups[2].logoUrl,
    amount: 15000000,
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    mainInvestor: "Idinvest Partners",
    round: "Série B",
    sourceUrl: "https://example.com"
  },
  {
    id: "fr4",
    startupId: "4",
    startupName: "AlgoFin",
    startupLogoUrl: undefined,
    amount: 800000,
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    mainInvestor: "Business Angels",
    round: "Pré-seed",
    sourceUrl: "https://example.com"
  }
];

// Format date function
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

// Format amount function
const formatAmount = (amount: number) => {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)} M€`;
  }
  return `${(amount / 1000).toFixed(0)} K€`;
};

const RadarIA = () => {
  const [recentStartups, setRecentStartups] = useState<Startup[]>([]);
  const [topHealthStartups, setTopHealthStartups] = useState<Startup[]>([]);
  const [topHRStartups, setTopHRStartups] = useState<Startup[]>([]);
  const [topFinanceStartups, setTopFinanceStartups] = useState<Startup[]>([]);
  const [fundingRounds, setFundingRounds] = useState(mockFundingRounds);

  useEffect(() => {
    // Initialize data
    setRecentStartups(getRecentStartups(mockStartups));
    setTopHealthStartups(getTopStartupsBySector(mockStartups, "Santé"));
    setTopHRStartups(getTopStartupsBySector(mockStartups, "RH"));
    setTopFinanceStartups(getTopStartupsBySector(mockStartups, "Finance"));
    
    // Title update
    document.title = "Radar IA - Startupia.fr";
  }, []);

  // Create a simple card component for startups to replace the missing StartupCard component
  const StartupCard = ({ startup }: { startup: Startup }) => (
    <Card className="glass-card overflow-hidden border border-startupia-turquoise/20 bg-black/30 hover:bg-black/40 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-center mb-3">
          <div className="h-10 w-10 rounded-full bg-startupia-turquoise/10 overflow-hidden mr-3">
            {startup.logoUrl ? (
              <img 
                src={startup.logoUrl} 
                alt={`${startup.name} logo`} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-lg font-bold text-startupia-turquoise">
                  {startup.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <h3 className="font-semibold">{startup.name}</h3>
        </div>
        <p className="text-sm text-white/70 mb-3">{startup.shortDescription}</p>
        <div className="flex justify-between items-center">
          <Badge variant="outline" className="text-xs">
            {startup.sector}
          </Badge>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-startupia-turquoise hover:text-white"
            asChild
          >
            <Link to={`/startup/${startup.id}`}>
              <span className="text-xs">Détails</span>
              <ArrowUpRight size={14} className="ml-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      {/* Hero section */}
      <section className="py-20 mt-16 relative">
        <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
        <div className="absolute top-1/4 -left-40 w-96 h-96 bg-startupia-turquoise/30 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-startupia-turquoise/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              Radar IA France & Europe
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Veille intelligente et visuelle des nouvelles startups IA 
              françaises et européennes, classements dynamiques et levées de fonds récentes.
            </p>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="container mx-auto px-4 pb-20">
        <Tabs defaultValue="nouveautes" className="mb-8">
          <TabsList className="bg-black/30 border border-startupia-turquoise/20">
            <TabsTrigger value="nouveautes" className="data-[state=active]:bg-startupia-turquoise/20">
              <Clock size={16} className="mr-2" />
              Nouveautés
            </TabsTrigger>
            <TabsTrigger value="classements" className="data-[state=active]:bg-startupia-turquoise/20">
              <Award size={16} className="mr-2" />
              Classements
            </TabsTrigger>
            <TabsTrigger value="levees" className="data-[state=active]:bg-startupia-turquoise/20">
              <BarChart3 size={16} className="mr-2" />
              Levées de fonds
            </TabsTrigger>
            <TabsTrigger value="alertes" className="data-[state=active]:bg-startupia-turquoise/20">
              <Bell size={16} className="mr-2" />
              Alertes
            </TabsTrigger>
          </TabsList>

          {/* Nouveautés Tab */}
          <TabsContent value="nouveautes" className="pt-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center">
                <Rocket className="mr-2 text-startupia-turquoise" /> 
                Dernières startups IA détectées
              </h2>
              <Button variant="outline" className="border-startupia-turquoise text-startupia-turquoise">
                Voir toutes <ArrowUpRight size={16} className="ml-2" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recentStartups.map((startup) => (
                <div key={startup.id} className="relative">
                  <StartupCard startup={startup} />
                  {startup.dateAdded && 
                    new Date(startup.dateAdded) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                    <Badge className="absolute top-2 right-2 bg-startupia-turquoise text-white">
                      Nouveau
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Classements Tab */}
          <TabsContent value="classements" className="pt-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold flex items-center">
                <Award className="mr-2 text-startupia-turquoise" /> 
                Classements par secteur
              </h2>
              <p className="text-white/70">Top 5 des startups IA par secteur d'activité</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Top Santé */}
              <Card className="glass-card overflow-hidden border border-startupia-turquoise/20 bg-black/30">
                <div className="p-4 border-b border-startupia-turquoise/10">
                  <h3 className="text-xl font-bold flex items-center">
                    <Zap className="mr-2 text-startupia-turquoise" />
                    Top Santé
                  </h3>
                </div>
                <CardContent className="p-0">
                  {topHealthStartups.map((startup, index) => (
                    <Link 
                      to={`/startup/${startup.id}`} 
                      key={startup.id}
                      className="flex items-center p-4 hover:bg-startupia-turquoise/10 border-b border-startupia-turquoise/10 last:border-b-0 transition-colors"
                    >
                      <span className="font-bold text-startupia-turquoise mr-4">#{index + 1}</span>
                      <div className="h-10 w-10 rounded-full bg-startupia-turquoise/10 overflow-hidden mr-4">
                        {startup.logoUrl ? (
                          <img 
                            src={startup.logoUrl} 
                            alt={`${startup.name} logo`}
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-lg font-bold text-startupia-turquoise">
                              {startup.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-semibold">{startup.name}</h4>
                        <p className="text-sm text-white/60 truncate">{startup.shortDescription}</p>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>

              {/* Top RH */}
              <Card className="glass-card overflow-hidden border border-startupia-turquoise/20 bg-black/30">
                <div className="p-4 border-b border-startupia-turquoise/10">
                  <h3 className="text-xl font-bold flex items-center">
                    <Zap className="mr-2 text-startupia-turquoise" />
                    Top RH
                  </h3>
                </div>
                <CardContent className="p-0">
                  {topHRStartups.map((startup, index) => (
                    <Link 
                      to={`/startup/${startup.id}`} 
                      key={startup.id}
                      className="flex items-center p-4 hover:bg-startupia-turquoise/10 border-b border-startupia-turquoise/10 last:border-b-0 transition-colors"
                    >
                      <span className="font-bold text-startupia-turquoise mr-4">#{index + 1}</span>
                      <div className="h-10 w-10 rounded-full bg-startupia-turquoise/10 overflow-hidden mr-4">
                        {startup.logoUrl ? (
                          <img 
                            src={startup.logoUrl} 
                            alt={`${startup.name} logo`} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-lg font-bold text-startupia-turquoise">
                              {startup.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-semibold">{startup.name}</h4>
                        <p className="text-sm text-white/60 truncate">{startup.shortDescription}</p>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>

              {/* Top Finance */}
              <Card className="glass-card overflow-hidden border border-startupia-turquoise/20 bg-black/30">
                <div className="p-4 border-b border-startupia-turquoise/10">
                  <h3 className="text-xl font-bold flex items-center">
                    <Zap className="mr-2 text-startupia-turquoise" />
                    Top Finance
                  </h3>
                </div>
                <CardContent className="p-0">
                  {topFinanceStartups.map((startup, index) => (
                    <Link 
                      to={`/startup/${startup.id}`} 
                      key={startup.id}
                      className="flex items-center p-4 hover:bg-startupia-turquoise/10 border-b border-startupia-turquoise/10 last:border-b-0 transition-colors"
                    >
                      <span className="font-bold text-startupia-turquoise mr-4">#{index + 1}</span>
                      <div className="h-10 w-10 rounded-full bg-startupia-turquoise/10 overflow-hidden mr-4">
                        {startup.logoUrl ? (
                          <img 
                            src={startup.logoUrl} 
                            alt={`${startup.name} logo`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-lg font-bold text-startupia-turquoise">
                              {startup.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-semibold">{startup.name}</h4>
                        <p className="text-sm text-white/60 truncate">{startup.shortDescription}</p>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Levées de fonds Tab */}
          <TabsContent value="levees" className="pt-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center">
                <TrendingUp className="mr-2 text-startupia-turquoise" /> 
                Dernières levées de fonds IA
              </h2>
              <Button variant="outline" className="border-startupia-turquoise text-startupia-turquoise">
                Voir toutes <ArrowUpRight size={16} className="ml-2" />
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-startupia-turquoise/20">
                    <th className="py-3 px-2 text-left">Date</th>
                    <th className="py-3 px-2 text-left">Startup</th>
                    <th className="py-3 px-2 text-left">Montant</th>
                    <th className="py-3 px-2 text-left">Tour</th>
                    <th className="py-3 px-2 text-left">Investisseur principal</th>
                    <th className="py-3 px-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fundingRounds.map((round) => (
                    <tr key={round.id} className="border-b border-startupia-turquoise/10 hover:bg-startupia-turquoise/5">
                      <td className="py-3 px-2 text-white/70">
                        {formatDate(round.date)}
                      </td>
                      <td className="py-3 px-2">
                        <Link to={`/startup/${round.startupId}`} className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-startupia-turquoise/10 overflow-hidden mr-2">
                            {round.startupLogoUrl ? (
                              <img 
                                src={round.startupLogoUrl} 
                                alt={`${round.startupName} logo`}
                                className="w-full h-full object-cover" 
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-sm font-bold text-startupia-turquoise">
                                  {round.startupName.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>
                          <span>{round.startupName}</span>
                        </Link>
                      </td>
                      <td className="py-3 px-2 font-semibold text-startupia-turquoise">
                        {formatAmount(round.amount)}
                      </td>
                      <td className="py-3 px-2">
                        <Badge variant="outline" className="border-startupia-turquoise text-white">
                          {round.round}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-white/90">{round.mainInvestor}</td>
                      <td className="py-3 px-2">
                        <div className="flex space-x-2">
                          <a 
                            href={round.sourceUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-startupia-turquoise hover:text-white transition-colors"
                          >
                            <ArrowUpRight size={16} />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Alertes Tab */}
          <TabsContent value="alertes" className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell size={48} className="text-startupia-turquoise mb-4" />
              <h3 className="text-2xl font-bold mb-2">Alertes personnalisées</h3>
              <p className="text-white/70 mb-6 max-w-lg">
                Créez des alertes personnalisées pour suivre les nouvelles startups 
                IA selon vos critères et recevez des notifications par email.
              </p>
              <Button className="bg-startupia-turquoise hover:bg-startupia-turquoise/90">
                <Bell className="mr-2" size={16} />
                Fonctionnalité bientôt disponible
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RadarIA;
