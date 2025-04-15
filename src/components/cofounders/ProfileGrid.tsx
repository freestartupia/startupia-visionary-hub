
import React from 'react';
import { CofounderProfile } from '@/types/cofounders';
import ProfileCard from '@/components/ProfileCard';

interface ProfileGridProps {
  profiles: CofounderProfile[];
  onMatch: (profileId: string) => void;
}

const ProfileGrid: React.FC<ProfileGridProps> = ({ profiles, onMatch }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {profiles.map((profile) => (
        <ProfileCard 
          key={profile.id} 
          profile={profile} 
          onMatch={() => onMatch(profile.id)}
        />
      ))}
    </div>
  );
};

export default ProfileGrid;
