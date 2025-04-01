
import React, { useState } from 'react';
import { Filter, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';
import DirectoryView from '@/components/ecosystem/DirectoryView';
import SEO from '@/components/SEO';
import { useNavigate } from 'react-router-dom';

const RadarIA = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-black text-white">
      <SEO 
        title="Hub IA Français – Explorez et découvrez les meilleures startups IA françaises"
        description="Explorez les meilleures startups IA françaises, votez pour vos préférées et suivez les derniers lancements du marché de l'intelligence artificielle."
      />
      
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-10 z-0"></div>
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-startupia-turquoise/30 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-startupia-turquoise/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      
      <main className="container mx-auto pt-24 pb-16 px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-yellow-300">
            Hub IA Français
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Explorez les meilleures startups IA françaises, votez pour vos préférées et suivez les derniers lancements
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full md:w-auto md:flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher une startup ou un produit IA..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:max-w-xl bg-black/20 border border-gray-700 text-white rounded-md pl-10 pr-24 py-2.5 focus:outline-none focus:border-yellow-400/50"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-500">
                🔥 Tendance
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <Button 
              onClick={() => setShowFilters(!showFilters)} 
              variant="outline" 
              className="flex items-center gap-2 border-gray-700 bg-black/20 text-white hover:bg-black/30 flex-grow md:flex-grow-0"
            >
              <Filter size={18} />
              <span>Filtres</span>
            </Button>
            
            <Button 
              onClick={() => navigate('/submit-startup')}
              className="bg-yellow-400 hover:bg-yellow-500 text-black flex items-center gap-2 flex-grow md:flex-grow-0"
            >
              <Plus size={18} />
              <span>Ajouter un projet</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="border-gray-700 bg-black/20 text-white hover:bg-black/30 hidden md:flex"
            >
              Vue détaillée
            </Button>
          </div>
        </div>

        <DirectoryView searchQuery={searchQuery} showFilters={showFilters} />
      </main>
      
      <Footer />
    </div>
  );
};

export default RadarIA;
