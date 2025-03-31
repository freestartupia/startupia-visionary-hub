
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, Filter, Layers, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

const StartupMatcher = () => {
  return (
    <section id="startup-matcher" className="py-20 relative">
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-startupia-purple/20 rounded-full blur-3xl animate-pulse-slow"></div>
      
      <div className="container mx-auto px-4 z-10">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
          {/* Left Content - Interactive Search Mockup */}
          <div className="lg:w-1/2 glass-card p-6 border border-startupia-purple/30 animate-float">
            <div className="border-b border-white/10 pb-4 mb-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Rechercher une startup IA..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 pl-10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-startupia-purple/50"
                />
                <Search className="absolute left-3 top-3.5 text-white/50" size={18} />
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 text-sm bg-startupia-purple/20 border border-startupia-purple/30 rounded-full">
                  Santé
                </span>
                <span className="px-3 py-1 text-sm bg-white/5 border border-white/10 rounded-full">
                  RH
                </span>
                <span className="px-3 py-1 text-sm bg-white/5 border border-white/10 rounded-full">
                  Éducation
                </span>
                <span className="px-3 py-1 text-sm bg-white/5 border border-white/10 rounded-full">
                  Finance
                </span>
                <span className="px-3 py-1 text-sm bg-white/5 border border-white/10 rounded-full">
                  Industrie
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 text-sm bg-startupia-purple/20 border border-startupia-purple/30 rounded-full">
                  LLM
                </span>
                <span className="px-3 py-1 text-sm bg-white/5 border border-white/10 rounded-full">
                  NLP
                </span>
                <span className="px-3 py-1 text-sm bg-white/5 border border-white/10 rounded-full">
                  Vision
                </span>
                <span className="px-3 py-1 text-sm bg-white/5 border border-white/10 rounded-full">
                  Agent
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="p-3 bg-white/5 border border-white/10 rounded-lg flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer">
                <div>
                  <p className="font-medium">HealthIA Solutions</p>
                  <p className="text-sm text-white/50">SaaS, LLM, Santé</p>
                </div>
                <span className="text-xs px-2 py-1 bg-startupia-purple/20 text-startupia-purple rounded-full">
                  Score: 92
                </span>
              </div>
              
              <div className="p-3 bg-white/5 border border-white/10 rounded-lg flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer">
                <div>
                  <p className="font-medium">MedicScript</p>
                  <p className="text-sm text-white/50">B2B, NLP, Santé</p>
                </div>
                <span className="text-xs px-2 py-1 bg-startupia-purple/20 text-startupia-purple rounded-full">
                  Score: 88
                </span>
              </div>
              
              <div className="p-3 bg-white/5 border border-white/10 rounded-lg flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer">
                <div>
                  <p className="font-medium">DiagnosIA</p>
                  <p className="text-sm text-white/50">SaaS, Vision, Santé</p>
                </div>
                <span className="text-xs px-2 py-1 bg-startupia-purple/20 text-startupia-purple rounded-full">
                  Score: 85
                </span>
              </div>
            </div>
          </div>
          
          {/* Right Content */}
          <div className="lg:w-1/2 space-y-6">
            {/* Section Title */}
            <div className="flex items-center mb-2">
              <span className="text-3xl mr-3">🔍</span>
              <p className="text-lg text-startupia-purple font-semibold">Startup Matcher</p>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Trouve la startup qui te correspond
            </h2>

            <p className="text-xl text-white/70">
              Un moteur de recherche et de filtres intelligents pour explorer l'univers des startups IA selon tes critères.
            </p>
            
            <div className="space-y-4 pt-4">
              <div className="flex items-start">
                <div className="mr-3 mt-1 w-10 h-10 flex items-center justify-center rounded-full bg-startupia-purple/20 text-startupia-purple">
                  <Filter size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Recherche par secteur</h3>
                  <p className="text-white/70">Santé, RH, éducation, industrie et plus encore</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-3 mt-1 w-10 h-10 flex items-center justify-center rounded-full bg-startupia-purple/20 text-startupia-purple">
                  <Layers size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Filtre par technologie IA</h3>
                  <p className="text-white/70">LLM, NLP, Agent, Vision et autres technologies</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-3 mt-1 w-10 h-10 flex items-center justify-center rounded-full bg-startupia-purple/20 text-startupia-purple">
                  <Database size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Explore selon le business model</h3>
                  <p className="text-white/70">SaaS, B2C, plateforme, marketplace et plus</p>
                </div>
              </div>
            </div>
            
            <div className="pt-6">
              <Button size="lg" className="bg-startupia-gold hover:bg-startupia-light-gold button-glow-gold text-black font-semibold text-lg py-6 px-8" asChild>
                <Link to="/ecosystem">
                  <Search size={20} className="mr-2" />
                  Explorer l'écosystème IA
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StartupMatcher;
