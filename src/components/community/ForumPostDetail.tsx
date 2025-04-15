
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
import { togglePostUpvote } from '@/services/forumUpvoteService';
import { toast } from 'sonner';
import PostContent from './forum/PostContent';
import ReplyForm from './forum/ReplyForm';
import ReplyList from './forum/ReplyList';
import { supabase } from '@/integrations/supabase/client';

const ForumPostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<ForumPost | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

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

  // Handle new reply in real-time
  const handleNewReply = (payload: any) => {
    console.log('Nouvelle réponse détectée:', payload);
    // Update post immediately with the new reply
    setPost(prevPost => {
      if (!prevPost) return null;
      
      // Get the new reply data
      const newReply = payload.new;
      
      // Check if this is a reply to the main post or a nested reply
      if (!newReply.reply_parent_id) {
        // It's a reply to the main post
        const updatedReplies = prevPost.replies ? [...prevPost.replies] : [];
        // Add the new reply if it's not already in the list
        if (!updatedReplies.some(reply => reply.id === newReply.id)) {
          updatedReplies.push({
            id: newReply.id,
            content: newReply.content,
            authorId: newReply.author_id,
            authorName: newReply.author_name,
            authorAvatar: newReply.author_avatar,
            createdAt: newReply.created_at,
            parentId: newReply.parent_id,
            likes: 0,
            isLiked: false,
            nestedReplies: []
          });
        }
        
        return {
          ...prevPost,
          replies: updatedReplies
        };
      } else {
        // It's a nested reply to another reply
        const updatedReplies = prevPost.replies ? [...prevPost.replies] : [];
        
        // Find the parent reply
        const parentReplyIndex = updatedReplies.findIndex(
          reply => reply.id === newReply.reply_parent_id
        );
        
        if (parentReplyIndex !== -1) {
          // Clone the parent reply
          const updatedParentReply = {...updatedReplies[parentReplyIndex]};
          
          // Ensure nestedReplies exists
          updatedParentReply.nestedReplies = updatedParentReply.nestedReplies || [];
          
          // Add the nested reply if it's not already in the list
          if (!updatedParentReply.nestedReplies.some(reply => reply.id === newReply.id)) {
            updatedParentReply.nestedReplies.push({
              id: newReply.id,
              content: newReply.content,
              authorId: newReply.author_id,
              authorName: newReply.author_name,
              authorAvatar: newReply.author_avatar,
              createdAt: newReply.created_at,
              parentId: newReply.parent_id,
              replyParentId: newReply.reply_parent_id,
              likes: 0,
              isLiked: false
            });
          }
          
          // Update the parent reply in the array
          updatedReplies[parentReplyIndex] = updatedParentReply;
          
          return {
            ...prevPost,
            replies: updatedReplies
          };
        }
      }
      
      return prevPost;
    });
  };

  useEffect(() => {
    fetchPost();
    
    // Configuration de l'abonnement en temps réel pour les réponses
    if (!postId) return;
    
    // Canal pour les nouvelles réponses au post principal
    const repliesChannel = supabase
      .channel(`post-replies-${postId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'forum_replies',
          filter: `parent_id=eq.${postId}`
        },
        handleNewReply
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'forum_replies',
          filter: `parent_id=eq.${postId}`
        },
        (payload) => {
          console.log('Réponse modifiée détectée:', payload);
          fetchPost();
        }
      )
      .subscribe((status) => {
        console.log('Statut de l\'abonnement aux réponses:', status);
      });
      
    // Canal pour les likes des réponses
    const replyLikesChannel = supabase
      .channel(`reply-likes-${postId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE ou DELETE
          schema: 'public',
          table: 'forum_reply_likes'
        },
        (payload) => {
          console.log('Changement dans likes de réponses détecté:', payload);
          // Vérifier si le like concerne une réponse de ce post
          if (post && post.replies) {
            // On vérifie si la réponse likée appartient à ce post
            const replyId = payload.new?.reply_id || payload.old?.reply_id;
            if (post.replies && Array.isArray(post.replies)) {
              const replyExists = post.replies.some(reply => 
                reply.id === replyId || 
                (reply.nestedReplies && reply.nestedReplies.some(nested => nested.id === replyId))
              );
              
              if (replyExists) {
                fetchPost();
              }
            }
          }
        }
      )
      .subscribe();
    
    // Canal pour les modifications des réponses imbriquées
    const nestedRepliesChannel = supabase
      .channel(`nested-replies-${postId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'forum_replies',
          filter: `reply_parent_id=is.not.null`
        },
        handleNewReply
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(repliesChannel);
      supabase.removeChannel(replyLikesChannel);
      supabase.removeChannel(nestedRepliesChannel);
    };
  }, [postId]);
  
  const handleGoBack = () => {
    navigate('/community?tab=forum');
  };
  
  const handleReplyAdded = () => {
    // No need to reset replyingTo here as we handle it in ReplyForm
    // The real-time subscription will automatically update the UI
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
          likes: result.likes,
          isLiked: result.isLiked
        };
      });
      
    } catch (error) {
      console.error('Erreur lors du like:', error);
    }
  };
  
  const handleUpvotePost = async () => {
    if (!user || !post) {
      toast.error('Vous devez être connecté pour upvoter');
      navigate('/auth');
      return;
    }
    
    try {
      const result = await togglePostUpvote(post.id);
      
      setPost(prev => {
        if (!prev) return null;
        return {
          ...prev,
          upvotesCount: result.upvotes,
          isUpvoted: result.isUpvoted
        };
      });
      
    } catch (error) {
      console.error('Erreur lors de l\'upvote:', error);
    }
  };
  
  const handleLikeReply = async (replyId: string) => {
    if (!user || !post) {
      toast.error('Vous devez être connecté pour liker');
      navigate('/auth');
      return;
    }
    
    try {
      const result = await toggleReplyLike(replyId);
      
      // Mise à jour des likes dans la UI
      if (post && post.replies && Array.isArray(post.replies)) {
        setPost(prev => {
          if (!prev) return null;
          
          const updatedReplies = prev.replies.map(reply => {
            if (reply.id === replyId) {
              return {
                ...reply,
                likes: result.likes,
                isLiked: result.isLiked
              };
            }
            
            if (reply.nestedReplies) {
              const updatedNestedReplies = reply.nestedReplies.map(nestedReply => {
                if (nestedReply.id === replyId) {
                  return {
                    ...nestedReply,
                    likes: result.likes,
                    isLiked: result.isLiked
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
      }
      
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
    <div className="space-y-6 w-full">
      <div className="hidden md:block">
        <Button onClick={handleGoBack} variant="outline" size="sm" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au forum
        </Button>
      </div>
      
      <PostContent 
        post={post} 
        onLike={handleLikePost} 
        onUpvote={handleUpvotePost}
      />
      
      <ReplyForm 
        postId={post.id}
        user={user}
        replyingTo={replyingTo}
        onReplyAdded={handleReplyAdded}
        onCancelReply={() => setReplyingTo(null)}
      />
      
      <ReplyList 
        replies={post.replies || []}
        onLikeReply={handleLikeReply}
        onReplyToComment={handleReplyToComment}
      />
    </div>
  );
};

export default ForumPostDetail;
