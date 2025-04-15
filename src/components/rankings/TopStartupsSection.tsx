import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowBigUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Startup } from '@/types/startup';

interface TopStartupsSectionProps {
  startups: Startup[];
}

const TopStartupsSection = ({ startups }: TopStartupsSectionProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 gradient-text">
        <ArrowBigUp className="h-6 w-6" />
        Startups les Plus Votées
      </h2>
      <div className="space-y-6">
        {startups.slice(0, 3).map(startup => (
          <div key={startup.id} className="glass-card border border-white/10 p-4 rounded-lg flex items-center justify-between hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-black/30 rounded-lg overflow-hidden border border-white/10 flex items-center justify-center">
                {startup.logoUrl ? (
                  <img
                    src={startup.logoUrl}
                    alt={startup.name}
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <div className="text-xl font-bold text-white/70">{startup.name[0]}</div>
                )}
              </div>
              <div>
                <h3 className="font-bold">{startup.name}</h3>
                <p className="text-white/60">{startup.shortDescription}</p>
                <div className="flex gap-2 mt-1">
                  <Badge variant="outline" className="border-white/20 text-white">{startup.category}</Badge>
                  {startup.aiTechnology && (
                    <Badge variant="outline" className="border-white/20 text-white">{startup.aiTechnology}</Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a href={startup.websiteUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 text-white/50 hover:text-white/80 transition-colors" />
              </a>
              <Link
                to={`/startup/${startup.id}`}
                className="text-sm text-white/50 hover:text-white/80 transition-colors"
              >
                Découvrir <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopStartupsSection;
