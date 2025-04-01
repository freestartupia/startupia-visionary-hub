
import React from 'react';
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

interface UserMenuProps {
  isMobile?: boolean;
}

export const UserMenu: React.FC<UserMenuProps> = ({ isMobile = false }) => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };
  
  if (isMobile) {
    return (
      <div className="border-t border-white/10 pt-4 mt-2">
        <div className="flex justify-between items-center px-4 py-2">
          <span className="text-white/80 truncate">{user?.email}</span>
          <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/10">
            <Bell size={18} />
          </Button>
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
      <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
        <Bell size={20} />
      </Button>
      
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
