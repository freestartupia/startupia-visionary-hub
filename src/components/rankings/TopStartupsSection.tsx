
import React from 'react';
import { Card } from '@/components/ui/card';
import { Trophy, Star, ArrowUp } from 'lucide-react';
import { fetchStartups } from '@/services/startupService';
import { useEffect, useState } from 'react';
import { Startup } from '@/types/startup';
import { Link } from 'react-router-dom';

const TopStartupsSection = () => {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTopStartups = async () => {
      try {
        const data = await fetchStartups();
        setStartups(data.slice(0, 5)); // Prendre les 5 premières
      } catch (error) {
        console.error('Erreur lors du chargement des startups:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTopStartups();
  }, []);

  if (isLoading) {
    return (
      <Card className="p-6 bg-black/30 border-startupia-turquoise/20">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Trophy className="text-startupia-turquoise" size={20} />
          Top Startups IA
        </h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center gap-3">
              <div className="w-8 h-8 bg-startupia-turquoise/10 rounded-md"></div>
              <div className="flex-1 h-5 bg-startupia-turquoise/10 rounded"></div>
              <div className="w-10 h-5 bg-startupia-turquoise/10 rounded"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-black/30 border-startupia-turquoise/20">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Trophy className="text-startupia-turquoise" size={20} />
        Top Startups IA
      </h3>
      
      <div className="space-y-4">
        {startups.length > 0 ? (
          startups.map((startup, index) => (
            <Link 
              key={startup.id} 
              to={`/startup/${startup.id}`}
              className="flex items-center justify-between py-2 hover:bg-white/5 px-2 rounded-md transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-white/50 font-medium min-w-6">#{index + 1}</span>
                <div className="w-8 h-8 bg-black rounded-md overflow-hidden flex items-center justify-center border border-white/10">
                  {startup.logoUrl ? (
                    <img src={startup.logoUrl} alt={startup.name} className="w-full h-full object-contain p-1" />
                  ) : (
                    <span className="text-xs font-bold">{startup.name[0]}</span>
                  )}
                </div>
                <span className="font-medium truncate max-w-[150px]">{startup.name}</span>
              </div>
              
              <div className="flex items-center text-startupia-turquoise gap-1">
                <ArrowUp size={14} />
                <span className="text-sm font-medium">{startup.upvotes}</span>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-4 text-white/50">
            Aucune startup trouvée
          </div>
        )}
      </div>
    </Card>
  );
};

export default TopStartupsSection;
