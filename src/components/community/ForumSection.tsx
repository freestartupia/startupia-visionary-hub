
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, MessageCircle, ThumbsUp, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import AuthRequired from '@/components/AuthRequired';
import CreateForumPost from './CreateForumPost';
import { ForumPost } from '@/types/community';
import { getForumPosts, togglePostLike } from '@/services/forumService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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

  const handleViewPost = (postId: string) => {
    navigate(`/community/post/${postId}`);
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

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      return 'date inconnue';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Forum IA</h2>
        <CreateForumPost onPostCreated={fetchPosts} />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-startupia-turquoise"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div 
                key={post.id} 
                className="glass-card p-4 hover:bg-white/5 transition-colors cursor-pointer"
                onClick={() => handleViewPost(post.id)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-white/10 text-xs font-medium py-1 px-2 rounded">
                    {post.category}
                  </span>
                  {post.isPinned && (
                    <span className="bg-startupia-gold/20 text-startupia-gold text-xs font-medium py-1 px-2 rounded">
                      Épinglé
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-semibold mb-1">{post.title}</h3>
                
                <p className="text-white/70 mb-3 line-clamp-2">
                  {post.content}
                </p>
                
                <div className="flex flex-wrap justify-between items-center">
                  <div className="flex items-center text-sm text-white/60 mb-2 sm:mb-0">
                    <img 
                      src={post.authorAvatar || '/placeholder.svg'} 
                      alt={post.authorName} 
                      className="w-6 h-6 rounded-full mr-2"
                    />
                    <span>{post.authorName}</span>
                    <span className="mx-2">•</span>
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                  
                  <div className="flex gap-4">
                    <AuthRequired forActiveParticipation={requireAuth}>
                      <button 
                        onClick={(e) => handleLikePost(e, post.id)}
                        className={`flex items-center gap-1 ${post.isLiked ? "text-startupia-turquoise" : "text-white/60 hover:text-white"}`}
                      >
                        <ThumbsUp size={16} />
                        <span>{post.likes}</span>
                      </button>
                    </AuthRequired>
                    
                    <div className="flex items-center gap-1 text-white/60">
                      <MessageCircle size={16} />
                      <span>{post.replies?.length || 0}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-white/60">
                      <Eye size={16} />
                      <span>{post.views}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white/5 rounded-lg">
              <MessageCircle className="mx-auto h-16 w-16 text-white/30 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucune discussion pour l'instant</h3>
              <p className="text-white/70 mb-6">Soyez le premier à lancer une discussion sur le forum !</p>
              <CreateForumPost onPostCreated={fetchPosts} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ForumSection;
