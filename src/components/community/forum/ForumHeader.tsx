
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Filter, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ForumSearch from './ForumSearch';
import { PostSortOption } from '@/services/forum/postFetchService';

interface ForumHeaderProps {
  onSearch: (query: string) => void;
  onPostCreated: () => void;
  sortBy: PostSortOption;
  onSortChange: (option: PostSortOption) => void;
}

const ForumHeader: React.FC<ForumHeaderProps> = ({ 
  onSearch, 
  onPostCreated,
  sortBy,
  onSortChange 
}) => {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold text-white">Forum IA</h2>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="ml-2 text-white/70 hover:text-white">
                <Filter size={16} className="mr-1" />
                {sortBy === 'recent' ? 'Plus récents' : 'Plus populaires'}
                <ChevronDown size={14} className="ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem 
                onClick={() => onSortChange('recent')}
                className={sortBy === 'recent' ? 'bg-accent' : ''}
              >
                Plus récents
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onSortChange('popular')}
                className={sortBy === 'popular' ? 'bg-accent' : ''}
              >
                Plus populaires
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex w-full sm:w-auto">
          <ForumSearch onSearch={onSearch} showSearch={showSearch} setShowSearch={setShowSearch} />
          
          <Button 
            onClick={onPostCreated} 
            className="ml-2 whitespace-nowrap bg-startupia-turquoise text-black hover:bg-startupia-turquoise/80"
          >
            <Plus size={18} className="mr-1" /> Créer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ForumHeader;
