
import React from 'react';
import { Search, PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ProductHeroProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onAddProduct?: () => void;
}

const ProductHero: React.FC<ProductHeroProps> = ({ searchTerm, setSearchTerm, onAddProduct }) => {
  return (
    <div className="relative pt-28 pb-16 px-4 bg-gradient-to-b from-black/60 to-transparent">
      <div className="container mx-auto text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Lancez votre <span className="gradient-text">produit IA</span>
        </h1>
        <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
          Découvrez les derniers produits IA créés par la communauté Startupia
          ou présentez votre propre lancement
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
            <Input
              type="text"
              placeholder="Rechercher par nom ou description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black/20 border-startupia-turquoise/30 focus-visible:ring-startupia-turquoise/50"
            />
          </div>
          
          {onAddProduct && (
            <Button
              onClick={onAddProduct}
              className="bg-startupia-gold hover:bg-startupia-gold/90 text-black button-glow"
            >
              <PlusCircle size={18} className="mr-2" />
              Ajouter un produit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductHero;
