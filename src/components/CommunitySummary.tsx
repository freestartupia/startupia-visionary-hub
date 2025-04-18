
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Users, MessageSquare, BookOpen, Star, Handshake } from 'lucide-react';

const CommunitySummary = () => {
  return (
    <section id="community-summary" className="py-20 relative">
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-startupia-turquoise/30 rounded-full blur-3xl animate-pulse-slow"></div>
      
      <div className="container mx-auto px-4 z-10">
        <div className="text-center max-w-4xl mx-auto mb-16">
          {/* Section Title */}
          <div className="flex items-center justify-center mb-2">
            <span className="text-3xl mr-3">👥</span>
            <p className="text-lg text-startupia-turquoise font-semibold">Communauté Startupia</p>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
            Une communauté active pour échanger, apprendre et collaborer
          </h2>
          
          <p className="text-xl text-white/70">
            Rejoignez l'écosystème IA français et accédez à un espace d'échanges entre entrepreneurs,
            développeurs, designers et clients potentiels.
          </p>

          <div className="mt-8">
            <Button size="lg" className="bg-startupia-gold hover:bg-startupia-light-gold text-black font-semibold text-lg py-6 px-8">
              <Users size={20} className="mr-2" />
              Rejoindre la communauté
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Community Forum Card */}
          <div className="glass-card p-6 hover-scale">
            <div className="mb-4 w-12 h-12 flex items-center justify-center rounded-full bg-startupia-turquoise/20 text-startupia-turquoise">
              <MessageSquare size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Forum d'entraide</h3>
            <p className="text-white/70 mb-4">
              Posez vos questions techniques, partagez vos expériences et discutez des dernières tendances IA.
            </p>
            <Button variant="outline" className="text-startupia-gold hover:bg-startupia-gold/20 hover:text-white border-startupia-gold w-full" asChild>
              <Link to="/community">Accéder au forum →</Link>
            </Button>
          </div>
          
          {/* Services Marketplace Card */}
          <div className="glass-card p-6 hover-scale">
            <div className="mb-4 w-12 h-12 flex items-center justify-center rounded-full bg-startupia-turquoise/20 text-startupia-turquoise">
              <Star size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Marketplace de services</h3>
            <p className="text-white/70 mb-4">
              Proposez vos compétences en IA ou trouvez un expert pour vous accompagner dans vos projets.
            </p>
            <Button variant="outline" className="text-startupia-gold hover:bg-startupia-gold/20 hover:text-white border-startupia-gold w-full" asChild>
              <Link to="/community?tab=services">Voir les services →</Link>
            </Button>
          </div>
          
          {/* Educational Resources Card */}
          <div className="glass-card p-6 hover-scale">
            <div className="mb-4 w-12 h-12 flex items-center justify-center rounded-full bg-startupia-turquoise/20 text-startupia-turquoise">
              <BookOpen size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Formations et ressources</h3>
            <p className="text-white/70 mb-4">
              Accédez à des formations de qualité et partagez vos connaissances avec la communauté IA.
            </p>
            <Button variant="outline" className="text-startupia-gold hover:bg-startupia-gold/20 hover:text-white border-startupia-gold w-full" asChild>
              <Link to="/community?tab=resources">Découvrir les formations →</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySummary;

