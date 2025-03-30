
import React from 'react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Marie Dupont",
      role: "CTO & Co-fondatrice, IA Health",
      image: "",
      text: "Grâce à Startupia, nous avons trouvé notre CTO en moins de trois semaines. La qualité des profils est impressionnante et le matching est vraiment pertinent.",
    },
    {
      name: "Thomas Lefebvre",
      role: "Développeur NLP Senior",
      image: "",
      text: "J'ai rejoint une startup innovante dans le NLP via Startupia. La plateforme m'a permis de trouver un projet qui correspondait parfaitement à mes compétences et aspirations.",
    },
    {
      name: "Sophie Laurent",
      role: "Investisseuse, Venture Capital",
      image: "",
      text: "En tant qu'investisseuse dans l'IA, Startupia est devenue ma ressource principale. L'index offre une vision claire de l'écosystème et a déjà permis d'identifier plusieurs pépites.",
    },
    {
      name: "Julien Martin",
      role: "Fondateur, VisionAI",
      image: "",
      text: "Le Startup Index nous a donné une visibilité incroyable. Nous avons pu nous connecter avec des talents clés et des investisseurs grâce à notre présence sur Startupia.",
    }
  ];

  return (
    <section className="py-20 relative">
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-startupia-gold/20 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-startupia-gold/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto px-4 z-10 relative">
        <div className="text-center max-w-4xl mx-auto mb-12">
          {/* Section Title */}
          <div className="flex items-center justify-center mb-2">
            <span className="text-3xl mr-3">💬</span>
            <p className="text-lg text-startupia-gold font-semibold">Témoignages</p>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
            Ils ont transformé leur parcours grâce à Startupia
          </h2>
          
          <p className="text-xl text-white/70">
            Découvrez les histoires de réussite de fondateurs, développeurs et investisseurs qui ont utilisé notre plateforme.
          </p>
        </div>
        
        <div className="mt-10">
          <Carousel
            opts={{
              align: "start",
              loop: true
            }}
            className="w-full"
          >
            <CarouselContent className="px-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="glass-card p-6 border border-startupia-gold/30 h-full flex flex-col">
                    <div className="mb-6 relative">
                      <div className="text-4xl text-startupia-gold opacity-50 absolute -top-3 -left-1">❝</div>
                      <p className="text-white/90 italic pl-6">
                        {testimonial.text}
                      </p>
                      <div className="text-4xl text-startupia-gold opacity-50 absolute -bottom-5 right-0">❞</div>
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-white/10 flex items-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-startupia-light-gold to-startupia-gold"></div>
                      <div className="ml-4">
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-white/70">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-8 gap-2">
              <CarouselPrevious className="relative static left-0 translate-y-0 bg-startupia-gold/20 hover:bg-startupia-gold/40 border-startupia-gold/30" />
              <CarouselNext className="relative static right-0 translate-y-0 bg-startupia-gold/20 hover:bg-startupia-gold/40 border-startupia-gold/30" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
