
import React from 'react';
import ForumSearch from './ForumSearch';
import CreateForumPost from '../CreateForumPost';

interface ForumHeaderProps {
  onSearch: (query: string) => void;
  onPostCreated: () => void;
}

const ForumHeader: React.FC<ForumHeaderProps> = ({ onSearch, onPostCreated }) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <h2 className="text-2xl font-bold">Forum IA</h2>
      <div className="flex flex-col md:flex-row gap-4">
        <ForumSearch onSearch={onSearch} />
        <CreateForumPost onPostCreated={onPostCreated} />
      </div>
    </div>
  );
};

export default React.memo(ForumHeader);
