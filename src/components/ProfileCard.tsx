
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, MessageCircle, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CofounderProfile } from '@/types/cofounders';
import { toast } from 'sonner';
import ProfileDetail from './ProfileDetail';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useMediaQuery } from '@/hooks/use-mobile';

interface ProfileCardProps {
  profile: CofounderProfile;
  onMatch: () => void;
}

const ProfileCard = ({ profile, onMatch }: ProfileCardProps) => {
  const [showDetail, setShowDetail] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 640px)');

  // Fetch user avatar from profiles table
  useEffect(() => {
    const fetchUserAvatar = async () => {
      if (!user) return;
      
      try {
        // First check if this is current user's profile by user_id
        const isCurrentUserProfile = profile.user_id === user.id;
        
        if (isCurrentUserProfile) {
          console.log("This is current user's profile, fetching avatar for:", user.id);
          
          // Fetch avatar from profiles table
          const { data, error } = await supabase
            .from('profiles')
            .select('avatar_url')
            .eq('id', user.id)
            .single();
          
          if (error) {
            console.error("Error fetching avatar from profiles:", error);
          } else if (data && data.avatar_url) {
            console.log("Found avatar URL in profiles:", data.avatar_url);
            setUserAvatar(data.avatar_url);
          } else {
            console.log("No avatar found in profiles table for current user");
          }
        } else {
          console.log("Not current user's profile, skipping avatar fetch");
        }
      } catch (error) {
        console.error("Exception fetching user avatar:", error);
      }
    };
    
    fetchUserAvatar();
  }, [user, profile.user_id]);

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
        className="glass-card p-3 sm:p-5 rounded-lg flex flex-col h-full cursor-pointer hover:border-startupia-turquoise/50 transition-all"
        onClick={() => setShowDetail(true)}
      >
        {/* Header with photo and name */}
        <div className="flex items-center mb-3">
          <Avatar className="w-10 h-10 sm:w-14 sm:h-14 flex-shrink-0">
            {userAvatar ? (
              <AvatarImage 
                src={userAvatar} 
                alt={profile.name} 
                className="object-cover"
              />
            ) : profile.photoUrl && profile.photoUrl.trim() !== "" ? (
              <AvatarImage 
                src={profile.photoUrl} 
                alt={profile.name}
                className="object-cover"
              />
            ) : null}
            <AvatarFallback className="bg-gradient-to-br from-startupia-light-purple to-startupia-turquoise text-white text-xs sm:text-sm">
              {getInitials(profile.name)}
            </AvatarFallback>
          </Avatar>
          <div className="ml-2 sm:ml-3 min-w-0 flex-1">
            <div className="flex items-center flex-wrap gap-1 sm:gap-2">
              <h3 className="font-semibold text-sm sm:text-base truncate">{profile.name}</h3>
              {profile.hasAIBadge && (
                <Badge className="bg-gradient-to-r from-startupia-gold to-startupia-light-gold text-black text-[10px] sm:text-xs">
                  <Award size={10} className="mr-1" />
                  Expertise IA
                </Badge>
              )}
            </div>
            <p className="text-[10px] sm:text-xs text-white/70 truncate">{profile.role}</p>
          </div>
        </div>
        
        {/* Profile type badge */}
        <Badge 
          variant="outline" 
          className={`self-start mb-2 text-[10px] sm:text-xs ${
            profile.profileType === 'project-owner'
              ? 'border-startupia-gold/50 text-startupia-gold'
              : 'border-startupia-purple/50 text-startupia-purple'
          }`}
        >
          {profile.profileType === 'project-owner' ? 'Porteur de projet' : 'Collaborateur'}
        </Badge>
        
        {/* Project name if applicable */}
        {profile.profileType === 'project-owner' && profile.projectName && (
          <div className="mb-2">
            <h4 className="font-medium text-[10px] sm:text-xs text-white/50">Projet</h4>
            <p className="text-white font-medium text-xs sm:text-sm truncate">{profile.projectName}</p>
            {profile.projectStage && (
              <Badge variant="secondary" className="mt-1 bg-black/20 text-white/70 text-[10px] sm:text-xs">
                {profile.projectStage}
              </Badge>
            )}
          </div>
        )}
        
        {/* Pitch - limit to 3 lines with ellipsis */}
        <p className="text-[10px] sm:text-xs text-white/80 mb-3 flex-grow overflow-hidden line-clamp-3">
          {profile.pitch}
        </p>
        
        {/* Skills and Tags */}
        <div className="mb-3 flex flex-wrap gap-1 sm:gap-2">
          {/* Sector */}
          <Badge variant="outline" className="border-startupia-turquoise/30 text-startupia-turquoise text-[10px] sm:text-xs">
            {profile.sector}
          </Badge>
          
          {/* AI Tools - limit to 1 on mobile, 2 on desktop */}
          {profile.aiTools.slice(0, isMobile ? 1 : 2).map((tool) => (
            <Badge key={tool} variant="outline" className="border-white/20 text-[10px] sm:text-xs">
              {tool}
            </Badge>
          ))}
          
          {/* More badge if many tools */}
          {profile.aiTools.length > (isMobile ? 1 : 2) && (
            <Badge variant="outline" className="bg-white/5 text-[10px] sm:text-xs">
              +{profile.aiTools.length - (isMobile ? 1 : 2)}
            </Badge>
          )}
        </div>
        
        {/* Info and location */}
        <div className="flex justify-between items-center mb-3 text-[10px] sm:text-xs">
          <div className="text-white/60 truncate max-w-[60%]">{profile.availability}</div>
          <div className="text-white/60 truncate">{profile.region}</div>
        </div>
        
        {/* Action buttons */}
        <div className="flex space-x-1 sm:space-x-2 mt-auto" onClick={(e) => e.stopPropagation()}>
          <Button 
            onClick={handleMatchRequest}
            className="flex-1 bg-startupia-turquoise hover:bg-startupia-turquoise/90 text-black text-[10px] sm:text-xs px-1 sm:px-3"
            size={isMobile ? "sm" : "default"}
          >
            <MessageCircle size={isMobile ? 12 : 14} className="mr-1" />
            Contact
          </Button>
          
          {profile.linkedinUrl && (
            <Button 
              variant="outline" 
              className="px-1 sm:px-2 border-white/20"
              size={isMobile ? "sm" : "default"}
              onClick={(e) => {
                e.stopPropagation();
                window.open(profile.linkedinUrl, '_blank');
              }}
            >
              <ExternalLink size={isMobile ? 12 : 14} />
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
