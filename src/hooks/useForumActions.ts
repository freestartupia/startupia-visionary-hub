
import { useState, useCallback } from 'react';
import { ForumPost } from '@/types/community';
import { togglePostUpvote } from '@/services/forumUpvoteService';
import { invalidatePostsCache } from '@/services/forum/postFetchService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useForumActions = (requireAuth = false) => {
  const navigate = useNavigate();

  // Fonction pour trier les posts 
  const sortPosts = useCallback((postsToSort: ForumPost[]) => {
    return [...postsToSort].sort((a, b) => {
      const upvoteDiff = (b.upvotesCount || 0) - (a.upvotesCount || 0);
      if (upvoteDiff === 0) {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return upvoteDiff;
    });
  }, []);
  
  // Fonction optimisée pour gérer les upvotes de posts
  const handleUpvotePost = useCallback(async (e: React.MouseEvent, postId: string, user: any | null, posts: ForumPost[], setPosts: React.Dispatch<React.SetStateAction<ForumPost[]>>, setFilteredPosts: React.Dispatch<React.SetStateAction<ForumPost[]>>, searchQuery: string) => {
    e.stopPropagation();
    
    if (requireAuth && !user) {
      toast.error("Vous devez être connecté pour upvoter un post");
      navigate('/auth');
      return;
    }
    
    try {
      const result = await togglePostUpvote(postId);
      
      // Mettre à jour et trier les posts
      setPosts(prevPosts => {
        const updated = prevPosts.map(post => 
          post.id === postId ? {
            ...post,
            upvotesCount: result.newCount,
            isUpvoted: result.upvoted
          } : post
        );
        return sortPosts(updated);
      });
      
      // Mettre à jour les posts filtrés si nécessaire
      if (searchQuery) {
        setFilteredPosts(prevFiltered => {
          const updated = prevFiltered.map(post => 
            post.id === postId ? {
              ...post,
              upvotesCount: result.newCount,
              isUpvoted: result.upvoted
            } : post
          );
          return sortPosts(updated);
        });
      }
      
      // Invalider le cache
      invalidatePostsCache();
      
    } catch (error) {
      console.error('Erreur lors de l\'upvote:', error);
    }
  }, [requireAuth, navigate, sortPosts]);

  return {
    handleUpvotePost,
    sortPosts
  };
};
