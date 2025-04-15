
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Settings, LogOut } from 'lucide-react';
import NotificationsDropdown from './NotificationsDropdown';

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  // If no user is logged in, return nothing
  if (!user) return null;

  // Extract user info
  const email = user.email || '';
  const firstName = user.user_metadata?.first_name || '';
  const lastName = user.user_metadata?.last_name || '';
  const fullName = `${firstName} ${lastName}`.trim() || email;
  const initials = firstName && lastName 
    ? `${firstName[0]}${lastName[0]}`.toUpperCase() 
    : email ? email[0].toUpperCase() : 'U';
  const avatarUrl = user.user_metadata?.avatar_url;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <div className="flex items-center gap-2">
      <NotificationsDropdown />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="p-0 h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8 border border-white/20">
              <AvatarImage src={avatarUrl} alt={fullName} />
              <AvatarFallback className="bg-startupia-turquoise/20 text-startupia-turquoise">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-black border border-white/20">
          <div className="p-2 text-center">
            <p className="font-medium">{fullName}</p>
            <p className="text-xs text-white/60">{email}</p>
          </div>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem 
            className="cursor-pointer flex items-center" 
            onClick={handleProfileClick}
          >
            <User className="mr-2 h-4 w-4" />
            <span>Profil</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-pointer flex items-center" 
            onClick={() => navigate('/profile?tab=settings')}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Paramètres</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem 
            className="cursor-pointer text-startupia-turquoise flex items-center" 
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>{isLoggingOut ? 'Déconnexion...' : 'Se déconnecter'}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenu;
