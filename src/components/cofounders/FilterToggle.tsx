
import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FilterToggleProps {
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
}

const FilterToggle = ({ showFilters, setShowFilters }: FilterToggleProps) => {
  return (
    <Button
      variant="outline"
      className="border-startupia-turquoise text-white flex items-center"
      onClick={() => setShowFilters(!showFilters)}
    >
      <Filter className="mr-2" size={16} />
      Filtres
    </Button>
  );
};

export default FilterToggle;
