
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Inscription réussie !",
        description: "Vous recevrez bientôt notre newsletter hebdomadaire.",
        action: (
          <div className="h-8 w-8 bg-green-500/20 rounded-full flex items-center justify-center">
            <Check className="h-5 w-5 text-green-500" />
          </div>
        ),
      });
      setIsSubmitting(false);
      setEmail('');
    }, 1000);
  };

  return (
    <section className="py-20 relative">
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-3xl h-1/2 bg-startupia-purple/20 blur-3xl rounded-full"></div>
      
      <div className="container mx-auto px-4 z-10">
        <div className="glass-card border border-startupia-purple/30 p-10 md:p-16 max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-startupia-purple/20 mb-6">
            <Mail size={28} className="text-startupia-purple" />
          </div>
          
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
            📬 Chaque semaine, 3 startups IA et 1 idée de business à lancer
          </h2>
          
          <p className="text-lg text-white/70 mb-8">
            Reçois chaque jeudi une sélection de startups inspirantes, un modèle à suivre et une idée concrète à reproduire.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
            <div className="flex-1 relative">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entrez votre adresse email"
                className="w-full bg-white/10 border border-white/20 rounded-lg py-3 px-4 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-startupia-purple/50"
                required
              />
            </div>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-startupia-purple hover:bg-startupia-purple/90 button-glow text-white py-3 px-6"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Inscription...
                </span>
              ) : (
                <span className="flex items-center">
                  Je m'abonne
                  <ArrowRight size={18} className="ml-2" />
                </span>
              )}
            </Button>
          </form>
          
          <p className="text-xs text-white/40 mt-4">
            Nous respectons votre vie privée. Désinscription possible à tout moment.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
