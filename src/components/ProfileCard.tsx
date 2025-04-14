
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, MessageCircle, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CofounderProfile } from '@/types/cofounders';
import { toast } from 'sonner';
import ProfileDetail from './ProfileDetail';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface ProfileCardProps {
  profile: CofounderProfile;
  onMatch: () => void;
}

const ProfileCard = ({ profile, onMatch }: ProfileCardProps) => {
  const [showDetail, setShowDetail] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleMatchRequest = () => {
    if (!user) {
      toast.error("Vous devez être connecté pour contacter un profil");
      navigate('/auth');
      return;
    }
    onMatch();
    toast.success("Demande de contact envoyée !");
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <>
      <div 
        className="glass-card p-6 rounded-lg flex flex-col h-full cursor-pointer hover:border-startupia-turquoise/50 transition-all"
        onClick={() => setShowDetail(true)}
      >
        {/* Header with photo and name */}
        <div className="flex items-center mb-4">
          <Avatar className="w-16 h-16">
            {profile.photoUrl && profile.photoUrl.trim() !== "" ? (
              <AvatarImage 
                src={profile.photoUrl} 
                alt={profile.name}
                className="object-cover"
              />
            ) : null}
            <AvatarFallback className="bg-gradient-to-br from-startupia-light-purple to-startupia-turquoise text-white">
              {getInitials(profile.name)}
            </AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <div className="flex items-center">
              <h3 className="font-semibold text-lg">{profile.name}</h3>
              {profile.hasAIBadge && (
                <Badge className="ml-2 bg-gradient-to-r from-startupia-gold to-startupia-light-gold text-black text-xs">
                  <Award size={12} className="mr-1" />
                  Expertise IA
                </Badge>
              )}
            </div>
            <p className="text-sm text-white/70">{profile.role}</p>
          </div>
        </div>
        
        {/* Profile type badge */}
        <Badge 
          variant="outline" 
          className={`self-start mb-3 ${
            profile.profileType === 'project-owner'
              ? 'border-startupia-gold/50 text-startupia-gold'
              : 'border-startupia-purple/50 text-startupia-purple'
          }`}
        >
          {profile.profileType === 'project-owner' ? 'Porteur de projet' : 'Collaborateur'}
        </Badge>
        
        {/* Project name if applicable */}
        {profile.profileType === 'project-owner' && profile.projectName && (
          <div className="mb-3">
            <h4 className="font-medium text-sm text-white/50">Projet</h4>
            <p className="text-white font-medium">{profile.projectName}</p>
            {profile.projectStage && (
              <Badge variant="secondary" className="mt-1 bg-black/20 text-white/70">
                {profile.projectStage}
              </Badge>
            )}
          </div>
        )}
        
        {/* Pitch */}
        <p className="text-white/80 mb-4 flex-grow">{profile.pitch}</p>
        
        {/* Skills and Tags */}
        <div className="mb-4">
          {/* Sector */}
          <Badge variant="outline" className="mr-2 mb-2 border-startupia-turquoise/30 text-startupia-turquoise">
            {profile.sector}
          </Badge>
          
          {/* AI Tools */}
          {profile.aiTools.slice(0, 3).map((tool) => (
            <Badge key={tool} variant="outline" className="mr-2 mb-2 border-white/20">
              {tool}
            </Badge>
          ))}
          
          {/* More badge if many tools */}
          {profile.aiTools.length > 3 && (
            <Badge variant="outline" className="mr-2 mb-2 bg-white/5">
              +{profile.aiTools.length - 3}
            </Badge>
          )}
        </div>
        
        {/* Info and location */}
        <div className="flex justify-between items-center mb-4 text-sm">
          <div className="text-white/60">{profile.availability}</div>
          <div className="text-white/60">{profile.region}</div>
        </div>
        
        {/* Action buttons */}
        <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
          <Button 
            onClick={handleMatchRequest}
            className="flex-1 bg-startupia-turquoise hover:bg-startupia-turquoise/90 text-black"
          >
            <MessageCircle size={16} className="mr-2" />
            Contact
          </Button>
          
          {profile.linkedinUrl && (
            <Button 
              variant="outline" 
              className="px-2 border-white/20"
              onClick={(e) => {
                e.stopPropagation();
                window.open(profile.linkedinUrl, '_blank');
              }}
            >
              <ExternalLink size={16} />
            </Button>
          )}
        </div>
      </div>
      
      <ProfileDetail
        profile={profile}
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        onMatch={onMatch}
      />
    </>
  );
};

export default ProfileCard;
