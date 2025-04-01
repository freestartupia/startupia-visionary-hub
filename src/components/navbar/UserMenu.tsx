
import React, { useState, useEffect } from 'react';
import { User, Bell, LogOut, Settings } from 'lucide-react';
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

interface UserMenuProps {
  isMobile?: boolean;
}

export const UserMenu: React.FC<UserMenuProps> = ({ isMobile = false }) => {
  const { user, signOut } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);

  // Fetch notifications count when user is logged in
  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from('match_notifications')
          .select('id')
          .eq('recipient_id', user.id)
          .eq('status', 'pending');

        if (error) {
          console.error('Error fetching notifications:', error);
          return;
        }

        setNotificationCount(data?.length || 0);
      } catch (error) {
        console.error('Error in notification fetch:', error);
      }
    };

    fetchNotifications();

    // Set up realtime subscription for new notifications
    const channel = supabase
      .channel('match_notifications_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'match_notifications',
        filter: `recipient_id=eq.${user.id}`,
      }, () => {
        fetchNotifications();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
  };
  
  if (isMobile) {
    return (
      <div className="border-t border-white/10 pt-4 mt-2">
        <div className="flex justify-between items-center px-4 py-2">
          <span className="text-white/80 truncate">{user?.email}</span>
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
          <Button variant="ghost" className="w-full justify-start text-white/80 hover:text-white hover:bg-white/5">
            <Settings size={16} className="mr-2" />
            Paramètres
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
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
          <Bell size={20} />
        </Button>
        {notificationCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500">
            {notificationCount}
          </Badge>
        )}
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
            <User size={20} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-black/90 backdrop-blur-lg border border-white/10 text-white">
          <DropdownMenuLabel className="font-normal">
            <div className="font-medium truncate">{user?.email}</div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem className="text-white/80 hover:text-white hover:bg-white/10 cursor-pointer">
            <Link to="/profile" className="flex w-full">
              <User className="mr-2 h-4 w-4" />
              <span>Profil</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-white/80 hover:text-white hover:bg-white/10 cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Paramètres</span>
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
