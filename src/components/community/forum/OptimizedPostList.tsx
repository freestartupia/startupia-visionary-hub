
import React, { useState, useCallback, useMemo } from 'react';
import { ForumPost } from '@/types/community';
import ForumPostItem from './ForumPostItem';
import ForumEmptyState from './ForumEmptyState';
import { useNavigate } from 'react-router-dom';
import { useForumPosts, useTogglePostLike } from '@/hooks/use-forum-query';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface OptimizedPostListProps {
  onPostCreated: () => void;
  requireAuth?: boolean;
  category?: string;
  limit?: number;
}

const OptimizedPostList: React.FC<OptimizedPostListProps> = ({ 
  onPostCreated,
  requireAuth = false,
  category,
  limit 
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: posts = [], isLoading, error } = useForumPosts();
  const toggleLikeMutation = useTogglePostLike();

  const handleViewPost = useCallback((postId: string) => {
    navigate(`/community/post/${postId}`);
  }, [navigate]);

  const handleLikePost = useCallback((e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!user) {
      toast.error("Vous devez être connecté pour aimer un post");
      navigate('/auth');
      return;
    }
    
    toggleLikeMutation.mutate({ postId, userId: user.id });
  }, [toggleLikeMutation, user, navigate]);

  const filteredPosts = useMemo(() => {
    let result = [...posts];
    
    if (category) {
      result = result.filter(post => post.category === category);
    }
    
    if (limit && limit > 0) {
      result = result.slice(0, limit);
    }
    
    return result;
  }, [posts, category, limit]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-startupia-turquoise"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 glass-card">
        <p className="text-white/70">Une erreur est survenue lors du chargement des discussions.</p>
      </div>
    );
  }

  if (filteredPosts.length === 0) {
    return <ForumEmptyState onPostCreated={onPostCreated} />;
  }

  return (
    <div className="space-y-4">
      {filteredPosts.map((post) => (
        <ForumPostItem
          key={post.id}
          post={post}
          onViewPost={handleViewPost}
          onLikePost={handleLikePost}
          requireAuth={true}
        />
      ))}
    </div>
  );
};

export default OptimizedPostList;
