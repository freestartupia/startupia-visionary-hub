
import React from 'react';
import { Button } from '@/components/ui/button';
import { Wrench, Coins } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InvestmentSection = () => {
  const navigate = useNavigate();
  
  const handleScroll = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 relative">
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-startupia-purple/20 rounded-full blur-3xl animate-pulse-slow"></div>
      
      <div className="container mx-auto px-4 z-10">
        <div className="text-center max-w-4xl mx-auto mb-16">
          {/* Section Title */}
          <div className="flex items-center justify-center mb-2">
            <span className="text-3xl mr-3">🚀</span>
            <p className="text-lg text-startupia-purple font-semibold">Rejoignez l'écosystème</p>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
            Et vous, vous cherchez à investir de votre temps... ou de votre argent ?
          </h2>
          
          <p className="text-xl text-white/70 mb-8">
            Startupia est aussi une plateforme pour ceux qui veulent s'impliquer dans la nouvelle génération de startups IA.
            <br />Que vous soyez fondateur, freelance, investisseur ou curieux, il y a une place pour vous ici.
          </p>
        </div>
        
        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Card 1 - Contribute */}
          <div className="glass-card p-8 hover-scale border-2 border-startupia-purple/30 relative group overflow-hidden">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-startupia-purple/10 rounded-full transition-all duration-300 group-hover:scale-150 group-hover:bg-startupia-purple/20"></div>
            
            <div className="mb-6 w-16 h-16 flex items-center justify-center rounded-full bg-startupia-purple/20 text-startupia-purple">
              <Wrench size={32} />
            </div>
            
            <h3 className="text-2xl font-bold mb-4 relative z-10">
              🔧 Je veux m'impliquer dans un projet
            </h3>
            
            <p className="text-white/70 mb-8 relative z-10">
              Pour les freelances, développeurs, marketeurs, et tous ceux qui souhaitent contribuer à des projets innovants.
            </p>
            
            <Button 
              size="lg" 
              onClick={() => handleScroll('startup-cofounder')}
              className="bg-startupia-purple hover:bg-startupia-purple/90 button-glow text-white relative z-10"
            >
              Trouver une startup à rejoindre
            </Button>
          </div>
          
          {/* Card 2 - Invest */}
          <div className="glass-card p-8 hover-scale border-2 border-startupia-purple/30 relative group overflow-hidden">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-startupia-purple/10 rounded-full transition-all duration-300 group-hover:scale-150 group-hover:bg-startupia-purple/20"></div>
            
            <div className="mb-6 w-16 h-16 flex items-center justify-center rounded-full bg-startupia-purple/20 text-startupia-purple">
              <Coins size={32} />
            </div>
            
            <h3 className="text-2xl font-bold mb-4 relative z-10">
              💰 Je cherche à investir dans des startups IA
            </h3>
            
            <p className="text-white/70 mb-8 relative z-10">
              Pour business angels, incubateurs, curieux et tous ceux qui souhaitent soutenir financièrement l'innovation.
            </p>
            
            <Button 
              size="lg" 
              onClick={() => handleScroll('startup-cofounder')}
              className="bg-startupia-purple hover:bg-startupia-purple/90 button-glow text-white relative z-10"
            >
              Découvrir les projets à fort potentiel
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvestmentSection;
