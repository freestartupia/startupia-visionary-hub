
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProfileSettings from '@/components/profile/ProfileSettings';
import ProfileCoFounderProfiles from '@/components/profile/ProfileCoFounderProfiles';
import ProtectedRoute from '@/components/ProtectedRoute';

const UserProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('settings');

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setUserData(data);
      } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger votre profil",
          variant: "destructive",
        });
      }
    };

    fetchUserProfile();
  }, [user, toast]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-hero-pattern text-white">
        {/* Background elements */}
        <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
        <div className="absolute top-1/4 -left-40 w-96 h-96 bg-startupia-turquoise/30 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-startupia-turquoise/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        
        <div className="container mx-auto px-4 pt-32 pb-16 relative z-10">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="md:w-1/4">
              <div className="glass-card p-6 rounded-lg flex flex-col items-center">
                <Avatar className="w-24 h-24 mb-4 border-2 border-startupia-turquoise">
                  {user?.user_metadata?.avatar_url ? (
                    <AvatarImage src={user.user_metadata.avatar_url} alt={user.email || 'Utilisateur'} />
                  ) : (
                    <AvatarFallback className="bg-black text-white">
                      <User size={40} />
                    </AvatarFallback>
                  )}
                </Avatar>
                
                <h2 className="text-xl font-semibold mb-1">
                  {userData?.first_name && userData?.last_name 
                    ? `${userData.first_name} ${userData.last_name}`
                    : user?.email?.split('@')[0] || 'Utilisateur'}
                </h2>
                <p className="text-white/60 text-sm mb-4">{user?.email}</p>
                
                <div className="w-full space-y-2 mt-4">
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start ${activeTab === 'settings' ? 'bg-white/10' : ''}`}
                    onClick={() => setActiveTab('settings')}
                  >
                    Paramètres du compte
                  </Button>
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start ${activeTab === 'cofounder' ? 'bg-white/10' : ''}`}
                    onClick={() => setActiveTab('cofounder')}
                  >
                    Profils cofondateur
                  </Button>
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start ${activeTab === 'activity' ? 'bg-white/10' : ''}`}
                    onClick={() => setActiveTab('activity')}
                  >
                    Activité
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Main content */}
            <div className="md:w-3/4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full bg-black/20 mb-6">
                  <TabsTrigger value="settings" className="flex-1">Paramètres du compte</TabsTrigger>
                  <TabsTrigger value="cofounder" className="flex-1">Profils cofondateur</TabsTrigger>
                  <TabsTrigger value="activity" className="flex-1">Activité</TabsTrigger>
                </TabsList>
                
                <TabsContent value="settings">
                  <ProfileSettings userData={userData} />
                </TabsContent>
                
                <TabsContent value="cofounder">
                  <ProfileCoFounderProfiles />
                </TabsContent>
                
                <TabsContent value="activity">
                  <div className="glass-card p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Votre activité récente</h2>
                    <p className="text-white/70">Aucune activité récente à afficher.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default UserProfile;
