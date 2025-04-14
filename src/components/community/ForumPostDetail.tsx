
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ForumPost } from '@/types/community';
import { 
  getForumPost, 
  togglePostLike, 
  toggleReplyLike, 
  incrementPostViews 
} from '@/services/forumService';
import { toast } from 'sonner';
import PostContent from './forum/PostContent';
import ReplyForm from './forum/ReplyForm';
import ReplyList from './forum/ReplyList';

const ForumPostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<ForumPost | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;
      
      try {
        setIsLoading(true);
        const fetchedPost = await getForumPost(postId);
        setPost(fetchedPost);
        incrementPostViews(postId);
      } catch (error) {
        console.error('Erreur lors du chargement du post:', error);
        toast.error('Impossible de charger la discussion');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPost();
  }, [postId]);
  
  const handleGoBack = () => {
    navigate('/community?tab=forum');
  };
  
  const handleReplyAdded = async () => {
    if (!postId) return;
    
    try {
      const updatedPost = await getForumPost(postId);
      setPost(updatedPost);
      setReplyingTo(null);
    } catch (error) {
      console.error('Erreur lors du rafraîchissement des données:', error);
    }
  };
  
  const handleReplyToComment = (replyId: string) => {
    setReplyingTo(replyId);
    document.getElementById('reply-form')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleLikePost = async () => {
    if (!user || !post) {
      toast.error('Vous devez être connecté pour liker');
      navigate('/auth');
      return;
    }
    
    try {
      const result = await togglePostLike(post.id);
      
      setPost(prev => {
        if (!prev) return null;
        return {
          ...prev,
          likes: result.newCount,
          isLiked: result.liked
        };
      });
      
    } catch (error) {
      console.error('Erreur lors du like:', error);
    }
  };
  
  const handleLikeReply = async (replyId: string) => {
    if (!user) {
      toast.error('Vous devez être connecté pour liker');
      navigate('/auth');
      return;
    }
    
    try {
      const result = await toggleReplyLike(replyId);
      
      setPost(prev => {
        if (!prev) return null;
        
        const updatedReplies = prev.replies.map(reply => {
          if (reply.id === replyId) {
            return {
              ...reply,
              likes: result.newCount,
              isLiked: result.liked
            };
          }
          
          if (reply.nestedReplies) {
            const updatedNestedReplies = reply.nestedReplies.map(nestedReply => {
              if (nestedReply.id === replyId) {
                return {
                  ...nestedReply,
                  likes: result.newCount,
                  isLiked: result.liked
                };
              }
              return nestedReply;
            });
            
            return {
              ...reply,
              nestedReplies: updatedNestedReplies
            };
          }
          
          return reply;
        });
        
        return {
          ...prev,
          replies: updatedReplies
        };
      });
      
    } catch (error) {
      console.error('Erreur lors du like:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-startupia-turquoise"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">Discussion introuvable</h3>
        <Button onClick={handleGoBack} variant="outline" className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au forum
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-3xl mx-auto">
      <div className="hidden md:block">
        <Button onClick={handleGoBack} variant="outline" size="sm" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au forum
        </Button>
      </div>
      
      <PostContent post={post} onLike={handleLikePost} />
      
      <ReplyForm 
        postId={post.id}
        user={user}
        replyingTo={replyingTo}
        onReplyAdded={handleReplyAdded}
        onCancelReply={() => setReplyingTo(null)}
      />
      
      <ReplyList 
        replies={post.replies}
        onLikeReply={handleLikeReply}
        onReplyToComment={handleReplyToComment}
      />
    </div>
  );
};

export default ForumPostDetail;
