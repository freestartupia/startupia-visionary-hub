
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Settings, Plus } from 'lucide-react';
import MatchNotifications from './MatchNotifications';
import { useIsMobile } from '@/hooks/use-mobile';

interface UserMenuProps {
  isMobile?: boolean;
}

const UserMenu = ({ isMobile }: UserMenuProps) => {
  const { user, signOut } = useAuth();
  const isScreenMobile = useIsMobile();
  
  // Si l'utilisateur n'est pas connecté, ne rien afficher
  if (!user) return null;
  
  // Récupérer les initiales de l'utilisateur pour l'avatar
  const getInitials = () => {
    if (!user.user_metadata) return 'U';
    const firstName = user.user_metadata.first_name || '';
    const lastName = user.user_metadata.last_name || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };
  
  return (
    <div className="flex items-center gap-2">
      {/* Icône de notifications */}
      <MatchNotifications />

      {/* Menu utilisateur */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="p-0">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-startupia-turquoise text-black">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-black border border-gray-800">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">
                {user.user_metadata?.first_name} {user.user_metadata?.last_name}
              </p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/profile" className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/settings" className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Paramètres</span>
            </Link>
          </DropdownMenuItem>
          {!isScreenMobile && !isMobile && (
            <DropdownMenuItem asChild>
              <Link to="/cofounders" className="cursor-pointer">
                <Plus className="mr-2 h-4 w-4" />
                <span>Créer un profil</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="cursor-pointer text-red-500 focus:text-red-500"
            onClick={() => {
              signOut();
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Se déconnecter</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenu;
