
import React from 'react';
import { Button } from '@/components/ui/button';
import { Users, Code, Palette, FileCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { useMediaQuery } from '@/hooks/use-mobile';

const StartupCoFounder = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <section id="startup-cofounder" className="py-12 md:py-20 relative">
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-startupia-purple/20 rounded-full blur-3xl animate-pulse-slow"></div>
      
      <div className="container mx-auto px-4 z-10">
        <div className="text-center max-w-4xl mx-auto mb-10 md:mb-16">
          {/* Section Title */}
          <div className="flex items-center justify-center mb-2">
            <span className="text-3xl mr-3">🤝</span>
            <p className="text-lg text-startupia-purple font-semibold">Startup Co-Founder</p>
          </div>
          
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 md:mb-6">
            Rejoins un projet IA ou trouve ton associé
          </h2>
          
          <p className="text-base md:text-xl text-white/70">
            Un espace de mise en relation entre porteurs de projet IA, talents tech et profils business.
            <br className="hidden md:block" />Dépose ton profil ou ta recherche. Startupia fait le lien.
          </p>
        </div>
        
        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="glass-card p-4 md:p-6 hover-scale">
            <div className="mb-4 w-12 h-12 flex items-center justify-center rounded-full bg-startupia-purple/20 text-startupia-purple">
              <Users size={24} />
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2">Porteurs de projet IA</h3>
            <p className="text-white/70 text-sm md:text-base">
              Entrepreneurs avec une vision et à la recherche de talents complémentaires.
            </p>
          </div>
          
          <div className="glass-card p-4 md:p-6 hover-scale">
            <div className="mb-4 w-12 h-12 flex items-center justify-center rounded-full bg-startupia-purple/20 text-startupia-purple">
              <Code size={24} />
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2">CTOs & dev IA</h3>
            <p className="text-white/70 text-sm md:text-base">
              Tech leaders et développeurs experts en intelligence artificielle.
            </p>
          </div>
          
          <div className="glass-card p-4 md:p-6 hover-scale">
            <div className="mb-4 w-12 h-12 flex items-center justify-center rounded-full bg-startupia-purple/20 text-startupia-purple">
              <Palette size={24} />
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2">Designers & UX</h3>
            <p className="text-white/70 text-sm md:text-base">
              Créatifs qui façonnent l'expérience et l'interface des produits IA.
            </p>
          </div>
          
          <div className="glass-card p-4 md:p-6 hover-scale">
            <div className="mb-4 w-12 h-12 flex items-center justify-center rounded-full bg-startupia-purple/20 text-startupia-purple">
              <FileCheck size={24} />
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2">Business & Stratèges</h3>
            <p className="text-white/70 text-sm md:text-base">
              Experts en growth, marketing, vente et financement.
            </p>
          </div>
        </div>
        
        {/* Profile Carousel */}
        <div className="mt-12 md:mt-16 relative">
          <div className="mb-6">
            <h3 className="text-xl md:text-2xl font-semibold text-center">Profils disponibles</h3>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true
            }}
            className="w-full"
          >
            <CarouselContent className="px-2 md:px-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <CarouselItem key={item} className="md:basis-1/2 lg:basis-1/3 pl-2 md:pl-4">
                  <div className="glass-card p-4 md:p-6 hover-scale h-full">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-startupia-light-purple to-startupia-purple"></div>
                      <div className="ml-3 md:ml-4">
                        <h4 className="font-semibold">Thomas L.</h4>
                        <p className="text-xs md:text-sm text-white/70">{item % 2 ? 'CTO / Dev IA' : 'Porteur de projet'}</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-white/80 text-xs md:text-sm line-clamp-3">
                        {item % 2 
                          ? "Développeur IA avec 5 ans d'expérience en NLP et LLM. Recherche un projet innovant dans le secteur de la santé ou l'éducation."
                          : "Entrepreneur avec une idée d'IA appliquée au domaine légal. Recherche CTO et développeur frontend pour MVP."
                        }
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1 md:gap-2 mb-4">
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
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-6 md:mt-8 gap-2">
              <CarouselPrevious className="relative static left-0 translate-y-0 bg-startupia-purple/20 hover:bg-startupia-purple/40 border-startupia-purple/30" />
              <CarouselNext className="relative static right-0 translate-y-0 bg-startupia-purple/20 hover:bg-startupia-purple/40 border-startupia-purple/30" />
            </div>
          </Carousel>
        </div>
        
        {/* CTA */}
        <div className="mt-10 md:mt-12 text-center">
          <Button size="lg" className="bg-startupia-gold hover:bg-startupia-light-gold text-black font-semibold button-glow-gold text-base md:text-lg py-4 px-6 md:py-6 md:px-8 w-full sm:w-auto">
            <Users size={18} className="mr-2" />
            Accéder à la communauté
          </Button>
        </div>
      </div>
    </section>
  );
};

export default StartupCoFounder;
