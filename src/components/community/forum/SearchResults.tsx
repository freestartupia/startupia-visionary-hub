
import React from 'react';

interface SearchResultsProps {
  searchQuery: string;
  resultsCount: number;
}

const SearchResults: React.FC<SearchResultsProps> = ({ searchQuery, resultsCount }) => {
  if (!searchQuery) return null;
  
  return (
    <div className="text-sm text-gray-400">
      {resultsCount === 0
        ? "Aucun résultat trouvé"
        : `${resultsCount} résultat${resultsCount > 1 ? 's' : ''} trouvé${resultsCount > 1 ? 's' : ''}`}
    </div>
  );
};

export default React.memo(SearchResults);
