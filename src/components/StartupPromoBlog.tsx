
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, Heart, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

const StartupPromoBlog = () => {
  return (
    <section className="py-24 relative z-10 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-startupia-turquoise/30 rounded-full blur-3xl animate-pulse-slow"></div>
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content - Visual Element */}
          <div className="lg:w-5/12">
            <div className="relative">
              {/* Main Visual - Stylized Vote Card */}
              <div className="glass-card p-8 border border-startupia-turquoise/30 shadow-lg relative z-10 transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-black rounded-xl border border-startupia-turquoise/30 flex items-center justify-center">
                    <span className="text-startupia-turquoise font-bold text-2xl">S</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold">Startupia AI</h4>
                    <p className="text-white/70 text-sm">Intelligence artificielle · Paris</p>
                  </div>
                </div>
                
                <p className="text-white/90 mb-6">
                  La première plateforme qui connecte l'écosystème des startups IA françaises en un seul endroit.
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button variant="outline" className="bg-black/30 border-startupia-turquoise/50 text-startupia-turquoise hover:bg-startupia-turquoise/20 flex items-center gap-2">
                      Visiter
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button className="bg-startupia-turquoise text-black hover:bg-startupia-turquoise/90 flex items-center gap-2">
                      <ArrowUp size={18} />
                      <span className="font-bold">832</span>
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute top-10 -left-6 w-12 h-12 bg-startupia-turquoise/20 rounded-full"></div>
              <div className="absolute bottom-16 -right-8 w-16 h-16 bg-startupia-turquoise/20 rounded-full"></div>
              
              {/* Floating Vote Bubbles */}
              <div className="absolute top-1/4 -right-12 w-24 h-24 glass-card rounded-full flex items-center justify-center border border-startupia-turquoise/30 animate-float" style={{ animationDelay: "0.5s" }}>
                <Heart size={28} className="text-startupia-turquoise" />
              </div>
              <div className="absolute bottom-0 -left-10 w-20 h-20 glass-card rounded-full flex items-center justify-center border border-startupia-turquoise/30 animate-float" style={{ animationDelay: "1.2s" }}>
                <Rocket size={24} className="text-startupia-turquoise" />
              </div>
            </div>
          </div>
          
          {/* Right Content - Promotional Text */}
          <div className="lg:w-7/12 space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight text-center">
              Faites exploser votre startup, gratuitement
            </h2>
            
            <div className="pt-8 flex justify-center">
              <Button size="lg" className="bg-startupia-turquoise hover:bg-startupia-turquoise/90 text-black font-semibold text-lg py-6 px-8" asChild>
                <Link to="/startup">
                  <Rocket size={20} className="mr-2" />
                  Lancez-vous. Postez. Grimpez. Brillez.
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StartupPromoBlog;
