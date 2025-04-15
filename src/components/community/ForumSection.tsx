
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ForumPost } from '@/types/community';
import { getForumPosts, invalidatePostsCache, PostSortOption } from '@/services/forum/postFetchService';
import ForumPostList from './forum/ForumPostList';
import LoadingSkeleton from './LoadingSkeleton';
import { useForumActions } from '@/hooks/useForumActions';
import ForumHeader from './forum/ForumHeader';
import SearchResults from './forum/SearchResults';

interface ForumSectionProps {
  requireAuth?: boolean;
}

const ForumSection: React.FC<ForumSectionProps> = ({ requireAuth = false }) => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<PostSortOption>('recent');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { handleLikePost, handleUpvotePost } = useForumActions(requireAuth);

  // Optimisation: utiliser useCallback pour empêcher les recreations inutiles
  const fetchPosts = useCallback(async (isMounted = true) => {
    try {
      setIsLoading(true);
      console.time('Chargement des posts');
      const fetchedPosts = await getForumPosts(sortBy);
      console.timeEnd('Chargement des posts');
      
      if (isMounted) {
        setPosts(fetchedPosts);
        setFilteredPosts(fetchedPosts);
        setIsFirstLoad(false);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des posts:', error);
      if (isMounted) {
        toast.error('Erreur lors du chargement des discussions');
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  }, [sortBy]);

  useEffect(() => {
    let isMounted = true;
    // Délai progressif réduit pour le premier chargement
    const loadTimeout = setTimeout(() => {
      fetchPosts(isMounted);
    }, isFirstLoad ? 10 : 0);
    
    return () => {
      isMounted = false;
      clearTimeout(loadTimeout);
    };
  }, [fetchPosts, isFirstLoad]);

  // Effet pour filtrer les posts lors de la recherche
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPosts(posts);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = posts.filter(post => {
      // Recherche dans le titre, contenu, nom de l'auteur et catégorie
      const matchesPost = 
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.authorName.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(query)));
        
      // Recherche dans les réponses (contenu et noms d'auteurs)
      const matchesReplies = post.replies && post.replies.some(reply => 
        reply.content.toLowerCase().includes(query) ||
        reply.authorName.toLowerCase().includes(query)
      );
      
      return matchesPost || matchesReplies;
    });
    
    setFilteredPosts(filtered);
  }, [searchQuery, posts]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleSortChange = useCallback((option: PostSortOption) => {
    setSortBy(option);
    invalidatePostsCache(); // Invalider le cache pour forcer un rechargement avec le nouveau tri
  }, []);

  const handlePostCreated = useCallback(() => {
    invalidatePostsCache();
    fetchPosts();
  }, [fetchPosts]);

  const handleLikePostWrapper = useCallback((e: React.MouseEvent, postId: string) => {
    handleLikePost(e, postId, user, posts, setPosts, setFilteredPosts, searchQuery);
  }, [handleLikePost, user, posts, searchQuery]);

  const handleUpvotePostWrapper = useCallback((e: React.MouseEvent, postId: string) => {
    handleUpvotePost(e, postId, user, posts, setPosts, setFilteredPosts, searchQuery);
  }, [handleUpvotePost, user, posts, searchQuery]);

  return (
    <div className="space-y-6">
      <ForumHeader 
        onSearch={handleSearch} 
        onPostCreated={handlePostCreated}
        sortBy={sortBy}
        onSortChange={handleSortChange}
      />

      <SearchResults 
        searchQuery={searchQuery} 
        resultsCount={filteredPosts.length} 
      />

      {isLoading ? (
        <LoadingSkeleton count={3} type="post" />
      ) : (
        <ForumPostList
          posts={filteredPosts}
          isLoading={false}
          onLikePost={handleLikePostWrapper}
          onUpvotePost={handleUpvotePostWrapper}
          onPostCreated={handlePostCreated}
          requireAuth={requireAuth}
        />
      )}
    </div>
  );
};

// Utiliser React.memo pour éviter les rendus inutiles
export default React.memo(ForumSection);
