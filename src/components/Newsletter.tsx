
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulation d'une souscription
    setTimeout(() => {
      toast({
        title: "Inscription réussie!",
        description: "Vous recevrez bientôt notre newsletter sur l'écosystème IA français.",
      });
      setEmail('');
      setLoading(false);
    }, 1000);
  };

  return (
    <section id="newsletter" className="py-20 relative timeline-section">
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-startupia-purple/20 rounded-full blur-3xl animate-pulse-slow"></div>
      
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-5xl mx-auto glass-card p-8 md:p-12 border border-startupia-purple/30">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="lg:w-2/3">
              <div className="flex items-center mb-2">
                <span className="text-3xl mr-3">📮</span>
                <p className="text-lg text-startupia-purple font-semibold">Newsletter hebdomadaire</p>
              </div>
              
              <h2 className="text-3xl font-bold mb-4">Restez informé de l'actualité IA française</h2>
              <p className="text-lg text-white/70 mb-6">
                Recevez les dernières actualités sur les startups IA françaises, les levées de fonds, les offres d'emploi et les événements à ne pas manquer.
              </p>
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="px-3 py-1 text-sm bg-startupia-purple/20 rounded-full border border-startupia-purple/30">🚀 Startups émergentes</span>
                <span className="px-3 py-1 text-sm bg-white/5 border border-white/10 rounded-full">💰 Levées de fonds</span>
                <span className="px-3 py-1 text-sm bg-white/5 border border-white/10 rounded-full">🔍 Analyse du marché</span>
                <span className="px-3 py-1 text-sm bg-white/5 border border-white/10 rounded-full">👥 Opportunités</span>
              </div>
            </div>
            
            <div className="lg:w-1/3 w-full">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium">
                    Votre adresse e-mail
                  </label>
                  <Input 
                    type="email" 
                    id="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nom@exemple.com" 
                    className="bg-white/5 border-white/20 placeholder:text-white/40 focus:border-startupia-purple/50"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-startupia-purple hover:bg-startupia-purple/90 button-glow"
                  disabled={loading}
                >
                  {loading ? 'Inscription...' : 'Rejoindre la communauté'}
                </Button>
                <p className="text-xs text-white/50 text-center">
                  Nous respectons votre vie privée. Désabonnez-vous à tout moment.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
