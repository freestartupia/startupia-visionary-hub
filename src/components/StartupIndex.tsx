
import React from 'react';
import { Button } from '@/components/ui/button';
import { Book, BadgeCheck, Lightbulb, TrendingUp, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

const StartupIndex = () => {
  return (
    <section id="startup-index" className="py-20 relative">
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-startupia-purple/20 rounded-full blur-3xl animate-pulse-slow"></div>
      
      <div className="container mx-auto px-4 z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="lg:w-1/2 space-y-6">
            {/* Section Title */}
            <div className="flex items-center mb-2">
              <span className="text-3xl mr-3">🧬</span>
              <p className="text-lg text-startupia-purple font-semibold">Le Startup Index</p>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              La base de données enrichie des startups IA françaises
            </h2>

            <p className="text-xl text-white/70">
              Un espace de référence pour découvrir les startups qui façonnent l'écosystème IA français, 
              avec des analyses approfondies et des données qui vous inspirent.
            </p>
            
            <div className="pt-6">
              <Button size="lg" className="bg-startupia-gold hover:bg-startupia-light-gold button-glow-gold text-black font-semibold text-lg py-6 px-8" asChild>
                <Link to="/ecosystem">
                  <Book size={20} className="mr-2" />
                  Explorer l'écosystème IA
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Right Content - Feature Cards */}
          <div className="lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 hover-scale">
              <div className="mb-4 w-12 h-12 flex items-center justify-center rounded-full bg-startupia-purple/20 text-startupia-purple">
                <BadgeCheck size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Profils détaillés</h3>
              <p className="text-white/70">
                Leur secteur, modèle économique et outils IA utilisés
              </p>
            </div>
            
            <div className="glass-card p-6 hover-scale">
              <div className="mb-4 w-12 h-12 flex items-center justify-center rounded-full bg-startupia-purple/20 text-startupia-purple">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Note d'impact IA</h3>
              <p className="text-white/70">
                Une notation éditoriale de l'impact et de l'innovation
              </p>
            </div>
            
            <div className="glass-card p-6 hover-scale">
              <div className="mb-4 w-12 h-12 flex items-center justify-center rounded-full bg-startupia-purple/20 text-startupia-purple">
                <Lightbulb size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Insight stratégique</h3>
              <p className="text-white/70">
                Ce qu'on peut apprendre de leur modèle et stratégie
              </p>
            </div>
            
            <div className="glass-card p-6 hover-scale">
              <div className="mb-4 w-12 h-12 flex items-center justify-center rounded-full bg-startupia-purple/20 text-startupia-purple">
                <Rocket size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Idées à lancer</h3>
              <p className="text-white/70">
                Une idée de startup inspirée de leur modèle
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StartupIndex;
