import React from 'react';
import { SEO } from '@/components/SEO';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import { Sparkles } from 'lucide-react';
import TopStartupsSection from '@/components/rankings/TopStartupsSection';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchStartups } from '@/services/startupService';
import { Startup } from '@/types/startup';

const Rankings = () => {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStartups = async () => {
      setIsLoading(true);
      try {
        const data = await fetchStartups();
        setStartups(data);
      } catch (error) {
        console.error('Error fetching startups:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStartups();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO
        title="Classement des Startups IA Françaises - Hub IA Français"
        description="Découvrez le classement des startups IA françaises les plus prometteuses. Explorez les leaders de l'innovation en intelligence artificielle."
      />

      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-startupia-turquoise/30 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-startupia-turquoise/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Classement des Startups IA Françaises
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Explorez les startups les plus innovantes et prometteuses de l'écosystème IA français.
          </p>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Startups Section */}
          <TopStartupsSection />

          {/* Latest Startups Section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 gradient-text">
              <Sparkles className="h-6 w-6" />
              Startups Récemment Ajoutées
            </h2>
            {isLoading ? (
              <div className="text-center py-10">
                <div className="w-8 h-8 border-4 border-white/20 border-t-startupia-turquoise rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white/60">Chargement des startups...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {startups.slice(0, 4).map(product => (
                  <Link
                    key={product.id}
                    to={`/startup/${product.id}`}
                    className="glass-card border border-white/10 p-4 rounded-lg flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-black/30 rounded-lg overflow-hidden border border-white/10 flex items-center justify-center">
                        {product.logoUrl ? (
                          <img 
                            src={product.logoUrl} 
                            alt={product.name} 
                            className="w-full h-full object-contain p-1"
                          />
                        ) : (
                          <div className="text-xl font-bold text-white/70">{product.name[0]}</div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold">{product.name}</h3>
                        <p className="text-white/60">{product.shortDescription}</p>
                      </div>
                    </div>
                    <span className="text-sm text-white/50 hover:text-white/80 transition-colors">
                      Découvrir <span aria-hidden="true">→</span>
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Rankings;
