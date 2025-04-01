
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

interface RankingsItem {
  id: number;
  name: string;
  avatar?: string;
  points: number;
  badge?: string;
  link?: string;
  description?: string;
}

interface RankingsListProps {
  items: RankingsItem[];
  showDescription?: boolean;
}

const RankingsList = ({ items, showDescription = false }: RankingsListProps) => {
  const handleClick = (id: number) => {
    // This would track affiliate link clicks in a real application
    console.log(`Tool ${id} affiliate link clicked`);
    // Could also use analytics service or backend API to track
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-black/40 border border-startupia-turquoise/10 hover:border-startupia-turquoise/30 transition-colors"
        >
          <div className="flex items-center gap-4 mb-3 sm:mb-0">
            <div className="text-xl font-bold text-white/60 w-6 text-center">
              {index + 1}
            </div>
            <Avatar>
              <AvatarImage src={item.avatar} alt={item.name} />
              <AvatarFallback>{item.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              {item.link ? (
                <Link 
                  to={item.link} 
                  className="font-medium hover:text-startupia-turquoise transition-colors flex items-center gap-1"
                  onClick={() => handleClick(item.id)}
                >
                  {item.name}
                  <ExternalLink size={14} className="text-startupia-turquoise/70" />
                </Link>
              ) : (
                <div className="font-medium">{item.name}</div>
              )}
              {item.badge && (
                <Badge variant="outline" className="mt-1 bg-startupia-turquoise/10 text-startupia-turquoise border-none">
                  {item.badge}
                </Badge>
              )}
              {showDescription && item.description && (
                <p className="text-sm text-white/70 mt-1 max-w-xl">{item.description}</p>
              )}
            </div>
          </div>
          <div className="text-lg font-bold text-startupia-turquoise ml-10 sm:ml-0">
            {item.points} pts
          </div>
        </div>
      ))}
    </div>
  );
};

export default RankingsList;
