
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Rocket, ArrowRight, Users, MessageSquare, Star } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="min-h-screen relative flex flex-col items-center justify-center pt-16 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-20 z-0"></div>
      <div className="absolute top-1/3 -left-40 w-96 h-96 bg-startupia-turquoise/30 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-startupia-turquoise/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto px-4 z-10 text-center">
        {/* Small badge */}
        <div className="inline-block mb-6 px-4 py-2 rounded-full bg-startupia-turquoise/20 border border-startupia-turquoise/30 text-sm">
          <span className="gradient-text font-medium">Plus de 500 startups IA françaises répertoriées</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 max-w-5xl mx-auto leading-tight glow-effect">
          Découvrez, rejoignez et investissez dans les startups IA françaises
        </h1>

        {/* Subtitle */}
        <div className="max-w-3xl mx-auto mb-8">
          <p className="text-xl sm:text-2xl text-white/90 font-medium mb-6">
            Startupia, la plateforme qui connecte entrepreneurs, talents, clients et investisseurs dans l'écosystème IA français.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-white/80">Intelligence artificielle</span>
            <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-white/80">LLM</span>
            <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-white/80">Computer Vision</span>
            <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-white/80">NLP</span>
            <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-white/80">B2B SaaS</span>
            <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-white/80">IA générative</span>
          </div>
        </div>

        {/* Value Proposition Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="glass-card p-4 hover-scale flex flex-col items-center">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-startupia-turquoise/20 text-startupia-turquoise mb-3">
              <Search size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-1">Trouvez l'inspiration</h3>
            <p className="text-sm text-white/80">Découvrez des SaaS, concepts et agents IA innovants</p>
          </div>
          
          <div className="glass-card p-4 hover-scale flex flex-col items-center">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-startupia-turquoise/20 text-startupia-turquoise mb-3">
              <Star size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-1">Devenez client</h3>
            <p className="text-sm text-white/80">Abonnez-vous aux services des startups listées</p>
          </div>
          
          <div className="glass-card p-4 hover-scale flex flex-col items-center">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-startupia-turquoise/20 text-startupia-turquoise mb-3">
              <Users size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-1">Rejoignez la communauté</h3>
            <p className="text-sm text-white/80">Proposez vos services et collaborez sur des projets</p>
          </div>
          
          <div className="glass-card p-4 hover-scale flex flex-col items-center">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-startupia-turquoise/20 text-startupia-turquoise mb-3">
              <MessageSquare size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-1">Échangez sur le forum</h3>
            <p className="text-sm text-white/80">Partagez vos connaissances et posez vos questions</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-16">
          <Button 
            size="lg" 
            className="bg-startupia-turquoise hover:bg-startupia-turquoise/90 button-glow text-lg py-6 px-8 w-full sm:w-auto"
            asChild
          >
            <Link to="/startups">
              <Search size={20} className="mr-2" />
              Explorer les startups
            </Link>
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-startupia-turquoise hover:bg-startupia-turquoise/20 text-white text-lg py-6 px-8 w-full sm:w-auto"
            asChild
          >
            <Link to="/community">
              <Users size={20} className="mr-2" />
              Rejoindre la communauté
            </Link>
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-startupia-turquoise hover:bg-startupia-turquoise/20 text-white text-lg py-6 px-8 w-full sm:w-auto"
            asChild
          >
            <Link to="/cofounder">
              <Rocket size={20} className="mr-2" />
              Trouver un cofondateur
            </Link>
          </Button>
        </div>

        {/* Down arrow indicator */}
        <a 
          href="#startup-index" 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center hover:text-startupia-turquoise transition-colors"
        >
          <span className="text-sm mb-2 opacity-80">Découvrir</span>
          <ArrowRight size={24} className="rotate-90" />
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
