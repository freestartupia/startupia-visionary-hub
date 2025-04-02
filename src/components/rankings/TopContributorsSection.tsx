
import React from 'react';
import { Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import RankingsList from '@/components/rankings/RankingsList';

interface Contributor {
  id: number;
  name: string;
  avatar?: string;
  points: number;
  badge?: string;
}

interface TopContributorsSectionProps {
  contributors: Contributor[];
}

const TopContributorsSection = ({ contributors }: TopContributorsSectionProps) => {
  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <Award className="text-startupia-gold" />
        <h2 className="text-2xl font-bold">Top Contributeurs</h2>
      </div>
      <Card className="bg-black/50 border-startupia-turquoise/20">
        <CardContent>
          <RankingsList items={contributors} />
        </CardContent>
      </Card>
    </section>
  );
};

export default TopContributorsSection;
