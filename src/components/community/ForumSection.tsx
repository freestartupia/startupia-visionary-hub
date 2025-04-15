
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ForumPost } from '@/types/community';
import { getForumPosts, invalidatePostsCache } from '@/services/forum/postFetchService';
import { togglePostLike } from '@/services/forumService';
import { togglePostUpvote } from '@/services/forumUpvoteService';
import CreateForumPost from './CreateForumPost';
import ForumPostList from './forum/ForumPostList';
import ForumSearch from './forum/ForumSearch';
import LoadingSkeleton from './LoadingSkeleton';

interface ForumSectionProps {
  requireAuth?: boolean;
}

const ForumSection: React.FC<ForumSectionProps> = ({ requireAuth = false }) => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Optimisation: utiliser useCallback pour empêcher les recreations inutiles
  const fetchPosts = useCallback(async (isMounted = true) => {
    try {
      setIsLoading(true);
      console.time('Chargement des posts');
      const fetchedPosts = await getForumPosts();
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
  }, []);

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

  // Utiliser useMemo pour filtrer les posts seulement quand nécessaire
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

  // Manipulation optimisée des événements avec useCallback
  const handleLikePost = useCallback(async (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    
    if (requireAuth && !user) {
      toast.error("Vous devez être connecté pour liker un post");
      navigate('/auth');
      return;
    }
    
    try {
      const result = await togglePostLike(postId);
      
      // Optimiser les mises à jour d'état en utilisant un updater fonctionnel
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId ? {
            ...post,
            likes: result.newCount,
            isLiked: result.liked
          } : post
        )
      );
      
      // Filtrer conditionnellement pour éviter les calculs inutiles
      if (searchQuery) {
        setFilteredPosts(prevFiltered => 
          prevFiltered.map(post => 
            post.id === postId ? {
              ...post,
              likes: result.newCount,
              isLiked: result.liked
            } : post
          )
        );
      }
      
      // Invalider le cache
      invalidatePostsCache();
      
    } catch (error) {
      console.error('Erreur lors du like:', error);
    }
  }, [requireAuth, user, navigate, searchQuery]);
  
  const handleUpvotePost = useCallback(async (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    
    if (requireAuth && !user) {
      toast.error("Vous devez être connecté pour upvoter un post");
      navigate('/auth');
      return;
    }
    
    try {
      const result = await togglePostUpvote(postId);
      
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
  }, [requireAuth, user, navigate, searchQuery]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handlePostCreated = useCallback(() => {
    invalidatePostsCache();
    fetchPosts();
  }, [fetchPosts]);

  // Memoization du resultat de la recherche pour éviter des re-rendus
  const searchResultText = useMemo(() => {
    if (!searchQuery) return null;
    
    return filteredPosts.length === 0
      ? "Aucun résultat trouvé"
      : `${filteredPosts.length} résultat${filteredPosts.length > 1 ? 's' : ''} trouvé${filteredPosts.length > 1 ? 's' : ''}`;
  }, [searchQuery, filteredPosts.length]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h2 className="text-2xl font-bold">Forum IA</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <ForumSearch onSearch={handleSearch} />
          <CreateForumPost onPostCreated={handlePostCreated} />
        </div>
      </div>

      {searchQuery && (
        <div className="text-sm text-gray-400">
          {searchResultText}
        </div>
      )}

      {isLoading ? (
        <LoadingSkeleton count={3} type="post" />
      ) : (
        <ForumPostList
          posts={filteredPosts}
          isLoading={false}
          onLikePost={handleLikePost}
          onUpvotePost={handleUpvotePost}
          onPostCreated={handlePostCreated}
          requireAuth={requireAuth}
        />
      )}
    </div>
  );
};

// Utiliser React.memo pour éviter les rendus inutiles
export default React.memo(ForumSection);
