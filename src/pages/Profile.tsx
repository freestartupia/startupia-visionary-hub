
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Helmet } from 'react-helmet-async';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ProfileMatchRequests from '@/components/profile/ProfileMatchRequests';
import ProfileCoFounderProfiles from '@/components/profile/ProfileCoFounderProfiles';
import { Separator } from '@/components/ui/separator';

const Profile = () => {
  const { user, signOut, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="container mx-auto py-16 flex justify-center">
        <div className="animate-pulse w-full max-w-3xl">
          <div className="h-64 rounded-lg bg-gray-800/40 mb-8"></div>
          <div className="h-10 w-1/3 rounded bg-gray-800/40 mb-4"></div>
          <div className="h-24 rounded bg-gray-800/40"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  const getInitials = () => {
    if (!user.user_metadata) return 'U';
    const firstName = user.user_metadata.first_name || '';
    const lastName = user.user_metadata.last_name || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };

  return (
    <>
      <Helmet>
        <title>Profil utilisateur | Startupia.fr</title>
      </Helmet>
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar with user info */}
          <div className="lg:col-span-1">
            <Card className="bg-black border border-gray-800">
              <CardHeader className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-startupia-turquoise text-black text-2xl">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl text-center">
                  {user.user_metadata?.first_name} {user.user_metadata?.last_name}
                </CardTitle>
                <CardDescription className="text-center break-all">
                  {user.email}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <Link to="/settings">
                  <Button variant="outline" className="w-full justify-start">
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier mon profil
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-red-500 border-red-900/20 hover:bg-red-900/10"
                  onClick={() => signOut()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Se déconnecter
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            <Card className="bg-black border border-gray-800 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <User className="h-6 w-6" /> Votre Profil
                </CardTitle>
                <CardDescription>
                  Gérer vos informations personnelles et vos préférences
                </CardDescription>
              </CardHeader>
            </Card>

            <Tabs defaultValue="profiles" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="profiles">Mes Profils</TabsTrigger>
                <TabsTrigger value="matches">Mes Connections</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profiles">
                <ProfileCoFounderProfiles />
              </TabsContent>
              
              <TabsContent value="matches">
                <ProfileMatchRequests />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
