
import React from 'react';
import Footer from '@/components/Footer';
import { mockProductLaunches } from '@/data/mockProductLaunches';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import SEO from '@/components/SEO';
import Navbar from '@/components/navbar/Navbar';

// Type for startups
interface Startup {
  id: string;
  name: string;
  logoUrl?: string;
  shortDescription: string;
  viewCount?: number;
  maturityLevel?: string;
}

// Mock data for top startups
const mockStartups: Startup[] = [
  {
    id: "1",
    name: "IA Santé",
    shortDescription: "Solution IA pour le diagnostic médical",
    viewCount: 1200,
    maturityLevel: "MVP"
  },
  {
    id: "2",
    name: "RH Vision",
    shortDescription: "Recrutement optimisé par IA",
    viewCount: 950,
    maturityLevel: "Seed"
  },
  {
    id: "3",
    name: "FinTech IA",
    shortDescription: "Analyse financière automatisée",
    viewCount: 2300,
    maturityLevel: "Série A"
  }
];

// Simple RankingsTabContent component that doesn't rely on the removed components
const RankingsTabContent = ({ 
  isDemo = false
}: { 
  isDemo?: boolean 
}) => {
  // Top voted startups
  const topStartups = [...mockStartups]
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 3);
    
  // New promising startups
  const newStartups = [...mockStartups]
    .filter(s => s.maturityLevel === 'MVP' || s.maturityLevel === 'Seed')
    .slice(0, 3);
    
  // Top AI tools from product launches
  const topTools = [...mockProductLaunches]
    .sort((a, b) => b.upvotes - a.upvotes)
    .slice(0, 3);

  // Top contributors (hardcoded)
  const topContributors = [
    { id: 1, name: 'Sophie Martin', avatar: 'https://i.pravatar.cc/150?img=1', points: 245, badge: '🏆 Expert' },
    { id: 2, name: 'Thomas Dubois', avatar: 'https://i.pravatar.cc/150?img=12', points: 198, badge: '🔥 Power User' },
    { id: 3, name: 'Julie Leroy', avatar: 'https://i.pravatar.cc/150?img=5', points: 156, badge: '⚡️ Actif' },
    { id: 4, name: 'Antoine Bernard', avatar: 'https://i.pravatar.cc/150?img=8', points: 132, badge: '👨‍💻 Contributeur' }
  ];

  return (
    <div className={`${isDemo ? 'opacity-60' : ''}`}>
      {isDemo && (
        <div className="text-center mb-8 p-3 rounded-md bg-startupia-turquoise/10 border border-startupia-turquoise/20">
          <p>Données de démonstration uniquement. Les classements réels seront bientôt disponibles.</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Top Startups Section */}
        <div className="glass-card border border-startupia-turquoise/20 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">🔥 Top Startups</h3>
          <div className="space-y-4">
            {topStartups.map((startup, index) => (
              <div key={startup.id} className="flex items-center gap-3 p-3 bg-black/20 rounded-md">
                <div className="text-xl font-bold text-startupia-turquoise w-6">#{index + 1}</div>
                <div className="h-10 w-10 rounded-full bg-startupia-turquoise/10 flex items-center justify-center">
                  {startup.logoUrl ? (
                    <img src={startup.logoUrl} alt={startup.name} className="rounded-full" />
                  ) : (
                    <span className="text-lg font-bold text-startupia-turquoise">{startup.name[0]}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{startup.name}</h4>
                  <p className="text-xs text-white/60 truncate">{startup.shortDescription}</p>
                </div>
                <div className="text-sm text-white/80">{startup.viewCount} vues</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* New Startups Section */}
        <div className="glass-card border border-startupia-turquoise/20 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">✨ Nouveaux Projets Prometteurs</h3>
          <div className="space-y-4">
            {newStartups.map((startup) => (
              <div key={startup.id} className="flex items-center gap-3 p-3 bg-black/20 rounded-md">
                <div className="h-10 w-10 rounded-full bg-startupia-turquoise/10 flex items-center justify-center">
                  {startup.logoUrl ? (
                    <img src={startup.logoUrl} alt={startup.name} className="rounded-full" />
                  ) : (
                    <span className="text-lg font-bold text-startupia-turquoise">{startup.name[0]}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{startup.name}</h4>
                  <p className="text-xs text-white/60 truncate">{startup.shortDescription}</p>
                </div>
                <div className="text-xs px-2 py-1 bg-startupia-turquoise/20 rounded-full">{startup.maturityLevel}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Top Contributors Section */}
        <div className="glass-card border border-startupia-turquoise/20 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">👑 Top Contributeurs</h3>
          <div className="space-y-4">
            {topContributors.map((user) => (
              <div key={user.id} className="flex items-center gap-3 p-3 bg-black/20 rounded-md">
                <div className="h-10 w-10 rounded-full bg-startupia-turquoise/10 overflow-hidden">
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{user.name}</h4>
                  <div className="text-xs text-white/60">{user.badge}</div>
                </div>
                <div className="text-sm font-semibold text-startupia-turquoise">{user.points} pts</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Top AI Tools Section */}
      <div className="glass-card border border-startupia-turquoise/20 p-6 rounded-lg mb-10">
        <h3 className="text-xl font-bold mb-4">🛠 Top Outils IA</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {topTools.map((tool) => (
            <div key={tool.id} className="p-4 bg-black/20 rounded-lg border border-white/10 hover:border-startupia-turquoise/30 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-startupia-turquoise/10 flex items-center justify-center overflow-hidden">
                  {tool.logo_url ? (
                    <img src={tool.logo_url} alt={tool.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg font-bold text-startupia-turquoise">{tool.name[0]}</span>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold">{tool.name}</h4>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-white/60">{tool.upvotes}</span>
                    <span className="text-xs text-white/60">upvotes</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-white/80 line-clamp-2">{tool.tagline}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Simple RankingsHeader component
const RankingsHeader = ({ title, subtitle }: { title: string, subtitle: string }) => (
  <div className="text-center mb-10">
    <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
      {title}
    </h1>
    <p className="text-xl text-white/80 max-w-3xl mx-auto">
      {subtitle}
    </p>
  </div>
);

const Rankings = () => {
  const { toast } = useToast();
  
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
            <RankingsTabContent />
          </TabsContent>
          
          {/* Monthly content */}
          <TabsContent value="monthly">
            <RankingsTabContent isDemo={true} />
          </TabsContent>
          
          {/* All time content */}
          <TabsContent value="alltime">
            <RankingsTabContent isDemo={true} />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Rankings;
