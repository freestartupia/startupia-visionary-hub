
import React from 'react';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockStartups } from '@/data/mockStartups';
import { mockProductLaunches } from '@/data/mockProductLaunches';
import StartupCard from '@/components/StartupCard';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Rocket, TrendingUp, Award } from 'lucide-react';
import { incrementValue, supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import ProductList from '@/components/productLaunch/ProductList';
import { ChartContainer } from '@/components/ui/chart';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import RankingsList from '@/components/rankings/RankingsList';

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

  // Simulated startup data trends for the chart
  const startupTrendsData = [
    { date: '2023-10', count: 15 },
    { date: '2023-11', count: 18 },
    { date: '2023-12', count: 22 },
    { date: '2024-01', count: 28 },
    { date: '2024-02', count: 31 },
    { date: '2024-03', count: 35 },
    { date: '2024-04', count: 42 },
    { date: '2024-05', count: 48 }
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
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      
      <Navbar />
      
      <main className="container mx-auto pt-24 pb-16 px-4 relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Classements & <span className="text-startupia-turquoise">Tendances</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Découvrez les startups et outils IA français qui font l'actualité
          </p>
        </div>
        
        <Tabs defaultValue="weekly" className="mb-10">
          <div className="flex justify-center mb-6">
            <TabsList>
              <TabsTrigger value="weekly">Cette semaine</TabsTrigger>
              <TabsTrigger value="monthly">Ce mois</TabsTrigger>
              <TabsTrigger value="alltime">Tout temps</TabsTrigger>
            </TabsList>
          </div>

          {/* The content will be the same for all tabs in this demo */}
          <TabsContent value="weekly" className="space-y-10">
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Trophy className="text-startupia-gold" />
                <h2 className="text-2xl font-bold">Top Startups les plus votées</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {topStartups.map((startup, index) => (
                  <div key={startup.id} className="relative">
                    {index === 0 && (
                      <div className="absolute -top-4 -left-4 z-10">
                        <Badge variant="outline" className="bg-startupia-gold text-black border-none px-3 py-1 flex items-center gap-1">
                          <Trophy size={14} />
                          <span>N°1</span>
                        </Badge>
                      </div>
                    )}
                    <StartupCard startup={startup} />
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center mt-6">
                <a href="/ecosystem" className="text-startupia-turquoise hover:underline">
                  Voir toutes les startups →
                </a>
              </div>
            </section>
            
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Rocket className="text-startupia-turquoise" />
                <h2 className="text-2xl font-bold">Nouvelles startups prometteuses</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {newStartups.map((startup) => (
                  <StartupCard key={startup.id} startup={startup} />
                ))}
              </div>
            </section>
            
            <section>
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="text-startupia-turquoise" />
                <h2 className="text-2xl font-bold">Évolution des startups IA françaises</h2>
              </div>
              <Card className="bg-black/50 border-startupia-turquoise/20">
                <CardContent className="pt-6">
                  <ChartContainer
                    config={{
                      startups: {
                        label: "Nouvelles startups",
                        theme: {
                          light: "#2EDBA0",
                          dark: "#2EDBA0",
                        },
                      }
                    }}
                    className="h-72"
                  >
                    <AreaChart data={startupTrendsData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stackId="1"
                        stroke="var(--color-startups)"
                        fill="var(--color-startups)"
                        fillOpacity={0.2}
                        name="startups"
                      />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </section>
            
            <section>
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="text-startupia-turquoise" />
                <h2 className="text-2xl font-bold">Top Outils IA</h2>
              </div>
              <ProductList products={topTools} />
              <div className="flex justify-center mt-6">
                <a href="/ecosystem" className="text-startupia-turquoise hover:underline">
                  Voir tous les outils →
                </a>
              </div>
            </section>
            
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Award className="text-startupia-gold" />
                <h2 className="text-2xl font-bold">Top Contributeurs</h2>
              </div>
              <Card className="bg-black/50 border-startupia-turquoise/20">
                <CardContent>
                  <RankingsList items={topContributors} />
                </CardContent>
              </Card>
            </section>
          </TabsContent>

          <TabsContent value="monthly">
            <div className="text-center py-10">
              <p className="text-white/70 mb-4">Même contenu que l'onglet "Cette semaine" pour la démo</p>
            </div>
          </TabsContent>
          
          <TabsContent value="alltime">
            <div className="text-center py-10">
              <p className="text-white/70 mb-4">Même contenu que l'onglet "Cette semaine" pour la démo</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Rankings;
