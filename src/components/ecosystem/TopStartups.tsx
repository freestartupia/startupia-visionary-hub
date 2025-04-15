
import React from "react";
import { TrendingUp } from "lucide-react";
import { Startup } from "@/types/startup";
import StartupCard from "@/components/StartupCard";

interface TopStartupsProps {
  startups: Startup[];
  onUpvote?: (startupId: string, newCount: number) => void;
}

const TopStartups = ({ startups, onUpvote }: TopStartupsProps) => {
  if (!startups || startups.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="flex items-center mb-4">
        <TrendingUp size={20} className="mr-2 text-startupia-gold" />
        <h2 className="text-2xl font-bold">Top Startups</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {startups.map((startup) => (
          <StartupCard 
            key={startup.id} 
            startup={startup} 
            onUpvote={onUpvote}
          />
        ))}
      </div>
    </section>
  );
};

export default TopStartups;
