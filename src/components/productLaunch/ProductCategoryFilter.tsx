
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ProductCategoryFilterProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const ProductCategoryFilter = ({ activeCategory, setActiveCategory }: ProductCategoryFilterProps) => {
  const categories = [
    'all',
    'Marketing',
    'Productivité',
    'IA Générative',
    'No-Code',
    'Développement',
    'Service Client',
    'Industrie',
    'Santé',
    'Finance',
    'RH',
    'Éducation'
  ];

  return (
    <div className="overflow-x-auto pb-2 scrollbar-none">
      <div className="flex gap-2 min-w-max">
        {categories.map((category) => (
          <Badge 
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            className={`cursor-pointer px-3 py-1 text-sm ${
              activeCategory === category 
                ? 'bg-startupia-turquoise text-black' 
                : 'hover:bg-startupia-turquoise/10 border-startupia-turquoise/30'
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category === 'all' ? 'Toutes les catégories' : category}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default ProductCategoryFilter;
