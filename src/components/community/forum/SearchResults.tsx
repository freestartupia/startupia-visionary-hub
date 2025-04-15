
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';

interface SearchResultsProps {
  searchQuery: string;
  resultsCount: number;
}

const SearchResults: React.FC<SearchResultsProps> = ({ searchQuery, resultsCount }) => {
  if (!searchQuery.trim()) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-white/5 border border-white/10">
      <Search size={18} className="text-startupia-turquoise" />
      <span className="text-white/80">Résultats pour</span>
      <Badge variant="secondary" className="bg-startupia-turquoise/20 text-white border border-startupia-turquoise/30 px-3 py-1">
        {searchQuery}
      </Badge>
      <span className="text-white/80 ml-auto">{resultsCount} résultat{resultsCount !== 1 ? 's' : ''}</span>
    </div>
  );
};

export default SearchResults;
