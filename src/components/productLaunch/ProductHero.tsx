
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductHeroProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const ProductHero = ({ searchTerm, setSearchTerm }: ProductHeroProps) => {
  return (
    <section className="text-center mb-16">
      <div className="inline-block mb-6 px-4 py-2 rounded-full bg-startupia-gold/20 border border-startupia-gold/30 text-sm">
        <span className="font-medium text-startupia-gold">Nouvelle fonctionnalité Startupia</span>
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold mb-6">
        Découvrez et soutenez les <span className="gradient-text">lancements</span> des produits IA
      </h1>
      
      <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
        L'endroit où les startups françaises de l'IA lancent leurs nouveaux produits, obtiennent des retours et rencontrent leurs premiers utilisateurs.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center gap-4 justify-center mb-12">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
          <Input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-black/30 text-white border-startupia-turquoise/30 focus:border-startupia-turquoise"
          />
        </div>
        
        <Button className="bg-startupia-gold hover:bg-startupia-light-gold text-black font-semibold" asChild>
          <Link to="/product/new">
            <Plus size={16} className="mr-2" />
            Lancer votre produit
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-4 justify-center text-sm">
        <span className="text-white/50">Tendances :</span>
        <a href="#" className="text-startupia-turquoise hover:underline">#GenerativeAI</a>
        <a href="#" className="text-startupia-turquoise hover:underline">#NoCode</a>
        <a href="#" className="text-startupia-turquoise hover:underline">#AIAssistant</a>
        <a href="#" className="text-startupia-turquoise hover:underline">#ComputerVision</a>
      </div>
    </section>
  );
};

export default ProductHero;
