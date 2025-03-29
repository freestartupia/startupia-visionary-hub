
import React from 'react';
import { Button } from '@/components/ui/button';
import { Users, Code, Palette, FileCheck } from 'lucide-react';

const StartupCoFounder = () => {
  return (
    <section id="startup-cofounder" className="py-20 relative">
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-startupia-purple/20 rounded-full blur-3xl animate-pulse-slow"></div>
      
      <div className="container mx-auto px-4 z-10">
        <div className="text-center max-w-4xl mx-auto mb-16">
          {/* Section Title */}
          <div className="flex items-center justify-center mb-2">
            <span className="text-3xl mr-3">🤝</span>
            <p className="text-lg text-startupia-purple font-semibold">Startup Co-Founder</p>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
            Rejoins un projet IA ou trouve ton associé
          </h2>
          
          <p className="text-xl text-white/70">
            Un espace de mise en relation entre porteurs de projet IA, talents tech et profils business.
            <br />Dépose ton profil ou ta recherche. Startupia fait le lien.
          </p>
        </div>
        
        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 hover-scale">
            <div className="mb-4 w-12 h-12 flex items-center justify-center rounded-full bg-startupia-purple/20 text-startupia-purple">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Porteurs de projet IA</h3>
            <p className="text-white/70">
              Entrepreneurs avec une vision et à la recherche de talents complémentaires.
            </p>
          </div>
          
          <div className="glass-card p-6 hover-scale">
            <div className="mb-4 w-12 h-12 flex items-center justify-center rounded-full bg-startupia-purple/20 text-startupia-purple">
              <Code size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">CTOs & dev IA</h3>
            <p className="text-white/70">
              Tech leaders et développeurs experts en intelligence artificielle.
            </p>
          </div>
          
          <div className="glass-card p-6 hover-scale">
            <div className="mb-4 w-12 h-12 flex items-center justify-center rounded-full bg-startupia-purple/20 text-startupia-purple">
              <Palette size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Designers & UX</h3>
            <p className="text-white/70">
              Créatifs qui façonnent l'expérience et l'interface des produits IA.
            </p>
          </div>
          
          <div className="glass-card p-6 hover-scale">
            <div className="mb-4 w-12 h-12 flex items-center justify-center rounded-full bg-startupia-purple/20 text-startupia-purple">
              <FileCheck size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Business & Stratèges</h3>
            <p className="text-white/70">
              Experts en growth, marketing, vente et financement.
            </p>
          </div>
        </div>
        
        {/* Profile Carousel Preview */}
        <div className="mt-16 flex overflow-x-auto pb-6 space-x-6 no-scrollbar">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="glass-card p-6 min-w-[280px] hover-scale">
              <div className="flex items-center mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-startupia-light-purple to-startupia-purple"></div>
                <div className="ml-4">
                  <h4 className="font-semibold">Thomas L.</h4>
                  <p className="text-sm text-white/70">{item % 2 ? 'CTO / Dev IA' : 'Porteur de projet'}</p>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-white/80 text-sm line-clamp-3">
                  {item % 2 
                    ? "Développeur IA avec 5 ans d'expérience en NLP et LLM. Recherche un projet innovant dans le secteur de la santé ou l'éducation."
                    : "Entrepreneur avec une idée d'IA appliquée au domaine légal. Recherche CTO et développeur frontend pour MVP."
                  }
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-0.5 text-xs bg-startupia-purple/20 border border-startupia-purple/30 rounded-full">
                  {item % 2 ? 'Python' : 'LegalTech'}
                </span>
                <span className="px-2 py-0.5 text-xs bg-white/5 border border-white/10 rounded-full">
                  {item % 2 ? 'LLM' : 'SaaS'}
                </span>
                <span className="px-2 py-0.5 text-xs bg-white/5 border border-white/10 rounded-full">
                  {item % 2 ? 'TensorFlow' : 'B2B'}
                </span>
              </div>
              <Button variant="ghost" className="text-startupia-purple hover:text-startupia-light-purple w-full">
                Voir le profil
              </Button>
            </div>
          ))}
        </div>
        
        {/* CTA */}
        <div className="mt-12 text-center">
          <Button size="lg" className="bg-startupia-purple hover:bg-startupia-purple/90 button-glow text-lg py-6 px-8">
            <Users size={20} className="mr-2" />
            Accéder à la communauté
          </Button>
        </div>
      </div>
    </section>
  );
};

export default StartupCoFounder;
