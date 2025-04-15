
import React from 'react';
import { Startup } from '@/types/startup';
import TopStartupsSection from './TopStartupsSection';
import TopToolsSection from './TopToolsSection';
import TopContributorsSection from './TopContributorsSection';
import NewStartupsSection from './NewStartupsSection';
import { Tool } from '@/types/tools';
import { Contributor } from '@/types/community';

export interface RankingsTabContentProps {
  activeTab: 'top' | 'trending' | 'featured';
  startups?: Startup[];
  tools?: Tool[];
  contributors?: Contributor[];
  newStartups?: Startup[];
}

const RankingsTabContent: React.FC<RankingsTabContentProps> = ({ 
  activeTab,
  startups = [],
  tools = [],
  contributors = [],
  newStartups = []
}) => {
  if (activeTab === 'top') {
    return (
      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold mb-6">Top Startups IA</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {startups.slice(0, 6).map(startup => (
              <div key={startup.id} className="glass-card p-4 rounded-lg">
                <h3 className="font-bold text-lg">{startup.name}</h3>
                <p className="text-sm text-white/70">{startup.shortDescription}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Startups Récentes</h2>
          <NewStartupsSection newStartups={newStartups} />
        </section>
      </div>
    );
  }

  if (activeTab === 'trending') {
    return (
      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold mb-6">Projets Tendance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {startups.slice(0, 6).map(startup => (
              <div key={startup.id} className="glass-card p-4 rounded-lg">
                <h3 className="font-bold text-lg">{startup.name}</h3>
                <p className="text-sm text-white/70">{startup.shortDescription}</p>
              </div>
            ))}
          </div>
        </section>
        
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-bold mb-6">Outils Populaires</h2>
            <TopToolsSection tools={tools} />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-6">Top Contributeurs</h2>
            <TopContributorsSection contributors={contributors} />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-2xl font-bold mb-6">Projets en Vedette</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {startups.slice(0, 3).map(startup => (
            <div key={startup.id} className="glass-card p-4 rounded-lg">
              <h3 className="font-bold text-lg">{startup.name}</h3>
              <p className="text-sm text-white/70">{startup.shortDescription}</p>
            </div>
          ))}
        </div>
      </section>
      
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-2xl font-bold mb-6">Top Contributeurs</h2>
          <TopContributorsSection contributors={contributors} />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-6">Startups Récentes</h2>
          <NewStartupsSection newStartups={newStartups} />
        </div>
      </section>
    </div>
  );
};

export default RankingsTabContent;
