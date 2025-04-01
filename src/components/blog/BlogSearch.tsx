
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface BlogSearchProps {
  onSearch: (query: string) => void;
}

const BlogSearch = ({ onSearch }: BlogSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
        <Input
          type="text"
          placeholder="Rechercher un article..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 py-2 bg-black/30 border-startupia-turquoise/30 rounded-full text-white placeholder:text-white/50 focus:border-startupia-turquoise"
        />
      </div>
    </form>
  );
};

export default BlogSearch;
