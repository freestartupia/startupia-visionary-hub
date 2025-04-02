
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, Settings, Users, Clock, ArrowLeft, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProfileSettings from '@/components/profile/ProfileSettings';
import ProfileCoFounderProfiles from '@/components/profile/ProfileCoFounderProfiles';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

const UserProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('settings');
  const [notificationCount, setNotificationCount] = useState(0);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        setUserData(profileData);

        // Fetch notification count
        const { data: notifData, error: notifError } = await supabase
          .from('match_notifications')
          .select('id')
          .eq('recipient_id', user.id)
          .eq('status', 'pending');
          
        if (!notifError) {
          setNotificationCount(notifData?.length || 0);
        }

        // Fetch recent activity (simplified for demo)
        const { data: activityData, error: activityError } = await supabase
          .from('community_activities')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (!activityError && activityData) {
          setRecentActivity(activityData);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger votre profil",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
    
    // Set up real-time subscription for notifications
    const notificationChannel = supabase
      .channel('notifications_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'match_notifications',
        filter: `recipient_id=eq.${user?.id}`,
      }, () => {
        // Refresh notifications count on changes
        fetchNotificationCount();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(notificationChannel);
    };
  }, [user, toast]);

  const fetchNotificationCount = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('match_notifications')
        .select('id')
        .eq('recipient_id', user.id)
        .eq('status', 'pending');

      if (!error) {
        setNotificationCount(data?.length || 0);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  const formatActivityDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit', 
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hero-pattern">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-startupia-turquoise"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-hero-pattern text-white">
        {/* Background elements */}
        <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
        <div className="absolute top-1/4 -left-40 w-96 h-96 bg-startupia-turquoise/30 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-startupia-turquoise/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        
        <div className="container mx-auto px-4 pt-32 pb-16 relative z-10">
          <Button 
            variant="ghost" 
            onClick={goBack}
            className="mb-6 text-white/80 hover:text-white"
            size="sm"
          >
            <ArrowLeft size={16} className="mr-2" />
            Retour
          </Button>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="md:w-1/4">
              <div className="glass-card p-6 rounded-lg flex flex-col items-center">
                <div className="relative">
                  <Avatar className="w-24 h-24 mb-4 border-2 border-startupia-turquoise">
                    {userData?.avatar_url ? (
                      <AvatarImage src={userData.avatar_url} alt={user?.email || 'Utilisateur'} />
                    ) : (
                      <AvatarFallback className="bg-black text-white">
                        {userData?.first_name && userData?.last_name 
                          ? `${userData.first_name[0]}${userData.last_name[0]}`
                          : <User size={40} />
                        }
                      </AvatarFallback>
                    )}
                  </Avatar>
                  {notificationCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-red-500">{notificationCount}</Badge>
                  )}
                </div>
                
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
                    <Settings className="mr-2 h-4 w-4" /> Paramètres du compte
                  </Button>
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start ${activeTab === 'cofounder' ? 'bg-white/10' : ''}`}
                    onClick={() => setActiveTab('cofounder')}
                  >
                    <Users className="mr-2 h-4 w-4" /> Profils cofondateur
                    {notificationCount > 0 && (
                      <Badge className="ml-2 bg-red-500">{notificationCount}</Badge>
                    )}
                  </Button>
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start ${activeTab === 'activity' ? 'bg-white/10' : ''}`}
                    onClick={() => setActiveTab('activity')}
                  >
                    <Clock className="mr-2 h-4 w-4" /> Activité
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Main content */}
            <div className="md:w-3/4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full bg-black/20 mb-6">
                  <TabsTrigger value="settings" className="flex-1">
                    <Settings className="mr-2 h-4 w-4 md:hidden" />
                    <span className="hidden md:inline">Paramètres du compte</span>
                    <span className="md:hidden">Paramètres</span>
                  </TabsTrigger>
                  <TabsTrigger value="cofounder" className="flex-1 relative">
                    <Users className="mr-2 h-4 w-4 md:hidden" />
                    <span className="hidden md:inline">Profils cofondateur</span>
                    <span className="md:hidden">Profils</span>
                    {notificationCount > 0 && (
                      <Badge className="ml-2 bg-red-500 absolute -top-2 -right-2 md:hidden">{notificationCount}</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="activity" className="flex-1">
                    <Clock className="mr-2 h-4 w-4 md:hidden" />
                    <span className="hidden md:inline">Activité récente</span>
                    <span className="md:hidden">Activité</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="settings">
                  <ProfileSettings userData={userData} />
                </TabsContent>
                
                <TabsContent value="cofounder">
                  <ProfileCoFounderProfiles />
                </TabsContent>
                
                <TabsContent value="activity">
                  <div className="glass-card p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <Clock className="mr-2" /> Votre activité récente
                    </h2>
                    
                    {recentActivity && recentActivity.length > 0 ? (
                      <div className="space-y-4">
                        {recentActivity.map((activity) => (
                          <Card key={activity.id} className="p-4 bg-black/20 border-white/10">
                            <div className="flex items-start gap-3">
                              <div className="bg-startupia-turquoise/20 p-2 rounded-full">
                                <Clock size={16} className="text-startupia-turquoise" />
                              </div>
                              <div className="flex-1">
                                <p className="text-white/90">{activity.title}</p>
                                <p className="text-white/60 text-sm">{activity.summary}</p>
                                <p className="text-xs text-white/40 mt-1">
                                  {formatActivityDate(activity.created_at)}
                                </p>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-white/60">
                        <Bell className="mx-auto h-12 w-12 opacity-20 mb-2" />
                        <p>Aucune activité récente à afficher.</p>
                        <p className="text-sm mt-2">
                          Vos interactions sur la plateforme apparaîtront ici.
                        </p>
                      </div>
                    )}
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
