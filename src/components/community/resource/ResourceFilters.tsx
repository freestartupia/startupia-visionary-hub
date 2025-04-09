
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ResourceFormat } from '@/types/community';

interface ResourceFiltersProps {
  searchTerm: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleShareResource: () => void;
  selectedFormat: ResourceFormat | 'all';
  setSelectedFormat: (format: ResourceFormat | 'all') => void;
  formats: (ResourceFormat | 'all')[];
}

const ResourceFilters: React.FC<ResourceFiltersProps> = ({
  searchTerm,
  handleSearch,
  handleShareResource,
  selectedFormat,
  setSelectedFormat,
  formats
}) => {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une formation ou ressource..."
            className="pl-10"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <Button className="flex items-center gap-2" onClick={handleShareResource}>
          Partager une ressource
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {formats.map((format) => (
          <Badge 
            key={format} 
            variant={selectedFormat === format ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedFormat(format)}
          >
            {format === 'all' ? 'Tous' : format}
          </Badge>
        ))}
      </div>
    </>
  );
};

export default ResourceFilters;
