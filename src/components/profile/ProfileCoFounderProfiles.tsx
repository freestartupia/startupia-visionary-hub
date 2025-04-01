
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { CofounderProfile } from '@/types/cofounders';
import { supabase } from '@/integrations/supabase/client';

const ProfileCoFounderProfiles = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<CofounderProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserProfiles = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('cofounder_profiles')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        // TODO: Correctement convertir les données DB en CofounderProfile
        setProfiles(data as unknown as CofounderProfile[] || []);
      } catch (error) {
        console.error('Error fetching user profiles:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfiles();
  }, [user]);
  
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-48 bg-gray-800/40 rounded-lg"></div>
        <div className="h-48 bg-gray-800/40 rounded-lg"></div>
      </div>
    );
  }
  
  return (
    <Card className="border border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Mes profils de cofondateur</CardTitle>
          <CardDescription>
            Gérez vos profils pour trouver des collaborateurs
          </CardDescription>
        </div>
        <Link to="/cofounders">
          <Button className="bg-startupia-turquoise text-black hover:bg-startupia-turquoise/90">
            <Plus className="h-4 w-4 mr-2" />
            Créer un profil
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {profiles.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-12 w-12 mx-auto text-gray-500 mb-4" />
            <h3 className="text-lg font-medium">Aucun profil</h3>
            <p className="text-gray-400 mt-2 mb-6">
              Vous n'avez pas encore créé de profil de cofondateur
            </p>
            <Link to="/cofounders">
              <Button className="bg-startupia-turquoise text-black hover:bg-startupia-turquoise/90">
                <Plus className="h-4 w-4 mr-2" />
                Créer mon premier profil
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profiles.map(profile => (
              <Card key={profile.id} className="bg-black/50 border-gray-800 hover:border-gray-700 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    {profile.photoUrl ? (
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-startupia-turquoise/30">
                        <img 
                          src={profile.photoUrl} 
                          alt={profile.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-startupia-light-purple to-startupia-turquoise rounded-full flex items-center justify-center text-xl font-bold">
                        {profile.name.charAt(0)}
                      </div>
                    )}
                    
                    <div>
                      <h3 className="font-medium text-lg">{profile.name}</h3>
                      <p className="text-gray-400">{profile.role}</p>
                      
                      <div className="mt-2">
                        <span className="text-xs bg-gray-800 px-2 py-1 rounded-full mr-2">
                          {profile.profileType === 'project-owner' ? 'Porteur de projet' : 'Collaborateur'}
                        </span>
                        <span className="text-xs bg-startupia-purple/30 px-2 py-1 rounded-full">
                          {profile.sector}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" className="flex-1" asChild>
                      <Link to={`/cofounders/edit/${profile.id}`}>
                        Modifier
                      </Link>
                    </Button>
                    <Button 
                      variant="secondary" 
                      className="flex-1 bg-startupia-turquoise/10 hover:bg-startupia-turquoise/20 text-startupia-turquoise" 
                      asChild
                    >
                      <Link to={`/cofounders?profile=${profile.id}`}>
                        Voir les matchs
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileCoFounderProfiles;
