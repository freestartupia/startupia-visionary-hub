
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

  // Fetch user avatar from profiles table if this is the current user's profile
  useEffect(() => {
    const fetchUserAvatar = async () => {
      if (user && profile.user_id === user.id) {
        try {
          console.log("Fetching avatar for user:", user.id);
          const { data, error } = await supabase
            .from('profiles')
            .select('avatar_url')
            .eq('id', user.id)
            .single();
          
          if (error) {
            console.error("Error fetching avatar:", error);
          } else if (data && data.avatar_url) {
            console.log("Found avatar URL:", data.avatar_url);
            setUserAvatar(data.avatar_url);
          } else {
            console.log("No avatar URL found in profiles table");
          }
        } catch (error) {
          console.error("Exception fetching user avatar:", error);
        }
      } else {
        console.log("Not fetching avatar - user condition not met:", 
          user ? "User logged in" : "No user", 
          profile.user_id === user?.id ? "Profile belongs to user" : "Profile doesn't belong to user");
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

  // Debug current avatar state
  console.log("Avatar rendering state:", {
    userAvatar,
    photoUrl: profile.photoUrl,
    userId: user?.id,
    profileUserId: profile.user_id,
    isCurrentUser: user?.id === profile.user_id
  });

  return (
    <>
      <div 
        className="glass-card p-4 sm:p-6 rounded-lg flex flex-col h-full cursor-pointer hover:border-startupia-turquoise/50 transition-all"
        onClick={() => setShowDetail(true)}
      >
        {/* Header with photo and name */}
        <div className="flex items-center mb-4">
          <Avatar className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
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
            <AvatarFallback className="bg-gradient-to-br from-startupia-light-purple to-startupia-turquoise text-white">
              {getInitials(profile.name)}
            </AvatarFallback>
          </Avatar>
          <div className="ml-3 min-w-0">
            <div className="flex items-center flex-wrap gap-2">
              <h3 className="font-semibold text-base sm:text-lg truncate">{profile.name}</h3>
              {profile.hasAIBadge && (
                <Badge className="bg-gradient-to-r from-startupia-gold to-startupia-light-gold text-black text-xs">
                  <Award size={12} className="mr-1" />
                  Expertise IA
                </Badge>
              )}
            </div>
            <p className="text-xs sm:text-sm text-white/70 truncate">{profile.role}</p>
          </div>
        </div>
        
        {/* Profile type badge */}
        <Badge 
          variant="outline" 
          className={`self-start mb-3 text-xs ${
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
            <h4 className="font-medium text-xs sm:text-sm text-white/50">Projet</h4>
            <p className="text-white font-medium text-sm truncate">{profile.projectName}</p>
            {profile.projectStage && (
              <Badge variant="secondary" className="mt-1 bg-black/20 text-white/70 text-xs">
                {profile.projectStage}
              </Badge>
            )}
          </div>
        )}
        
        {/* Pitch - limit to 3 lines with ellipsis */}
        <p className="text-xs sm:text-sm text-white/80 mb-4 flex-grow overflow-hidden line-clamp-3">
          {profile.pitch}
        </p>
        
        {/* Skills and Tags */}
        <div className="mb-4 flex flex-wrap gap-2">
          {/* Sector */}
          <Badge variant="outline" className="border-startupia-turquoise/30 text-startupia-turquoise text-xs">
            {profile.sector}
          </Badge>
          
          {/* AI Tools - limit to 2 on mobile, 3 on desktop */}
          {profile.aiTools.slice(0, isMobile ? 2 : 3).map((tool) => (
            <Badge key={tool} variant="outline" className="border-white/20 text-xs">
              {tool}
            </Badge>
          ))}
          
          {/* More badge if many tools */}
          {profile.aiTools.length > (isMobile ? 2 : 3) && (
            <Badge variant="outline" className="bg-white/5 text-xs">
              +{profile.aiTools.length - (isMobile ? 2 : 3)}
            </Badge>
          )}
        </div>
        
        {/* Info and location */}
        <div className="flex justify-between items-center mb-4 text-xs">
          <div className="text-white/60 truncate max-w-[60%]">{profile.availability}</div>
          <div className="text-white/60 truncate">{profile.region}</div>
        </div>
        
        {/* Action buttons */}
        <div className="flex space-x-2 mt-auto" onClick={(e) => e.stopPropagation()}>
          <Button 
            onClick={handleMatchRequest}
            className="flex-1 bg-startupia-turquoise hover:bg-startupia-turquoise/90 text-black text-xs sm:text-sm px-2 sm:px-4"
            size={isMobile ? "sm" : "default"}
          >
            <MessageCircle size={isMobile ? 14 : 16} className="mr-1" />
            Contact
          </Button>
          
          {profile.linkedinUrl && (
            <Button 
              variant="outline" 
              className="px-2 border-white/20"
              size={isMobile ? "sm" : "default"}
              onClick={(e) => {
                e.stopPropagation();
                window.open(profile.linkedinUrl, '_blank');
              }}
            >
              <ExternalLink size={isMobile ? 14 : 16} />
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
