
import React, { useState } from 'react';
import { Startup } from '@/types/startup';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import StartupCard from '@/components/StartupCard';
import { mockStartups } from '@/data/mockStartups';

export interface DirectoryViewProps {
  searchQuery: string;
}

const DirectoryView: React.FC<DirectoryViewProps> = ({ searchQuery }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [startups, setStartups] = useState<Startup[]>(mockStartups);
  
  // Filter startups based on search query
  const filteredStartups = startups.filter(startup => {
    if (searchQuery && searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      return (
        startup.name.toLowerCase().includes(query) ||
        startup.shortDescription.toLowerCase().includes(query) ||
        startup.tags.some(tag => tag.toLowerCase().includes(query)) ||
        (startup.founders && startup.founders.some(founder => 
          founder.name.toLowerCase().includes(query)
        ))
      );
    }
    return true;
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="glass-card border border-startupia-turquoise/20 bg-black/30">
            <div className="p-4 flex items-center border-b border-startupia-turquoise/10">
              <Skeleton className="h-10 w-10 rounded-md" />
              <div className="ml-3">
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <div className="p-4">
              <Skeleton className="h-4 w-full mb-3" />
              <Skeleton className="h-3 w-3/4 mb-2" />
              <div className="flex gap-1 mt-4">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (filteredStartups.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">Aucune startup trouvée</h3>
        <p className="text-white/70 mb-4">Essayez de modifier vos critères de recherche</p>
        <Button variant="outline" onClick={() => setStartups(mockStartups)}>
          Réinitialiser les filtres
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredStartups.map(startup => (
        <StartupCard key={startup.id} startup={startup} />
      ))}
    </div>
  );
};

export default DirectoryView;
