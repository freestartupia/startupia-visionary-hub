
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ProfileCoFounderProfiles = () => {
  const navigate = useNavigate();
  const mockProfiles = [
    {
      id: '1',
      name: 'Développeur Full-Stack',
      profileType: 'collaborator',
      role: 'Développeur',
      sector: 'SaaS'
    },
    {
      id: '2',
      name: 'Startup IA Médicale',
      profileType: 'project-owner',
      role: 'Fondateur',
      sector: 'HealthTech'
    }
  ];

  return (
    <div className="glass-card p-4 md:p-6 rounded-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-xl font-semibold mb-4 md:mb-0">Vos profils cofondateur</h2>
        <Button onClick={() => navigate('/cofounder/create')} className="bg-startupia-turquoise hover:bg-startupia-turquoise/90 text-black w-full md:w-auto">
          <Plus size={16} className="mr-2" />
          Créer un profil
        </Button>
      </div>

      {mockProfiles.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-white/20 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Vous n'avez pas encore de profil cofondateur</h3>
          <p className="text-white/70 mb-4">Créez votre profil pour être mis en relation avec des partenaires potentiels.</p>
          <Button onClick={() => navigate('/cofounder/create')} className="bg-startupia-turquoise hover:bg-startupia-turquoise/90 text-black">
            <Plus size={16} className="mr-2" />
            Créer un profil
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {mockProfiles.map((profile) => (
            <div key={profile.id} className="border border-white/10 rounded-lg p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium">{profile.name}</h3>
                  <Badge 
                    variant="outline" 
                    className={
                      profile.profileType === 'project-owner'
                        ? 'border-startupia-gold/50 text-startupia-gold'
                        : 'border-startupia-turquoise/50 text-startupia-turquoise'
                    }
                  >
                    {profile.profileType === 'project-owner' ? 'Porteur de projet' : 'Collaborateur'}
                  </Badge>
                </div>
                <p className="text-sm text-white/70">{profile.role} • {profile.sector}</p>
              </div>
              
              <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                <Button 
                  variant="outline" 
                  className="flex-1 md:flex-none"
                  asChild
                >
                  <Link to={`/cofounder/edit/${profile.id}`}>
                    <Edit size={16} className="mr-2" />
                    Modifier
                  </Link>
                </Button>
                <Button 
                  variant="destructive"
                  className="flex-1 md:flex-none"
                >
                  <Trash2 size={16} className="mr-2" />
                  Supprimer
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileCoFounderProfiles;
