
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'py-2 bg-black bg-opacity-70 backdrop-blur-md' : 'py-4 bg-transparent'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <a href="/" className="text-white font-display text-2xl font-bold tracking-tight">
            Startupia<span className="text-startupia-purple">.fr</span>
          </a>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 items-center">
          <a href="#startup-index" className="text-white/80 hover:text-white transition-colors">Index</a>
          <a href="#startup-matcher" className="text-white/80 hover:text-white transition-colors">Matcher</a>
          <a href="#startup-cofounder" className="text-white/80 hover:text-white transition-colors">Co-Founder</a>
          <Button variant="outline" className="border-startupia-purple text-white hover:bg-startupia-purple/20">
            Se connecter
          </Button>
          <Button className="bg-startupia-purple hover:bg-startupia-purple/90 button-glow">
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
            <a 
              href="#startup-index" 
              onClick={toggleMobileMenu}
              className="text-white hover:text-startupia-purple px-4 py-2 rounded-md hover:bg-white/5"
            >
              Index
            </a>
            <a 
              href="#startup-matcher" 
              onClick={toggleMobileMenu}
              className="text-white hover:text-startupia-purple px-4 py-2 rounded-md hover:bg-white/5"
            >
              Matcher
            </a>
            <a 
              href="#startup-cofounder" 
              onClick={toggleMobileMenu}
              className="text-white hover:text-startupia-purple px-4 py-2 rounded-md hover:bg-white/5"
            >
              Co-Founder
            </a>
            <div className="pt-4 flex flex-col space-y-3">
              <Button variant="outline" className="border-startupia-purple text-white hover:bg-startupia-purple/20 w-full">
                Se connecter
              </Button>
              <Button className="bg-startupia-purple hover:bg-startupia-purple/90 w-full button-glow">
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
