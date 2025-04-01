
import React from 'react';
import { NavLinks } from './NavLinks';
import { AuthButtons } from './AuthButtons';
import { UserMenu } from './UserMenu';
import { useAuth } from '@/contexts/AuthContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { user, isLoading } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed top-[60px] left-0 right-0 max-h-[calc(100vh-60px)] overflow-y-auto glass-card mt-2 mx-4 p-4 animate-fade-in backdrop-blur-lg z-40">
      <NavLinks isMobile onMobileItemClick={onClose} />
      
      <div className="mt-6 pt-4 border-t border-white/10">
        {isLoading ? (
          <div className="animate-pulse w-8 h-8 rounded-full bg-white/20 mx-auto"></div>
        ) : user ? (
          <UserMenu isMobile />
        ) : (
          <AuthButtons isMobile onMobileItemClick={onClose} />
        )}
      </div>
    </div>
  );
};
