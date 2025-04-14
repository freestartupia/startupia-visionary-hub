
import React from 'react';
import { ForumPost } from '@/types/community';
import ForumPostItem from './ForumPostItem';
import ForumEmptyState from './ForumEmptyState';
import { useNavigate } from 'react-router-dom';
import { ThumbsUp } from 'lucide-react';

interface ForumPostListProps {
  posts: ForumPost[];
  isLoading: boolean;
  onLikePost: (e: React.MouseEvent, postId: string) => void;
  onUpvotePost?: (e: React.MouseEvent, postId: string) => void;
  onPostCreated: () => void;
  requireAuth?: boolean;
}

const ForumPostList: React.FC<ForumPostListProps> = ({ 
  posts, 
  isLoading, 
  onLikePost,
  onUpvotePost,
  onPostCreated,
  requireAuth = false 
}) => {
  const navigate = useNavigate();

  const handleViewPost = (postId: string) => {
    navigate(`/community/post/${postId}`);
  };

  // Sort posts by upvotes (descending) and then by creation date (oldest first for tie breakers)
  const sortedPosts = [...posts].sort((a, b) => {
    // First sort by upvotes (highest first)
    const upvotesDiff = (b.upvotesCount || 0) - (a.upvotesCount || 0);
    if (upvotesDiff !== 0) return upvotesDiff;
    
    // For equal upvotes, sort by creation date (oldest first)
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

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
      {sortedPosts.map((post) => (
        <ForumPostItem
          key={post.id}
          post={post}
          onViewPost={handleViewPost}
          onLikePost={onLikePost}
          onUpvotePost={onUpvotePost}
          requireAuth={requireAuth}
        />
      ))}
    </div>
  );
};

export default ForumPostList;
