
import React from 'react';
import { MessageCircle } from 'lucide-react';
import CreateForumPost from '../CreateForumPost';

interface ForumEmptyStateProps {
  onPostCreated: () => void;
}

const ForumEmptyState: React.FC<ForumEmptyStateProps> = ({ onPostCreated }) => {
  return (
    <div className="text-center py-16 bg-white/5 rounded-lg">
      <MessageCircle className="mx-auto h-16 w-16 text-white/30 mb-4" />
      <h3 className="text-xl font-semibold mb-2">Aucune discussion pour l'instant</h3>
      <p className="text-white/70 mb-6">Soyez le premier à lancer une discussion sur le forum !</p>
      <CreateForumPost onPostCreated={onPostCreated} />
    </div>
  );
};

export default ForumEmptyState;
