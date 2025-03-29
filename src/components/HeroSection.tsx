
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, Rocket } from 'lucide-react';

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
          <span className="gradient-text">L'écosystème IA français</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 max-w-5xl mx-auto leading-tight glow-effect">
          Startupia.fr – L'intelligence derrière les startups IA françaises
        </h1>

        {/* Subtitle */}
        <div className="max-w-3xl mx-auto mb-12">
          <p className="text-lg sm:text-xl text-white/80 mb-2">
            Explore les meilleures startups IA de France.
          </p>
          <p className="text-lg sm:text-xl text-white/80 mb-2">
            Découvre leurs technologies, inspire-toi de leurs modèles, trouve tes futurs associés.
          </p>
          <p className="text-lg sm:text-xl text-white/90 font-medium">
            Startupia, c'est la carte d'identité intelligente de l'écosystème IA.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <Button size="lg" className="bg-startupia-turquoise hover:bg-startupia-turquoise/90 button-glow text-lg py-6 px-8">
            <Search size={20} className="mr-2" />
            Explorer les startups
          </Button>
          <Button size="lg" variant="outline" className="border-startupia-turquoise hover:bg-startupia-turquoise/20 text-white text-lg py-6 px-8">
            <Rocket size={20} className="mr-2" />
            Proposer une startup
          </Button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
