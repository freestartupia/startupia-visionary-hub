
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, MessageCircle, Award, MapPin, CalendarClock, Briefcase, Target, Sparkles } from 'lucide-react';
import { CofounderProfile } from '@/types/cofounders';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ProfileDetailProps {
  profile: CofounderProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onMatch: () => void;
}

const ProfileDetail = ({ profile, isOpen, onClose, onMatch }: ProfileDetailProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!profile) return null;

  const handleMatchRequest = () => {
    if (!user) {
      toast.error("Vous devez être connecté pour contacter un profil");
      navigate('/auth');
      return;
    }
    
    onMatch();
    toast.success("Demande de contact envoyée !");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl bg-gradient-to-b from-black to-gray-900 border-startupia-purple/20 overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            Profil {profile.profileType === 'project-owner' ? 'Porteur de projet' : 'Collaborateur'}
          </DialogTitle>
          <DialogDescription>
            Détails du profil et compétences
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {/* Left column - Photo and basic info */}
          <div className="space-y-4">
            <div className="flex flex-col items-center">
              {profile.photoUrl ? (
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-startupia-turquoise/30">
                  <img 
                    src={profile.photoUrl} 
                    alt={profile.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 bg-gradient-to-br from-startupia-light-purple to-startupia-turquoise rounded-full border-4 border-startupia-turquoise/30"></div>
              )}
              
              <h2 className="text-xl font-bold mt-3">{profile.name}</h2>
              <p className="text-white/70">{profile.role}</p>
              
              {profile.hasAIBadge && (
                <Badge className="mt-2 bg-gradient-to-r from-startupia-gold to-startupia-light-gold text-black">
                  <Award size={14} className="mr-1" />
                  Expertise IA
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-white/70">
                <MapPin size={16} className="mr-2" />
                <span>{profile.region}</span>
              </div>
              
              <div className="flex items-center text-white/70">
                <CalendarClock size={16} className="mr-2" />
                <span>{profile.availability}</span>
              </div>
              
              <div className="flex items-center text-white/70">
                <Briefcase size={16} className="mr-2" />
                <span>{profile.sector}</span>
              </div>
              
              <div className="flex items-center text-white/70">
                <Target size={16} className="mr-2" />
                <span>{profile.objective}</span>
              </div>
            </div>

            {/* External links */}
            <div className="space-y-2">
              {profile.linkedinUrl && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full border-white/20 justify-start"
                  onClick={() => window.open(profile.linkedinUrl, '_blank')}
                >
                  <ExternalLink size={14} className="mr-2" />
                  LinkedIn
                </Button>
              )}
              
              {profile.portfolioUrl && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full border-white/20 justify-start"
                  onClick={() => window.open(profile.portfolioUrl, '_blank')}
                >
                  <ExternalLink size={14} className="mr-2" />
                  Portfolio
                </Button>
              )}
              
              {profile.websiteUrl && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full border-white/20 justify-start"
                  onClick={() => window.open(profile.websiteUrl, '_blank')}
                >
                  <ExternalLink size={14} className="mr-2" />
                  Site web
                </Button>
              )}
            </div>
          </div>
          
          {/* Right column - Extended info */}
          <div className="md:col-span-2 space-y-6">
            {/* Project info for project owners */}
            {profile.profileType === 'project-owner' && profile.projectName && (
              <div className="glass-card p-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Sparkles className="mr-2 text-startupia-gold" size={18} />
                  Projet: {profile.projectName}
                </h3>
                {profile.projectStage && (
                  <Badge variant="secondary" className="mt-2 bg-black/20 text-white/70">
                    {profile.projectStage}
                  </Badge>
                )}
                
                {profile.seekingRoles && profile.seekingRoles.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-white/70 mb-2">Rôles recherchés:</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.seekingRoles.map((role) => (
                        <Badge key={role} variant="outline" className="bg-startupia-purple/20 border-startupia-purple/30">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Pitch */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Pitch</h3>
              <p className="text-white/80">{profile.pitch}</p>
            </div>
            
            {/* Vision */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Vision</h3>
              <p className="text-white/80">{profile.vision}</p>
            </div>
            
            {/* AI Tools */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Outils IA maîtrisés</h3>
              <div className="flex flex-wrap gap-2">
                {profile.aiTools.map((tool) => (
                  <Badge key={tool} variant="outline" className="border-startupia-turquoise/30 text-startupia-turquoise">
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Contact button */}
            <div className="pt-4">
              <Button 
                onClick={handleMatchRequest}
                className="w-full bg-startupia-turquoise hover:bg-startupia-turquoise/90 text-black"
              >
                <MessageCircle size={18} className="mr-2" />
                Contacter {profile.name}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDetail;
