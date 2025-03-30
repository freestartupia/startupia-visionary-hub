
import React from 'react';

const TrustSignals = () => {
  return (
    <section className="py-12 relative z-10 border-y border-white/10 backdrop-blur-sm bg-black/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <p className="text-lg text-white/70">Ils font confiance à Startupia</p>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 md:gap-16">
          {/* Logos défilants des entreprises et partenaires - en version simulée */}
          <div className="h-12 w-24 bg-white/5 rounded-md flex items-center justify-center">
            <div className="text-white/40 font-semibold">BPI France</div>
          </div>
          
          <div className="h-12 w-24 bg-white/5 rounded-md flex items-center justify-center">
            <div className="text-white/40 font-semibold">STATION F</div>
          </div>
          
          <div className="h-12 w-24 bg-white/5 rounded-md flex items-center justify-center">
            <div className="text-white/40 font-semibold">HEC Paris</div>
          </div>
          
          <div className="h-12 w-24 bg-white/5 rounded-md flex items-center justify-center">
            <div className="text-white/40 font-semibold">Microsoft</div>
          </div>
          
          <div className="h-12 w-24 bg-white/5 rounded-md flex items-center justify-center">
            <div className="text-white/40 font-semibold">CMA CGM</div>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-8 mt-10 text-center">
          <div className="w-full sm:w-auto">
            <div className="text-3xl font-bold text-startupia-turquoise">500+</div>
            <p className="text-white/70">Startups IA</p>
          </div>
          
          <div className="w-full sm:w-auto">
            <div className="text-3xl font-bold text-startupia-turquoise">2,500+</div>
            <p className="text-white/70">Entrepreneurs</p>
          </div>
          
          <div className="w-full sm:w-auto">
            <div className="text-3xl font-bold text-startupia-turquoise">120M€</div>
            <p className="text-white/70">Investissements facilités</p>
          </div>
          
          <div className="w-full sm:w-auto">
            <div className="text-3xl font-bold text-startupia-turquoise">350+</div>
            <p className="text-white/70">Talents connectés</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSignals;
