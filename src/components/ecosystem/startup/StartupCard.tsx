
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Startup } from '@/types/startup';
import VoteButtons from './VoteButtons';

interface StartupCardProps {
  startup: Startup;
  index: number;
}

const StartupCard = ({ startup, index }: StartupCardProps) => {
  return (
    <div className="relative">
      <Link to={`/startup/${startup.id}`} className="block hover:no-underline">
        <Card className="hover:border-startupia-turquoise/50 transition-all duration-300 border border-startupia-turquoise/20 bg-black/30">
          <div className="flex items-center p-5">
            <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 mr-4 relative">
              <div className="w-full h-full rounded-full bg-startupia-turquoise/10 flex items-center justify-center overflow-hidden">
                {startup.logoUrl ? (
                  <img src={startup.logoUrl} alt={`${startup.name} logo`} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-bold text-startupia-turquoise">{startup.name.charAt(0)}</span>
                )}
              </div>
              <div className="absolute -top-2 -left-2 flex items-center justify-center h-6 w-6 bg-startupia-turquoise text-black font-bold rounded-full text-xs">
                {index + 1}
              </div>
            </div>
            
            <div className="flex-grow mr-8">
              <div className="mb-1.5">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-lg font-bold text-white">{startup.name}</h3>
                </div>
                <p className="text-white/80 text-sm mb-1.5 line-clamp-1">{startup.shortDescription}</p>
                <p className="text-white/60 text-xs mb-2">
                  {startup.sector}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </Link>
      
      {/* Vote buttons overlay */}
      <VoteButtons startupId={startup.id} />
    </div>
  );
};

export default StartupCard;
