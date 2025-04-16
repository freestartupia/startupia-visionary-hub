
import React from 'react';
import { ForumPost } from '@/types/community';
import ForumPostItem from './ForumPostItem';
import ForumEmptyState from './ForumEmptyState';
import { useNavigate } from 'react-router-dom';

interface ForumPostListProps {
  posts: ForumPost[];
  isLoading: boolean;
  onUpvotePost?: (e: React.MouseEvent, postId: string) => void;
  onPostCreated: () => void;
  requireAuth?: boolean;
}

const ForumPostList: React.FC<ForumPostListProps> = ({ 
  posts, 
  isLoading, 
  onUpvotePost,
  onPostCreated,
  requireAuth = false 
}) => {
  const navigate = useNavigate();

  const handleViewPost = (postId: string) => {
    navigate(`/community/post/${postId}`);
  };

  // Si aucun post n'est disponible, afficher l'état vide
  if (posts.length === 0) {
    return <ForumEmptyState onPostCreated={onPostCreated} />;
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <ForumPostItem
          key={post.id}
          post={post}
          onViewPost={handleViewPost}
          onUpvotePost={onUpvotePost}
          requireAuth={requireAuth}
        />
      ))}
    </div>
  );
};

export default ForumPostList;
