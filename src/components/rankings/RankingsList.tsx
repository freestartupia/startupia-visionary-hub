
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface RankingsItem {
  id: number;
  name: string;
  avatar?: string;
  points: number;
  badge?: string;
}

interface RankingsListProps {
  items: RankingsItem[];
}

const RankingsList = ({ items }: RankingsListProps) => {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="flex items-center justify-between p-4 rounded-lg bg-black/40 border border-startupia-turquoise/10 hover:border-startupia-turquoise/30 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="text-xl font-bold text-white/60 w-6 text-center">
              {index + 1}
            </div>
            <Avatar>
              <AvatarImage src={item.avatar} alt={item.name} />
              <AvatarFallback>{item.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{item.name}</div>
              {item.badge && (
                <Badge variant="outline" className="mt-1 bg-startupia-turquoise/10 text-startupia-turquoise border-none">
                  {item.badge}
                </Badge>
              )}
            </div>
          </div>
          <div className="text-lg font-bold text-startupia-turquoise">
            {item.points} pts
          </div>
        </div>
      ))}
    </div>
  );
};

export default RankingsList;
