
import React, { memo } from 'react';
import { cn } from '@/lib/utils';

// Définition des types pour les logos des partenaires et les statistiques
interface PartnerLogo {
  name: string;
}

interface Statistic {
  value: string;
  label: string;
}

// Utilisation de React.memo pour éviter les rendus inutiles
const TrustSignals = memo(() => {
  // Données des logos des partenaires
  const partnerLogos: PartnerLogo[] = [
    { name: "BPI France" },
    { name: "STATION F" },
    { name: "HEC Paris" },
    { name: "Microsoft" },
    { name: "CMA CGM" }
  ];

  // Données des statistiques
  const statistics: Statistic[] = [
    { value: "+50", label: "Startups IA" },
    { value: "+100", label: "Entrepreneurs" },
    { value: "100%", label: "gratuit pour tous" },
    { value: "+50", label: "Talents connectés" }
  ];

  return (
    <section className="py-10 sm:py-12 relative z-10 border-y border-white/10 backdrop-blur-sm bg-black/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6 sm:mb-8">
          <p className="text-base sm:text-lg text-white/70">Ils font confiance à Startupia</p>
        </div>
        
        {/* Logos des partenaires - Optimisé pour les appareils mobiles */}
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 md:gap-16">
          {partnerLogos.map((partner, index) => (
            <div 
              key={index}
              className="h-10 sm:h-12 w-20 sm:w-24 bg-white/5 rounded-md flex items-center justify-center"
            >
              <div className="text-white/40 text-sm sm:text-base font-semibold">{partner.name}</div>
            </div>
          ))}
        </div>
        
        {/* Statistiques - Layout adaptatif avec des transitions fluides */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center items-center gap-y-6 gap-x-4 mt-8 text-center">
          {statistics.map((stat, index) => (
            <div 
              key={index} 
              className={cn(
                "w-full sm:w-auto px-2 transition-all duration-300 hover:transform hover:scale-105",
                // S'assurer que le 100% reste en jaune (turquoise) comme les autres statistiques
                { "order-2 sm:order-none": stat.label === "gratuit pour tous" }
              )}
            >
              <div className="text-2xl sm:text-3xl font-bold text-startupia-turquoise">{stat.value}</div>
              <p className="text-sm sm:text-base text-white/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

// Définir un displayName pour le composant mémorisé
TrustSignals.displayName = 'TrustSignals';

export default TrustSignals;
