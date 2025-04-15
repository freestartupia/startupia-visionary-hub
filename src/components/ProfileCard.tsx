
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, MessageCircle, Award, Mail, Linkedin } from 'lucide-react';
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
      try {
        // Fetch avatar from profiles table using the profile.user_id
        if (profile.user_id) {
          const { data, error } = await supabase
            .from('profiles')
            .select('avatar_url')
            .eq('id', profile.user_id)
            .single();
          
          if (error) {
            console.error("Error fetching avatar from profiles:", error);
          } else if (data && data.avatar_url) {
            console.log("Found avatar URL in profiles:", data.avatar_url);
            setUserAvatar(data.avatar_url);
          }
        }
      } catch (error) {
        console.error("Exception fetching user avatar:", error);
      }
    };
    
    fetchUserAvatar();
  }, [profile.user_id]);

  const handleMatchRequest = () => {
    if (!user) {
      toast.error("Vous devez être connecté pour contacter un profil");
      navigate('/auth');
      return;
    }
    
    // Check if the profile has a preferred contact method
    if (!profile.contactMethod) {
      toast.error("Ce profil n'a pas spécifié de méthode de contact");
      return;
    }
    
    // Handle contact based on the preferred method
    handleContact();
    onMatch();
  };
  
  // Handle contact based on preferred method
  const handleContact = () => {
    if (!profile.contactMethod) return;
    
    switch (profile.contactMethodType) {
      case 'linkedin':
        if (profile.linkedinUrl) {
          window.open(profile.linkedinUrl, '_blank');
          toast.success("Redirection vers LinkedIn");
        } else {
          toast.error("Lien LinkedIn non disponible");
        }
        break;
      case 'email':
        if (profile.contactMethod.includes('@')) {
          window.open(`mailto:${profile.contactMethod}`, '_blank');
          toast.success("Ouverture de votre client mail");
        } else {
          toast.error("Adresse email non valide");
        }
        break;
      default:
        // For other methods (phone, social media, etc.)
        toast.success(`Méthode de contact: ${profile.contactMethod}`);
        navigator.clipboard.writeText(profile.contactMethod)
          .then(() => toast.success("Coordonnées copiées dans le presse-papier"))
          .catch(() => toast.error("Impossible de copier les coordonnées"));
    }
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

  // Determine if this is a project owner or collaborator
  const isProjectOwner = profile.profileType === 'project-owner';
  
  // Set color scheme based on profile type
  const profileTypeColor = isProjectOwner
    ? 'border-startupia-gold/50 text-startupia-gold bg-startupia-gold/10'
    : 'border-startupia-turquoise/50 text-startupia-turquoise bg-startupia-turquoise/10';
  
  const cardBorderColor = isProjectOwner
    ? 'hover:border-startupia-gold/50'
    : 'hover:border-startupia-turquoise/50';

  // Determine contact icon based on preferred method
  const getContactIcon = () => {
    if (!profile.contactMethodType) return <MessageCircle size={isMobile ? 12 : 14} className="mr-1" />;
    
    switch (profile.contactMethodType) {
      case 'linkedin':
        return <Linkedin size={isMobile ? 12 : 14} className="mr-1" />;
      case 'email':
        return <Mail size={isMobile ? 12 : 14} className="mr-1" />;
      default:
        return <MessageCircle size={isMobile ? 12 : 14} className="mr-1" />;
    }
  };

  return (
    <>
      <div 
        className={`glass-card p-3 sm:p-5 rounded-lg flex flex-col h-full cursor-pointer ${cardBorderColor} transition-all ${isProjectOwner ? 'border-t-2 border-t-startupia-gold' : 'border-t-2 border-t-startupia-turquoise'}`}
        onClick={() => setShowDetail(true)}
      >
        {/* Profile type badge - more prominent and positioned at top */}
        <Badge 
          variant="outline" 
          className={`self-start mb-3 text-[10px] sm:text-xs font-semibold py-1 px-2 ${profileTypeColor}`}
        >
          {isProjectOwner ? 'Recherche associé(s)' : 'Cherche à rejoindre un projet'}
        </Badge>
        
        {/* Header with photo and name */}
        <div className="flex items-center mb-3">
          <Avatar className="w-10 h-10 sm:w-14 sm:h-14 flex-shrink-0">
            {userAvatar ? (
              <AvatarImage 
                src={userAvatar} 
                alt={profile.name} 
                className="object-cover"
              />
            ) : profile.photoUrl ? (
              <AvatarImage 
                src={profile.photoUrl} 
                alt={profile.name}
                className="object-cover"
              />
            ) : null}
            <AvatarFallback className={`text-white text-xs sm:text-sm ${isProjectOwner ? 'bg-gradient-to-br from-startupia-gold to-startupia-deep-gold' : 'bg-gradient-to-br from-startupia-turquoise to-startupia-deep-turquoise'}`}>
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
        
        {/* Project name if applicable */}
        {isProjectOwner && profile.projectName && (
          <div className="mb-2">
            <h4 className="font-medium text-[10px] sm:text-xs text-white/50">Projet</h4>
            <p className="text-white font-medium text-xs sm:text-sm truncate">{profile.projectName}</p>
            {profile.projectStage && (
              <Badge variant="secondary" className={`mt-1 text-[10px] sm:text-xs ${isProjectOwner ? 'bg-startupia-gold/10 text-startupia-gold' : 'bg-black/20 text-white/70'}`}>
                {profile.projectStage}
              </Badge>
            )}
          </div>
        )}
        
        {/* Roles being sought - only for project owners */}
        {isProjectOwner && profile.seekingRoles && profile.seekingRoles.length > 0 && (
          <div className="mb-2">
            <h4 className="font-medium text-[10px] sm:text-xs text-white/50">Recherche</h4>
            <div className="flex flex-wrap gap-1 mt-1">
              {profile.seekingRoles.map((role, index) => (
                <Badge key={index} variant="outline" className="border-startupia-gold/30 text-startupia-gold text-[9px] sm:text-[10px]">
                  {role}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Pitch - limit to 3 lines with ellipsis */}
        <p className="text-[10px] sm:text-xs text-white/80 mb-3 flex-grow overflow-hidden line-clamp-3">
          {profile.pitch}
        </p>
        
        {/* Skills and Tags */}
        <div className="mb-3 flex flex-wrap gap-1 sm:gap-2">
          {/* Sector */}
          <Badge variant="outline" className={`text-[10px] sm:text-xs ${isProjectOwner ? 'border-startupia-gold/30 text-startupia-gold' : 'border-startupia-turquoise/30 text-startupia-turquoise'}`}>
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
            className={`flex-1 text-black text-[10px] sm:text-xs px-1 sm:px-3 ${isProjectOwner ? 'bg-startupia-gold hover:bg-startupia-gold/90' : 'bg-startupia-turquoise hover:bg-startupia-turquoise/90'}`}
            size={isMobile ? "sm" : "default"}
          >
            {getContactIcon()}
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
