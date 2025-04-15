
import React from 'react';
import TopStartupsSection from './TopStartupsSection';
import NewStartupsSection from './NewStartupsSection';
import TopToolsSection from './TopToolsSection';
import TopContributorsSection from './TopContributorsSection';
import { Startup } from '@/types/startup';

interface RankingsTabContentProps {
  topStartups: Startup[];
  newStartups: Startup[];
  topAIToolsWithAffiliates: Array<{
    id: number;
    name: string;
    avatar?: string;
    points: number;
    badge?: string;
    link?: string;
    description?: string;
  }>;
  topContributors: Array<{
    id: number;
    name: string;
    avatar?: string;
    points: number;
    badge?: string;
  }>;
  isDemo?: boolean;
}

const RankingsTabContent = ({ 
  topStartups, 
  newStartups, 
  topAIToolsWithAffiliates, 
  topContributors,
  isDemo = false 
}: RankingsTabContentProps) => {
  if (isDemo) {
    return (
      <div className="text-center py-10">
        <p className="text-white/70 mb-4">Même contenu que l'onglet "Cette semaine" pour la démo</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-10">
      <TopStartupsSection startups={topStartups} />
      <NewStartupsSection newStartups={newStartups} />
      <TopToolsSection tools={topAIToolsWithAffiliates} />
      <TopContributorsSection contributors={topContributors} />
    </div>
  );
};

export default RankingsTabContent;
