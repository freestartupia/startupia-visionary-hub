
import React from 'react';
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from "@/components/ui/toggle-group";
import { SlidersHorizontal } from "lucide-react";

export interface ToolCategoryFilterProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

const ToolsCategoryFilter: React.FC<ToolCategoryFilterProps> = ({ 
  selectedCategory, 
  onCategorySelect 
}) => {
  const categories = [
    'Tous',
    'Assistant IA',
    'Génération d\'images',
    'Productivité',
    'Rédaction',
    'Audio/Vidéo'
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <SlidersHorizontal size={18} className="text-startupia-turquoise" />
        <h3 className="text-white/80 text-sm font-medium">Filtrer par catégorie</h3>
      </div>
      
      <ToggleGroup 
        type="single" 
        value={selectedCategory}
        onValueChange={(value) => {
          if (value) onCategorySelect(value);
        }}
        className="flex flex-wrap gap-2"
      >
        {categories.map(category => (
          <ToggleGroupItem
            key={category}
            value={category}
            className={
              selectedCategory === category
                ? "bg-startupia-turquoise hover:bg-startupia-turquoise/80 text-white"
                : "border-startupia-turquoise/30 text-white/70 hover:bg-startupia-turquoise/20 data-[state=on]:bg-startupia-turquoise"
            }
          >
            {category}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};

export default ToolsCategoryFilter;
