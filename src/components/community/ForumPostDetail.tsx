
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowUp } from 'lucide-react';
import { ForumPost, ForumReply } from '@/types/community';
import { 
  getForumPost, 
  togglePostLike, 
  toggleReplyLike, 
  incrementPostViews 
} from '@/services/forumService';
import { togglePostUpvote } from '@/services/forumUpvoteService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import PostContent from './forum/PostContent';
import ReplyForm from './forum/ReplyForm';
import ReplyList from './forum/ReplyList';
import { mapReplyFromDB } from '@/utils/forumMappers';

const ForumPostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<ForumPost | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const channelRef = useRef<any>(null);
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
  
  // Configurer le canal Realtime pour les nouvelles réponses
  useEffect(() => {
    if (!postId) return;
    
    console.log('Configuration du canal Realtime pour les réponses du post:', postId);
    
    // Créer un canal pour écouter les nouvelles réponses
    const channel = supabase
      .channel(`post-${postId}-replies`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'forum_replies',
          filter: `parent_id=eq.${postId}`
        },
        (payload) => {
          console.log('Nouvelle réponse détectée:', payload);
          
          // Ne pas ajouter la réponse si elle est déjà dans l'état (pour éviter les doublons)
          if (post && Array.isArray(post.replies)) {
            const replyExists = post.replies.some(reply => reply.id === payload.new.id);
            if (!replyExists) {
              const newReply = mapReplyFromDB(payload.new);
              
              // Mettre à jour l'état pour inclure la nouvelle réponse
              setPost(prevPost => {
                if (!prevPost) return null;
                
                if (newReply.replyParentId) {
                  // C'est une réponse imbriquée, l'ajouter au parent approprié
                  const updatedReplies = prevPost.replies.map(reply => {
                    if (reply.id === newReply.replyParentId) {
                      return {
                        ...reply,
                        nestedReplies: [...(reply.nestedReplies || []), newReply]
                      };
                    }
                    return reply;
                  });
                  
                  return {
                    ...prevPost,
                    replies: updatedReplies
                  };
                } else {
                  // C'est une réponse principale, l'ajouter directement à la liste
                  return {
                    ...prevPost,
                    replies: [...prevPost.replies, newReply]
                  };
                }
              });
            }
          }
        }
      )
      .subscribe((status) => {
        console.log('Statut de l\'abonnement aux réponses:', status);
      });
    
    // Sauvegarder la référence au canal
    channelRef.current = channel;
    
    // Nettoyage lors du démontage du composant
    return () => {
      console.log('Nettoyage du canal Realtime pour les réponses');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [postId, post]);
  
  // Configurer un canal séparé pour les mises à jour des "j'aime" sur les réponses
  useEffect(() => {
    if (!postId || !post) return;
    
    console.log('Configuration du canal Realtime pour les likes des réponses');
    
    const likesChannel = supabase
      .channel(`post-${postId}-reply-likes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'forum_reply_likes'
        },
        async (payload) => {
          console.log('Changement détecté dans les likes de réponses:', payload);
          
          // Identifier l'ID de la réponse concernée
          const replyId = payload.new?.reply_id || payload.old?.reply_id;
          
          if (replyId && post) {
            // Mettre à jour le nombre de likes pour cette réponse
            const { data } = await supabase
              .from('forum_replies')
              .select('id, likes')
              .eq('id', replyId)
              .single();
              
            if (data) {
              setPost(prevPost => {
                if (!prevPost) return null;
                
                // Mettre à jour les réponses principales et imbriquées
                const updateReplies = (replies: ForumReply[]) => {
                  return replies.map(reply => {
                    if (reply.id === replyId) {
                      return {
                        ...reply,
                        likes: data.likes,
                        isLiked: payload.eventType === 'INSERT' && user?.id === payload.new.user_id
                      };
                    }
                    
                    if (reply.nestedReplies && reply.nestedReplies.length > 0) {
                      return {
                        ...reply,
                        nestedReplies: updateReplies(reply.nestedReplies)
                      };
                    }
                    
                    return reply;
                  });
                };
                
                return {
                  ...prevPost,
                  replies: updateReplies(prevPost.replies)
                };
              });
            }
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(likesChannel);
    };
  }, [postId, post, user]);
  
  const handleGoBack = () => {
    navigate('/community?tab=forum');
  };
  
  const handleReplyAdded = (newReply?: ForumReply) => {
    if (!postId) return;
    
    if (newReply) {
      // Mise à jour optimiste pour afficher immédiatement la réponse
      setPost(prevPost => {
        if (!prevPost) return null;
        
        if (newReply.replyParentId) {
          // C'est une réponse imbriquée, l'ajouter au parent approprié
          const updatedReplies = prevPost.replies.map(reply => {
            if (reply.id === newReply.replyParentId) {
              const nestedReplies = reply.nestedReplies || [];
              return {
                ...reply,
                nestedReplies: [...nestedReplies, newReply]
              };
            }
            return reply;
          });
          
          return {
            ...prevPost,
            replies: updatedReplies
          };
        } else {
          // C'est une réponse principale, l'ajouter directement à la liste
          return {
            ...prevPost,
            replies: [...prevPost.replies, newReply]
          };
        }
      });
    }
    
    // Réinitialiser l'état de réponse
    setReplyingTo(null);
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
          upvotesCount: result.newCount,
          isUpvoted: result.upvoted
        };
      });
      
    } catch (error) {
      console.error('Erreur lors de l\'upvote:', error);
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
      
      // Mise à jour optimiste immédiate de l'UI
      setPost(prev => {
        if (!prev) return null;
        
        const updateReplies = (replies: ForumReply[]): ForumReply[] => {
          return replies.map(reply => {
            if (reply.id === replyId) {
              return {
                ...reply,
                likes: result.newCount,
                isLiked: result.liked
              };
            }
            
            if (reply.nestedReplies && reply.nestedReplies.length > 0) {
              return {
                ...reply,
                nestedReplies: updateReplies(reply.nestedReplies)
              };
            }
            
            return reply;
          });
        };
        
        return {
          ...prev,
          replies: updateReplies(prev.replies)
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
