
import React from 'react';
import { Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

const PromoTopbar = () => {
  return (
    <div className="bg-startupia-gold text-black py-2 px-4 text-center font-medium relative z-50">
      <div className="container mx-auto flex items-center justify-center gap-2 text-sm md:text-base">
        <Rocket size={16} className="animate-pulse" />
        <span>
          Fondateur de startup ? Poste ton projet sur Startupia : 
          <span className="hidden md:inline"> Visibilité gratuite 🔥 • Backlink SEO 🔗 • Classement par votes 📈</span>
          <span className="md:hidden"> Visibilité gratuite 🔥</span>
        </span>
        <Link 
          to="/startup" 
          className="ml-2 underline font-bold hover:text-startupia-deep-gold transition-colors"
        >
          Ajouter
        </Link>
      </div>
    </div>
  );
};

export default PromoTopbar;
