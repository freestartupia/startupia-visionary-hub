
import React from "react";
import { Button } from "@/components/ui/button";
import { BlogCategory } from "@/types/blog";

interface CategoryFilterProps {
  categories: BlogCategory[];
  selectedCategory: BlogCategory | null;
  onSelectCategory: (category: BlogCategory | null) => void;
}

const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        size="sm"
        className={`rounded-full ${!selectedCategory ? 'bg-startupia-turquoise text-black' : 'hover:text-startupia-turquoise'}`}
        onClick={() => onSelectCategory(null)}
      >
        Tous
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          size="sm"
          className={`rounded-full ${
            selectedCategory === category 
              ? 'bg-startupia-turquoise text-black' 
              : 'hover:text-startupia-turquoise'
          }`}
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
