
import React from 'react';
import { 
  Twitter, 
  Linkedin, 
  Github, 
  Mail,
  ChevronRight,
  User,
  LogIn,
  Home,
  Star,
  MessageSquare,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative pt-16 pb-10 bg-black">
      <div className="container mx-auto px-4">
        {/* Top section */}
        <div className="flex flex-wrap gap-y-12">
          {/* Logo and description */}
          <div className="w-full md:w-1/3 pr-0 md:pr-8 mb-8 md:mb-0">
            <a href="/" className="text-white font-display text-2xl font-bold tracking-tight inline-block mb-4">
              Startupia<span className="text-startupia-turquoise">.fr</span>
            </a>
            <p className="text-white/60 mb-6">
              L'intelligence derrière les startups IA françaises. Un écosystème pour découvrir, analyser et s'inspirer des innovations IA en France.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-startupia-turquoise/20 text-white/70 hover:text-startupia-turquoise transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-startupia-turquoise/20 text-white/70 hover:text-startupia-turquoise transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-startupia-turquoise/20 text-white/70 hover:text-startupia-turquoise transition-colors">
                <Github size={18} />
              </a>
              <a href="mailto:contact@startupia.fr" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-startupia-turquoise/20 text-white/70 hover:text-startupia-turquoise transition-colors">
                <Mail size={18} />
              </a>
            </div>
          </div>
          
          {/* Navigation Links */}
          <div className="w-full md:w-2/3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Produit Links */}
              <div>
                <h4 className="text-white font-semibold mb-4">Produit</h4>
                <ul className="space-y-2">
                  <li>
                    <Link to="/startup" className="text-white/60 hover:text-startupia-turquoise inline-flex items-center">
                      <ChevronRight size={14} className="mr-1" /> Startups
                    </Link>
                  </li>
                  <li>
                    <Link to="/tools" className="text-white/60 hover:text-startupia-turquoise inline-flex items-center">
                      <ChevronRight size={14} className="mr-1" /> Outils IA
                    </Link>
                  </li>
                  <li>
                    <Link to="/cofounder" className="text-white/60 hover:text-startupia-turquoise inline-flex items-center">
                      <ChevronRight size={14} className="mr-1" /> Cofondateurs
                    </Link>
                  </li>
                  <li>
                    <Link to="/community" className="text-white/60 hover:text-startupia-turquoise inline-flex items-center">
                      <ChevronRight size={14} className="mr-1" /> Communauté
                    </Link>
                  </li>
                </ul>
              </div>
              
              {/* Resources Links */}
              <div>
                <h4 className="text-white font-semibold mb-4">Ressources</h4>
                <ul className="space-y-2">
                  <li>
                    <Link to="/blog" className="text-white/60 hover:text-startupia-turquoise inline-flex items-center">
                      <ChevronRight size={14} className="mr-1" /> Blog IA
                    </Link>
                  </li>
                  <li>
                    <Link to="/newsletter" className="text-white/60 hover:text-startupia-turquoise inline-flex items-center">
                      <ChevronRight size={14} className="mr-1" /> Newsletter
                    </Link>
                  </li>
                  <li>
                    <a href="#" className="text-white/60 hover:text-startupia-turquoise inline-flex items-center">
                      <ChevronRight size={14} className="mr-1" /> Événements IA
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-white/60 hover:text-startupia-turquoise inline-flex items-center">
                      <ChevronRight size={14} className="mr-1" /> Guides
                    </a>
                  </li>
                </ul>
              </div>
              
              {/* Company Links */}
              <div>
                <h4 className="text-white font-semibold mb-4">Entreprise</h4>
                <ul className="space-y-2">
                  <li>
                    <Link to="/profile" className="text-white/60 hover:text-startupia-turquoise inline-flex items-center">
                      <ChevronRight size={14} className="mr-1" /> Profil
                    </Link>
                  </li>
                  <li>
                    <Link to="/auth" className="text-white/60 hover:text-startupia-turquoise inline-flex items-center">
                      <ChevronRight size={14} className="mr-1" /> Connexion
                    </Link>
                  </li>
                  <li>
                    <Link to="/legal" className="text-white/60 hover:text-startupia-turquoise inline-flex items-center">
                      <ChevronRight size={14} className="mr-1" /> Mentions légales
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacy" className="text-white/60 hover:text-startupia-turquoise inline-flex items-center">
                      <ChevronRight size={14} className="mr-1" /> Confidentialité
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Divider */}
        <div className="border-t border-white/10 my-8"></div>
        
        {/* Copyright */}
        <div className="text-center text-white/40 text-sm">
          <p>© {new Date().getFullYear()} Startupia.fr. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
