
import React from 'react';
import { Startup } from '@/types/startup';
import StartupCard from './StartupCard';

interface StartupListProps {
  startups: Startup[];
}

const StartupList = ({ startups }: StartupListProps) => {
  return (
    <div className="space-y-4">
      {startups.map((startup, index) => (
        <StartupCard 
          key={startup.id}
          startup={startup}
          index={index}
        />
      ))}
    </div>
  );
};

export default StartupList;
