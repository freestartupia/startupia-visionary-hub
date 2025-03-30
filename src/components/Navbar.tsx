
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
          <Link 
            to="/startups" 
            className={`transition-colors ${isActive('/startups') ? 'text-startupia-turquoise' : 'text-white/80 hover:text-white'}`}
          >
            Index
          </Link>
          <Link 
            to="/radar" 
            className={`transition-colors ${isActive('/radar') ? 'text-startupia-turquoise' : 'text-white/80 hover:text-white'}`}
          >
            Radar IA
          </Link>
          <Button variant="outline" className="border-startupia-turquoise text-white hover:bg-startupia-turquoise/20">
            Se connecter
          </Button>
          <Button className="bg-startupia-turquoise hover:bg-startupia-turquoise/90 button-glow">
            S'inscrire
          </Button>
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
        <div className="md:hidden glass-card mt-2 mx-4 p-4 animate-fade-in">
          <div className="flex flex-col space-y-4 py-2">
            <Link
              to="/startups"
              onClick={toggleMobileMenu}
              className={`px-4 py-2 rounded-md hover:bg-white/5 ${isActive('/startups') ? 'text-startupia-turquoise' : 'text-white hover:text-startupia-turquoise'}`}
            >
              Index
            </Link>
            <Link
              to="/radar"
              onClick={toggleMobileMenu}
              className={`px-4 py-2 rounded-md hover:bg-white/5 ${isActive('/radar') ? 'text-startupia-turquoise' : 'text-white hover:text-startupia-turquoise'}`}
            >
              Radar IA
            </Link>
            <div className="pt-4 flex flex-col space-y-3">
              <Button variant="outline" className="border-startupia-turquoise text-white hover:bg-startupia-turquoise/20 w-full">
                Se connecter
              </Button>
              <Button className="bg-startupia-turquoise hover:bg-startupia-turquoise/90 w-full button-glow">
                S'inscrire
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
