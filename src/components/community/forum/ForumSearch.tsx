
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface ForumSearchProps {
  onSearch: (query: string) => void;
}

const ForumSearch: React.FC<ForumSearchProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleClear = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSearch} className="relative flex w-full max-w-sm items-center">
      <Input
        type="text"
        placeholder="Rechercher des discussions..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pr-10"
      />
      {searchQuery ? (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-12 text-gray-400 hover:text-gray-500"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
      <Button type="submit" variant="ghost" size="sm" className="absolute right-0 px-3">
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default ForumSearch;
