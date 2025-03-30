
import React from 'react';
import { CofounderProfile } from '@/types/cofounders';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Briefcase, MapPin, Clock, Award, Rocket, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProfileCardProps {
  profile: CofounderProfile;
  onMatch: () => void;
}

const ProfileCard = ({ profile, onMatch }: ProfileCardProps) => {
  const {
    name,
    profileType,
    role,
    pitch,
    sector,
    objective,
    availability,
    region,
    photoUrl,
    hasAIBadge,
    projectName,
    projectStage
  } = profile;

  // Determine avatar fallback (initials from name)
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <Card className="glass-card overflow-hidden hover:shadow-lg transition-shadow hover:shadow-startupia-turquoise/10 border-startupia-turquoise/20">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-startupia-turquoise/30">
              <AvatarImage src={photoUrl} alt={name} />
              <AvatarFallback className="bg-startupia-turquoise/20">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{name}</h3>
              <div className="flex items-center text-sm text-white/70">
                {profileType === 'project-owner' ? (
                  <Rocket className="h-3.5 w-3.5 mr-1 text-startupia-turquoise" />
                ) : (
                  <User className="h-3.5 w-3.5 mr-1 text-startupia-turquoise" />
                )}
                <span>
                  {profileType === 'project-owner' ? 'Porteur de projet' : 'Collaborateur'} • {role}
                </span>
              </div>
            </div>
          </div>
          
          {hasAIBadge && (
            <Badge className="bg-startupia-turquoise text-black">
              <Award className="h-3 w-3 mr-1" /> AI Badge
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {projectName && (
          <div className="mb-3">
            <Badge variant="outline" className="border-startupia-turquoise/50 text-startupia-turquoise">
              {projectName}
              {projectStage && ` • ${projectStage}`}
            </Badge>
          </div>
        )}
        
        <p className="text-white/80 text-sm mb-4 line-clamp-3">{pitch}</p>
        
        <div className="grid grid-cols-2 gap-2 text-sm text-white/70">
          <div className="flex items-center gap-2">
            <Briefcase className="h-3.5 w-3.5 text-startupia-turquoise" />
            <span>{sector}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-startupia-turquoise" />
            <span>{region}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Rocket className="h-3.5 w-3.5 text-startupia-turquoise" />
            <span>{objective}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-startupia-turquoise" />
            <span>{availability}</span>
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="text-xs font-medium text-white/50 mb-1.5">Outils IA</h4>
          <div className="flex flex-wrap gap-1.5">
            {profile.aiTools.slice(0, 3).map((tool, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs py-0 border-white/20 text-white/60"
              >
                {tool}
              </Badge>
            ))}
            {profile.aiTools.length > 3 && (
              <Badge variant="outline" className="text-xs py-0 border-white/20 text-white/60">
                +{profile.aiTools.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={onMatch}
          className="w-full bg-startupia-turquoise hover:bg-startupia-turquoise/80 text-black"
        >
          <Heart className="h-4 w-4 mr-2" />
          Proposer un contact
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
