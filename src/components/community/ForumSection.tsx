
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ForumPost } from '@/types/community';
import { getForumPosts, togglePostLike } from '@/services/forumService';
import { togglePostUpvote } from '@/services/forumUpvoteService';
import CreateForumPost from './CreateForumPost';
import ForumPostList from './forum/ForumPostList';
import ForumSearch from './forum/ForumSearch';

interface ForumSectionProps {
  requireAuth?: boolean;
}

const ForumSection: React.FC<ForumSectionProps> = ({ requireAuth = false }) => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPosts(posts);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = posts.filter(post => {
      // Search in post title, content, author name, and category
      const matchesPost = 
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.authorName.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(query)));
        
      // Search in replies content and author names
      const matchesReplies = post.replies && post.replies.some(reply => 
        reply.content.toLowerCase().includes(query) ||
        reply.authorName.toLowerCase().includes(query)
      );
      
      return matchesPost || matchesReplies;
    });
    
    setFilteredPosts(filtered);
  }, [searchQuery, posts]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const fetchedPosts = await getForumPosts();
      setPosts(fetchedPosts);
      setFilteredPosts(fetchedPosts);
    } catch (error) {
      console.error('Erreur lors du chargement des posts:', error);
      toast.error('Erreur lors du chargement des discussions');
    } finally {
      setIsLoading(false);
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
      
      // Update local state
      const updatedPosts = posts.map(post => 
        post.id === postId ? {
          ...post,
          likes: result.newCount,
          isLiked: result.liked
        } : post
      );
      
      setPosts(updatedPosts);
      
      // Also update filtered posts
      setFilteredPosts(prevFiltered => 
        prevFiltered.map(post => 
          post.id === postId ? {
            ...post,
            likes: result.newCount,
            isLiked: result.liked
          } : post
        )
      );
      
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
      
      // Update local state
      const updatedPosts = posts.map(post => 
        post.id === postId ? {
          ...post,
          upvotesCount: result.newCount,
          isUpvoted: result.upvoted
        } : post
      );
      
      // Sort by upvotes and then by creation date for ties
      const sortedPosts = [...updatedPosts].sort((a, b) => {
        const upvoteDiff = (b.upvotesCount || 0) - (a.upvotesCount || 0);
        
        // If upvote counts are equal, sort by creation date (older first)
        if (upvoteDiff === 0) {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        
        return upvoteDiff;
      });
      
      setPosts(sortedPosts);
      
      // Also update filtered posts with the same sorting
      const updatedFiltered = filteredPosts.map(post => 
        post.id === postId ? {
          ...post,
          upvotesCount: result.newCount,
          isUpvoted: result.upvoted
        } : post
      );
      
      const sortedFiltered = [...updatedFiltered].sort((a, b) => {
        const upvoteDiff = (b.upvotesCount || 0) - (a.upvotesCount || 0);
        
        // If upvote counts are equal, sort by creation date (older first)
        if (upvoteDiff === 0) {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        
        return upvoteDiff;
      });
      
      setFilteredPosts(sortedFiltered);
      
    } catch (error) {
      console.error('Erreur lors de l\'upvote:', error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h2 className="text-2xl font-bold">Forum IA</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <ForumSearch onSearch={handleSearch} />
          <CreateForumPost onPostCreated={fetchPosts} />
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

      <ForumPostList
        posts={filteredPosts}
        isLoading={isLoading}
        onLikePost={handleLikePost}
        onUpvotePost={handleUpvotePost}
        onPostCreated={fetchPosts}
        requireAuth={requireAuth}
      />
    </div>
  );
};

export default ForumSection;
