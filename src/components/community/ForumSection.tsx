
import React, { useState, useEffect } from 'react';
import { mockForumPosts } from '@/data/mockCommunityData';
import { ForumPost } from '@/types/community';
import { Button } from '@/components/ui/button';
import { PlusCircle, MessageCircle, ThumbsUp, Eye, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import AuthRequired from '@/components/AuthRequired';
import { usePagination } from '@/hooks/usePagination';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import LoadingSpinner from '@/components/ui/loading-spinner';
import ErrorMessage from '@/components/ui/error-message';

interface ForumSectionProps {
  requireAuth?: boolean;
}

const ForumSection: React.FC<ForumSectionProps> = ({ requireAuth = false }) => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiking, setIsLiking] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Set up pagination
  const pagination = usePagination({ 
    initialPageSize: 5, 
    totalItems: posts.length 
  });
  
  // Simulate async loading of posts
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    const timer = setTimeout(() => {
      try {
        setPosts(mockForumPosts);
        pagination.setTotal(mockForumPosts.length);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading forum posts:', err);
        setError('Une erreur est survenue lors du chargement des discussions.');
        setIsLoading(false);
      }
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Get paginated posts
  const paginatedPosts = posts.slice(
    pagination.pageItems.skip,
    pagination.pageItems.skip + pagination.pageItems.take
  );

  const handleCreatePost = () => {
    if (requireAuth && !user) {
      toast.error("Vous devez être connecté pour créer un post");
      navigate('/auth');
      return;
    }
    
    // In a real app, this would open a form to create a new post
    toast.success("Fonctionnalité en développement");
  };

  const handleLikePost = async (postId: string) => {
    if (requireAuth && !user) {
      toast.error("Vous devez être connecté pour liker un post");
      navigate('/auth');
      return;
    }
    
    setIsLiking(postId);
    
    // Simulate async like operation
    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update posts with new like count
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      );
      
      toast.success("Post liké !");
    } catch (err) {
      toast.error("Erreur lors du like");
      console.error(err);
    } finally {
      setIsLiking(null);
    }
  };
  
  const handleRetryLoad = () => {
    setIsLoading(true);
    setError(null);
    
    setTimeout(() => {
      setPosts(mockForumPosts);
      pagination.setTotal(mockForumPosts.length);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Forum IA</h2>
        <Button 
          onClick={handleCreatePost}
          className="bg-startupia-turquoise hover:bg-startupia-turquoise/90"
        >
          <PlusCircle size={18} className="mr-2" />
          Nouveau sujet
        </Button>
      </div>

      {isLoading ? (
        <div className="py-16 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <ErrorMessage message={error} onRetry={handleRetryLoad} />
      ) : (
        <div>
          <div className="space-y-4">
            {paginatedPosts.map((post) => (
              <div key={post.id} className="glass-card p-4 hover:bg-white/5 transition-colors cursor-pointer">
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
                      loading="lazy"
                    />
                    <span>{post.authorName}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex gap-4">
                    <AuthRequired forActiveParticipation={requireAuth}>
                      <button 
                        onClick={() => handleLikePost(post.id)}
                        disabled={isLiking === post.id}
                        className="flex items-center gap-1 text-white/60 hover:text-white disabled:opacity-50"
                      >
                        {isLiking === post.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <ThumbsUp size={16} />
                        )}
                        <span>{post.likes}</span>
                      </button>
                    </AuthRequired>
                    
                    <div className="flex items-center gap-1 text-white/60">
                      <MessageCircle size={16} />
                      <span>{post.replies.length}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-white/60">
                      <Eye size={16} />
                      <span>{post.views}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => pagination.prevPage()}
                      className={pagination.currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: pagination.totalPages }).map((_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink 
                        isActive={pagination.currentPage === i + 1}
                        onClick={() => pagination.goToPage(i + 1)}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => pagination.nextPage()}
                      className={pagination.currentPage >= pagination.totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ForumSection;
