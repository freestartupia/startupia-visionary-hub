
import React from 'react';
import { Heart, Users } from 'lucide-react';
import { CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProjectCardFooterProps {
  initiatorName: string;
  initiatorAvatar?: string;
  createdAt: string;
  likes: number;
  applications: number;
  onLike: () => void;
  onContact: () => void;
  onViewDetails: () => void;
}

const ProjectCardFooter: React.FC<ProjectCardFooterProps> = ({
  initiatorName,
  initiatorAvatar,
  createdAt,
  likes,
  applications,
  onLike,
  onContact,
  onViewDetails,
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <CardFooter className="flex flex-col gap-4 border-t border-white/10 pt-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={initiatorAvatar} alt={initiatorName} />
            <AvatarFallback>{getInitials(initiatorName)}</AvatarFallback>
          </Avatar>
          <div>
            <span className="text-sm font-medium">{initiatorName}</span>
            <p className="text-xs text-white/60">{formatDate(createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            className="flex items-center text-white/60 hover:text-white transition-colors"
            onClick={onLike}
          >
            <Heart className="h-4 w-4 mr-1" />
            <span className="text-sm">{likes || 0}</span>
          </button>
          <div className="flex items-center text-white/60">
            <Users className="h-4 w-4 mr-1" />
            <span className="text-sm">{applications}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2 w-full">
        <Button 
          variant="outline" 
          className="flex-1 h-10"
          onClick={onViewDetails}
        >
          En savoir plus
        </Button>
        <Button 
          className="flex-1 h-10"
          onClick={onContact}
        >
          Contacter
        </Button>
      </div>
    </CardFooter>
  );
};

export default ProjectCardFooter;
