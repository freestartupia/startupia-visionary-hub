
import React from 'react';
import { Button } from '@/components/ui/button';

export interface ProductCategoryFilterProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

const ProductCategoryFilter: React.FC<ProductCategoryFilterProps> = ({ 
  selectedCategory, 
  onCategorySelect 
}) => {
  const categories = [
    'Tous',
    'AI Tools',
    'Finance',
    'Marketing',
    'Productivity',
    'Healthcare',
    'Education',
    'Communication',
    'Creative',
    'Other'
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map(category => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          size="sm"
          onClick={() => onCategorySelect(category)}
          className={
            selectedCategory === category
              ? "bg-startupia-turquoise hover:bg-startupia-turquoise/80"
              : "border-startupia-turquoise/30 text-white/70 hover:bg-startupia-turquoise/20"
          }
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default ProductCategoryFilter;
