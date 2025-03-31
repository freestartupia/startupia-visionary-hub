
import React, { useState, useEffect } from 'react';
import { Menu, X, User, Bell } from 'lucide-react';
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

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // For demo purposes, set to true
  const location = useLocation();

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
          {isLoggedIn ? (
            <>
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
              <div className="flex items-center gap-4 ml-4">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <Bell size={20} />
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <User size={20} />
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link 
                to="/ecosystem" 
                className={`transition-colors ${isActive('/ecosystem') || isActive('/startups') || isActive('/radar') ? 'text-startupia-turquoise' : 'text-white/80 hover:text-white'}`}
              >
                Écosystème IA
              </Link>
              <Link 
                to="/products" 
                className={`transition-colors ${isActive('/products') ? 'text-startupia-turquoise' : 'text-white/80 hover:text-white'}`}
              >
                Lancements
              </Link>
              <Link 
                to="/cofounder" 
                className={`transition-colors ${isActive('/cofounder') ? 'text-startupia-turquoise' : 'text-white/80 hover:text-white'}`}
              >
                Co-Founder
              </Link>
              <Button variant="outline" className="border-startupia-turquoise text-white hover:bg-startupia-turquoise/20">
                Se connecter
              </Button>
              <Button className="bg-startupia-turquoise hover:bg-startupia-turquoise/90 button-glow">
                S'inscrire
              </Button>
            </>
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
            {isLoggedIn ? (
              <>
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
                <div className="flex space-x-4 px-4 py-2">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                    <Bell size={20} />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                    <User size={20} />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/ecosystem"
                  onClick={toggleMobileMenu}
                  className={`px-4 py-2 rounded-md hover:bg-white/5 ${isActive('/ecosystem') || isActive('/startups') || isActive('/radar') ? 'text-startupia-turquoise' : 'text-white hover:text-startupia-turquoise'}`}
                >
                  Écosystème IA
                </Link>
                <Link
                  to="/products"
                  onClick={toggleMobileMenu}
                  className={`px-4 py-2 rounded-md hover:bg-white/5 ${isActive('/products') ? 'text-startupia-turquoise' : 'text-white hover:text-startupia-turquoise'}`}
                >
                  Lancements
                </Link>
                <Link
                  to="/cofounder"
                  onClick={toggleMobileMenu}
                  className={`px-4 py-2 rounded-md hover:bg-white/5 ${isActive('/cofounder') ? 'text-startupia-turquoise' : 'text-white hover:text-startupia-turquoise'}`}
                >
                  Co-Founder
                </Link>
                <div className="pt-4 flex flex-col space-y-3">
                  <Button variant="outline" className="border-startupia-turquoise text-white hover:bg-startupia-turquoise/20 w-full">
                    Se connecter
                  </Button>
                  <Button className="bg-startupia-turquoise hover:bg-startupia-turquoise/90 w-full button-glow">
                    S'inscrire
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
