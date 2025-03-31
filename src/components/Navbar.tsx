
import React, { useState, useEffect } from 'react';
import { Menu, X, User, Bell, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isLoading, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'py-2 bg-black bg-opacity-70 backdrop-blur-md' : 'py-4 bg-transparent'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-white font-display text-2xl font-bold tracking-tight">
            Startupia<span className="text-startupia-turquoise">.fr</span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link 
            to="/ecosystem" 
            className={`transition-colors ${isActive('/ecosystem') || isActive('/startups') || isActive('/radar') ? 'text-startupia-turquoise' : 'text-white/80 hover:text-white'}`}
          >
            Explorer l'écosystème IA
          </Link>
          <Link 
            to="/products" 
            className={`transition-colors ${isActive('/products') ? 'text-startupia-turquoise' : 'text-white/80 hover:text-white'}`}
          >
            Lancements de produits
          </Link>
          <Link 
            to="/cofounder" 
            className={`transition-colors ${isActive('/cofounder') ? 'text-startupia-turquoise' : 'text-white/80 hover:text-white'}`}
          >
            Trouver un cofondateur
          </Link>
          <Link 
            to="/community" 
            className={`transition-colors ${isActive('/community') ? 'text-startupia-turquoise' : 'text-white/80 hover:text-white'}`}
          >
            Communauté
          </Link>
          
          {isLoading ? (
            <div className="animate-pulse w-8 h-8 rounded-full bg-white/20"></div>
          ) : user ? (
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
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
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
          ) : (
            <div className="flex items-center gap-4">
              <Button variant="outline" className="border-startupia-turquoise text-white hover:bg-startupia-turquoise/20" asChild>
                <Link to="/auth">Se connecter</Link>
              </Button>
              <Button className="bg-startupia-turquoise hover:bg-startupia-turquoise/90 button-glow" asChild>
                <Link to="/auth?tab=register">S'inscrire</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            onClick={toggleMobileMenu}
            className="p-2 text-white focus:outline-none"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-[60px] left-0 right-0 max-h-[calc(100vh-60px)] overflow-y-auto glass-card mt-2 mx-4 p-4 animate-fade-in backdrop-blur-lg">
          <div className="flex flex-col space-y-4 py-2">
            <Link
              to="/ecosystem"
              onClick={toggleMobileMenu}
              className={`px-4 py-2 rounded-md hover:bg-white/5 ${isActive('/ecosystem') || isActive('/startups') || isActive('/radar') ? 'text-startupia-turquoise' : 'text-white hover:text-startupia-turquoise'}`}
            >
              Explorer l'écosystème IA
            </Link>
            <Link
              to="/products"
              onClick={toggleMobileMenu}
              className={`px-4 py-2 rounded-md hover:bg-white/5 ${isActive('/products') ? 'text-startupia-turquoise' : 'text-white hover:text-startupia-turquoise'}`}
            >
              Lancements de produits
            </Link>
            <Link
              to="/cofounder"
              onClick={toggleMobileMenu}
              className={`px-4 py-2 rounded-md hover:bg-white/5 ${isActive('/cofounder') ? 'text-startupia-turquoise' : 'text-white hover:text-startupia-turquoise'}`}
            >
              Trouver un cofondateur
            </Link>
            <Link
              to="/community"
              onClick={toggleMobileMenu}
              className={`px-4 py-2 rounded-md hover:bg-white/5 ${isActive('/community') ? 'text-startupia-turquoise' : 'text-white hover:text-startupia-turquoise'}`}
            >
              Communauté
            </Link>
            
            {isLoading ? (
              <div className="animate-pulse w-8 h-8 rounded-full bg-white/20 mx-auto"></div>
            ) : user ? (
              <div className="border-t border-white/10 pt-4 mt-2">
                <div className="flex justify-between items-center px-4 py-2">
                  <span className="text-white/80 truncate">{user.email}</span>
                  <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/10">
                    <Bell size={18} />
                  </Button>
                </div>
                <div className="mt-2 space-y-2">
                  <Button variant="ghost" className="w-full justify-start text-white/80 hover:text-white hover:bg-white/5">
                    <User size={16} className="mr-2" />
                    Mon profil
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
            ) : (
              <div className="pt-4 flex flex-col space-y-3">
                <Button variant="outline" className="border-startupia-turquoise text-white hover:bg-startupia-turquoise/20 w-full" asChild>
                  <Link to="/auth" onClick={toggleMobileMenu}>Se connecter</Link>
                </Button>
                <Button className="bg-startupia-turquoise hover:bg-startupia-turquoise/90 w-full button-glow" asChild>
                  <Link to="/auth?tab=register" onClick={toggleMobileMenu}>S'inscrire</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
