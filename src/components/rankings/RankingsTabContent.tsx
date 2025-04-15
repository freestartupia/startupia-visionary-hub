import React from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import TopContributorsSection from './TopContributorsSection';
import TopStartupsSection from './TopStartupsSection';
import TopToolsSection from './TopToolsSection';
import NewStartupsSection from './NewStartupsSection';
import { Startup } from '@/types/startup';

interface RankingsTabContentProps {
  activeTab: string;
  startups?: Startup[];
}

const RankingsTabContent = ({ activeTab, startups = [] }: RankingsTabContentProps) => {
  return (
    <Tabs defaultValue={activeTab} className="w-full">
      <TabsContent value="startups" className="mt-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Top Startups IA</h2>
            <p className="text-white/70 mb-6">
              Les startups IA les plus populaires auprès de la communauté Startupia, basées sur les votes des utilisateurs.
            </p>
            <div className="space-y-4">
              {startups.slice(0, 10).map((startup, index) => (
                <div key={startup.id} className="glass-card border border-white/10 p-4 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="text-xl font-bold text-white/40 w-8">#{index + 1}</div>
                    <div className="h-12 w-12 rounded-md bg-startupia-turquoise/10 flex items-center justify-center overflow-hidden">
                      {startup.logoUrl ? (
                        <img 
                          src={startup.logoUrl} 
                          alt={`${startup.name} logo`} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <span className="text-lg font-bold text-startupia-turquoise">
                          {startup.name[0]}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold">{startup.name}</h3>
                      <p className="text-sm text-white/60 line-clamp-1">{startup.shortDescription}</p>
                    </div>
                    <div className="text-startupia-turquoise font-bold flex items-center gap-1">
                      <span>{startup.upvotes}</span>
                      <span className="text-xs text-white/60">votes</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-8">
            <TopStartupsSection />
            <NewStartupsSection />
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="tools" className="mt-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Top Outils IA</h2>
            <p className="text-white/70 mb-6">
              Les outils IA les plus populaires et les plus utilisés par la communauté Startupia.
            </p>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((index) => (
                <div key={index} className="glass-card border border-white/10 p-4 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="text-xl font-bold text-white/40 w-8">#{index}</div>
                    <div className="h-12 w-12 rounded-md bg-startupia-turquoise/10 flex items-center justify-center">
                      <span className="text-lg font-bold text-startupia-turquoise">T</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold">Outil IA #{index}</h3>
                      <p className="text-sm text-white/60">Description de l'outil IA</p>
                    </div>
                    <div className="text-startupia-turquoise font-bold flex items-center gap-1">
                      <span>{Math.floor(Math.random() * 100) + 50}</span>
                      <span className="text-xs text-white/60">utilisateurs</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-8">
            <TopToolsSection />
            <TopContributorsSection />
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="community" className="mt-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Top Contributeurs</h2>
            <p className="text-white/70 mb-6">
              Les membres les plus actifs de la communauté Startupia, qui contribuent à l'enrichissement de la plateforme.
            </p>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((index) => (
                <div key={index} className="glass-card border border-white/10 p-4 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="text-xl font-bold text-white/40 w-8">#{index}</div>
                    <div className="h-12 w-12 rounded-full bg-startupia-turquoise/10 flex items-center justify-center overflow-hidden">
                      <span className="text-lg font-bold text-startupia-turquoise">U</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold">Utilisateur #{index}</h3>
                      <p className="text-sm text-white/60">Membre depuis {new Date().getFullYear() - Math.floor(Math.random() * 3)}</p>
                    </div>
                    <div className="text-startupia-turquoise font-bold flex items-center gap-1">
                      <span>{Math.floor(Math.random() * 50) + 10}</span>
                      <span className="text-xs text-white/60">contributions</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-8">
            <TopContributorsSection />
            <TopStartupsSection />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default RankingsTabContent;
