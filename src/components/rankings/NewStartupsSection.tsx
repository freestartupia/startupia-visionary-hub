
import React from 'react';
import StartupCard from '@/components/StartupCard';
import { Rocket } from 'lucide-react';
import { Startup } from '@/types/startup';

interface NewStartupsSectionProps {
  newStartups: Startup[];
}

const NewStartupsSection = ({ newStartups }: NewStartupsSectionProps) => {
  return (
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
  );
};

export default NewStartupsSection;
