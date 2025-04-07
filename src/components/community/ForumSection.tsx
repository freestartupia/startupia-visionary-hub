
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ForumPost } from '@/types/community';
import { getForumPosts, togglePostLike } from '@/services/forumService';
import CreateForumPost from './CreateForumPost';
import ForumPostList from './forum/ForumPostList';

interface ForumSectionProps {
  requireAuth?: boolean;
}

const ForumSection: React.FC<ForumSectionProps> = ({ requireAuth = false }) => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const fetchedPosts = await getForumPosts();
      setPosts(fetchedPosts);
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
      
      // Mettre à jour l'état local
      setPosts(prevPosts => 
        prevPosts.map(post => 
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Forum IA</h2>
        <CreateForumPost onPostCreated={fetchPosts} />
      </div>

      <ForumPostList
        posts={posts}
        isLoading={isLoading}
        onLikePost={handleLikePost}
        onPostCreated={fetchPosts}
        requireAuth={requireAuth}
      />
    </div>
  );
};

export default ForumSection;
