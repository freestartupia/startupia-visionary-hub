
import React from 'react';
import StartupCard from '@/components/StartupCard';
import { Badge } from '@/components/ui/badge';
import { Trophy, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Startup } from '@/types/startup';

interface TopStartupsSectionProps {
  topStartups: Startup[];
}

const TopStartupsSection = ({ topStartups }: TopStartupsSectionProps) => {
  return (
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
        <Link to="/ecosystem" className="text-startupia-turquoise hover:underline inline-flex items-center">
          Voir toutes les startups 
          <ExternalLink className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </section>
  );
};

export default TopStartupsSection;
