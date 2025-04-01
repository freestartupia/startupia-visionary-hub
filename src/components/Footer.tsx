
import React from 'react';
import { 
  Twitter, 
  Linkedin, 
  Github, 
  Mail,
  ChevronRight
} from 'lucide-react';

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
              {/* Product Links */}
              <div>
                <h4 className="text-white font-semibold mb-4">Produit</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#startup-index" className="text-white/60 hover:text-startupia-turquoise inline-flex items-center">
                      <ChevronRight size={14} className="mr-1" /> Startup Index
                    </a>
                  </li>
                  <li>
                    <a href="#startup-matcher" className="text-white/60 hover:text-startupia-turquoise inline-flex items-center">
                      <ChevronRight size={14} className="mr-1" /> Startup Matcher
                    </a>
                  </li>
                  <li>
                    <a href="#startup-cofounder" className="text-white/60 hover:text-startupia-turquoise inline-flex items-center">
                      <ChevronRight size={14} className="mr-1" /> Co-Founder
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-white/60 hover:text-startupia-turquoise inline-flex items-center">
                      <ChevronRight size={14} className="mr-1" /> Newsletter
                    </a>
                  </li>
                </ul>
              </div>
              
              {/* Resources Links */}
              <div>
                <h4 className="text-white font-semibold mb-4">Ressources</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-white/60 hover:text-startupia-turquoise inline-flex items-center">
                      <ChevronRight size={14} className="mr-1" /> Blog IA
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-white/60 hover:text-startupia-turquoise inline-flex items-center">
                      <ChevronRight size={14} className="mr-1" /> Guides
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-white/60 hover:text-startupia-turquoise inline-flex items-center">
                      <ChevronRight size={14} className="mr-1" /> Événements IA
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-white/60 hover:text-startupia-turquoise inline-flex items-center">
                      <ChevronRight size={14} className="mr-1" /> Podcasts
                    </a>
                  </li>
                </ul>
              </div>
              
              {/* Company Links */}
              <div>
                <h4 className="text-white font-semibold mb-4">Entreprise</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-white/60 hover:text-startupia-turquoise inline-flex items-center">
                      <ChevronRight size={14} className="mr-1" /> À propos
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-white/60 hover:text-startupia-turquoise inline-flex items-center">
                      <ChevronRight size={14} className="mr-1" /> Contact
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-white/60 hover:text-startupia-turquoise inline-flex items-center">
                      <ChevronRight size={14} className="mr-1" /> Mentions légales
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-white/60 hover:text-startupia-turquoise inline-flex items-center">
                      <ChevronRight size={14} className="mr-1" /> Confidentialité
                    </a>
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
