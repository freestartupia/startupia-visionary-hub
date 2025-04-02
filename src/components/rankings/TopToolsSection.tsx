
import React from 'react';
import { TrendingUp, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import RankingsList from '@/components/rankings/RankingsList';

interface Tool {
  id: number;
  name: string;
  avatar?: string;
  points: number;
  badge?: string;
  link?: string;
  description?: string;
}

interface TopToolsSectionProps {
  tools: Tool[];
}

const TopToolsSection = ({ tools }: TopToolsSectionProps) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="text-startupia-turquoise" />
          <h2 className="text-2xl font-bold">Top Outils IA</h2>
        </div>
        <Link to="/tools" className="text-startupia-turquoise hover:underline flex items-center">
          Voir tous les outils
          <ExternalLink className="ml-1 h-4 w-4" />
        </Link>
      </div>
      
      <Card className="bg-black/50 border-startupia-turquoise/20">
        <CardContent className="pt-6">
          <RankingsList items={tools} showDescription={true} />
          
          <div className="mt-6 flex justify-center">
            <Button asChild variant="outline" className="border-startupia-turquoise text-startupia-turquoise">
              <Link to="/tools">
                Explorer tous les outils IA
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default TopToolsSection;
