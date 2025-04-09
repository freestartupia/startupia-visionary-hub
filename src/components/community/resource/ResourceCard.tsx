
import React from 'react';
import { ExternalLink, ThumbsUp, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ResourceListing } from '@/types/community';

interface ResourceCardProps {
  resource: ResourceListing;
  getInitials: (name: string | null) => string;
  formatDate: (dateString: string) => string;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ 
  resource, 
  getInitials,
  formatDate 
}) => {
  return (
    <Card className="glass-card hover-scale transition-transform duration-300 flex flex-col h-full">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge>{resource.format}</Badge>
          <div className="flex items-center space-x-2">
            {resource.is_paid ? (
              <Badge variant="outline" className="text-yellow-300 border-yellow-300">
                {resource.price}
              </Badge>
            ) : (
              <Badge variant="outline" className="text-green-400 border-green-400">
                Gratuit
              </Badge>
            )}
            {resource.community_validated && (
              <Badge variant="secondary" className="flex items-center">
                <Users className="h-3 w-3 mr-1" />
                Validé
              </Badge>
            )}
          </div>
        </div>
        <h3 className="text-xl font-semibold">{resource.title}</h3>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-white/80 mb-4">{resource.description}</p>
        <div className="text-white/80">
          <strong>Public cible:</strong> {resource.target_audience}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 border-t border-white/10 pt-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={resource.author_avatar || undefined} alt={resource.author_name} />
              <AvatarFallback>{getInitials(resource.author_name)}</AvatarFallback>
            </Avatar>
            <div>
              <span className="text-sm font-medium">{resource.author_name}</span>
              <p className="text-xs text-white/60">{formatDate(resource.created_at)}</p>
            </div>
          </div>
          <div className="flex items-center">
            <ThumbsUp className="h-4 w-4 mr-1 text-white/60" />
            <span className="text-sm text-white/60">{resource.votes || 0}</span>
          </div>
        </div>
        <Button className="w-full" asChild>
          <a href={resource.access_link} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            Accéder à la ressource
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResourceCard;
