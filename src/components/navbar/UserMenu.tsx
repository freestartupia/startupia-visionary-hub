
import React, { useState, useEffect } from 'react';
import { User, Bell, LogOut, Settings, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { checkUserHasRole } from '@/services/roleService';

interface UserMenuProps {
  isMobile?: boolean;
}

export const UserMenu: React.FC<UserMenuProps> = ({ isMobile = false }) => {
  const { user, signOut } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModerator, setIsModerator] = useState(false);

  // Check user roles and fetch user profile when user is logged in
  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      try {
        // Check if user has admin or moderator role
        const adminRole = await checkUserHasRole('admin');
        const moderatorRole = await checkUserHasRole('moderator');
        setIsAdmin(adminRole);
        setIsModerator(moderatorRole);
        
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!profileError && profileData) {
          setUserProfile(profileData);
        }

        // Fetch notifications
        const { data: notifData, error: notifError } = await supabase
          .from('match_notifications')
          .select('id')
          .eq('recipient_id', user.id)
          .eq('status', 'pending');

        if (notifError) {
          console.error('Error fetching notifications:', notifError);
          return;
        }

        setNotificationCount(notifData?.length || 0);
      } catch (error) {
        console.error('Error in user data fetch:', error);
      }
    };

    fetchUserData();

    // Set up realtime subscription for new notifications
    const channel = supabase
      .channel('match_notifications_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'match_notifications',
        filter: `recipient_id=eq.${user.id}`,
      }, () => {
        fetchUserData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
  };

  const getDisplayName = () => {
    if (userProfile?.first_name && userProfile?.last_name) {
      return `${userProfile.first_name} ${userProfile.last_name}`;
    }
    return user?.email?.split('@')[0] || 'Utilisateur';
  };
  
  const getInitials = () => {
    if (userProfile?.first_name && userProfile?.last_name) {
      return `${userProfile.first_name[0]}${userProfile.last_name[0]}`.toUpperCase();
    }
    return user?.email?.[0].toUpperCase() || 'U';
  };
  
  if (isMobile) {
    return (
      <div className="border-t border-white/10 pt-4 mt-2">
        <div className="flex justify-between items-center px-4 py-2">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-3">
              {userProfile?.avatar_url ? (
                <AvatarImage src={userProfile.avatar_url} alt={getDisplayName()} />
              ) : (
                <AvatarFallback className="bg-black text-white">
                  {getInitials()}
                </AvatarFallback>
              )}
            </Avatar>
            <span className="text-white/80 truncate">{getDisplayName()}</span>
          </div>
          <div className="relative">
            <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/10">
              <Bell size={18} />
            </Button>
            {notificationCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500">
                {notificationCount}
              </Badge>
            )}
          </div>
        </div>
        <div className="mt-2 space-y-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-white/80 hover:text-white hover:bg-white/5"
            asChild
          >
            <Link to="/profile">
              <User size={16} className="mr-2" />
              Mon profil
            </Link>
          </Button>
          
          {(isAdmin || isModerator) && (
            <Button 
              variant="ghost" 
              className="w-full justify-start text-white/80 hover:text-white hover:bg-white/5"
              asChild
            >
              <Link to="/admin">
                <Shield size={16} className="mr-2" />
                Administration
              </Link>
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-white/80 hover:text-white hover:bg-white/5"
            asChild
          >
            <Link to="/profile?tab=settings">
              <Settings size={16} className="mr-2" />
              Paramètres
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
            onClick={handleSignOut}
          >
            <LogOut size={16} className="mr-2" />
            Se déconnecter
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 ml-4">
      <div className="relative">
        <Link to="/profile">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 relative">
            <Bell size={20} />
            {notificationCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500">
                {notificationCount}
              </Badge>
            )}
          </Button>
        </Link>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="text-white hover:bg-white/10 rounded-full p-0 h-9 w-9">
            <Avatar>
              {userProfile?.avatar_url ? (
                <AvatarImage src={userProfile.avatar_url} alt={getDisplayName()} />
              ) : (
                <AvatarFallback className="bg-black text-white border border-white/20">
                  {getInitials()}
                </AvatarFallback>
              )}
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-black/90 backdrop-blur-lg border border-white/10 text-white">
          <DropdownMenuLabel className="font-normal">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                {userProfile?.avatar_url ? (
                  <AvatarImage src={userProfile.avatar_url} alt={getDisplayName()} />
                ) : (
                  <AvatarFallback className="bg-black text-white border border-white/20">
                    {getInitials()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <p className="font-medium truncate">{getDisplayName()}</p>
                <p className="text-xs text-white/60 truncate">{user?.email}</p>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem className="text-white/80 hover:text-white hover:bg-white/10 cursor-pointer">
            <Link to="/profile" className="flex w-full">
              <User className="mr-2 h-4 w-4" />
              <span>Profil</span>
              {notificationCount > 0 && (
                <Badge className="ml-2 bg-red-500">{notificationCount}</Badge>
              )}
            </Link>
          </DropdownMenuItem>
          
          {(isAdmin || isModerator) && (
            <DropdownMenuItem className="text-white/80 hover:text-white hover:bg-white/10 cursor-pointer">
              <Link to="/admin" className="flex w-full">
                <Shield className="mr-2 h-4 w-4" />
                <span>Administration</span>
              </Link>
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem className="text-white/80 hover:text-white hover:bg-white/10 cursor-pointer">
            <Link to="/profile?tab=settings" className="flex w-full">
              <Settings className="mr-2 h-4 w-4" />
              <span>Paramètres</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem onClick={handleSignOut} className="text-rose-500 hover:bg-rose-500/10 cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Se déconnecter</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
