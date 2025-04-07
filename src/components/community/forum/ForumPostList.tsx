
import React from 'react';
import { ForumPost } from '@/types/community';
import ForumPostItem from './ForumPostItem';
import ForumEmptyState from './ForumEmptyState';
import { useNavigate } from 'react-router-dom';

interface ForumPostListProps {
  posts: ForumPost[];
  isLoading: boolean;
  onLikePost: (e: React.MouseEvent, postId: string) => void;
  onPostCreated: () => void;
  requireAuth?: boolean;
}

const ForumPostList: React.FC<ForumPostListProps> = ({ 
  posts, 
  isLoading, 
  onLikePost, 
  onPostCreated,
  requireAuth = false 
}) => {
  const navigate = useNavigate();

  const handleViewPost = (postId: string) => {
    navigate(`/community/post/${postId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-startupia-turquoise"></div>
      </div>
    );
  }

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
          onLikePost={onLikePost}
          requireAuth={requireAuth}
        />
      ))}
    </div>
  );
};

export default ForumPostList;
