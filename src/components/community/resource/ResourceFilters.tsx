
import React from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ResourceFormat } from '@/types/community';
import { Badge } from '@/components/ui/badge';

interface ResourceFiltersProps {
  searchTerm: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedFormat: ResourceFormat | 'all';
  setSelectedFormat: React.Dispatch<React.SetStateAction<ResourceFormat | 'all'>>;
  handleShareResource: () => void;
  formats: (ResourceFormat | 'all')[];
  isPaidOnly: boolean | null;
  setIsPaidOnly: React.Dispatch<React.SetStateAction<boolean | null>>;
}

const ResourceFilters: React.FC<ResourceFiltersProps> = ({
  searchTerm,
  handleSearch,
  selectedFormat,
  setSelectedFormat,
  handleShareResource,
  formats,
  isPaidOnly,
  setIsPaidOnly,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
          <Input
            className="pl-10 bg-black/30 border-white/10 text-white"
            placeholder="Rechercher des ressources..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <Button onClick={handleShareResource} className="whitespace-nowrap">
          <Plus className="mr-2 h-4 w-4" />
          Partager une ressource
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {formats.map((format) => (
          <Badge
            key={format}
            onClick={() => setSelectedFormat(format)}
            className={`cursor-pointer ${
              format === selectedFormat
                ? 'bg-startupia-turquoise text-black hover:bg-startupia-turquoise/80'
                : 'bg-black/30 hover:bg-black/50'
            }`}
          >
            {format === 'all' ? 'Tous' : format}
          </Badge>
        ))}
        
        <Badge
          onClick={() => setIsPaidOnly(isPaidOnly === true ? null : true)}
          className={`cursor-pointer ml-2 ${
            isPaidOnly === true
              ? 'bg-startupia-turquoise text-black hover:bg-startupia-turquoise/80'
              : 'bg-black/30 hover:bg-black/50'
          }`}
        >
          Payant
        </Badge>
        
        <Badge
          onClick={() => setIsPaidOnly(isPaidOnly === false ? null : false)}
          className={`cursor-pointer ${
            isPaidOnly === false
              ? 'bg-startupia-turquoise text-black hover:bg-startupia-turquoise/80'
              : 'bg-black/30 hover:bg-black/50'
          }`}
        >
          Gratuit
        </Badge>
      </div>
    </div>
  );
};

export default ResourceFilters;
