
import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    let isMounted = true;
    const loadTimeout = setTimeout(() => {
      fetchPosts(isMounted);
    }, isFirstLoad ? 300 : 0); // Délai réduit au premier chargement
    
    return () => {
      isMounted = false;
      clearTimeout(loadTimeout);
    };
  }, []);

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

  const fetchPosts = async (isMounted = true) => {
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
  };

  const handleLikePost = async (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    
    if (requireAuth && !user) {
      toast.error("Vous devez être connecté pour liker un post");
      navigate('/auth');
      return;
    }
    
    try {
      const result = await togglePostLike(postId);
      
      // Mettre à jour l'état local
      const updatedPosts = posts.map(post => 
        post.id === postId ? {
          ...post,
          likes: result.newCount,
          isLiked: result.liked
        } : post
      );
      
      setPosts(updatedPosts);
      
      // Mettre à jour aussi les posts filtrés
      setFilteredPosts(prevFiltered => 
        prevFiltered.map(post => 
          post.id === postId ? {
            ...post,
            likes: result.newCount,
            isLiked: result.liked
          } : post
        )
      );
      
      // Invalider le cache
      invalidatePostsCache();
      
    } catch (error) {
      console.error('Erreur lors du like:', error);
    }
  };
  
  const handleUpvotePost = async (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    
    if (requireAuth && !user) {
      toast.error("Vous devez être connecté pour upvoter un post");
      navigate('/auth');
      return;
    }
    
    try {
      const result = await togglePostUpvote(postId);
      
      // Mettre à jour l'état local
      const updatedPosts = posts.map(post => 
        post.id === postId ? {
          ...post,
          upvotesCount: result.newCount,
          isUpvoted: result.upvoted
        } : post
      );
      
      // Trier par upvotes puis par date de création pour les égalités
      const sortedPosts = [...updatedPosts].sort((a, b) => {
        const upvoteDiff = (b.upvotesCount || 0) - (a.upvotesCount || 0);
        
        // Si les nombres de upvotes sont égaux, trier par date de création (plus ancien en premier)
        if (upvoteDiff === 0) {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        
        return upvoteDiff;
      });
      
      setPosts(sortedPosts);
      
      // Mettre à jour aussi les posts filtrés avec le même tri
      const updatedFiltered = filteredPosts.map(post => 
        post.id === postId ? {
          ...post,
          upvotesCount: result.newCount,
          isUpvoted: result.upvoted
        } : post
      );
      
      const sortedFiltered = [...updatedFiltered].sort((a, b) => {
        const upvoteDiff = (b.upvotesCount || 0) - (a.upvotesCount || 0);
        
        // Si les nombres de upvotes sont égaux, trier par date de création (plus ancien en premier)
        if (upvoteDiff === 0) {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        
        return upvoteDiff;
      });
      
      setFilteredPosts(sortedFiltered);
      
      // Invalider le cache
      invalidatePostsCache();
      
    } catch (error) {
      console.error('Erreur lors de l\'upvote:', error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handlePostCreated = () => {
    // Invalider le cache et recharger les posts
    invalidatePostsCache();
    fetchPosts();
  };

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
          {filteredPosts.length === 0
            ? "Aucun résultat trouvé"
            : `${filteredPosts.length} résultat${filteredPosts.length > 1 ? 's' : ''} trouvé${filteredPosts.length > 1 ? 's' : ''}`
          }
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

export default ForumSection;
