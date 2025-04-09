
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ServiceCategory } from '@/types/community';

interface ServiceFiltersProps {
  searchTerm: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedCategory: ServiceCategory | 'all';
  setSelectedCategory: (category: ServiceCategory | 'all') => void;
  handleProposeService: () => void;
  categories: (ServiceCategory | 'all')[];
}

const ServiceFilters: React.FC<ServiceFiltersProps> = ({
  searchTerm,
  handleSearch,
  selectedCategory,
  setSelectedCategory,
  handleProposeService,
  categories
}) => {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un service..."
            className="pl-10"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <Button className="flex items-center gap-2" onClick={handleProposeService}>
          Proposer un service
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <Badge 
            key={category} 
            variant={selectedCategory === category ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedCategory(category)}
          >
            {category === 'all' ? 'Tous' : category}
          </Badge>
        ))}
      </div>
    </>
  );
};

export default ServiceFilters;
